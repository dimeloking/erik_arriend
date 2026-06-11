'use client';

import { useMemo, useState } from 'react';
import type { BalanceMovement } from '../balance-data';
import { fmtCLP, fmtDate, fmtMonthLong } from '../lib';
import { Icon } from '../ui/Icon';
import { Button, Card } from '../ui/primitives';

type Props = {
  movements: BalanceMovement[];
  baseBalance: number;
};

type HistoryEntry = {
  movement: BalanceMovement;
  runningBalance: number;
};

export const MovementsDetail = (props: Props) => {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);

  // Running balance is computed over the full chronological set (oldest first),
  // then reversed to newest-first so the figure matches the landing card.
  const history = useMemo<HistoryEntry[]>(() => {
    let running = props.baseBalance;
    return [...props.movements]
      .toSorted((a, b) => a.date.localeCompare(b.date) || a.id.localeCompare(b.id))
      .map((movement) => {
        running += movement.type === 'income' ? movement.amountClp : -movement.amountClp;
        return { movement, runningBalance: running };
      })
      .toReversed();
  }, [props.movements, props.baseBalance]);

  const currentBalanceClp = history[0]?.runningBalance ?? props.baseBalance;

  const totalIncomeClp = useMemo(
    () =>
      props.movements
        .filter((movement) => movement.type === 'income')
        .reduce((sum, movement) => sum + movement.amountClp, 0),
    [props.movements],
  );

  const totalExpenseClp = useMemo(
    () =>
      props.movements
        .filter((movement) => movement.type === 'expense')
        .reduce((sum, movement) => sum + movement.amountClp, 0),
    [props.movements],
  );

  const filtered = useMemo(() => {
    if (!search.trim()) {
      return history;
    }
    const query = search.toLowerCase();
    return history.filter((entry) => entry.movement.description.toLowerCase().includes(query));
  }, [history, search]);

  // Group entries by YYYY-MM, newest month first.
  const monthGroups = useMemo(() => {
    const groups = new Map<string, HistoryEntry[]>();
    for (const entry of filtered) {
      const key = entry.movement.date.slice(0, 7);
      const bucket = groups.get(key);
      if (bucket) {
        bucket.push(entry);
      } else {
        groups.set(key, [entry]);
      }
    }
    return [...groups.entries()].toSorted((a, b) => b[0].localeCompare(a[0]));
  }, [filtered]);

  const totalPages = Math.max(1, monthGroups.length);
  const currentPage = Math.min(page, totalPages);
  const currentGroup = monthGroups[currentPage - 1];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <Card className="border-peach-100 bg-peach-50/30 p-4">
          <div className="text-[11px] font-bold tracking-[0.1em] text-peach-700 uppercase">
            Saldo actual
          </div>
          <div className="mt-1 num serif text-[24px] text-ink-900">{fmtCLP(currentBalanceClp)}</div>
        </Card>
        <Card className="border-mint-100 bg-mint-50/30 p-4">
          <div className="text-[11px] font-bold tracking-[0.1em] text-mint-700 uppercase">
            Ingresos
          </div>
          <div className="mt-1 num serif text-[24px] text-ink-900">{fmtCLP(totalIncomeClp)}</div>
        </Card>
        <Card className="border-rose-100 bg-rose-50/30 p-4">
          <div className="text-[11px] font-bold tracking-[0.1em] text-rose-700 uppercase">
            Gastos
          </div>
          <div className="mt-1 num serif text-[24px] text-ink-900">{fmtCLP(totalExpenseClp)}</div>
        </Card>
      </div>

      <Card className="overflow-hidden p-5">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-4">
          <h3 className="serif text-[20px] text-ink-900">Historial por mes</h3>
          <div className="relative w-full max-w-sm">
            <div className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-ink-400">
              <Icon name="search" size={14} />
            </div>
            <input
              type="text"
              aria-label="Buscar movimientos por descripción"
              placeholder="Buscar por descripción..."
              value={search}
              onChange={(event) => {
                setSearch(event.target.value);
                setPage(1);
              }}
              className="h-10 w-full rounded-full border border-cream-200 bg-cream-50 pr-4 pl-9 text-[14px] text-ink-900 transition outline-none placeholder:text-ink-400 focus:border-ink-900"
            />
          </div>
        </div>

        {currentGroup ? (
          <div>
            <div className="mb-2 flex items-center justify-between">
              <h4 className="serif text-[16px] text-ink-700 capitalize">
                {fmtMonthLong(currentGroup[0])}
              </h4>
              <div className="text-[12px] text-ink-400">{currentGroup[1].length} movimientos</div>
            </div>
            <div className="overflow-hidden rounded-2xl border border-cream-200">
              <div className="grid grid-cols-12 gap-3 border-b border-cream-200 bg-cream-50 px-4 py-3 text-[11px] tracking-[0.1em] text-ink-500 uppercase">
                <div className="col-span-2">Fecha</div>
                <div className="col-span-4">Movimiento</div>
                <div className="col-span-2">Tipo</div>
                <div className="col-span-2 text-right">Valor</div>
                <div className="col-span-2 text-right">Saldo</div>
              </div>
              {currentGroup[1].map((entry) => {
                const isIncome = entry.movement.type === 'income';
                return (
                  <div
                    key={entry.movement.id}
                    className="grid grid-cols-12 items-center gap-3 border-b border-cream-100 px-4 py-3 last:border-0 hover:bg-cream-50/60"
                  >
                    <div className="col-span-2 text-[13px] text-ink-500">
                      {fmtDate(entry.movement.date)}
                    </div>
                    <div className="col-span-4 min-w-0">
                      <div className="truncate text-[14px] text-ink-900">
                        {entry.movement.description}
                      </div>
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
                      {fmtCLP(entry.movement.amountClp)}
                    </div>
                    <div className="col-span-2 text-right num text-[14px] text-ink-900">
                      {fmtCLP(entry.runningBalance)}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="rounded-2xl border border-cream-200 px-4 py-5 text-[13px] text-ink-500">
            No se encontraron movimientos.
          </div>
        )}

        {totalPages > 1 && (
          <div className="mt-4 flex items-center justify-between">
            <div className="text-[13px] text-ink-500">
              Mes {currentPage} de {totalPages}
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="soft"
                size="sm"
                disabled={currentPage === 1}
                onClick={() => {
                  setPage((current) => Math.max(1, current - 1));
                }}
              >
                <Icon name="chev_l" size={13} /> Más reciente
              </Button>
              <Button
                variant="soft"
                size="sm"
                disabled={currentPage === totalPages}
                onClick={() => {
                  setPage((current) => Math.min(totalPages, current + 1));
                }}
              >
                Más antiguo <Icon name="chev_r" size={13} />
              </Button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
};
