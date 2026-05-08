import * as z from 'zod';

const colorEnum = z.enum(['mint', 'peach', 'lavender', 'sky']);
const monthAnchor = z.string().regex(/^(0[1-9]|1[0-2])$/u, 'Mes inválido (01-12)');
const isoDate = z.string().regex(/^\d{4}-\d{2}-\d{2}$/u, 'Formato YYYY-MM-DD');

export const propertyInputSchema = z.object({
  nickname: z.string().min(1, 'Apodo requerido').max(120),
  address: z.string().min(1, 'Dirección requerida').max(240),
  tenantName: z.string().min(1, 'Arrendatario requerido').max(120),
  tenantPhone: z.string().max(40).optional().or(z.literal('')),
  rentClp: z.coerce.number().int().min(1, 'Arriendo debe ser positivo'),
  depositClp: z.coerce.number().int().min(0).default(0),
  startDate: isoDate,
  contractMonths: z.coerce.number().int().min(1).max(120).default(12),
  increasePct: z.coerce.number().int().min(0).max(100).default(0),
  increaseAnchor: monthAnchor.default('01'),
  color: colorEnum.default('mint'),
  notes: z.string().max(2000).optional().or(z.literal('')),
});

export const markPaidInputSchema = z.object({
  paymentId: z.uuid(),
  paidOn: isoDate,
  method: z.string().min(1).max(32),
  reference: z.string().max(80).optional().or(z.literal('')),
  notes: z.string().max(2000).optional().or(z.literal('')),
});
