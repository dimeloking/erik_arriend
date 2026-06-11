'use client';

import { useMemo, useState } from 'react';
import type { BalancePaymentDetail } from '../balance-data';
import { fmtCLP, fmtDate, fmtMonthLong, getPaymentStatus } from '../lib';
import { Icon } from '../ui/Icon';
import { Button, Card, StatusPill } from '../ui/primitives';

type Props = {
  payments: BalancePaymentDetail[];
};

export const PaymentsDetail = (props: Props) => {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);

  const collectedClp = useMemo(
    () =>
      props.payments
        .filter((payment) => payment.status === 'paid')
        .reduce((sum, payment) => sum + payment.amountClp, 0),
    [props.payments],
  );

  const pendingCount = useMemo(
    () => props.payments.filter((payment) => payment.status !== 'paid').length,
    [props.payments],
  );

  const filtered = useMemo(() => {
    if (!search.trim()) {
      return props.payments;
    }
    const query = search.toLowerCase();
    return props.payments.filter(
      (payment) =>
        payment.propertyName.toLowerCase().includes(query) ||
        payment.tenantName.toLowerCase().includes(query),
    );
  }, [props.payments, search]);

  // Group by YYYY-MM, newest month first.
  const monthGroups = useMemo(() => {
    const groups = new Map<string, BalancePaymentDetail[]>();
    for (const payment of filtered) {
      const bucket = groups.get(payment.month);
      if (bucket) {
        bucket.push(payment);
      } else {
        groups.set(payment.month, [payment]);
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
        <Card className="border-mint-100 bg-mint-50/30 p-4">
          <div className="text-[11px] font-bold tracking-[0.1em] text-mint-700 uppercase">
            Recaudado
          </div>
          <div className="mt-1 num serif text-[24px] text-ink-900">{fmtCLP(collectedClp)}</div>
        </Card>
        <Card className="border-cream-200 p-4">
          <div className="text-[11px] font-bold tracking-[0.1em] text-ink-500 uppercase">
            Registros
          </div>
          <div className="mt-1 num serif text-[24px] text-ink-900">{props.payments.length}</div>
        </Card>
        <Card className="border-peach-100 bg-peach-50/30 p-4">
          <div className="text-[11px] font-bold tracking-[0.1em] text-peach-700 uppercase">
            Pendientes
          </div>
          <div className="mt-1 num serif text-[24px] text-ink-900">{pendingCount}</div>
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
              aria-label="Buscar pagos por propiedad o inquilino"
              placeholder="Buscar por propiedad o inquilino..."
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
              <div className="text-[12px] text-ink-400">{currentGroup[1].length} pagos</div>
            </div>
            <div className="overflow-hidden rounded-2xl border border-cream-200">
              <div className="grid grid-cols-12 gap-3 border-b border-cream-200 bg-cream-50 px-4 py-3 text-[11px] tracking-[0.1em] text-ink-500 uppercase">
                <div className="col-span-4">Propiedad</div>
                <div className="col-span-3">Inquilino</div>
                <div className="col-span-2">Estado</div>
                <div className="col-span-3 text-right">Valor</div>
              </div>
              {currentGroup[1].map((payment) => (
                <div
                  key={`${payment.type}-${payment.id}`}
                  className="grid grid-cols-12 items-center gap-3 border-b border-cream-100 px-4 py-3 last:border-0 hover:bg-cream-50/60"
                >
                  <div className="col-span-4 min-w-0">
                    <div className="truncate text-[13.5px] text-ink-900">
                      {payment.propertyName}
                    </div>
                    <div className="text-[11px] text-ink-400">{fmtDate(payment.paidOn)}</div>
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
                    className={`col-span-3 text-right num text-[14px] font-medium ${payment.type === 'extra' ? 'text-peach-900' : 'text-ink-900'}`}
                  >
                    {fmtCLP(payment.amountClp)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="rounded-2xl border border-cream-200 px-4 py-5 text-[13px] text-ink-500">
            No se encontraron pagos.
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
