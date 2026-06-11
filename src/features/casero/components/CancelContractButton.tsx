'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { cancelContract } from '../actions';
import { Icon } from '../ui/Icon';
import { Button } from '../ui/primitives';

type CancelContractButtonProps = {
  propertyId: string;
  tenantName: string;
};

export const CancelContractButton = (props: CancelContractButtonProps) => {
  const router = useRouter();
  const [confirming, setConfirming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  const handleCancel = async () => {
    if (!confirming) {
      setConfirming(true);
      return;
    }

    setError(null);
    setPending(true);
    const result = await cancelContract(props.propertyId);
    setPending(false);

    if (!result.ok) {
      setError(result.errors.join('\n'));
      return;
    }

    setConfirming(false);
    router.refresh();
  };

  return (
    <div className="flex flex-wrap items-center justify-end gap-2">
      {confirming && (
        <span className="text-[12px] text-rose-500">
          {error ?? `Confirmar salida de ${props.tenantName}`}
        </span>
      )}
      {confirming && (
        <Button
          type="button"
          size="sm"
          variant="ghost"
          disabled={pending}
          onClick={() => {
            setConfirming(false);
            setError(null);
          }}
        >
          No
        </Button>
      )}
      <Button type="button" size="sm" variant="danger" isLoading={pending} onClick={handleCancel}>
        {!pending && <Icon name="x" size={13} />}{' '}
        {confirming ? 'Sí, cancelar' : 'Cancelar contrato'}
      </Button>
    </div>
  );
};
