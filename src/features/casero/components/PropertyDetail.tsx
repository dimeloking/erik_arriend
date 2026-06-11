'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { deleteExtraPayment, deletePayment } from '../actions';
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
import type { ExtraPaymentRow, PaymentRow, PropertyWithPayments } from '../queries';
import { Icon } from '../ui/Icon';
import { Avatar, Button, Card, StatusPill } from '../ui/primitives';
import { CancelContractButton } from './CancelContractButton';
import { DeletePropertyButton } from './DeletePropertyButton';
import { ExtraPaymentRegistrationDialog } from './ExtraPaymentRegistrationDialog';
import { PaymentRegistrationDialog } from './PaymentRegistrationDialog';

type Tab = 'historial' | 'balance' | 'reajustes';

const TABS: readonly { k: Tab; l: string }[] = [
  { k: 'historial', l: 'Historial de pagos' },
  { k: 'balance', l: 'Balance' },
  { k: 'reajustes', l: 'Reajustes' },
];

const tabHref = (id: string, tab: Tab) => `/dashboard/properties/${id}?tab=${tab}`;

type HistoryItem = { type: 'payment'; data: PaymentRow } | { type: 'extra'; data: ExtraPaymentRow };

const groupByYear = (payments: PaymentRow[], extraPayments: ExtraPaymentRow[]) => {
  const g: Record<string, HistoryItem[]> = {};
  for (const x of payments) {
    const y = x.month.slice(0, 4);
    (g[y] ??= []).push({ type: 'payment', data: x });
  }
  for (const x of extraPayments) {
    const y = x.month.slice(0, 4);
    (g[y] ??= []).push({ type: 'extra', data: x });
  }

  // Sort items within each year by date descending
  for (const items of Object.values(g)) {
    items.sort((a, b) => {
      const dateA = a.type === 'payment' ? (a.data.paidOn ?? `${a.data.month}-01`) : a.data.paidOn;
      const dateB = b.type === 'payment' ? (b.data.paidOn ?? `${b.data.month}-01`) : b.data.paidOn;
      return dateB.localeCompare(dateA);
    });
  }

  return g;
};

