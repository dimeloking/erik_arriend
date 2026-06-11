'use client';

import { useRouter } from 'next/navigation';
import type { ComponentProps } from 'react';
import { useState } from 'react';
import { createExtraPayment, updateExtraPayment } from '../actions';
import type { ExtraPaymentRow } from '../queries';
import { Icon } from '../ui/Icon';
import { Button } from '../ui/primitives';
import { ExtraPaymentDialogPanel } from './ExtraPaymentDialogPanel';

type Props = {
  propertyId: string;
  defaultMonth: string;
  extraPayment?: ExtraPaymentRow;
  triggerLabel?: string;
  triggerSize?: 'sm' | 'md';
  triggerVariant?: 'primary' | 'soft' | 'ghost' | 'mint' | 'danger';
};

export const ExtraPaymentRegistrationDialog = (props: Props) => {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [pending, setPending] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);
  const isEditing = Boolean(props.extraPayment);

  const close = () => {
    if (!pending) {
      setOpen(false);
      setErrors([]);
    }
  };

  const handleSubmit: NonNullable<ComponentProps<'form'>['onSubmit']> = async (event) => {
    event.preventDefault();
    setPending(true);
    setErrors([]);
    const formData = new FormData(event.currentTarget);

    const result = props.extraPayment
      ? await updateExtraPayment(props.propertyId, props.extraPayment.id, formData)
      : await createExtraPayment(props.propertyId, formData);
    setPending(false);

    if (!result.ok) {
      setErrors(result.errors);
      return;
    }

    setOpen(false);
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
        className="cursor-pointer"
      >
        {isEditing ? <Icon name="edit" size={13} /> : <Icon name="plus" size={13} />}{' '}
        {props.triggerLabel ?? 'Cobro extra'}
      </Button>

      {open && (
        <ExtraPaymentDialogPanel
          close={close}
          errors={errors}
          handleSubmit={handleSubmit}
          isEditing={isEditing}
          extraPayment={props.extraPayment}
          pending={pending}
          defaultMonth={props.defaultMonth}
        />
      )}
    </>
  );
};
