// Datos de demostración para el cliente (4 propiedades reales del prototipo).
// Se cargan vía la server action `seedDemoData` cuando el usuario no tiene propiedades.

export type SeedPayment = {
  month: string;
  amount: number;
  paidOn: string | null;
  status: 'paid' | 'late' | 'pending' | 'overdue';
};

export type SeedProperty = {
  nickname: string;
  address: string;
  tenantName: string;
  tenantPhone: string;
  rent: number;
  deposit: number;
  startDate: string;
  contractMonths: number;
  increasePct: number;
  increaseAnchor: string;
  color: 'mint' | 'peach' | 'lavender' | 'sky';
  notes: string;
  payments: SeedPayment[];
};

export const SEED_PROPERTIES: SeedProperty[] = [
  {
    nickname: 'Casa Providencia',
    address: 'Av. Pedro de Valdivia 1245, Providencia',
    tenantName: 'Marta Sepúlveda',
    tenantPhone: '+56 9 6712 3344',
    rent: 680_000,
    deposit: 1_360_000,
    startDate: '2023-03-01',
    contractMonths: 36,
    increasePct: 8,
    increaseAnchor: '03',
    color: 'mint',
    notes: 'Pago vía transferencia BancoEstado. Mantención de jardín a cargo del propietario.',
    payments: [
      { month: '2025-01', amount: 680_000, paidOn: '2025-01-03', status: 'paid' },
      { month: '2025-02', amount: 680_000, paidOn: '2025-02-04', status: 'paid' },
      { month: '2025-03', amount: 734_400, paidOn: '2025-03-05', status: 'paid' },
      { month: '2025-04', amount: 734_400, paidOn: '2025-04-02', status: 'paid' },
      { month: '2025-05', amount: 734_400, paidOn: '2025-05-06', status: 'paid' },
      { month: '2025-06', amount: 734_400, paidOn: '2025-06-04', status: 'paid' },
      { month: '2025-07', amount: 734_400, paidOn: '2025-07-03', status: 'paid' },
      { month: '2025-08', amount: 734_400, paidOn: '2025-08-05', status: 'paid' },
      { month: '2025-09', amount: 734_400, paidOn: '2025-09-04', status: 'paid' },
      { month: '2025-10', amount: 734_400, paidOn: '2025-10-08', status: 'paid' },
      { month: '2025-11', amount: 734_400, paidOn: '2025-11-12', status: 'late' },
      { month: '2025-12', amount: 734_400, paidOn: '2025-12-04', status: 'paid' },
      { month: '2026-01', amount: 734_400, paidOn: '2026-01-05', status: 'paid' },
      { month: '2026-02', amount: 734_400, paidOn: '2026-02-03', status: 'paid' },
      { month: '2026-03', amount: 793_152, paidOn: '2026-03-04', status: 'paid' },
      { month: '2026-04', amount: 793_152, paidOn: '2026-04-06', status: 'paid' },
      { month: '2026-05', amount: 793_152, paidOn: null, status: 'pending' },
    ],
  },
  {
    nickname: 'Depto. Ñuñoa',
    address: 'Irarrázaval 3902, Ñuñoa — Depto 802',
    tenantName: 'Diego Alarcón',
    tenantPhone: '+56 9 8821 0099',
    rent: 520_000,
    deposit: 520_000,
    startDate: '2024-06-15',
    contractMonths: 24,
    increasePct: 6,
    increaseAnchor: '06',
    color: 'peach',
    notes: 'Estacionamiento incluido. Gastos comunes a cargo del arrendatario.',
    payments: [
      { month: '2025-01', amount: 520_000, paidOn: '2025-01-15', status: 'paid' },
      { month: '2025-02', amount: 520_000, paidOn: '2025-02-15', status: 'paid' },
      { month: '2025-03', amount: 520_000, paidOn: '2025-03-16', status: 'paid' },
      { month: '2025-04', amount: 520_000, paidOn: '2025-04-14', status: 'paid' },
      { month: '2025-05', amount: 520_000, paidOn: '2025-05-15', status: 'paid' },
      { month: '2025-06', amount: 551_200, paidOn: '2025-06-15', status: 'paid' },
      { month: '2025-07', amount: 551_200, paidOn: '2025-07-15', status: 'paid' },
      { month: '2025-08', amount: 551_200, paidOn: '2025-08-19', status: 'late' },
      { month: '2025-09', amount: 551_200, paidOn: '2025-09-15', status: 'paid' },
      { month: '2025-10', amount: 551_200, paidOn: '2025-10-15', status: 'paid' },
      { month: '2025-11', amount: 551_200, paidOn: '2025-11-15', status: 'paid' },
      { month: '2025-12', amount: 551_200, paidOn: '2025-12-16', status: 'paid' },
      { month: '2026-01', amount: 551_200, paidOn: '2026-01-14', status: 'paid' },
      { month: '2026-02', amount: 551_200, paidOn: '2026-02-15', status: 'paid' },
      { month: '2026-03', amount: 551_200, paidOn: '2026-03-15', status: 'paid' },
      { month: '2026-04', amount: 551_200, paidOn: '2026-04-22', status: 'late' },
      { month: '2026-05', amount: 551_200, paidOn: null, status: 'pending' },
    ],
  },
  {
    nickname: 'Casa La Serena',
    address: 'Av. del Mar 4150, La Serena',
    tenantName: 'Familia Torres',
    tenantPhone: '+56 9 5544 7788',
    rent: 450_000,
    deposit: 450_000,
    startDate: '2025-01-10',
    contractMonths: 12,
    increasePct: 7,
    increaseAnchor: '01',
    color: 'lavender',
    notes: 'Casa arrendada con muebles incluidos. Contrato anual renovable.',
    payments: [
      { month: '2025-01', amount: 450_000, paidOn: '2025-01-10', status: 'paid' },
      { month: '2025-02', amount: 450_000, paidOn: '2025-02-10', status: 'paid' },
      { month: '2025-03', amount: 450_000, paidOn: '2025-03-10', status: 'paid' },
      { month: '2025-04', amount: 450_000, paidOn: '2025-04-09', status: 'paid' },
      { month: '2025-05', amount: 450_000, paidOn: '2025-05-10', status: 'paid' },
      { month: '2025-06', amount: 450_000, paidOn: '2025-06-11', status: 'paid' },
      { month: '2025-07', amount: 450_000, paidOn: '2025-07-10', status: 'paid' },
      { month: '2025-08', amount: 450_000, paidOn: '2025-08-10', status: 'paid' },
      { month: '2025-09', amount: 450_000, paidOn: '2025-09-12', status: 'paid' },
      { month: '2025-10', amount: 450_000, paidOn: '2025-10-10', status: 'paid' },
      { month: '2025-11', amount: 450_000, paidOn: '2025-11-10', status: 'paid' },
      { month: '2025-12', amount: 450_000, paidOn: '2025-12-10', status: 'paid' },
      { month: '2026-01', amount: 481_500, paidOn: '2026-01-10', status: 'paid' },
      { month: '2026-02', amount: 481_500, paidOn: '2026-02-10', status: 'paid' },
      { month: '2026-03', amount: 481_500, paidOn: '2026-03-11', status: 'paid' },
      { month: '2026-04', amount: 481_500, paidOn: '2026-04-10', status: 'paid' },
      { month: '2026-05', amount: 481_500, paidOn: null, status: 'pending' },
    ],
  },
  {
    nickname: 'Loft Bellas Artes',
    address: 'Lastarria 215, Santiago Centro — Loft 4B',
    tenantName: 'Camila Ríos',
    tenantPhone: '+56 9 4421 6655',
    rent: 590_000,
    deposit: 1_180_000,
    startDate: '2024-09-01',
    contractMonths: 24,
    increasePct: 5,
    increaseAnchor: '09',
    color: 'sky',
    notes: 'Incluye gastos comunes. Edificio con conserjería 24/7.',
    payments: [
      { month: '2025-01', amount: 590_000, paidOn: '2025-01-01', status: 'paid' },
      { month: '2025-02', amount: 590_000, paidOn: '2025-02-02', status: 'paid' },
      { month: '2025-03', amount: 590_000, paidOn: '2025-03-01', status: 'paid' },
      { month: '2025-04', amount: 590_000, paidOn: '2025-04-03', status: 'paid' },
      { month: '2025-05', amount: 590_000, paidOn: '2025-05-02', status: 'paid' },
      { month: '2025-06', amount: 590_000, paidOn: '2025-06-01', status: 'paid' },
      { month: '2025-07', amount: 590_000, paidOn: '2025-07-04', status: 'paid' },
      { month: '2025-08', amount: 590_000, paidOn: '2025-08-02', status: 'paid' },
      { month: '2025-09', amount: 619_500, paidOn: '2025-09-01', status: 'paid' },
      { month: '2025-10', amount: 619_500, paidOn: '2025-10-02', status: 'paid' },
      { month: '2025-11', amount: 619_500, paidOn: '2025-11-04', status: 'paid' },
      { month: '2025-12', amount: 619_500, paidOn: '2025-12-01', status: 'paid' },
      { month: '2026-01', amount: 619_500, paidOn: '2026-01-02', status: 'paid' },
      { month: '2026-02', amount: 619_500, paidOn: '2026-02-01', status: 'paid' },
      { month: '2026-03', amount: 619_500, paidOn: '2026-03-03', status: 'paid' },
      { month: '2026-04', amount: 619_500, paidOn: '2026-04-02', status: 'paid' },
      { month: '2026-05', amount: 619_500, paidOn: null, status: 'pending' },
    ],
  },
];
