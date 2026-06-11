import type { ComponentProps } from 'react';
import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { MdOutlineAttachMoney } from 'react-icons/md';
import { fmtCLP, PAYMENT_METHODS, todayISO } from '../lib';
import type { PaymentRow } from '../queries';
import { Icon } from '../ui/Icon';
import { Button, Card, Field, FieldSelect } from '../ui/primitives';

type PaymentDialogPanelProps = {
  amount: number;
  close: () => void;
  errors: string[];
  handleSubmit: NonNullable<ComponentProps<'form'>['onSubmit']>;
  isEditing: boolean;
  payment?: PaymentRow;
  pending: boolean;
  defaultMonth: string;
};

const daysInMonth = (yearMonth: string) => {
  const [year, month] = yearMonth.split('-').map(Number);
  if (!year || !month) {
    return 31;
  }
  return new Date(year, month, 0).getDate();
};

const alignDateToMonth = (date: string, yearMonth: string) => {
  const day = Number(date.split('-')[2] ?? '1');
  const safeDay = Math.min(Math.max(day, 1), daysInMonth(yearMonth));
  return `${yearMonth}-${String(safeDay).padStart(2, '0')}`;
};

const PAYMENT_STATUS_OPTIONS = [
  { value: 'paid', label: 'Pagado' },
  { value: 'pending', label: 'Pendiente' },
] as const;

const getPaymentDialogDescription = (status: string, isEditing: boolean) => {
  if (status === 'pending') {
    return 'Quedará pendiente al guardar.';
  }
  if (isEditing) {
    return 'Se actualizará como pagado al guardar.';
  }
  return 'Se registrará como pagado al guardar.';
};

export function PaymentDialogPanel(props: PaymentDialogPanelProps) {
  const initialMonth = props.payment?.month ?? props.defaultMonth;
  const initialPaidOn = props.payment?.paidOn ?? alignDateToMonth(todayISO(), initialMonth);
  const initialStatus = props.payment?.status === 'paid' ? 'paid' : 'pending';
  const [mounted, setMounted] = useState(false);
  const [month, setMonth] = useState(initialMonth);
  const [paidOn, setPaidOn] = useState(initialPaidOn);
  const [status, setStatus] = useState(props.isEditing ? initialStatus : 'paid');
  const description = getPaymentDialogDescription(status, props.isEditing);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return createPortal(
    <div className="fade-in fixed inset-0 z-50 grid h-dvh w-dvw place-items-center overflow-y-auto p-4">
      <div className="fixed inset-0 bg-cream-50/65 backdrop-blur-[3px]" />
      <dialog
        open
        className="fade-up relative m-0 w-full max-w-[460px] rounded-3xl border border-cream-200 bg-cream-50 p-0 shadow-2xl backdrop:bg-transparent"
        aria-labelledby="payment-dialog-title"
      >
        <div className="flex items-center justify-between px-6 pt-5 pb-3">
          <h3 id="payment-dialog-title" className="serif text-[22px] text-ink-900">
            {props.isEditing ? 'Editar pago' : 'Registrar pago'}
          </h3>
          <button
            type="button"
            onClick={props.close}
            className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full text-ink-500 hover:bg-cream-100"
            aria-label="Cerrar"
          >
            <Icon name="x" size={16} />
          </button>
        </div>

        <form onSubmit={props.handleSubmit}>
          <div className="space-y-3 px-6 pb-2">
            <Card className="flex items-center gap-3 p-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-mint-100 text-mint-700">
                <MdOutlineAttachMoney size={24} />
              </div>
              <div className="min-w-0 flex-1">
                <div className="truncate text-[15px] text-ink-900">Pago de arriendo</div>
                <div className="truncate text-[12.5px] text-ink-500">{description}</div>
              </div>
              <div className="shrink-0 num text-[18px] text-ink-900">{fmtCLP(props.amount)}</div>
            </Card>
            {props.isEditing ? (
              <FieldSelect
                label="Estado"
                name="status"
                value={status}
                onChange={(event) => {
                  setStatus(event.currentTarget.value);
                }}
                options={PAYMENT_STATUS_OPTIONS}
              />
            ) : (
              <input type="hidden" name="status" value="paid" />
            )}

            <div className="grid grid-cols-2 gap-3">
              <Field
                label="Mes"
                name="month"
                type="month"
                value={month}
                onChange={(event) => {
                  const nextMonth = event.currentTarget.value;
                  setMonth(nextMonth);
                  setPaidOn((current) => alignDateToMonth(current, nextMonth));
                }}
                required
              />
              <Field
                label="Monto"
                name="amountClp"
                type="number"
                prefix="$"
                min={1}
                step={1}
                defaultValue={String(props.amount)}
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Field
                label="Fecha del pago"
                name="paidOn"
                type="date"
                value={paidOn}
                onChange={(event) => {
                  setPaidOn(event.currentTarget.value);
                }}
                required
              />
              <FieldSelect
                label="Método de pago"
                name="method"
                defaultValue={props.payment?.method ?? 'bancolombia'}
                options={PAYMENT_METHODS}
              />
            </div>
            <Field
              label="Referencia / N° transacción"
              name="reference"
              placeholder="Opcional"
              defaultValue={props.payment?.reference ?? ''}
            />
            <Field
              label="Notas"
              name="notes"
              placeholder="Opcional"
              defaultValue={props.payment?.notes ?? ''}
            />

            {props.errors.length > 0 && (
              <div className="rounded-xl bg-rose-50 p-3 text-[13px] text-rose-500">
                <ul className="list-disc space-y-1 pl-4">
                  {props.errors.map((message) => (
                    <li key={message}>{message}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <div className="flex items-center justify-end gap-2 border-t border-cream-200 px-6 py-4">
            <Button type="button" variant="ghost" onClick={props.close} disabled={props.pending}>
              Cancelar
            </Button>
            <Button type="submit" isLoading={props.pending}>
              {!props.pending && <Icon name="check" size={14} />}{' '}
              {props.isEditing ? 'Guardar cambios' : 'Confirmar pago'}
            </Button>
          </div>
        </form>
      </dialog>
    </div>,
    document.body,
  );
}
