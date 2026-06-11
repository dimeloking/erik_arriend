'use client';

import { useRouter } from 'next/navigation';
import type { ComponentProps } from 'react';
import { useState } from 'react';
import { updateBalanceSnapshot } from '../actions';
import type { BalanceSnapshotRow } from '../queries';
import { Icon } from '../ui/Icon';
import { Button, Card, Field } from '../ui/primitives';

type Props = {
  snapshot: BalanceSnapshotRow;
};

export const BalanceSnapshotEditDialog = (props: Props) => {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [pending, setPending] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);

  const handleSubmit: NonNullable<ComponentProps<'form'>['onSubmit']> = async (event) => {
    event.preventDefault();
    setPending(true);
    setErrors([]);
    const formData = new FormData(event.currentTarget);
    const result = await updateBalanceSnapshot(formData);
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
        variant="soft"
        size="sm"
        onClick={() => {
          setOpen(true);
        }}
        className="mt-2"
      >
        <Icon name="edit" size={13} /> Editar base inicial
      </Button>

      {open && (
        <div className="animate-in fade-in fixed inset-0 z-50 flex items-center justify-center bg-ink-900/40 p-5 backdrop-blur-sm duration-200">
          <Card className="w-full max-w-md animate-fade-up p-6 shadow-2xl">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="serif text-[24px] text-ink-900">Configurar base inicial</h2>
              <button
                type="button"
                onClick={() => {
                  if (!pending) {
                    setOpen(false);
                  }
                }}
                className="text-ink-400 hover:text-ink-900"
              >
                <Icon name="x" size={20} />
              </button>
            </div>

            <p className="mb-6 text-[14px] text-ink-500">
              Ingresa el saldo neto final de tu Excel para que la app lo use como punto de partida.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <Field
                label="Saldo inicial (Base Excel)"
                name="balanceClp"
                type="number"
                defaultValue={props.snapshot.balanceClp}
                prefix="$"
                required
                hint="Este monto se sumará a los movimientos que registres en la app."
              />

              {/* Mantenemos los otros campos ocultos para cumplir con el esquema pero con valor 0 */}
              <input type="hidden" name="incomeClp" value="0" />
              <input type="hidden" name="expensesClp" value="0" />

              {errors.length > 0 && (
                <div className="rounded-xl bg-rose-50 p-3 text-[13px] text-rose-600">
                  {errors.map((err) => (
                    <div key={err}>{err}</div>
                  ))}
                </div>
              )}

              <div className="flex gap-3 pt-2">
                <Button
                  variant="soft"
                  className="flex-1"
                  onClick={() => {
                    setOpen(false);
                  }}
                  disabled={pending}
                >
                  Cancelar
                </Button>
                <Button type="submit" className="flex-1" isLoading={pending}>
                  {pending ? 'Guardando...' : 'Guardar base'}
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}
    </>
  );
};
