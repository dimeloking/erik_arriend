import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import Link from 'next/link';
import { getBalanceOverview } from '@/features/casero/balance-data';
import { MovementsDetail } from '@/features/casero/components/MovementsDetail';
import { Icon } from '@/features/casero/ui/Icon';

export const metadata: Metadata = {
  title: 'Casero — Historial de balance',
};

type PageProps = {
  params: Promise<{ locale: string }>;
};

export default async function MovementsPage(props: PageProps) {
  const { locale } = await props.params;
  setRequestLocale(locale);

  const { movements, snapshot } = await getBalanceOverview();

  return (
    <div className="animate-fade-up space-y-6">
      <div>
        <Link
          href="/dashboard/balance"
          className="inline-flex items-center gap-1 text-[13px] text-ink-500 hover:text-ink-900"
        >
          <Icon name="chev_l" size={14} /> Volver al balance
        </Link>
        <h1 className="mt-3 serif text-[36px] leading-tight text-ink-900">Historial de balance</h1>
        <p className="mt-1 max-w-2xl text-[14px] text-ink-500">
          Ingresos de arriendo y gastos nuevos con saldo actualizado, mes a mes.
        </p>
      </div>

      <MovementsDetail movements={movements} baseBalance={snapshot.balanceClp} />
    </div>
  );
}
