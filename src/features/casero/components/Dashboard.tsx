import Link from 'next/link';
import { ACCENTS, fmtCLP, fmtMonth, fmtMonthLong, getAccentKey, todayYM } from '../lib';
import type { ExpenseRow, PropertyWithPayments } from '../queries';
import { Icon } from '../ui/Icon';
import { Avatar, Button, Card } from '../ui/primitives';
import { PropertyCard } from './PropertyCard';

export const Dashboard = (props: {
  properties: PropertyWithPayments[];
  expenses: ExpenseRow[];
}) => {
  const { properties, expenses } = props;
  const ym = todayYM();
  const occupiedProperties = properties.filter((p) => p.isOccupied);

  const monthEntries = occupiedProperties.map((p) => {
    const payment = p.payments.find((x) => x.month === ym);
    const extras = p.extraPayments.filter((x) => x.month === ym);
    const extrasTotal = extras.reduce((s, x) => s + x.amountClp, 0);
    return {
      amountClp: (payment?.amountClp ?? p.rentClp) + extrasTotal,
      propId: p.id,
      status: payment?.status ?? 'pending',
    };
  });

  const expected = monthEntries.reduce((s, x) => s + x.amountClp, 0);
  const collected = monthEntries
    .filter((x) => x.status === 'paid')
    .reduce((s, x) => s + x.amountClp, 0);
  const pending = expected - collected;

  const currentYear = String(new Date().getFullYear());
  const ytdRent = properties.reduce(
    (s, p) =>
      s +
      p.payments
        .filter((x) => x.month.startsWith(currentYear) && x.status !== 'pending')
        .reduce((a, b) => a + b.amountClp, 0),
    0,
  );
  const ytdExtras = properties.reduce(
    (s, p) =>
      s +
      p.extraPayments
        .filter((x) => x.month.startsWith(currentYear))
        .reduce((a, b) => a + b.amountClp, 0),
    0,
  );
  const ytd = ytdRent + ytdExtras;

  const months = (() => {
    const set = new Set<string>();
    for (const p of properties) {
      for (const x of p.payments) {
        set.add(x.month);
      }
      for (const x of p.extraPayments) {
        set.add(x.month);
      }
    }
    return [...set].toSorted().slice(-6);
  })();

  const monthlyTotals = months.map((m) => {
    let total = 0;
    for (const p of properties) {
      const payment = p.payments.find((x) => x.month === m);
      if (payment?.status === 'paid') {
        total += payment.amountClp;
      }
      for (const x of p.extraPayments) {
        if (x.month === m) {
          total += x.amountClp;
        }
      }
    }
    return { m, total };
  });
  const maxTotal = Math.max(...monthlyTotals.map((x) => x.total), 1);

  const thisMonthPayments = properties.flatMap((p) => {
    if (!p.isOccupied) {
      return [];
    }
    const currentPayment = p.payments.find((x) => x.month === ym);
    const extras = p.extraPayments.filter((x) => x.month === ym);
    return currentPayment ? [{ p, payment: currentPayment, extras }] : [];
  });

  const pendingCount = thisMonthPayments.filter((x) => x.payment.status === 'pending').length;

  const recentMovements = [
    ...properties.flatMap((p) =>
      p.payments
        .filter((payment) => payment.status === 'paid')
        .map((payment) => ({
          id: `income-${payment.id}`,
          date: payment.paidOn ?? `${payment.month}-01`,
          description: `Ingreso de arriendo: ${p.nickname} (${payment.month})`,
          amountClp: payment.amountClp,
          type: 'income' as const,
        })),
    ),
    ...properties.flatMap((p) =>
      p.extraPayments.map((extra) => ({
        id: `extra-${extra.id}`,
        date: extra.paidOn,
        description: `${extra.description} (${p.nickname})`,
        amountClp: extra.amountClp,
        type: 'income' as const,
      })),
    ),
    ...expenses.map((expense) => ({
      id: `expense-${expense.id}`,
      date: expense.date,
      description: expense.description,
      amountClp: expense.amountClp,
      type: 'expense' as const,
    })),
  ]
    .toSorted((a, b) => b.date.localeCompare(a.date) || b.id.localeCompare(a.id))
    .slice(0, 5);

  const accent = ACCENTS.mint;

  return (
    <div className="animate-fade-up space-y-6">
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card className="relative overflow-hidden p-6 lg:col-span-2">
          <div
            className="absolute -top-16 -right-16 h-56 w-56 rounded-full"
            style={{ background: accent[50] }}
          />
          <div className="relative">
            <div className="text-[12px] tracking-[0.1em] text-ink-500 uppercase">
              Mes actual · {fmtMonthLong(ym)}
            </div>
            <div className="mt-2 flex flex-wrap items-end gap-3">
              <div className="num serif text-[52px] leading-none text-ink-900">
                {fmtCLP(collected)}
              </div>
              <div className="mb-2 text-ink-500">de {fmtCLP(expected)} esperados</div>
            </div>
            <div className="mt-4 h-2 max-w-md overflow-hidden rounded-full bg-cream-100">
              <div
                className="h-full rounded-full transition-all"
                style={{
                  width: `${expected ? (collected / expected) * 100 : 0}%`,
                  background: accent[500],
                }}
              />
            </div>
            <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-[13px]">
              <span className="flex items-center gap-1.5 text-mint-700">
                <span className="h-2 w-2 rounded-full bg-mint-500" /> Cobrado {fmtCLP(collected)}
              </span>
              <span className="flex items-center gap-1.5 text-peach-700">
                <span className="h-2 w-2 rounded-full bg-peach-500" /> Pendiente {fmtCLP(pending)}
              </span>
              <span className="flex items-center gap-1.5 text-ink-500">
                <span className="h-2 w-2 rounded-full bg-ink-300" /> {properties.length} propiedades
              </span>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="text-[12px] tracking-[0.1em] text-ink-500 uppercase">
            Acumulado {currentYear}
          </div>
          <div className="mt-1 num serif text-[32px] text-ink-900">{fmtCLP(ytd)}</div>
          <div className="mt-1 flex items-center gap-1 text-[13px] text-mint-700">
            <Icon name="arrow_up" size={13} /> ingreso anual
          </div>
          <div className="mt-5 flex h-20 items-end gap-1.5">
            {monthlyTotals.map(({ m, total }) => (
              <div key={m} className="flex flex-1 flex-col items-center gap-1.5">
                <div
                  className="w-full rounded-md transition-all"
                  style={{
                    height: `${(total / maxTotal) * 100}%`,
                    background: accent[100],
                    minHeight: 4,
                  }}
                />
                <div className="text-[10px] text-ink-400">{fmtMonth(m).split(' ')[0]}</div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div className="flex items-center justify-between pt-2">
        <div>
          <h2 className="serif text-[26px] text-ink-900">Mis propiedades</h2>
          <div className="text-[13px] text-ink-500">{properties.length} en tu cartera</div>
        </div>
        <Link href="/dashboard/properties/new">
          <Button>
            <Icon name="plus" size={14} /> Agregar propiedad
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {properties.map((p) => (
          <PropertyCard key={p.id} property={p} />
        ))}
        <Link
          href="/dashboard/properties/new"
          className="flex min-h-[200px] flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-cream-200 text-ink-400 transition hover:border-ink-300 hover:text-ink-700"
        >
          <Icon name="plus" size={22} />
          <div className="text-sm">Agregar propiedad</div>
        </Link>
      </div>

      {thisMonthPayments.length > 0 && (
        <Card className="p-5">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="serif text-[20px] text-ink-900">Cobros del mes</h3>
            <span className="text-[12.5px] text-ink-500">{pendingCount} pendientes</span>
          </div>
          <div className="divide-y divide-cream-200">
            {thisMonthPayments.map(({ p, payment, extras }) => {
              const extrasTotal = extras.reduce((s, x) => s + x.amountClp, 0);
              return (
                <div key={p.id} className="flex items-center gap-4 py-3">
                  <Avatar name={p.tenantName} color={getAccentKey(p.color)} />
                  <div className="min-w-0 flex-1">
                    <div className="text-[15px] text-ink-900">{p.tenantName}</div>
                    <div className="truncate text-[12.5px] text-ink-500">
                      {p.nickname} · {fmtMonthLong(payment.month)}
                    </div>
                  </div>
                  <div className="num text-[15px] text-ink-900">
                    {fmtCLP(payment.amountClp + extrasTotal)}
                  </div>
                  <Link href={`/dashboard/properties/${p.id}`}>
                    {payment.status === 'paid' ? (
                      <Button size="sm" variant="soft" className="cursor-pointer">
                        <Icon name="check" size={13} /> Registrado
                      </Button>
                    ) : (
                      <Button size="sm" variant="mint">
                        <Icon name="plus" size={13} /> Registrar pago
                      </Button>
                    )}
                  </Link>
                </div>
              );
            })}
          </div>
        </Card>
      )}

      {recentMovements.length > 0 && (
        <div className="pt-4">
          <div className="mb-3 flex items-center justify-between">
            <div>
              <h3 className="serif text-[22px] text-ink-900">Últimos movimientos</h3>
              <div className="text-[13px] text-ink-500">Ingresos y gastos recientes</div>
            </div>
            <Link href="/dashboard/balance">
              <Button variant="soft" size="sm">
                Ir al detallado <Icon name="chev_r" size={13} />
              </Button>
            </Link>
          </div>
          <Card className="p-5">
            <div className="divide-y divide-cream-200">
              {recentMovements.map((mov) => (
                <div key={mov.id} className="flex items-center gap-4 py-3">
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-full ${mov.type === 'income' ? 'bg-mint-100 text-mint-700' : 'bg-rose-100 text-rose-700'}`}
                  >
                    <Icon name={mov.type === 'income' ? 'arrow_up' : 'arrow_dr'} size={18} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="line-clamp-1 text-[14px] text-ink-900">{mov.description}</div>
                    <div className="text-[12px] text-ink-500">
                      {mov.date.split('-').toReversed().join('/')}
                    </div>
                  </div>
                  <div
                    className={`num text-[15px] font-medium ${mov.type === 'income' ? 'text-mint-700' : 'text-rose-700'}`}
                  >
                    {mov.type === 'income' ? '+' : '-'}
                    {fmtCLP(mov.amountClp)}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};
