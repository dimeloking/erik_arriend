import 'server-only';
import { auth } from '@clerk/nextjs/server';
import { and, asc, desc, eq, inArray } from 'drizzle-orm';
import { db } from '@/libs/DB';
import {
  balanceSnapshotSchema,
  expenseSchema,
  paymentSchema,
  propertySchema,
} from '@/models/Schema';

export const DEFAULT_BALANCE_SNAPSHOT = {
  incomeClp: 34_118_011,
  expensesClp: 30_411_264,
  balanceClp: 3_706_747,
} as const;

export const requireUserId = async () => {
  const { userId } = await auth();
  if (!userId) {
    throw new Error('UNAUTHORIZED');
  }
  return userId;
};

export const listProperties = async () => {
  const userId = await requireUserId();
  return await db
    .select()
    .from(propertySchema)
    .where(eq(propertySchema.userId, userId))
    .orderBy(asc(propertySchema.createdAt));
};

export type PropertyRow = Awaited<ReturnType<typeof listProperties>>[number];
export type PaymentRow = typeof paymentSchema.$inferSelect;
export type ExpenseRow = typeof expenseSchema.$inferSelect;
export type BalanceSnapshotRow = Pick<
  typeof balanceSnapshotSchema.$inferSelect,
  'incomeClp' | 'expensesClp' | 'balanceClp'
>;
export type PropertyWithPayments = PropertyRow & { payments: PaymentRow[] };
export type PendingPaymentNotification = {
  paymentId: string;
  propertyId: string;
  propertyNickname: string;
  tenantName: string;
  month: string;
  amountClp: number;
  status: string;
  dueDate: string;
};

const buildDuePayments = (property: PropertyRow, existingMonths: Set<string>) => {
  if (!property.isOccupied) {
    return [];
  }

  const [startYear, startMonth] = property.startDate.split('-').map(Number);
  const today = new Date();
  const ty = today.getFullYear();
  const tm = today.getMonth() + 1;
  const todayDate = new Date(ty, tm - 1, today.getDate());
  const startDay = Number(property.startDate.split('-')[2] ?? '1');
  const rows: (typeof paymentSchema.$inferInsert)[] = [];
  let amount = property.rentClp;
  let y = startYear ?? ty;
  let m = startMonth ?? tm;

  while (y < ty || (y === ty && m <= tm)) {
    const month = `${y}-${String(m).padStart(2, '0')}`;
    const isStartMonth = y === (startYear ?? ty) && m === (startMonth ?? tm);
    const dueDay = Math.min(property.paymentDay, new Date(y, m, 0).getDate());
    const dueDate = new Date(y, m - 1, isStartMonth ? Math.max(startDay, dueDay) : dueDay);
    if (dueDate > todayDate) {
      break;
    }

    if (y > (startYear ?? ty) && String(m).padStart(2, '0') === property.increaseAnchor) {
      amount = Math.round(amount * (1 + property.increasePct / 100));
    }

    if (!existingMonths.has(month)) {
      rows.push({
        propertyId: property.id,
        month,
        amountClp: amount,
        tenantName: property.tenantName,
        tenantPhone: property.tenantPhone,
        status: 'pending',
      });
    }

    m += 1;
    if (m > 12) {
      m = 1;
      y += 1;
    }
  }

  return rows;
};

const paymentDueDate = (property: PropertyRow, paymentMonth: string) => {
  const [year, month] = paymentMonth.split('-').map(Number);
  const safeYear = year ?? new Date().getFullYear();
  const safeMonth = month ?? new Date().getMonth() + 1;
  const dueDay = Math.min(property.paymentDay, new Date(safeYear, safeMonth, 0).getDate());
  return `${paymentMonth}-${String(dueDay).padStart(2, '0')}`;
};

export const listPropertiesWithPayments = async (): Promise<PropertyWithPayments[]> => {
  const properties = await listProperties();
  if (properties.length === 0) {
    return [];
  }

  const propertyIds = properties.map((p) => p.id);
  const payments = await db
    .select()
    .from(paymentSchema)
    .where(inArray(paymentSchema.propertyId, propertyIds))
    .orderBy(asc(paymentSchema.month));

  const byProp = new Map<string, PaymentRow[]>();
  for (const pay of payments) {
    const arr = byProp.get(pay.propertyId) ?? [];
    arr.push(pay);
    byProp.set(pay.propertyId, arr);
  }

  const missingPayments = properties.flatMap((p) =>
    buildDuePayments(p, new Set((byProp.get(p.id) ?? []).map((payment) => payment.month))),
  );
  if (missingPayments.length > 0) {
    await db.insert(paymentSchema).values(missingPayments).onConflictDoNothing();
    return await listPropertiesWithPayments();
  }

  return properties.map((p) => ({ ...p, payments: byProp.get(p.id) ?? [] }));
};

export const getPropertyWithPayments = async (
  propertyId: string,
): Promise<PropertyWithPayments | null> => {
  const userId = await requireUserId();
  const [property] = await db
    .select()
    .from(propertySchema)
    .where(and(eq(propertySchema.id, propertyId), eq(propertySchema.userId, userId)))
    .limit(1);

  if (!property) {
    return null;
  }

  const payments = await db
    .select()
    .from(paymentSchema)
    .where(eq(paymentSchema.propertyId, property.id))
    .orderBy(asc(paymentSchema.month));

  const missingPayments = buildDuePayments(
    property,
    new Set(payments.map((payment) => payment.month)),
  );
  if (missingPayments.length > 0) {
    await db.insert(paymentSchema).values(missingPayments).onConflictDoNothing();
    return await getPropertyWithPayments(propertyId);
  }

  return { ...property, payments };
};

export const listPendingPaymentNotifications = async (): Promise<PendingPaymentNotification[]> => {
  const properties = await listPropertiesWithPayments();
  const today = new Date();
  const todayDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());

  return properties
    .flatMap((property) =>
      property.payments
        .filter((payment) => payment.status === 'pending')
        .map((payment) => {
          const dueDate = paymentDueDate(property, payment.month);
          const [year, month, day] = dueDate.split('-').map(Number);
          const due = new Date(year ?? today.getFullYear(), (month ?? 1) - 1, day ?? 1);

          return {
            paymentId: payment.id,
            propertyId: property.id,
            propertyNickname: property.nickname,
            tenantName: property.tenantName,
            month: payment.month,
            amountClp: payment.amountClp,
            status: due < todayDate ? 'overdue' : 'pending',
            dueDate,
          };
        }),
    )
    .toSorted((a, b) => a.dueDate.localeCompare(b.dueDate));
};

export const getBalanceSnapshot = async (): Promise<BalanceSnapshotRow> => {
  const userId = await requireUserId();
  const [snapshot] = await db
    .select({
      incomeClp: balanceSnapshotSchema.incomeClp,
      expensesClp: balanceSnapshotSchema.expensesClp,
      balanceClp: balanceSnapshotSchema.balanceClp,
    })
    .from(balanceSnapshotSchema)
    .where(eq(balanceSnapshotSchema.userId, userId))
    .limit(1);

  return snapshot ?? DEFAULT_BALANCE_SNAPSHOT;
};

export const listExpenses = async (): Promise<ExpenseRow[]> => {
  const userId = await requireUserId();
  return await db
    .select()
    .from(expenseSchema)
    .where(eq(expenseSchema.userId, userId))
    .orderBy(desc(expenseSchema.date), desc(expenseSchema.createdAt));
};
