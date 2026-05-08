import 'server-only';
import { auth } from '@clerk/nextjs/server';
import { and, asc, eq, inArray, isNull, or } from 'drizzle-orm';
import { db } from '@/libs/DB';
import { paymentSchema, propertySchema } from '@/models/Schema';
import { todayYM } from './lib';

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
export type PropertyWithPayments = PropertyRow & { payments: PaymentRow[] };
export type PendingPaymentNotification = {
  propertyId: string;
  propertyNickname: string;
  tenantName: string;
  month: string;
  amountClp: number;
  status: string;
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

  return { ...property, payments };
};

export const listPendingPaymentNotifications = async (): Promise<PendingPaymentNotification[]> => {
  const dayOfMonth = new Date().getDate();
  if (dayOfMonth < 2) {
    return [];
  }

  const userId = await requireUserId();
  const currentMonth = todayYM();

  const rows = await db
    .select({
      propertyId: propertySchema.id,
      propertyNickname: propertySchema.nickname,
      tenantName: propertySchema.tenantName,
      rentClp: propertySchema.rentClp,
      month: paymentSchema.month,
      amountClp: paymentSchema.amountClp,
      status: paymentSchema.status,
    })
    .from(propertySchema)
    .leftJoin(
      paymentSchema,
      and(eq(paymentSchema.propertyId, propertySchema.id), eq(paymentSchema.month, currentMonth)),
    )
    .where(
      and(
        eq(propertySchema.userId, userId),
        or(isNull(paymentSchema.id), inArray(paymentSchema.status, ['pending', 'late', 'overdue'])),
      ),
    )
    .orderBy(asc(propertySchema.nickname));

  return rows.map((row) => ({
    propertyId: row.propertyId,
    propertyNickname: row.propertyNickname,
    tenantName: row.tenantName,
    month: row.month ?? currentMonth,
    amountClp: row.amountClp ?? row.rentClp,
    status: row.status ?? 'pending',
  }));
};
