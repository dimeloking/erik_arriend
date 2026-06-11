import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import Link from 'next/link';
import { getBalanceOverview } from '@/features/casero/balance-data';
import { BalanceSnapshotCard } from '@/features/casero/components/BalanceSnapshotCard';
import { BalanceSnapshotEditDialog } from '@/features/casero/components/BalanceSnapshotEditDialog';
import { fmtCLP } from '@/features/casero/lib';
import { Icon } from '@/features/casero/ui/Icon';
import { Button, Card } from '@/features/casero/ui/primitives';

type BalancePageProps = {
  params: Promise<{ locale: string }>;
};

export const metadata: Metadata = {
  title: 'Casero — Balance general',
};

export default async function BalancePage(props: BalancePageProps) {
  const { locale } = await props.params;
  setRequestLocale(locale);

  const {
    snapshot,
    expenses,
    appIncomeClp,
    appExpensesClp,
    totalIncomeClp,
    totalExpensesClp,
    currentBalanceClp,
    movements,
    payments,
  } = await getBalanceOverview();

  return (
    <div className="animate-fade-up space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-1 text-[13px] text-ink-500 hover:text-ink-900"
          >
            <Icon name="chev_l" size={14} /> Volver al panel
          </Link>
          <h1 className="mt-3 serif text-[36px] leading-tight text-ink-900">Balance general</h1>
          <p className="mt-1 max-w-2xl text-[14px] text-ink-500">
            Controla los saldos que vienen del Excel y los movimientos nuevos de la app.
          </p>
        </div>
        <Link href="/dashboard/properties/new">
          <Button>
            <Icon name="plus" size={14} /> Agregar propiedad
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <Card className="border-mint-100 bg-mint-50/30 p-5">
          <div className="text-[12px] font-bold tracking-[0.1em] text-mint-700 uppercase">
            Ingresos
          </div>
          <div className="mt-1 num serif text-[30px] text-ink-900">{fmtCLP(totalIncomeClp)}</div>
          <div className="mt-1 text-[13px] text-ink-500">
            {snapshot.incomeClp > 0
              ? `Excel ${fmtCLP(snapshot.incomeClp)} + app ${fmtCLP(appIncomeClp)}`
              : 'Solo movimientos de la app'}
          </div>
        </Card>

        <Card className="border-peach-100 bg-peach-50/30 p-5">
          <div className="text-[12px] font-bold tracking-[0.1em] text-peach-700 uppercase">
            Saldo actual
          </div>
          <div className="mt-1 num serif text-[30px] text-ink-900">{fmtCLP(currentBalanceClp)}</div>
          <div className="mt-1 text-[13px] text-ink-500">
            {snapshot.balanceClp === 0
              ? 'Basado en movimientos de la app'
              : `Base ${fmtCLP(snapshot.balanceClp)} + movimiento app`}
          </div>
          <BalanceSnapshotEditDialog snapshot={snapshot} />
        </Card>

        <Card className="border-rose-100 bg-rose-50/30 p-5">
          <div className="text-[12px] font-bold tracking-[0.1em] text-rose-700 uppercase">
            Gastos
          </div>
          <div className="mt-1 num serif text-[30px] text-ink-900">{fmtCLP(totalExpensesClp)}</div>
          <div className="mt-1 text-[13px] text-ink-500">
            {snapshot.expensesClp > 0
              ? `Excel ${fmtCLP(snapshot.expensesClp)} + app ${fmtCLP(appExpensesClp)}`
              : 'Solo movimientos de la app'}
          </div>
        </Card>
      </div>

      <BalanceSnapshotCard
        snapshot={snapshot}
        appIncomeClp={appIncomeClp}
        expenses={expenses}
        movements={movements}
        payments={payments}
      />
    </div>
  );
}
