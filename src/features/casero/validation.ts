import * as z from 'zod';

const colorEnum = z.enum(['mint', 'peach', 'lavender', 'sky']);
const contractDurationUnitEnum = z.enum(['days', 'months', 'years']);
const paymentStatusEnum = z.enum(['pending', 'paid']);
const monthAnchor = z.string().regex(/^(0[1-9]|1[0-2])$/u, 'Mes inválido (01-12)');
const isoDate = z.string().regex(/^\d{4}-\d{2}-\d{2}$/u, 'Formato YYYY-MM-DD');
const yearMonth = z.string().regex(/^\d{4}-(0[1-9]|1[0-2])$/u, 'Mes inválido');
const numberFromForm = <T extends z.ZodType>(schema: T) =>
  z.preprocess((value) => {
    if (typeof value !== 'string') {
      return value;
    }
    const trimmed = value.trim();
    if (trimmed === '') {
      return null;
    }
    const number = Number(trimmed);
    return Number.isFinite(number) ? number : value;
  }, schema);

export const propertyInputSchema = z.object({
  nickname: z.string().min(1, 'Apodo requerido').max(120),
  address: z.string().min(1, 'Dirección requerida').max(240),
  tenantName: z.string().min(1, 'Arrendatario requerido').max(120),
  tenantPhone: z.string().max(40).optional().or(z.literal('')),
  rentClp: numberFromForm(
    z
      .number({ error: 'Arriendo mensual debe ser un número' })
      .int()
      .min(1, 'Arriendo debe ser positivo'),
  ),
  depositClp: numberFromForm(
    z.number({ error: 'Garantía debe ser un número' }).int().min(0),
  ).default(0),
  startDate: isoDate,
  paymentDay: numberFromForm(
    z
      .number({ error: 'Día de pago debe ser un número' })
      .int()
      .min(1, 'Día de pago inválido')
      .max(31, 'Día de pago inválido'),
  ).default(5),
  contractMonths: numberFromForm(
    z.number({ error: 'Duración debe ser un número' }).int().min(1).max(3650),
  ).default(12),
  contractDurationUnit: contractDurationUnitEnum.default('months'),
  increasePct: numberFromForm(
    z.number({ error: 'Reajuste debe ser un número' }).int().min(0).max(100),
  ).default(0),
  increaseAnchor: monthAnchor.default('01'),
  color: colorEnum.default('mint'),
  notes: z.string().max(2000).optional().or(z.literal('')),
});

export const registerPaymentInputSchema = z.object({
  month: yearMonth,
  amountClp: numberFromForm(
    z.number({ error: 'Monto debe ser un número' }).int().min(1, 'Monto debe ser positivo'),
  ),
  paidOn: isoDate,
  status: paymentStatusEnum.default('paid'),
  method: z.string().min(1, 'Método requerido').max(32),
  reference: z.string().max(80).optional().or(z.literal('')),
  notes: z.string().max(2000).optional().or(z.literal('')),
});

export const balanceSnapshotInputSchema = z.object({
  incomeClp: numberFromForm(
    z
      .number({ error: 'Ingresos debe ser un número' })
      .int()
      .min(0, 'Ingresos no puede ser negativo'),
  ),
  expensesClp: numberFromForm(
    z.number({ error: 'Gastos debe ser un número' }).int().min(0, 'Gastos no puede ser negativo'),
  ),
  balanceClp: numberFromForm(z.number({ error: 'Saldo debe ser un número' }).int()),
});

export const expenseInputSchema = z.object({
  date: isoDate,
  description: z.string().min(1, 'Descripción requerida').max(240),
  amountClp: numberFromForm(
    z.number({ error: 'Gasto debe ser un número' }).int().min(1, 'Gasto debe ser positivo'),
  ),
  notes: z.string().max(2000).optional().or(z.literal('')),
});
