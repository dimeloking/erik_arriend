'use client';

import { useRouter } from 'next/navigation';
import type { ComponentProps } from 'react';
import { useState } from 'react';
import { createExpense, deleteExpense, updateBalanceSnapshot } from '../actions';
import { fmtCLP, fmtDate, fmtMonthLong, getPaymentStatus, todayISO } from '../lib';
import type { BalanceSnapshotRow, ExpenseRow } from '../queries';
import { Icon } from '../ui/Icon';
import { Button, Card, Field, StatusPill } from '../ui/primitives';

export type BalanceMovement = {
  id: string;
  date: string;
  description: string;
  amountClp: number;
  type: 'income' | 'expense';
};

export type BalancePaymentDetail = {
  id: string;
  propertyName: string;
  tenantName: string;
  month: string;
  paidOn: string | null;
  amountClp: number;
  status: string;
};

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

const ExpenseRowItem = (props: { expense: ExpenseRow; onDelete: (id: string) => void }) => (
  <div className="grid grid-cols-12 items-center gap-3 border-b border-cream-100 px-4 py-3 last:border-0">
    <div className="col-span-3 text-[13px] text-ink-500">{fmtDate(props.expense.date)}</div>
    <div className="col-span-5 min-w-0">
      <div className="truncate text-[14px] text-ink-900">{props.expense.description}</div>
      {props.expense.notes && (
        <div className="truncate text-[12px] text-ink-400">{props.expense.notes}</div>
      )}
    </div>
    <div className="col-span-3 text-right num text-[14px] text-ink-900">
      {fmtCLP(props.expense.amountClp)}
    </div>
    <div className="col-span-1 flex justify-end">
      <button
        type="button"
        aria-label="Eliminar gasto"
        onClick={() => {
          props.onDelete(props.expense.id);
        }}
        className="flex h-8 w-8 items-center justify-center rounded-full text-ink-400 hover:bg-rose-50 hover:text-rose-500"
      >
        <Icon name="trash" size={14} />
      </button>
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
  const [expenseErrors, setExpenseErrors] = useState<string[]>([]);
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

  const handleExpenseSubmit: NonNullable<ComponentProps<'form'>['onSubmit']> = async (event) => {
    event.preventDefault();
    setPending(true);
    setExpenseErrors([]);
    const result = await createExpense(new FormData(event.currentTarget));
    setPending(false);

    if (!result.ok) {
      setExpenseErrors(result.errors);
      return;
    }

    event.currentTarget.reset();
    router.refresh();
  };

  const handleExpenseDelete = async (expenseId: string) => {
    setPending(true);
    await deleteExpense(expenseId);
    setPending(false);
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
            <Button type="submit" disabled={pending}>
              <Icon name="check" size={14} /> Guardar balance
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
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="serif text-[20px] text-ink-900">Gastos nuevos</h3>
            <div className="text-[13px] text-ink-500">
              Registra gastos desde que empiezas a usar la app.
            </div>
          </div>
          <div className="num text-[18px] text-peach-700">{fmtCLP(appExpensesClp)}</div>
        </div>

        <form
          onSubmit={handleExpenseSubmit}
          className="mt-4 grid grid-cols-1 gap-3 lg:grid-cols-12"
        >
          <div className="lg:col-span-3">
            <Field label="Fecha" name="date" type="date" defaultValue={todayISO()} required />
          </div>
          <div className="lg:col-span-4">
            <Field
              label="Descripción"
              name="description"
              placeholder="Pago servicios, reparación, etc."
              required
            />
          </div>
          <div className="lg:col-span-3">
            <Field
              label="Valor"
              name="amountClp"
              type="number"
              prefix="$"
              min={1}
              step={1}
              placeholder="250000"
              required
            />
          </div>
          <div className="flex items-end lg:col-span-2">
            <Button type="submit" disabled={pending} className="w-full">
              <Icon name="plus" size={14} /> Agregar
            </Button>
          </div>
        </form>

        {expenseErrors.length > 0 && (
          <div className="mt-3 rounded-xl bg-rose-50 p-3 text-[13px] text-rose-500">
            <ul className="list-disc space-y-1 pl-4">
              {expenseErrors.map((message) => (
                <li key={message}>{message}</li>
              ))}
            </ul>
          </div>
        )}

        <div className="mt-4 overflow-hidden rounded-2xl border border-cream-200">
          {expenses.length === 0 ? (
            <div className="px-4 py-5 text-[13px] text-ink-500">Sin gastos nuevos todavía.</div>
          ) : (
            expenses
              .slice(0, 6)
              .map((expense) => (
                <ExpenseRowItem key={expense.id} expense={expense} onDelete={handleExpenseDelete} />
              ))
          )}
        </div>

        <div className="mt-5">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
            <div>
              <h3 className="serif text-[20px] text-ink-900">Historial de balance</h3>
              <div className="text-[13px] text-ink-500">
                Ingresos de arriendo y gastos nuevos con saldo actualizado.
              </div>
            </div>
            <div className="num text-[16px] text-ink-900">{fmtCLP(currentBalanceClp)}</div>
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
                .slice(0, 12)
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

        <div className="mt-5">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
            <div>
              <h3 className="serif text-[20px] text-ink-900">Historial de pagos</h3>
              <div className="text-[13px] text-ink-500">
                Todos los pagos guardados por propiedad e inquilino.
              </div>
            </div>
            <div className="text-[12.5px] text-ink-500">{payments.length} registros</div>
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
              payments.slice(0, 24).map((payment) => (
                <div
                  key={payment.id}
                  className="grid grid-cols-12 items-center gap-3 border-b border-cream-100 px-4 py-3 last:border-0"
                >
                  <div className="col-span-2">
                    <div className="text-[13.5px] text-ink-900">{fmtMonthLong(payment.month)}</div>
                    <div className="text-[11px] text-ink-400">{fmtDate(payment.paidOn)}</div>
                  </div>
                  <div className="col-span-3 truncate text-[13.5px] text-ink-700">
                    {payment.propertyName}
                  </div>
                  <div className="col-span-3 truncate text-[13.5px] text-ink-700">
                    {payment.tenantName}
                  </div>
                  <div className="col-span-2">
                    <StatusPill status={getPaymentStatus(payment.status)} />
                  </div>
                  <div className="col-span-2 text-right num text-[14px] text-ink-900">
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
