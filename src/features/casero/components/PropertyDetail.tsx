import Link from 'next/link';
import {
  ACCENTS,
  fmtCLP,
  fmtDate,
  fmtMonth,
  fmtMonthLong,
  formatResidenceDuration,
  getAccentKey,
  getPaymentStatus,
  durationUnitLabel,
  nextYM,
} from '../lib';
import type { PaymentRow, PropertyWithPayments } from '../queries';
import { Icon } from '../ui/Icon';
import { Avatar, Button, Card, StatusPill } from '../ui/primitives';
import { CancelContractButton } from './CancelContractButton';
import { DeletePropertyButton } from './DeletePropertyButton';
import { PaymentRegistrationDialog } from './PaymentRegistrationDialog';

type Tab = 'historial' | 'balance' | 'reajustes';

const TABS: readonly { k: Tab; l: string }[] = [
  { k: 'historial', l: 'Historial de pagos' },
  { k: 'balance', l: 'Balance' },
  { k: 'reajustes', l: 'Reajustes' },
];

const tabHref = (id: string, tab: Tab) => `/dashboard/properties/${id}?tab=${tab}`;

const groupByYear = (payments: PaymentRow[]) => {
  const g: Record<string, PaymentRow[]> = {};
  for (const x of payments) {
    const y = x.month.slice(0, 4);
    (g[y] ??= []).push(x);
  }
  return g;
};