export const PropertyDetail = (props: {
  property: PropertyWithPayments;
  tab: Tab;
  openPaymentId?: string;
}) => {
  const router = useRouter();
  const [pendingOp, setPendingOp] = useState(false);
  const p = props.property;
  const { tab } = props;

  const handleDeletePayment = async (paymentId: string) => {
    // eslint-disable-next-line no-alert
    if (window.confirm('¿Estás seguro de que quieres eliminar este registro de pago?')) {
      setPendingOp(true);
      await deletePayment(p.id, paymentId);
      setPendingOp(false);
      router.refresh();
    }
  };

  const handleDeleteExtraPayment = async (extraId: string) => {
    // eslint-disable-next-line no-alert
    if (window.confirm('¿Estás seguro de que quieres eliminar este cobro extra?')) {
      setPendingOp(true);
      await deleteExtraPayment(p.id, extraId);
      setPendingOp(false);
      router.refresh();
    }
  };

  const colorKey = getAccentKey(p.color);
  const accent = ACCENTS[colorKey];

  const totalRentCollected = p.payments
    .filter((x) => x.status !== 'pending')
    .reduce((s, x) => s + x.amountClp, 0);

  const totalExtrasCollected = p.extraPayments.reduce((s, x) => s + x.amountClp, 0);

  const totalCollected = totalRentCollected + totalExtrasCollected;

  const totalRentExpected = p.payments.reduce((s, x) => s + x.amountClp, 0);
  const totalExpected = totalRentExpected + totalExtrasCollected;

  const totalPending = p.payments
    .filter((x) => x.status === 'pending')
    .reduce((s, x) => s + x.amountClp, 0);

  const pending = p.payments.filter((x) => x.status === 'pending');
  const yearGroups = groupByYear(p.payments, p.extraPayments);
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
                  <ExtraPaymentRegistrationDialog
                    propertyId={p.id}
                    defaultMonth={
                      pending[0]?.month ?? (last ? last.month : p.startDate.slice(0, 7))
                    }
                    triggerVariant="soft"
                  />
                  <div className="inline-block cursor-pointer">
                    <CancelContractButton propertyId={p.id} tenantName={p.tenantName} />
                  </div>
                </>
              )}
              <div className="inline-block cursor-pointer">
                <DeletePropertyButton propertyId={p.id} propertyName={p.nickname} />
              </div>
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
            <div className="col-span-3">Mes / Descripción</div>
            <div className="col-span-3">Estado / Tipo</div>
            <div className="col-span-3">Pagado el</div>
            <div className="col-span-3 text-right">Monto</div>
          </div>
          {Object.entries(yearGroups)
            .toReversed()
            .map(([year, items]) => (
              <div key={year}>
                <div className="border-b border-cream-100 bg-cream-50/40 px-5 py-1.5 text-[11px] font-bold text-ink-400">
                  {year}
                </div>
                {items.map((item) => {
                  if (item.type === 'payment') {
                    const x = item.data;
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
                        </div>
                        <div className="col-span-3">
                          <StatusPill status={getPaymentStatus(x.status)} />
                        </div>
                        <div className="col-span-3 num text-[13px] text-ink-700">
                          {fmtDate(x.paidOn)}
                        </div>
                        <div className="col-span-3 flex items-center justify-end gap-2 text-right">
                          <span className="num text-[15px] text-ink-900">
                            {fmtCLP(x.amountClp)}
                          </span>
                          <PaymentRegistrationDialog
                            propertyId={p.id}
                            defaultMonth={x.month}
                            defaultAmountClp={x.amountClp}
                            existingMonths={p.payments.map((payment) => payment.month)}
                            initialOpen={props.openPaymentId === x.id}
                            payment={x}
                            triggerLabel={x.status === 'pending' ? 'Registrar pago' : 'Editar'}
                            triggerSize="sm"
                            triggerVariant={x.status === 'pending' ? 'mint' : 'soft'}
                          />
                          <button
                            type="button"
                            title="Eliminar registro"
                            disabled={pendingOp}
                            onClick={() => {
                              void handleDeletePayment(x.id);
                            }}
                            className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full text-ink-400 hover:bg-rose-50 hover:text-rose-500 disabled:opacity-50"
                          >
                            {pendingOp ? (
                              <Icon name="loader" size={14} className="animate-spin" />
                            ) : (
                              <Icon name="trash" size={14} />
                            )}
                          </button>
                        </div>
                      </div>
                    );
                  }
                  const x = item.data;
                  return (
                    <div
                      key={x.id}
                      className="grid grid-cols-12 items-center gap-3 border-b border-cream-100 bg-peach-50/10 px-5 py-3.5 last:border-0 hover:bg-cream-50/60"
                    >
                      <div className="col-span-3">
                        <div className="text-peach-800 text-[14.5px] font-medium">
                          {x.description}
                        </div>
                        <div className="mt-0.5 truncate text-[11px] text-ink-400">
                          {fmtMonthLong(x.month)}
                        </div>
                      </div>
                      <div className="col-span-3">
                        <span className="inline-flex h-6 items-center gap-1.5 rounded-full bg-peach-100 px-2.5 text-[11px] font-medium text-peach-700">
                          Cobro extra
                        </span>
                      </div>
                      <div className="col-span-3 num text-[13px] text-ink-700">
                        {fmtDate(x.paidOn)}
                      </div>
                      <div className="col-span-3 flex items-center justify-end gap-2 text-right">
                        <span className="text-peach-900 num text-[15px] font-medium">
                          {fmtCLP(x.amountClp)}
                        </span>
                        <ExtraPaymentRegistrationDialog
                          propertyId={p.id}
                          defaultMonth={x.month}
                          extraPayment={x}
                          triggerLabel="Editar"
                          triggerVariant="soft"
                        />
                        <button
                          type="button"
                          title="Eliminar cobro extra"
                          disabled={pendingOp}
                          onClick={() => {
                            void handleDeleteExtraPayment(x.id);
                          }}
                          className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full text-ink-400 hover:bg-rose-50 hover:text-rose-500 disabled:opacity-50"
                        >
                          {pendingOp ? (
                            <Icon name="loader" size={14} className="animate-spin" />
                          ) : (
                            <Icon name="trash" size={14} />
                          )}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            ))}
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
            <div className="mt-2 text-[13px] text-ink-500">
              Valores calculados con el historial guardado desde {fmtDate(p.startDate)}. Incluye
              arriendos y cobros extra.
            </div>
            <div className="mt-6 space-y-3">
              {Object.entries(yearGroups).map(([year, items]) => {
                const cobrado = items
                  .filter(
                    (i) =>
                      i.type === 'extra' || (i.type === 'payment' && i.data.status !== 'pending'),
                  )
                  .reduce((s, x) => s + x.data.amountClp, 0);
                const total = items.reduce((s, x) => s + x.data.amountClp, 0);
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
              const rentPayments = items
                .filter((i): i is { type: 'payment'; data: PaymentRow } => i.type === 'payment')
                .map((i) => i.data);
              const [start] = rentPayments;
              if (!start) {
                return null;
              }
              const prevYear = String(Number(year) - 1);
              const prevPayments = yearGroups[prevYear]
                ?.filter((i): i is { type: 'payment'; data: PaymentRow } => i.type === 'payment')
                .map((i) => i.data);
              const prev = prevPayments?.[0];
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
