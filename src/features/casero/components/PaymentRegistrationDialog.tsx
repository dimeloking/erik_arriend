'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import type { ComponentProps } from 'react';
import { useState } from 'react';
import { registerPayment, updatePayment } from '../actions';
import type { PaymentRow } from '../queries';
import { Icon } from '../ui/Icon';
import { Button } from '../ui/primitives';
import { PaymentDialogPanel } from './PaymentDialogPanel';

type Props = {
  propertyId: string;
  defaultMonth: string;
  defaultAmountClp: number;
  existingMonths?: string[];
  payment?: PaymentRow;
  initialOpen?: boolean;
  triggerLabel?: string;
  triggerSize?: 'sm' | 'md';
  triggerVariant?: 'primary' | 'soft' | 'ghost' | 'mint';
};

export const PaymentRegistrationDialog = (props: Props) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [open, setOpen] = useState(props.initialOpen ?? false);
  const [pending, setPending] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);
  const isEditing = Boolean(props.payment);
  const amount = props.payment?.amountClp ?? props.defaultAmountClp;

  const clearOpenPaymentParam = () => {
    if (!props.initialOpen || !searchParams.has('paymentId')) {
      return;
    }

    const params = new URLSearchParams(searchParams);
    params.delete('paymentId');
    const query = params.toString();
    router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
  };

  const close = () => {
    if (!pending) {
      setOpen(false);
      setErrors([]);
      clearOpenPaymentParam();
    }
  };

  const handleSubmit: NonNullable<ComponentProps<'form'>['onSubmit']> = async (event) => {
    event.preventDefault();
    setPending(true);
    setErrors([]);
    const formData = new FormData(event.currentTarget);
    const monthValue = formData.get('month');
    const selectedMonth = typeof monthValue === 'string' ? monthValue : '';
    const alreadyExists = props.existingMonths?.includes(selectedMonth) ?? false;
    const isCurrentPaymentMonth = props.payment?.month === selectedMonth;

    if (alreadyExists && !isCurrentPaymentMonth) {
      setPending(false);
      setErrors(['Ese mes ya tiene un pago registrado. Usa Editar en el historial.']);
      return;
    }

    const result = props.payment
      ? await updatePayment(props.propertyId, props.payment.id, formData)
      : await registerPayment(props.propertyId, formData);
    setPending(false);

    if (!result.ok) {
      setErrors(result.errors);
      return;
    }

    setOpen(false);
    clearOpenPaymentParam();
    router.refresh();
  };

  return (
    <>
      <Button
        type="button"
        size={props.triggerSize ?? 'sm'}
        variant={props.triggerVariant ?? 'primary'}
        onClick={() => {
          setOpen(true);
        }}
      >
        {isEditing ? <Icon name="edit" size={13} /> : <span className="num text-[13px]">$</span>}{' '}
        {props.triggerLabel ?? 'Registrar pago'}
      </Button>

      {open && (
        <PaymentDialogPanel
          amount={amount}
          close={close}
          errors={errors}
          handleSubmit={handleSubmit}
          isEditing={isEditing}
          payment={props.payment}
          pending={pending}
          defaultMonth={props.defaultMonth}
        />
      )}
    </>
  );
};
