export const ACCENTS = {
  mint: { 50: '#eaf5ed', 100: '#d4ecd9', 500: '#6fa37b', 700: '#4a7a55', label: 'Menta' },
  peach: { 50: '#faecdf', 100: '#f4d4c2', 500: '#c98863', 700: '#985f3c', label: 'Durazno' },
  lavender: { 50: '#efe9f5', 100: '#dcd1ec', 500: '#8b76b8', 700: '#604c8a', label: 'Lavanda' },
  sky: { 50: '#e6eff4', 100: '#c8dde8', 500: '#5d8aa3', 700: '#3f6075', label: 'Cielo' },
} as const;

export type AccentKey = keyof typeof ACCENTS;

export const ACCENT_OPTIONS = [
  { key: 'mint', value: ACCENTS.mint },
  { key: 'peach', value: ACCENTS.peach },
  { key: 'lavender', value: ACCENTS.lavender },
  { key: 'sky', value: ACCENTS.sky },
] satisfies readonly { key: AccentKey; value: (typeof ACCENTS)[AccentKey] }[];

export const getAccentKey = (value: string | null | undefined): AccentKey => {
  if (value === 'mint' || value === 'peach' || value === 'lavender' || value === 'sky') {
    return value;
  }
  return 'mint';
};

export const PAYMENT_METHODS = [
  { value: 'bancolombia', label: 'Bancolombia' },
  { value: 'davivienda', label: 'Davivienda' },
  { value: 'bbva', label: 'BBVA Colombia' },
  { value: 'bogota', label: 'Banco de Bogotá' },
  { value: 'popular', label: 'Banco Popular' },
  { value: 'scotiabank', label: 'Scotiabank Colpatria' },
  { value: 'avvillas', label: 'Banco AV Villas' },
  { value: 'cajasocial', label: 'Banco Caja Social' },
  { value: 'falabella', label: 'Banco Falabella' },
  { value: 'itau', label: 'Itaú' },
  { value: 'nequi', label: 'Nequi' },
  { value: 'daviplata', label: 'Daviplata' },
  { value: 'pse', label: 'PSE — pago en línea' },
  { value: 'efectivo', label: 'Efectivo' },
] as const;

export const fmtCLP = (n: number | null | undefined) => `$${(n ?? 0).toLocaleString('es-CL')}`;

const MONTH_SHORT = [
  'Ene',
  'Feb',
  'Mar',
  'Abr',
  'May',
  'Jun',
  'Jul',
  'Ago',
  'Sep',
  'Oct',
  'Nov',
  'Dic',
];
const MONTH_LONG = [
  'enero',
  'febrero',
  'marzo',
  'abril',
  'mayo',
  'junio',
  'julio',
  'agosto',
  'septiembre',
  'octubre',
  'noviembre',
  'diciembre',
];

export const fmtMonth = (ym: string) => {
  const [y, m] = ym.split('-');
  return `${MONTH_SHORT[Number(m) - 1]} ${y}`;
};

export const fmtMonthLong = (ym: string) => {
  const [y, m] = ym.split('-');
  return `${MONTH_LONG[Number(m) - 1]} ${y}`;
};

export const fmtDate = (d: string | null | undefined) => {
  if (!d) {
    return '—';
  }
  const [y, m, day] = d.split('-');
  return `${day}/${m}/${y}`;
};

export const todayYM = () => {
  const t = new Date();
  return `${t.getFullYear()}-${String(t.getMonth() + 1).padStart(2, '0')}`;
};

export const nextYM = (ym: string) => {
  const [year, month] = ym.split('-').map(Number);
  const nextMonth = month === 12 ? 1 : (month ?? 1) + 1;
  const nextYear =
    month === 12 ? (year ?? new Date().getFullYear()) + 1 : (year ?? new Date().getFullYear());
  return `${nextYear}-${String(nextMonth).padStart(2, '0')}`;
};

export const todayISO = () => new Date().toISOString().slice(0, 10);

export type PaymentStatus = 'paid' | 'late' | 'pending' | 'overdue';

export const getPaymentStatus = (value: string | null | undefined): PaymentStatus => {
  if (value === 'paid' || value === 'late' || value === 'pending' || value === 'overdue') {
    return value;
  }
  return 'pending';
};
