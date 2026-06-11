import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import Link from 'next/link';
import { getBalanceOverview } from '@/features/casero/balance-data';
import { PaymentsDetail } from '@/features/casero/components/PaymentsDetail';
import { Icon } from '@/features/casero/ui/Icon';

export const metadata: Metadata = {
  title: 'Casero — Historial de pagos',
};

type PageProps = {
  params: Promise<{ locale: string }>;
};

export default async function PaymentsPage(props: PageProps) {
  const { locale } = await props.params;
  setRequestLocale(locale);

  const { payments } = await getBalanceOverview();

  return (
    <div className="animate-fade-up space-y-6">
      <div>
        <Link
          href="/dashboard/balance"
          className="inline-flex items-center gap-1 text-[13px] text-ink-500 hover:text-ink-900"
        >
          <Icon name="chev_l" size={14} /> Volver al balance
        </Link>
        <h1 className="mt-3 serif text-[36px] leading-tight text-ink-900">Historial de pagos</h1>
        <p className="mt-1 max-w-2xl text-[14px] text-ink-500">
          Todos los pagos guardados por propiedad e inquilino, mes a mes.
        </p>
      </div>

      <PaymentsDetail payments={payments} />
    </div>
  );
}
