'use server';

import { and, eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import type * as z from 'zod';
import { db } from '@/libs/DB';
import {
  balanceSnapshotSchema,
  expenseSchema,
  paymentSchema,
  propertySchema,
} from '@/models/Schema';
import { requireUserId } from './queries';
import {
  balanceSnapshotInputSchema,
  expenseInputSchema,
  propertyInputSchema,
  registerPaymentInputSchema,
} from './validation';

const computePaymentSeed = (input: {
  startDate: string;
  rentClp: number;
  increasePct: number;
  increaseAnchor: string;
  paymentDay: number;
}) => {
  // Pre-genera pagos pendientes solo hasta los meses que ya llegaron a su día de pago.
  const [startYear, startMonth] = input.startDate.split('-').map(Number);
  const today = new Date();
  const ty = today.getFullYear();
  const tm = today.getMonth() + 1;
  const todayDate = new Date(ty, tm - 1, today.getDate());

  const months: { month: string; amountClp: number; status: 'pending' }[] = [];
  let amount = input.rentClp;
  let y = startYear ?? ty;
  let m = startMonth ?? tm;

  while (y < ty || (y === ty && m <= tm)) {
    const isStartMonth = y === (startYear ?? ty) && m === (startMonth ?? tm);
    const startDay = Number(input.startDate.split('-')[2] ?? '1');
    const dueDay = Math.min(input.paymentDay, new Date(y, m, 0).getDate());
    const dueDate = new Date(y, m - 1, isStartMonth ? Math.max(startDay, dueDay) : dueDay);
    if (dueDate > todayDate) {
      break;
    }

    // Aplica reajuste anual al cumplirse 12 meses + mes ancla
    if (y > (startYear ?? ty) && String(m).padStart(2, '0') === input.increaseAnchor) {
      amount = Math.round(amount * (1 + input.increasePct / 100));
    }
    months.push({
      month: `${y}-${String(m).padStart(2, '0')}`,
      amountClp: amount,
      status: 'pending',
    });
    m += 1;
    if (m > 12) {
      m = 1;
      y += 1;
    }
  }

  return months;
};

const validationErrors = (error: z.ZodError) =>
  error.issues.map((issue) => issue.message).filter((message) => message.length > 0);

export const createProperty = async (formData: FormData) => {
  const userId = await requireUserId();
  const parsed = propertyInputSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return { ok: false as const, errors: validationErrors(parsed.error) };
  }
  const { data } = parsed;

  const [created] = await db
    .insert(propertySchema)
    .values({
      userId,
      nickname: data.nickname,
      address: data.address,
      tenantName: data.tenantName,
      tenantPhone: data.tenantPhone ?? null,
      isOccupied: true,
      vacantSince: null,
      rentClp: data.rentClp,
      depositClp: data.depositClp,
      startDate: data.startDate,
      paymentDay: data.paymentDay,
      contractMonths: data.contractMonths,
      contractDurationUnit: data.contractDurationUnit,
      increasePct: data.increasePct,
      increaseAnchor: data.increaseAnchor,
      color: data.color,
      notes: data.notes ?? null,
    })
    .returning({ id: propertySchema.id });

  if (!created) {
    return { ok: false as const, errors: ['No se pudo crear la propiedad'] };
  }

  const seed = computePaymentSeed(data);
  if (seed.length > 0) {
    await db.insert(paymentSchema).values(
      seed.map((s) => ({
        propertyId: created.id,
        month: s.month,
        amountClp: s.amountClp,
        tenantName: data.tenantName,
        tenantPhone: data.tenantPhone ?? null,
        status: s.status,
      })),
    );
  }

  revalidatePath('/dashboard');
  return { ok: true as const, id: created.id };
};

export const updateProperty = async (propertyId: string, formData: FormData) => {
  const userId = await requireUserId();
  const parsed = propertyInputSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return { ok: false as const, errors: validationErrors(parsed.error) };
  }
  const { data } = parsed;

  const [updated] = await db
    .update(propertySchema)
    .set({
      nickname: data.nickname,
      address: data.address,
      tenantName: data.tenantName,
      tenantPhone: data.tenantPhone ?? null,
      isOccupied: true,
      vacantSince: null,
      rentClp: data.rentClp,
      depositClp: data.depositClp,
      startDate: data.startDate,
      paymentDay: data.paymentDay,
      contractMonths: data.contractMonths,
      contractDurationUnit: data.contractDurationUnit,
      increasePct: data.increasePct,
      increaseAnchor: data.increaseAnchor,
      color: data.color,
      notes: data.notes ?? null,
    })
    .where(and(eq(propertySchema.id, propertyId), eq(propertySchema.userId, userId)))
    .returning({ id: propertySchema.id });

  if (!updated) {
    return { ok: false as const, errors: ['Propiedad no encontrada'] };
  }

  await db
    .update(paymentSchema)
    .set({
      amountClp: data.rentClp,
      tenantName: data.tenantName,
      tenantPhone: data.tenantPhone ?? null,
    })
    .where(and(eq(paymentSchema.propertyId, propertyId), eq(paymentSchema.status, 'pending')));

  revalidatePath('/dashboard');
  revalidatePath(`/dashboard/properties/${propertyId}`);
  return { ok: true as const };
};

