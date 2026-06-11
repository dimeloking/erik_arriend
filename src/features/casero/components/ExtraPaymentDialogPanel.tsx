'use client';

import type { ComponentProps } from 'react';
import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { MdOutlineAttachMoney } from 'react-icons/md';
import { PAYMENT_METHODS, todayISO } from '../lib';
import type { ExtraPaymentRow } from '../queries';
import { Icon } from '../ui/Icon';
import { Button, Card, Field, FieldSelect } from '../ui/primitives';

type ExtraPaymentDialogPanelProps = {
  close: () => void;
  errors: string[];
  handleSubmit: NonNullable<ComponentProps<'form'>['onSubmit']>;
  isEditing: boolean;
  extraPayment?: ExtraPaymentRow;
  pending: boolean;
  defaultMonth: string;
};

export function ExtraPaymentDialogPanel(props: ExtraPaymentDialogPanelProps) {
  const [mounted, setMounted] = useState(false);
  const [paidOn, setPaidOn] = useState(props.extraPayment?.paidOn ?? todayISO());

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
        aria-labelledby="extra-payment-dialog-title"
      >
        <div className="flex items-center justify-between px-6 pt-5 pb-3">
          <h3 id="extra-payment-dialog-title" className="serif text-[22px] text-ink-900">
            {props.isEditing ? 'Editar cobro extra' : 'Registrar cobro extra'}
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
            <Card className="flex items-center gap-3 border-peach-100 bg-peach-50/30 p-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-peach-100 text-peach-700">
                <MdOutlineAttachMoney size={24} />
              </div>
              <div className="min-w-0 flex-1">
                <div className="truncate text-[15px] text-ink-900">Cobro adicional</div>
                <div className="truncate text-[12.5px] text-ink-500">
                  {props.isEditing
                    ? 'Actualizando registro...'
                    : 'Quedará registrado en el historial.'}
                </div>
              </div>
            </Card>

            <div className="grid grid-cols-2 gap-3">
              <Field
                label="Mes"
                name="month"
                type="month"
                defaultValue={props.extraPayment?.month ?? props.defaultMonth}
                required
              />
              <Field
                label="Monto"
                name="amountClp"
                type="number"
                prefix="$"
                min={1}
                step={1}
                defaultValue={String(props.extraPayment?.amountClp ?? '')}
                placeholder="Monto extra"
                required
              />
            </div>

            <Field
              label="Descripción"
              name="description"
              placeholder="Ej: Multa, Arreglo de tubo, Gasto común extra"
              defaultValue={props.extraPayment?.description ?? ''}
              required
            />

            <div className="grid grid-cols-2 gap-3">
              <Field
                label="Fecha de cobro"
                name="paidOn"
                type="date"
                value={paidOn}
                onChange={(event) => {
                  setPaidOn(event.currentTarget.value);
                }}
                required
              />
              <FieldSelect
                label="Método"
                name="method"
                defaultValue={props.extraPayment?.method ?? 'bancolombia'}
                options={PAYMENT_METHODS}
              />
            </div>

            <Field
              label="Notas"
              name="notes"
              placeholder="Opcional"
              defaultValue={props.extraPayment?.notes ?? ''}
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
              <Icon name="check" size={14} />{' '}
              {props.isEditing ? 'Guardar cambios' : 'Registrar extra'}
            </Button>
          </div>
        </form>
      </dialog>
    </div>,
    document.body,
  );
}