export const PropertyDetail = (props: {
  property: PropertyWithPayments;
  tab: Tab;
  openPaymentId?: string;
}) => {
  const p = props.property;
  const { tab } = props;
  const colorKey = getAccentKey(p.color);
  const accent = ACCENTS[colorKey];
  const totalCollected = p.payments
    .filter((x) => x.status !== 'pending')
    .reduce((s, x) => s + x.amountClp, 0);
  const totalExpected = p.payments.reduce((s, x) => s + x.amountClp, 0);
  const totalPending = p.payments
    .filter((x) => x.status === 'pending')
    .reduce((s, x) => s + x.amountClp, 0);
  const pending = p.payments.filter((x) => x.status === 'pending');
  const yearGroups = groupByYear(p.payments);
  const last = p.payments.at(-1);
  const residenceDuration = formatResidenceDuration(p.startDate, p.vacantSince);
  const estimatedDuration = `${p.contractMonths} ${durationUnitLabel(
    p.contractDurationUnit,
    p.contractMonths,
  )}`;
  const tenantDisplay = p.isOccupied ? p.tenantName : 'Desocupada';

  return (
    <div className="animate-fade-up space-y-5">
      <Link
        href="/dashboard"
        className="inline-flex items-center gap-1 text-[13px] text-ink-500 hover:text-ink-900"
      >
        <Icon name="chev_l" size={14} /> Volver al panel
      </Link>

      <Card className="overflow-hidden">
        <div
          className="relative px-7 pt-6 pb-5"
          style={{
            background: `linear-gradient(180deg, ${accent[50]} 0%, #ffffff 100%)`,
          }}
        >
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="flex items-start gap-4">
              <div
                className="flex h-14 w-14 items-center justify-center rounded-2xl"
                style={{ background: accent[100], color: accent[700] }}
              >
                <Icon name="home" size={26} />
              </div>
              <div>
                <div className="text-[12px] tracking-[0.1em] text-ink-500 uppercase">Propiedad</div>
                <h2 className="serif text-[34px] leading-tight text-ink-900">{p.nickname}</h2>
                <div className="mt-0.5 flex items-center gap-1.5 text-[13.5px] text-ink-500">
                  <Icon name="pin" size={13} /> {p.address}
                </div>
              </div>
            </div>
            <div className="flex flex-wrap justify-end gap-2">
              <Link href={`/dashboard/properties/${p.id}/edit`}>
                <Button variant="soft" size="sm">
                  <Icon name="edit" size={13} /> Editar
                </Button>
              </Link>
              {p.isOccupied && (
                <>
                  <PaymentRegistrationDialog
                    propertyId={p.id}
                    defaultMonth={
                      pending[0]?.month ?? (last ? nextYM(last.month) : p.startDate.slice(0, 7))
                    }
                    defaultAmountClp={p.rentClp}
                    existingMonths={p.payments.map((payment) => payment.month)}
                  />
                  <CancelContractButton propertyId={p.id} tenantName={p.tenantName} />
                </>
              )}
              <DeletePropertyButton propertyId={p.id} propertyName={p.nickname} />
            </div>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-3 md:grid-cols-3">
            <Card className="p-4">
              <div className="text-[11px] tracking-[0.1em] text-ink-500 uppercase">
                Arriendo actual
              </div>
              <div className="mt-1 num text-[22px] text-ink-900">{fmtCLP(p.rentClp)}</div>
            </Card>
            <Card className="p-4">
              <div className="text-[11px] tracking-[0.1em] text-ink-500 uppercase">Día de pago</div>
              <div className="mt-1 num text-[32px] leading-none text-ink-900">{p.paymentDay}</div>
              <div className="mt-1 text-[12px] text-ink-400">
                cada mes · inició {fmtDate(p.startDate)}
              </div>
            </Card>
            <Card className="p-4">
              <div className="text-[11px] tracking-[0.1em] text-ink-500 uppercase">
                Lleva viviendo
              </div>
              <div className="mt-1 text-[20px] leading-tight text-ink-900">
                {p.isOccupied ? residenceDuration : 'Contrato cancelado'}
              </div>
              <div className="text-[12px] text-ink-400">estimado {estimatedDuration}</div>
            </Card>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 border-t border-cream-200 px-7 py-4 md:grid-cols-[1fr_auto]">
          <div className="flex min-w-0 items-center gap-3">
            <Avatar name={tenantDisplay} color={colorKey} size={42} />
            <div className="min-w-0">
              <div className="text-[11px] tracking-[0.1em] text-ink-400 uppercase">
                Arrendatario
              </div>
              <div className="truncate text-[15px] text-ink-900">{tenantDisplay}</div>
              <div className="mt-0.5 flex flex-wrap items-center gap-3 text-[12.5px] text-ink-500">
                {!p.isOccupied && p.vacantSince && (
                  <span>Desocupada desde {fmtDate(p.vacantSince)}</span>
                )}
                {p.isOccupied && p.tenantPhone && (
                  <span className="flex items-center gap-1">
                    <Icon name="phone" size={12} /> Teléfono: {p.tenantPhone}
                  </span>
                )}
              </div>
            </div>
          </div>
          {p.notes && (
            <div className="min-w-0 rounded-2xl bg-cream-50 px-4 py-3 md:max-w-md">
              <div className="text-[11px] tracking-[0.1em] text-ink-400 uppercase">Notas</div>
              <div className="text-ink-600 mt-1 text-[12.5px]">{p.notes}</div>
            </div>
          )}
        </div>
      </Card>

      <div className="flex items-center gap-1 border-b border-cream-200">
        {TABS.map((t) => (
          <Link
            key={t.k}
            href={tabHref(p.id, t.k)}
            className={`-mb-px inline-flex h-10 items-center border-b-2 px-4 text-sm transition ${
              tab === t.k
                ? 'border-ink-900 text-ink-900'
                : 'border-transparent text-ink-500 hover:text-ink-900'
            }`}
          >
            {t.l}
          </Link>
        ))}
      </div>

      {tab === 'historial' && (
        <Card className="overflow-hidden">
          <div className="grid grid-cols-12 gap-3 border-b border-cream-200 bg-cream-50 px-5 py-3 text-[11px] tracking-[0.1em] text-ink-500 uppercase">
            <div className="col-span-3">Mes</div>
            <div className="col-span-3">Estado</div>
            <div className="col-span-3">Pagado el</div>
            <div className="col-span-3 text-right">Monto</div>
          </div>
          {[...p.payments].toReversed().map((x, i) => {
            const prev = p.payments[p.payments.length - 2 - i];
            const isIncrease = prev && x.amountClp > prev.amountClp;
            return (
              <div
                key={x.id}
                className="grid grid-cols-12 items-center gap-3 border-b border-cream-100 px-5 py-3.5 last:border-0 hover:bg-cream-50/60"
              >
                <div className="col-span-3">
                  <div className="text-[14.5px] text-ink-900">{fmtMonthLong(x.month)}</div>
                  <div className="mt-0.5 truncate text-[11px] text-ink-400">
                    {x.tenantName ?? p.tenantName}
                  </div>
                  {isIncrease && (
                    <div className="mt-0.5 flex items-center gap-1 text-[11px] text-mint-700">
                      <Icon name="arrow_up" size={10} /> Reajuste anual
                    </div>
                  )}
                </div>
                <div className="col-span-3">
                  <StatusPill status={getPaymentStatus(x.status)} />
                </div>
                <div className="col-span-3 num text-[13px] text-ink-700">{fmtDate(x.paidOn)}</div>
                <div className="col-span-3 flex items-center justify-end gap-2 text-right">
                  <span className="num text-[15px] text-ink-900">{fmtCLP(x.amountClp)}</span>
                  <PaymentRegistrationDialog
                    propertyId={p.id}
                    defaultMonth={x.month}
                    defaultAmountClp={x.amountClp}
                    existingMonths={p.payments.map((payment) => payment.month)}
                    initialOpen={props.openPaymentId === x.id}
                    payment={x}
                    triggerLabel="Editar"
                    triggerSize="sm"
                    triggerVariant="ghost"
                  />
                </div>
              </div>
            );
          })}
        </Card>
      )}

      {tab === 'balance' && (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <Card className="p-5 md:col-span-2">
            <div className="text-[11px] tracking-[0.1em] text-ink-500 uppercase">
              Mini balance de la propiedad
            </div>
            <div className="mt-1.5 grid grid-cols-1 gap-3 sm:grid-cols-3">
              <div className="rounded-2xl border border-cream-200 bg-cream-50 p-4">
                <div className="text-[11px] tracking-[0.1em] text-ink-500 uppercase">Cobrado</div>
                <div className="mt-1 num text-[22px] text-mint-700">{fmtCLP(totalCollected)}</div>
              </div>
              <div className="rounded-2xl border border-cream-200 bg-cream-50 p-4">
                <div className="text-[11px] tracking-[0.1em] text-ink-500 uppercase">Pendiente</div>
                <div className="mt-1 num text-[22px] text-peach-700">{fmtCLP(totalPending)}</div>
              </div>
              <div className="rounded-2xl border border-cream-200 bg-cream-50 p-4">
                <div className="text-[11px] tracking-[0.1em] text-ink-500 uppercase">Esperado</div>
                <div className="mt-1 num text-[22px] text-ink-900">{fmtCLP(totalExpected)}</div>
              </div>
            </div>
            <div className="text-[13px] text-ink-500">
              Valores calculados con el historial guardado desde {fmtDate(p.startDate)}.
            </div>
            <div className="mt-6 space-y-3">
              {Object.entries(yearGroups).map(([year, items]) => {
                const cobrado = items
                  .filter((i) => i.status !== 'pending')
                  .reduce((s, x) => s + x.amountClp, 0);
                const total = items.reduce((s, x) => s + x.amountClp, 0);
                const progress = total > 0 ? (cobrado / total) * 100 : 0;
                return (
                  <div key={year}>
                    <div className="mb-1.5 flex items-baseline justify-between">
                      <div className="serif text-[18px] text-ink-900">{year}</div>
                      <div className="num text-[14px] text-ink-700">
                        {fmtCLP(cobrado)} <span className="text-ink-400">/ {fmtCLP(total)}</span>
                      </div>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-cream-100">
                      <div
                        className="h-full rounded-full"
                        style={{ width: `${progress}%`, background: accent[500] }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
          <Card className="p-5">
            <div className="text-[11px] tracking-[0.1em] text-ink-500 uppercase">Pendientes</div>
            <div className="mt-3 space-y-3">
              {pending.length === 0 && (
                <div className="text-[13.5px] text-ink-500">Todo al día.</div>
              )}
              {pending.map((x) => (
                <div
                  key={x.id}
                  className="flex items-center justify-between border-b border-cream-100 py-2 last:border-0"
                >
                  <div>
                    <div className="text-[14px] text-ink-900">{fmtMonthLong(x.month)}</div>
                    <div className="text-[11.5px] text-ink-500">vence el día {p.paymentDay}</div>
                  </div>
                  <div className="num text-[15px] text-ink-900">{fmtCLP(x.amountClp)}</div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}

      {tab === 'reajustes' && (
        <Card className="p-5">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <div className="text-[11px] tracking-[0.1em] text-ink-500 uppercase">
                Política de reajuste
              </div>
              <div className="mt-1 serif text-[22px] text-ink-900">
                +{p.increasePct}% cada año, en{' '}
                {fmtMonthLong(`2025-${p.increaseAnchor}`).split(' ')[0]}
              </div>
            </div>
            <Link href={`/dashboard/properties/${p.id}/edit`}>
              <Button variant="soft">
                <Icon name="settings" size={13} /> Cambiar política
              </Button>
            </Link>
          </div>
          <div className="relative mt-6">
            <div className="absolute top-2 bottom-2 left-3 w-px bg-cream-200" />
            {Object.entries(yearGroups).map(([year, items]) => {
              const [start] = items;
              if (!start) {
                return null;
              }
              const prevYear = String(Number(year) - 1);
              const prev = yearGroups[prevYear]?.[0];
              const delta = prev
                ? Math.round(((start.amountClp - prev.amountClp) / prev.amountClp) * 100)
                : 0;
              return (
                <div key={year} className="relative pb-6 pl-9 last:pb-0">
                  <div
                    className="absolute top-0.5 left-0 flex h-6 w-6 items-center justify-center rounded-full"
                    style={{ background: accent[100], color: accent[700] }}
                  >
                    <Icon name="sparkle" size={12} />
                  </div>
                  <div className="flex items-baseline justify-between">
                    <div className="serif text-[18px] text-ink-900">{year}</div>
                    {prev && delta > 0 && (
                      <div className="text-[13px] text-mint-700">
                        +{delta}% vs {prevYear}
                      </div>
                    )}
                  </div>
                  <div className="mt-0.5 num text-[15px] text-ink-700">
                    {fmtCLP(start.amountClp)}{' '}
                    <span className="text-[12.5px] text-ink-400">
                      / mes desde {fmtMonth(start.month)}
                    </span>
                  </div>
                </div>
              );
            })}
            {last && (
              <div className="relative pl-9">
                <div className="absolute top-0.5 left-0 flex h-6 w-6 items-center justify-center rounded-full border-2 border-dashed border-cream-300 text-ink-400">
                  <Icon name="sparkle" size={12} />
                </div>
                <div className="flex items-baseline justify-between">
                  <div className="serif text-[18px] text-ink-400">
                    {String(Number(last.month.slice(0, 4)) + 1)}{' '}
                    <span className="text-[12px] tracking-[0.1em] uppercase">(proyectado)</span>
                  </div>
                  <div className="text-[13px] text-ink-500">+{p.increasePct}%</div>
                </div>
                <div className="mt-0.5 num text-[15px] text-ink-500">
                  {fmtCLP(Math.round(last.amountClp * (1 + p.increasePct / 100)))}{' '}
                  <span className="text-[12.5px] text-ink-400">/ mes</span>
                </div>
              </div>
            )}
          </div>
        </Card>
      )}
    </div>
  );
};
