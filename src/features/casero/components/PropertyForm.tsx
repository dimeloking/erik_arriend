'use client';

import { useRouter } from 'next/navigation';
import type { ComponentProps } from 'react';
import { useState } from 'react';
import { createProperty, updateProperty } from '../actions';
import { ACCENT_OPTIONS, getAccentKey } from '../lib';
import type { AccentKey } from '../lib';
import type { PropertyWithPayments } from '../queries';
import { Icon } from '../ui/Icon';
import { Button, Card, Field } from '../ui/primitives';

type Initial = Pick<
  PropertyWithPayments,
  | 'id'
  | 'nickname'
  | 'address'
  | 'tenantName'
  | 'tenantPhone'
  | 'rentClp'
  | 'depositClp'
  | 'startDate'
  | 'contractMonths'
  | 'increasePct'
  | 'increaseAnchor'
  | 'color'
  | 'notes'
>;

type Props = {
  initial?: Initial;
};

export const PropertyForm = (props: Props) => {
  const router = useRouter();
  const { initial } = props;
  const [color, setColor] = useState<AccentKey>(getAccentKey(initial?.color));
  const [pending, setPending] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit: NonNullable<ComponentProps<'form'>['onSubmit']> = async (event) => {
    event.preventDefault();
    setPending(true);
    setErrorMsg(null);
    const fd = new FormData(event.currentTarget);
    fd.set('color', color);
    try {
      if (initial) {
        const result = await updateProperty(initial.id, fd);
        if (result.ok) {
          router.push(`/dashboard/properties/${initial.id}`);
        } else {
          setErrorMsg('Revisa los campos del formulario.');
        }
      } else {
        // createProperty redirects on success
        await createProperty(fd);
      }
    } catch (error) {
      const msg = error instanceof Error ? error.message : 'Error inesperado';
      // next.js redirect throws a special error — let it propagate
      if (msg === 'NEXT_REDIRECT') {
        return;
      }
      setErrorMsg(msg);
    } finally {
      setPending(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3.5 pb-2">
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        <Field
          label="Apodo"
          name="nickname"
          placeholder="Casa Providencia"
          defaultValue={initial?.nickname}
          required
        />
        <Field
          label="Dirección"
          name="address"
          placeholder="Av. ..."
          defaultValue={initial?.address}
          required
        />
      </div>
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        <Field
          label="Arrendatario"
          name="tenantName"
          placeholder="Nombre completo"
          defaultValue={initial?.tenantName}
          required
        />
        <Field
          label="Teléfono"
          name="tenantPhone"
          placeholder="+56 9 ..."
          defaultValue={initial?.tenantPhone ?? ''}
        />
      </div>
      <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
        <Field
          label="Arriendo mensual"
          name="rentClp"
          prefix="$"
          placeholder="500000"
          inputMode="numeric"
          defaultValue={initial ? String(initial.rentClp) : ''}
          required
        />
        <Field
          label="Garantía"
          name="depositClp"
          prefix="$"
          placeholder="500000"
          inputMode="numeric"
          defaultValue={initial ? String(initial.depositClp) : '0'}
        />
        <Field
          label="Reajuste"
          name="increasePct"
          suffix="%"
          placeholder="8"
          inputMode="numeric"
          defaultValue={initial ? String(initial.increasePct) : '8'}
        />
      </div>
      <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
        <Field
          label="Inicio del contrato"
          name="startDate"
          type="date"
          defaultValue={initial?.startDate}
          required
        />
        <Field
          label="Duración (meses)"
          name="contractMonths"
          type="number"
          min={1}
          max={120}
          defaultValue={initial ? String(initial.contractMonths) : '12'}
        />
        <Field
          label="Mes de reajuste (01-12)"
          name="increaseAnchor"
          placeholder="03"
          maxLength={2}
          defaultValue={initial?.increaseAnchor ?? '01'}
        />
      </div>
      <div>
        <div className="mb-2 text-[12px] tracking-[0.08em] text-ink-500 uppercase">
          Color de etiqueta
        </div>
        <div className="flex flex-wrap gap-2">
          {ACCENT_OPTIONS.map(({ key: k, value: v }) => (
            <button
              type="button"
              key={k}
              onClick={() => {
                setColor(k);
              }}
              className={`flex h-10 items-center gap-2 rounded-full border px-4 text-[13px] font-medium transition ${
                color === k ? 'border-ink-900' : 'border-cream-200'
              }`}
              style={{ background: v[100], color: v[700] }}
            >
              <span className="h-3 w-3 rounded-full" style={{ background: v[500] }} /> {v.label}
            </button>
          ))}
        </div>
      </div>
      <Field
        label="Notas"
        name="notes"
        placeholder="Detalles del contrato, gastos comunes, etc."
        defaultValue={initial?.notes ?? ''}
      />

      {errorMsg && (
        <Card className="border-rose-100 bg-rose-50 p-3 text-[13px] text-rose-500">{errorMsg}</Card>
      )}

      <div className="flex justify-end gap-2 pt-2">
        <Button
          variant="ghost"
          type="button"
          onClick={() => {
            router.back();
          }}
        >
          Cancelar
        </Button>
        <Button type="submit" disabled={pending}>
          <Icon name="check" size={14} /> {initial ? 'Guardar cambios' : 'Guardar'}
        </Button>
      </div>
    </form>
  );
};
