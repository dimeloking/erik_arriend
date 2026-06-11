import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import Link from 'next/link';
import { ExpensesDetail } from '@/features/casero/components/ExpensesDetail';
import { listExpenses } from '@/features/casero/queries';
import { Icon } from '@/features/casero/ui/Icon';

export const metadata: Metadata = {
  title: 'Casero — Historial de Gastos',
};

type PageProps = {
  params: Promise<{ locale: string }>;
};

export default async function ExpensesPage(props: PageProps) {
  const { locale } = await props.params;
  setRequestLocale(locale);

  const expenses = await listExpenses();

  return (
    <div className="animate-fade-up space-y-6">
      <div>
        <Link
          href="/dashboard/balance"
          className="inline-flex items-center gap-1 text-[13px] text-ink-500 hover:text-ink-900"
        >
          <Icon name="chev_l" size={14} /> Volver al balance
        </Link>
        <h1 className="mt-3 serif text-[36px] leading-tight text-ink-900">Historial de gastos</h1>
        <p className="mt-1 max-w-2xl text-[14px] text-ink-500">
          Registra y busca todos los gastos operativos y pagos de servicios.
        </p>
      </div>

      <ExpensesDetail expenses={expenses} />
    </div>
  );
}
