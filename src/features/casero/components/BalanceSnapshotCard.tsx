'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import type { ComponentProps } from 'react';
import { useState } from 'react';
import { updateBalanceSnapshot } from '../actions';
import type { BalanceMovement, BalancePaymentDetail } from '../balance-data';
import { fmtCLP, fmtDate, fmtMonthLong, getPaymentStatus } from '../lib';
import type { BalanceSnapshotRow, ExpenseRow } from '../queries';
import { Icon } from '../ui/Icon';
import { Button, Card, Field, StatusPill } from '../ui/primitives';

const BalanceHeader = (props: { action: React.ReactNode }) => (
  <div className="flex flex-wrap items-center justify-between gap-3">
    <div>
      <h2 className="serif text-[24px] text-ink-900">Balance general</h2>
      <div className="text-[13px] text-ink-500">Saldos iniciales importados desde tu Excel.</div>
    </div>
    {props.action}
  </div>
);

const BalanceValue = (props: {
  label: string;
  value: number;
  tone: 'mint' | 'gold' | 'peach';
  hint: string;
}) => {
  const tones = {
    mint: 'bg-mint-50 text-mint-700',
    gold: 'bg-amber-50 text-amber-700',
    peach: 'bg-peach-50 text-peach-700',
  };

  return (
    <div className={`p-5 ${tones[props.tone]}`}>
      <div className="text-[12px] tracking-[0.1em] uppercase">{props.label}</div>
      <div className="mt-2 num serif text-[30px] text-ink-900">{fmtCLP(props.value)}</div>
      <div className="mt-1 text-[12px] opacity-80">{props.hint}</div>
    </div>
  );
};

const ExpenseRowItem = (props: { expense: ExpenseRow }) => (
  <div className="grid grid-cols-12 items-center gap-3 border-b border-cream-100 px-4 py-3 last:border-0">
    <div className="col-span-3 text-[13px] text-ink-500">{fmtDate(props.expense.date)}</div>
    <div className="col-span-5 min-w-0">
      <div className="truncate text-[14px] text-ink-900">{props.expense.description}</div>
      {props.expense.notes && (
        <div className="truncate text-[12px] text-ink-400">{props.expense.notes}</div>
      )}
    </div>
    <div className="col-span-4 text-right num text-[14px] text-ink-900">
      {fmtCLP(props.expense.amountClp)}
    </div>
  </div>
);

const MovementRow = (props: { movement: BalanceMovement; runningBalance: number }) => {
  const isIncome = props.movement.type === 'income';

  return (
    <div className="grid grid-cols-12 items-center gap-3 border-b border-cream-100 px-4 py-3 last:border-0">
      <div className="col-span-2 text-[13px] text-ink-500">{fmtDate(props.movement.date)}</div>
      <div className="col-span-4 min-w-0">
        <div className="truncate text-[14px] text-ink-900">{props.movement.description}</div>
      </div>
      <div className="col-span-2">
        <span
          className={`inline-flex h-6 items-center rounded-full px-2.5 text-[11px] font-medium ${
            isIncome ? 'bg-mint-100 text-mint-700' : 'bg-peach-100 text-peach-700'
          }`}
        >
          {isIncome ? 'Ingreso' : 'Gasto'}
        </span>
      </div>
      <div
        className={`col-span-2 text-right num text-[14px] ${isIncome ? 'text-mint-700' : 'text-peach-700'}`}
      >
        {isIncome ? '+' : '-'}
        {fmtCLP(props.movement.amountClp)}
      </div>
      <div className="col-span-2 text-right num text-[14px] text-ink-900">
        {fmtCLP(props.runningBalance)}
      </div>
    </div>
  );
};

