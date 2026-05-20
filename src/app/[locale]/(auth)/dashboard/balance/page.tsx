import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import Link from 'next/link';
import { BalanceSnapshotCard } from '@/features/casero/components/BalanceSnapshotCard';
import type { BalanceMovement } from '@/features/casero/components/BalanceSnapshotCard';
import { fmtCLP, fmtMonthLong } from '@/features/casero/lib';
import {
  getBalanceSnapshot,
  listExpenses,
  listPropertiesWithPayments,
} from '@/features/casero/queries';
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

  const [properties, snapshot, expenses] = await Promise.all([
    listPropertiesWithPayments(),
    getBalanceSnapshot(),
    listExpenses(),
  ]);

  const appIncomeClp = properties.reduce(
    (sum, property) =>
      sum +
      property.payments
        .filter((payment) => payment.status === 'paid')
        .reduce((paymentSum, payment) => paymentSum + payment.amountClp, 0),
    0,
  );
  const appExpensesClp = expenses.reduce((sum, expense) => sum + expense.amountClp, 0);
  const currentBalanceClp = snapshot.balanceClp + appIncomeClp - appExpensesClp;

  const incomeMovements: BalanceMovement[] = properties.flatMap((property) =>
    property.payments
      .filter((payment) => payment.status === 'paid')
      .map((payment) => ({
        id: `income-${payment.id}`,
        date: payment.paidOn ?? `${payment.month}-01`,
        description: `${property.nickname} · ${fmtMonthLong(payment.month)}`,
        amountClp: payment.amountClp,
        type: 'income' as const,
      })),
  );
  const expenseMovements: BalanceMovement[] = expenses.map((expense) => ({
    id: `expense-${expense.id}`,
    date: expense.date,
    description: expense.description,
    amountClp: expense.amountClp,
    type: 'expense',
  }));

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
        <Card className="p-5">
          <div className="text-[12px] tracking-[0.1em] text-ink-500 uppercase">Base Excel</div>
          <div className="mt-1 num serif text-[30px] text-ink-900">
            {fmtCLP(snapshot.balanceClp)}
          </div>
          <div className="mt-1 text-[13px] text-ink-500">saldo inicial</div>
        </Card>
        <Card className="p-5">
          <div className="text-[12px] tracking-[0.1em] text-ink-500 uppercase">Movimiento app</div>
          <div className="mt-1 num serif text-[30px] text-ink-900">
            {fmtCLP(appIncomeClp - appExpensesClp)}
          </div>
          <div className="mt-1 text-[13px] text-ink-500">ingresos menos gastos nuevos</div>
        </Card>
        <Card className="p-5">
          <div className="text-[12px] tracking-[0.1em] text-ink-500 uppercase">Saldo actual</div>
          <div className="mt-1 num serif text-[30px] text-ink-900">{fmtCLP(currentBalanceClp)}</div>
          <div className="mt-1 text-[13px] text-mint-700">calculado automáticamente</div>
        </Card>
      </div>

      <BalanceSnapshotCard
        snapshot={snapshot}
        appIncomeClp={appIncomeClp}
        expenses={expenses}
        movements={[...incomeMovements, ...expenseMovements]}
      />
    </div>
  );
}