export const deleteProperty = async (propertyId: string) => {
  const userId = await requireUserId();
  const [deleted] = await db
    .delete(propertySchema)
    .where(and(eq(propertySchema.id, propertyId), eq(propertySchema.userId, userId)))
    .returning({ id: propertySchema.id });

  if (!deleted) {
    return { ok: false as const, errors: ['Propiedad no encontrada'] };
  }

  revalidatePath('/dashboard');
  revalidatePath('/dashboard/balance');
  return { ok: true as const };
};

export const cancelContract = async (propertyId: string) => {
  const userId = await requireUserId();
  const [updated] = await db
    .update(propertySchema)
    .set({
      isOccupied: false,
      vacantSince: new Date().toISOString().slice(0, 10),
    })
    .where(and(eq(propertySchema.id, propertyId), eq(propertySchema.userId, userId)))
    .returning({ id: propertySchema.id });

  if (!updated) {
    return { ok: false as const, errors: ['Propiedad no encontrada'] };
  }

  revalidatePath('/dashboard');
  revalidatePath(`/dashboard/properties/${propertyId}`);
  return { ok: true as const };
};

export const registerPayment = async (propertyId: string, formData: FormData) => {
  const userId = await requireUserId();
  const parsed = registerPaymentInputSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return { ok: false as const, errors: validationErrors(parsed.error) };
  }
  const { data } = parsed;

  const [property] = await db
    .select({
      id: propertySchema.id,
      tenantName: propertySchema.tenantName,
      tenantPhone: propertySchema.tenantPhone,
    })
    .from(propertySchema)
    .where(and(eq(propertySchema.id, propertyId), eq(propertySchema.userId, userId)))
    .limit(1);

  if (!property) {
    return { ok: false as const, errors: ['Propiedad no encontrada'] };
  }

  try {
    await db.insert(paymentSchema).values({
      propertyId,
      month: data.month,
      amountClp: data.amountClp,
      tenantName: property.tenantName,
      tenantPhone: property.tenantPhone,
      paidOn: data.status === 'paid' ? data.paidOn : null,
      status: data.status,
      method: data.status === 'paid' ? data.method : null,
      reference: data.reference ?? null,
      notes: data.notes ?? null,
    });
  } catch {
    return {
      ok: false as const,
      errors: ['Ya existe un pago para ese mes. Usa Editar en el historial para corregirlo.'],
    };
  }

  revalidatePath('/dashboard');
  revalidatePath(`/dashboard/properties/${propertyId}`);
  return { ok: true as const };
};

export const updatePayment = async (propertyId: string, paymentId: string, formData: FormData) => {
  const userId = await requireUserId();
  const parsed = registerPaymentInputSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return { ok: false as const, errors: validationErrors(parsed.error) };
  }
  const { data } = parsed;

  const [property] = await db
    .select({ id: propertySchema.id })
    .from(propertySchema)
    .where(and(eq(propertySchema.id, propertyId), eq(propertySchema.userId, userId)))
    .limit(1);

  if (!property) {
    return { ok: false as const, errors: ['Propiedad no encontrada'] };
  }

  try {
    const [updated] = await db
      .update(paymentSchema)
      .set({
        amountClp: data.amountClp,
        month: data.month,
        paidOn: data.status === 'paid' ? data.paidOn : null,
        status: data.status,
        method: data.status === 'paid' ? data.method : null,
        reference: data.reference ?? null,
        notes: data.notes ?? null,
      })
      .where(and(eq(paymentSchema.id, paymentId), eq(paymentSchema.propertyId, propertyId)))
      .returning({ id: paymentSchema.id });

    if (!updated) {
      return { ok: false as const, errors: ['Pago no encontrado'] };
    }
  } catch {
    return {
      ok: false as const,
      errors: ['No se pudo editar el pago. Revisa si ya existe otro pago para ese mes.'],
    };
  }

  revalidatePath('/dashboard');
  revalidatePath(`/dashboard/properties/${propertyId}`);
  return { ok: true as const };
};

export const updateBalanceSnapshot = async (formData: FormData) => {
  const userId = await requireUserId();
  const parsed = balanceSnapshotInputSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return { ok: false as const, errors: validationErrors(parsed.error) };
  }
  const { data } = parsed;

  await db
    .insert(balanceSnapshotSchema)
    .values({
      userId,
      incomeClp: data.incomeClp,
      expensesClp: data.expensesClp,
      balanceClp: data.balanceClp,
    })
    .onConflictDoUpdate({
      target: balanceSnapshotSchema.userId,
      set: {
        incomeClp: data.incomeClp,
        expensesClp: data.expensesClp,
        balanceClp: data.balanceClp,
      },
    });

  revalidatePath('/dashboard');
  return { ok: true as const };
};

export const createExpense = async (formData: FormData) => {
  const userId = await requireUserId();
  const parsed = expenseInputSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return { ok: false as const, errors: validationErrors(parsed.error) };
  }
  const { data } = parsed;

  await db.insert(expenseSchema).values({
    userId,
    date: data.date,
    month: data.date.slice(0, 7),
    description: data.description,
    amountClp: data.amountClp,
    notes: data.notes ?? null,
  });

  revalidatePath('/dashboard');
  return { ok: true as const };
};

export const deleteExpense = async (expenseId: string) => {
  const userId = await requireUserId();
  await db
    .delete(expenseSchema)
    .where(and(eq(expenseSchema.id, expenseId), eq(expenseSchema.userId, userId)));
  revalidatePath('/dashboard');
  return { ok: true as const };
};