export const BalanceSnapshotCard = (props: {
  snapshot: BalanceSnapshotRow;
  appIncomeClp: number;
  expenses: ExpenseRow[];
  movements: BalanceMovement[];
  payments: BalancePaymentDetail[];
}) => {
  const router = useRouter();
  const [editing, setEditing] = useState(false);
  const [pending, setPending] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);
  const { appIncomeClp, expenses, movements, payments, snapshot } = props;
  const appExpensesClp = expenses.reduce((sum, expense) => sum + expense.amountClp, 0);
  const totalIncomeClp = snapshot.incomeClp + appIncomeClp;
  const totalExpensesClp = snapshot.expensesClp + appExpensesClp;
  const currentBalanceClp = snapshot.balanceClp + appIncomeClp - appExpensesClp;
  let runningBalance = snapshot.balanceClp;
  const movementHistory = [...movements]
    .toSorted((a, b) => a.date.localeCompare(b.date) || a.id.localeCompare(b.id))
    .map((movement) => {
      runningBalance += movement.type === 'income' ? movement.amountClp : -movement.amountClp;
      return { movement, runningBalance };
    })
    .toReversed();

  const handleSnapshotSubmit: NonNullable<ComponentProps<'form'>['onSubmit']> = async (event) => {
    event.preventDefault();
    setPending(true);
    setErrors([]);
    const result = await updateBalanceSnapshot(new FormData(event.currentTarget));
    setPending(false);

    if (!result.ok) {
      setErrors(result.errors);
      return;
    }

    setEditing(false);
    router.refresh();
  };

  if (editing) {
    return (
      <Card className="p-5">
        <form onSubmit={handleSnapshotSubmit} className="space-y-4">
          <BalanceHeader
            action={
              <Button
                type="button"
                size="sm"
                variant="ghost"
                onClick={() => {
                  setEditing(false);
                }}
              >
                Cancelar
              </Button>
            }
          />
          <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
            <Field
              label="Ingresos"
              name="incomeClp"
              type="number"
              prefix="$"
              min={0}
              step={1}
              defaultValue={String(snapshot.incomeClp)}
              required
            />
            <Field
              label="Gastos"
              name="expensesClp"
              type="number"
              prefix="$"
              min={0}
              step={1}
              defaultValue={String(snapshot.expensesClp)}
              required
            />
            <Field
              label="Saldo"
              name="balanceClp"
              type="number"
              prefix="$"
              step={1}
              defaultValue={String(snapshot.balanceClp)}
              required
            />
          </div>

          {errors.length > 0 && (
            <div className="rounded-xl bg-rose-50 p-3 text-[13px] text-rose-500">
              <ul className="list-disc space-y-1 pl-4">
                {errors.map((message) => (
                  <li key={message}>{message}</li>
                ))}
              </ul>
            </div>
          )}

          <div className="flex justify-end">
            <Button type="submit" isLoading={pending}>
              {!pending && <Icon name="check" size={14} />} Guardar balance
            </Button>
          </div>
        </form>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden">
      <div className="p-5">
        <BalanceHeader
          action={
            <Button
              type="button"
              size="sm"
              variant="soft"
              onClick={() => {
                setEditing(true);
              }}
            >
              <Icon name="edit" size={13} /> Editar
            </Button>
          }
        />
        <div className="mt-4 grid grid-cols-1 overflow-hidden rounded-2xl border border-cream-200 md:grid-cols-3">
          <BalanceValue
            label="Ingresos"
            value={totalIncomeClp}
            tone="mint"
            hint={`Excel ${fmtCLP(snapshot.incomeClp)} + app ${fmtCLP(appIncomeClp)}`}
          />
          <BalanceValue
            label="Saldo actual"
            value={currentBalanceClp}
            tone="gold"
            hint={`Base ${fmtCLP(snapshot.balanceClp)} + movimiento app`}
          />
          <BalanceValue
            label="Gastos"
            value={totalExpensesClp}
            tone="peach"
            hint={`Excel ${fmtCLP(snapshot.expensesClp)} + app ${fmtCLP(appExpensesClp)}`}
          />
        </div>
      </div>

      <div className="border-t border-cream-200 p-5">
        {/* Sección de Gastos (Últimos 5) */}
        <div>
          <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
            <div>
              <h3 className="serif text-[20px] text-ink-900">Historial de gastos</h3>
              <div className="text-[13px] text-ink-500">Últimos gastos registrados en la app.</div>
            </div>
            <Link href="/dashboard/balance/expenses">
              <Button variant="soft" size="sm" className="cursor-pointer">
                Ver detalle <Icon name="chev_r" size={13} />
              </Button>
            </Link>
          </div>
          <div className="overflow-hidden rounded-2xl border border-cream-200">
            <div className="grid grid-cols-12 gap-3 border-b border-cream-200 bg-cream-50 px-4 py-3 text-[11px] tracking-[0.1em] text-ink-500 uppercase">
              <div className="col-span-3">Fecha</div>
              <div className="col-span-5">Descripción</div>
              <div className="col-span-4 text-right">Monto</div>
            </div>
            {expenses.length === 0 ? (
              <div className="px-4 py-5 text-[13px] text-ink-500">Sin gastos nuevos todavía.</div>
            ) : (
              expenses
                .slice(0, 5)
                .map((expense) => <ExpenseRowItem key={expense.id} expense={expense} />)
            )}
          </div>
        </div>

        {/* Sección de Balance (Últimos 5) */}
        <div className="mt-8">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
            <div>
              <h3 className="serif text-[20px] text-ink-900">Historial de balance</h3>
              <div className="text-[13px] text-ink-500">
                Ingresos de arriendo y gastos nuevos con saldo actualizado.
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="num text-[16px] text-ink-900">{fmtCLP(currentBalanceClp)}</div>
              <Link href="/dashboard/balance/movements">
                <Button variant="soft" size="sm" className="cursor-pointer">
                  Ver detalle <Icon name="chev_r" size={13} />
                </Button>
              </Link>
            </div>
          </div>
          <div className="overflow-hidden rounded-2xl border border-cream-200">
            <div className="grid grid-cols-12 gap-3 border-b border-cream-200 bg-cream-50 px-4 py-3 text-[11px] tracking-[0.1em] text-ink-500 uppercase">
              <div className="col-span-2">Fecha</div>
              <div className="col-span-4">Movimiento</div>
              <div className="col-span-2">Tipo</div>
              <div className="col-span-2 text-right">Valor</div>
              <div className="col-span-2 text-right">Saldo</div>
            </div>
            {movementHistory.length === 0 ? (
              <div className="px-4 py-5 text-[13px] text-ink-500">
                Sin movimientos nuevos todavía. Saldo inicial: {fmtCLP(snapshot.balanceClp)}.
              </div>
            ) : (
              movementHistory
                .slice(0, 5)
                .map((entry) => (
                  <MovementRow
                    key={entry.movement.id}
                    movement={entry.movement}
                    runningBalance={entry.runningBalance}
                  />
                ))
            )}
          </div>
        </div>

        {/* Sección de Pagos (Últimos 5) */}
        <div className="mt-8">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
            <div>
              <h3 className="serif text-[20px] text-ink-900">Historial de pagos</h3>
              <div className="text-[13px] text-ink-500">
                Todos los pagos guardados por propiedad e inquilino.
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-[12.5px] text-ink-500">{payments.length} registros totales</div>
              <Link href="/dashboard/balance/payments">
                <Button variant="soft" size="sm" className="cursor-pointer">
                  Ver detalle <Icon name="chev_r" size={13} />
                </Button>
              </Link>
            </div>
          </div>
          <div className="overflow-hidden rounded-2xl border border-cream-200">
            <div className="grid grid-cols-12 gap-3 border-b border-cream-200 bg-cream-50 px-4 py-3 text-[11px] tracking-[0.1em] text-ink-500 uppercase">
              <div className="col-span-2">Mes</div>
              <div className="col-span-3">Propiedad</div>
              <div className="col-span-3">Inquilino</div>
              <div className="col-span-2">Estado</div>
              <div className="col-span-2 text-right">Valor</div>
            </div>
            {payments.length === 0 ? (
              <div className="px-4 py-5 text-[13px] text-ink-500">Sin pagos guardados.</div>
            ) : (
              payments.slice(0, 5).map((payment) => (
                <div
                  key={`${payment.type}-${payment.id}`}
                  className="grid grid-cols-12 items-center gap-3 border-b border-cream-100 px-4 py-3 last:border-0 hover:bg-cream-50/60"
                >
                  <div className="col-span-2">
                    <div className="text-[13.5px] text-ink-900">{fmtMonthLong(payment.month)}</div>
                    <div className="text-[11px] text-ink-400">{fmtDate(payment.paidOn)}</div>
                  </div>
                  <div className="col-span-3 truncate text-[13.5px] text-ink-700">
                    {payment.propertyName}
                  </div>
                  <div className="col-span-3 min-w-0">
                    <div className="truncate text-[13.5px] text-ink-700">{payment.tenantName}</div>
                    {payment.type === 'extra' && (
                      <div className="text-[11px] font-medium text-peach-700">Cobro extra</div>
                    )}
                  </div>
                  <div className="col-span-2">
                    <StatusPill status={getPaymentStatus(payment.status)} />
                  </div>
                  <div
                    className={`col-span-2 text-right num text-[14px] font-medium ${payment.type === 'extra' ? 'text-peach-900' : 'text-ink-900'}`}
                  >
                    {fmtCLP(payment.amountClp)}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </Card>
  );
};
