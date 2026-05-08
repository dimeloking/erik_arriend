'use server';

import { and, eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import * as z from 'zod';
import { db } from '@/libs/DB';
import { paymentSchema, propertySchema } from '@/models/Schema';
import { requireUserId } from './queries';
import { SEED_PROPERTIES } from './seed-data';
import { markPaidInputSchema, propertyInputSchema } from './validation';

const computePaymentSeed = (input: {
  startDate: string;
  rentClp: number;
  increasePct: number;
  increaseAnchor: string;
}) => {
  // Pre-genera pagos pendientes desde startDate hasta el mes actual.
  const [startYear, startMonth] = input.startDate.split('-').map(Number);
  const today = new Date();
  const ty = today.getFullYear();
  const tm = today.getMonth() + 1;

  const months: { month: string; amountClp: number; status: 'pending' }[] = [];
  let amount = input.rentClp;
  let y = startYear ?? ty;
  let m = startMonth ?? tm;

  while (y < ty || (y === ty && m <= tm)) {
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

const validationErrors = (error: z.ZodError) => z.treeifyError(error);

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
      rentClp: data.rentClp,
      depositClp: data.depositClp,
      startDate: data.startDate,
      contractMonths: data.contractMonths,
      increasePct: data.increasePct,
      increaseAnchor: data.increaseAnchor,
      color: data.color,
      notes: data.notes ?? null,
    })
    .returning({ id: propertySchema.id });

  if (!created) {
    return { ok: false as const, errors: { _form: ['No se pudo crear la propiedad'] } };
  }

  const seed = computePaymentSeed(data);
  if (seed.length > 0) {
    await db.insert(paymentSchema).values(
      seed.map((s) => ({
        propertyId: created.id,
        month: s.month,
        amountClp: s.amountClp,
        status: s.status,
      })),
    );
  }

  revalidatePath('/dashboard');
  return redirect(`/dashboard/properties/${created.id}`);
};

export const updateProperty = async (propertyId: string, formData: FormData) => {
  const userId = await requireUserId();
  const parsed = propertyInputSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return { ok: false as const, errors: validationErrors(parsed.error) };
  }
  const { data } = parsed;

  await db
    .update(propertySchema)
    .set({
      nickname: data.nickname,
      address: data.address,
      tenantName: data.tenantName,
      tenantPhone: data.tenantPhone ?? null,
      rentClp: data.rentClp,
      depositClp: data.depositClp,
      startDate: data.startDate,
      contractMonths: data.contractMonths,
      increasePct: data.increasePct,
      increaseAnchor: data.increaseAnchor,
      color: data.color,
      notes: data.notes ?? null,
    })
    .where(and(eq(propertySchema.id, propertyId), eq(propertySchema.userId, userId)));

  revalidatePath('/dashboard');
  revalidatePath(`/dashboard/properties/${propertyId}`);
  return { ok: true as const };
};

export const markPaymentPaid = async (propertyId: string, formData: FormData) => {
  const userId = await requireUserId();
  const parsed = markPaidInputSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return { ok: false as const, errors: validationErrors(parsed.error) };
  }
  const { data } = parsed;

  // Verify ownership: payment.propertyId belongs to this user
  const [property] = await db
    .select({ id: propertySchema.id })
    .from(propertySchema)
    .where(and(eq(propertySchema.id, propertyId), eq(propertySchema.userId, userId)))
    .limit(1);

  if (!property) {
    return { ok: false as const, errors: { _form: ['Propiedad no encontrada'] } };
  }

  await db
    .update(paymentSchema)
    .set({
      status: 'paid',
      paidOn: data.paidOn,
      method: data.method,
      reference: data.reference ?? null,
      notes: data.notes ?? null,
    })
    .where(and(eq(paymentSchema.id, data.paymentId), eq(paymentSchema.propertyId, propertyId)));

  revalidatePath('/dashboard');
  revalidatePath(`/dashboard/properties/${propertyId}`);
  return { ok: true as const };
};

export const seedDemoData = async () => {
  const userId = await requireUserId();
  for (const seed of SEED_PROPERTIES) {
    const [created] = await db
      .insert(propertySchema)
      .values({
        userId,
        nickname: seed.nickname,
        address: seed.address,
        tenantName: seed.tenantName,
        tenantPhone: seed.tenantPhone,
        rentClp: seed.rent,
        depositClp: seed.deposit,
        startDate: seed.startDate,
        contractMonths: seed.contractMonths,
        increasePct: seed.increasePct,
        increaseAnchor: seed.increaseAnchor,
        color: seed.color,
        notes: seed.notes,
      })
      .returning({ id: propertySchema.id });

    if (!created) {
      continue;
    }

    if (seed.payments.length > 0) {
      await db.insert(paymentSchema).values(
        seed.payments.map((p) => ({
          propertyId: created.id,
          month: p.month,
          amountClp: p.amount,
          paidOn: p.paidOn,
          status: p.status,
        })),
      );
    }
  }

  revalidatePath('/dashboard');
  return { ok: true as const };
};
