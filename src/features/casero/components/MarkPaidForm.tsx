'use client';

import { useRouter } from 'next/navigation';
import type { ComponentProps } from 'react';
import { useState } from 'react';
import { markPaymentPaid } from '../actions';
import { fmtCLP, fmtMonthLong, PAYMENT_METHODS, todayISO } from '../lib';
import type { PaymentRow } from '../queries';
import { Icon } from '../ui/Icon';
import { Button, Field, FieldSelect } from '../ui/primitives';

type Props = {
  propertyId: string;
  payment: PaymentRow;
};

export const MarkPaidForm = (props: Props) => {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit: NonNullable<ComponentProps<'form'>['onSubmit']> = async (event) => {
    event.preventDefault();
    setPending(true);
    setError(null);
    const fd = new FormData(event.currentTarget);
    fd.set('paymentId', props.payment.id);
    const result = await markPaymentPaid(props.propertyId, fd);
    setPending(false);
    if (!result.ok) {
      setError('Revisa los campos');
      return;
    }
    router.refresh();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="text-[13px] text-ink-500">
        Marcar como pagado{' '}
        <strong className="text-ink-900">{fmtMonthLong(props.payment.month)}</strong> por{' '}
        <strong className="num text-ink-900">{fmtCLP(props.payment.amountClp)}</strong>
      </div>
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        <Field
          label="Fecha del pago"
          name="paidOn"
          type="date"
          defaultValue={todayISO()}
          required
        />
        <FieldSelect
          label="Método"
          name="method"
          defaultValue="bancolombia"
          options={PAYMENT_METHODS}
        />
      </div>
      <Field label="Referencia" name="reference" placeholder="N° transacción" />
      <Field label="Notas" name="notes" placeholder="Opcional" />
      {error && <div className="text-[13px] text-rose-500">{error}</div>}
      <div className="flex justify-end">
        <Button type="submit" size="sm" disabled={pending}>
          <Icon name="check" size={13} /> Confirmar pago
        </Button>
      </div>
    </form>
  );
};
