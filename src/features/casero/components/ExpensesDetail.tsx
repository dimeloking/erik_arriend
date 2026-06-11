'use client';

import { useRouter } from 'next/navigation';
import type { ComponentProps } from 'react';
import { useMemo, useState } from 'react';
import { createExpense, deleteExpense } from '../actions';
import { fmtCLP, fmtDate, todayISO } from '../lib';
import type { ExpenseRow } from '../queries';
import { Icon } from '../ui/Icon';
import { Button, Card, Field } from '../ui/primitives';

type Props = {
  expenses: ExpenseRow[];
};

export const ExpensesDetail = (props: Props) => {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const itemsPerPage = 10;

  const handleExpenseSubmit: NonNullable<ComponentProps<'form'>['onSubmit']> = async (event) => {
    event.preventDefault();
    setPending(true);
    setErrors([]);
    const result = await createExpense(new FormData(event.currentTarget));
    setPending(false);

    if (!result.ok) {
      setErrors(result.errors);
      return;
    }

    event.currentTarget.reset();
    setPage(1); // Reset page on new item
    router.refresh();
  };

  const handleExpenseDelete = async (expenseId: string) => {
    setPending(true);
    await deleteExpense(expenseId);
    setPending(false);
    router.refresh();
  };

  const filteredExpenses = useMemo(() => {
    if (!search.trim()) {
      return props.expenses;
    }
    const lower = search.toLowerCase();
    return props.expenses.filter(
      (e) =>
        e.description.toLowerCase().includes(lower) ||
        (e.notes && e.notes.toLowerCase().includes(lower)),
    );
  }, [props.expenses, search]);

  const totalPages = Math.max(1, Math.ceil(filteredExpenses.length / itemsPerPage));
  const currentPage = Math.min(page, totalPages);

  const currentItems = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredExpenses.slice(start, start + itemsPerPage);
  }, [filteredExpenses, currentPage]);

  return (
    <div className="space-y-6">
      <Card className="border border-cream-200 p-5">
        <div className="mb-4">
          <h3 className="serif text-[20px] text-ink-900">Registrar nuevo gasto</h3>
        </div>
        <form onSubmit={handleExpenseSubmit} className="grid grid-cols-1 gap-3 lg:grid-cols-12">
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
            <Button type="submit" isLoading={pending} className="w-full">
              {!pending && <Icon name="plus" size={14} />} Agregar
            </Button>
          </div>
        </form>

        {errors.length > 0 && (
          <div className="mt-4 rounded-xl bg-rose-50 p-3 text-[13px] text-rose-500">
            <ul className="list-disc space-y-1 pl-4">
              {errors.map((message) => (
                <li key={message}>{message}</li>
              ))}
            </ul>
          </div>
        )}
      </Card>

      <Card className="overflow-hidden p-5">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-4">
          <h3 className="serif text-[20px] text-ink-900">Lista detallada</h3>
          <div className="relative w-full max-w-sm">
            <div className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-ink-400">
              <Icon name="search" size={14} />
            </div>
            <input
              type="text"
              aria-label="Buscar gastos por descripción"
              placeholder="Buscar por descripción..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1); // Reset page on search
              }}
              className="h-10 w-full rounded-full border border-cream-200 bg-cream-50 pr-4 pl-9 text-[14px] text-ink-900 transition outline-none placeholder:text-ink-400 focus:border-ink-900"
            />
          </div>
        </div>

        <div className="overflow-hidden rounded-2xl border border-cream-200">
          <div className="grid grid-cols-12 gap-3 border-b border-cream-200 bg-cream-50 px-4 py-3 text-[11px] tracking-[0.1em] text-ink-500 uppercase">
            <div className="col-span-3">Fecha</div>
            <div className="col-span-5">Descripción</div>
            <div className="col-span-3 text-right">Monto</div>
            <div className="col-span-1" aria-hidden="true"></div>
          </div>

          {currentItems.length === 0 ? (
            <div className="px-4 py-5 text-[13px] text-ink-500">No se encontraron gastos.</div>
          ) : (
            currentItems.map((expense) => (
              <div
                key={expense.id}
                className="grid grid-cols-12 items-center gap-3 border-b border-cream-100 px-4 py-3 last:border-0 hover:bg-cream-50/60"
              >
                <div className="col-span-3 text-[13px] text-ink-500">{fmtDate(expense.date)}</div>
                <div className="col-span-5 min-w-0">
                  <div className="truncate text-[14px] text-ink-900">{expense.description}</div>
                  {expense.notes && (
                    <div className="truncate text-[12px] text-ink-400">{expense.notes}</div>
                  )}
                </div>
                <div className="col-span-3 text-right num text-[14px] text-ink-900">
                  {fmtCLP(expense.amountClp)}
                </div>
                <div className="col-span-1 flex justify-end">
                  <button
                    type="button"
                    title="Eliminar gasto"
                    disabled={pending}
                    onClick={() => {
                      void handleExpenseDelete(expense.id);
                    }}
                    className="flex h-8 w-8 items-center justify-center rounded-full text-ink-400 hover:bg-rose-50 hover:text-rose-500 disabled:opacity-50"
                  >
                    <Icon name="trash" size={14} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {totalPages > 1 && (
          <div className="mt-4 flex items-center justify-between">
            <div className="text-[13px] text-ink-500">
              Página {currentPage} de {totalPages}
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="soft"
                size="sm"
                disabled={currentPage === 1}
                onClick={() => {
                  setPage((p) => Math.max(1, p - 1));
                }}
              >
                <Icon name="chev_l" size={13} /> Anterior
              </Button>
              <Button
                variant="soft"
                size="sm"
                disabled={currentPage === totalPages}
                onClick={() => {
                  setPage((p) => Math.min(totalPages, p + 1));
                }}
              >
                Siguiente <Icon name="chev_r" size={13} />
              </Button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
};
