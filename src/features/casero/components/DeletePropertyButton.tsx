'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { deleteProperty } from '../actions';
import { Icon } from '../ui/Icon';
import { Button } from '../ui/primitives';

export const DeletePropertyButton = (props: { propertyId: string; propertyName: string }) => {
  const router = useRouter();
  const [confirming, setConfirming] = useState(false);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState('');

  const handleDelete = async () => {
    setPending(true);
    setError('');
    const result = await deleteProperty(props.propertyId);
    setPending(false);

    if (!result.ok) {
      setError(result.errors[0] ?? 'No se pudo eliminar la propiedad');
      return;
    }

    router.push('/dashboard');
    router.refresh();
  };

  return (
    <>
      <div className="flex flex-col items-end gap-1">
        <Button
          type="button"
          variant="danger"
          size="sm"
          disabled={pending}
          onClick={() => {
            setConfirming(true);
          }}
        >
          <Icon name="trash" size={13} /> Eliminar
        </Button>
        {error && <div className="max-w-40 text-right text-[12px] text-rose-500">{error}</div>}
      </div>

      {confirming && (
        <dialog
          open
          className="fade-in fixed inset-0 z-50 m-0 flex h-dvh max-h-none w-dvw max-w-none items-center justify-center bg-transparent p-4 backdrop:bg-transparent"
          aria-labelledby="delete-property-title"
        >
          <div className="absolute inset-0 bg-cream-50/70 backdrop-blur-[3px]" />
          <div className="fade-up relative w-full max-w-[430px] rounded-3xl border border-cream-200 bg-white p-6 shadow-2xl">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-rose-50 text-rose-500">
              <Icon name="trash" size={19} />
            </div>
            <h3 id="delete-property-title" className="mt-4 serif text-[24px] text-ink-900">
              Eliminar propiedad
            </h3>
            <p className="mt-2 text-[14px] text-ink-500">
              Se borrará <span className="font-medium text-ink-900">{props.propertyName}</span> y
              todo su historial de pagos. Esta acción no se puede deshacer.
            </p>
            <div className="mt-6 flex justify-end gap-2">
              <Button
                type="button"
                variant="ghost"
                disabled={pending}
                onClick={() => {
                  setConfirming(false);
                }}
              >
                Cancelar
              </Button>
              <Button type="button" variant="danger" isLoading={pending} onClick={handleDelete}>
                {!pending && <Icon name="trash" size={14} />} Eliminar
              </Button>
            </div>
          </div>
        </dialog>
      )}
    </>
  );
};
