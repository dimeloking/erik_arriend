import Link from 'next/link';
import { ACCENTS, fmtCLP, fmtMonth, fmtMonthLong, getAccentKey, todayYM } from '../lib';
import type { PropertyWithPayments } from '../queries';
import { Icon } from '../ui/Icon';
import { Avatar, Button, Card } from '../ui/primitives';
import { PropertyCard } from './PropertyCard';

export const Dashboard = (props: { properties: PropertyWithPayments[] }) => {
  const { properties } = props;
  const ym = todayYM();
  const occupiedProperties = properties.filter((p) => p.isOccupied);
  const monthEntries = occupiedProperties.map((p) => {
    const payment = p.payments.find((x) => x.month === ym);
    return {
      amountClp: payment?.amountClp ?? p.rentClp,
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
  const ytd = properties.reduce(
    (s, p) =>
      s +
      p.payments
        .filter((x) => x.month.startsWith(currentYear) && x.status !== 'pending')
        .reduce((a, b) => a + b.amountClp, 0),
    0,
  );
  const months = (() => {
    const set = new Set<string>();
    for (const p of properties) {
      for (const x of p.payments) {
        set.add(x.month);
      }
    }
    return [...set].toSorted().slice(-6);
  })();

  const monthlyTotals = months.map((m) => ({
    m,
    total: properties.reduce(
      (s, p) => s + (p.payments.find((x) => x.month === m)?.amountClp ?? 0),
      0,
    ),
  }));
  const maxTotal = Math.max(...monthlyTotals.map((x) => x.total), 1);

  const upcoming = properties.flatMap((p) => {
    const next = p.isOccupied ? p.payments.find((x) => x.status === 'pending') : undefined;
    return next ? [{ p, next }] : [];
  });

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

      {upcoming.length > 0 && (
        <Card className="p-5">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="serif text-[20px] text-ink-900">Cobros del mes</h3>
            <span className="text-[12.5px] text-ink-500">{upcoming.length} pendientes</span>
          </div>
          <div className="divide-y divide-cream-200">
            {upcoming.map(({ p, next }) => (
              <div key={p.id} className="flex items-center gap-4 py-3">
                <Avatar name={p.tenantName} color={getAccentKey(p.color)} />
                <div className="min-w-0 flex-1">
                  <div className="text-[15px] text-ink-900">{p.tenantName}</div>
                  <div className="truncate text-[12.5px] text-ink-500">
                    {p.nickname} · {fmtMonthLong(next.month)}
                  </div>
                </div>
                <div className="num text-[15px] text-ink-900">{fmtCLP(next.amountClp)}</div>
                <Link href={`/dashboard/properties/${p.id}`}>
                  <Button size="sm" variant="mint">
                    <Icon name="check" size={13} /> Registrar
                  </Button>
                </Link>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
};
