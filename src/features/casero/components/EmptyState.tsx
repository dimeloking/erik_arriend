'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, useTransition } from 'react';
import { seedDemoData } from '../actions';
import { Icon } from '../ui/Icon';
import { Button, Card } from '../ui/primitives';

export const EmptyState = () => {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [loadedDemo, setLoadedDemo] = useState(false);
  let demoButtonLabel = 'Cargar datos demo';
  if (pending) {
    demoButtonLabel = 'Cargando demo…';
  }
  if (loadedDemo) {
    demoButtonLabel = 'Demo cargado';
  }

  const handleSeed = () => {
    startTransition(async () => {
      const r = await seedDemoData();
      if (r.ok) {
        setLoadedDemo(true);
        router.refresh();
      }
    });
  };

  return (
    <div className="mx-auto max-w-2xl animate-fade-up py-10">
      <Card className="p-8 text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-mint-100 text-mint-700">
          <Icon name="home" size={32} />
        </div>
        <h2 className="serif text-[28px] text-ink-900">Bienvenido a Casero</h2>
        <p className="mx-auto mt-2 max-w-md text-[14.5px] text-ink-500">
          Agrega tu primera propiedad para llevar el control de los arriendos, fechas de pago y
          reajustes anuales.
        </p>

        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Link href="/dashboard/properties/new">
            <Button>
              <Icon name="plus" size={14} /> Agregar propiedad
            </Button>
          </Link>
          <Button variant="soft" onClick={handleSeed} disabled={pending || loadedDemo}>
            <Icon name="sparkle" size={14} /> {demoButtonLabel}
          </Button>
        </div>

        <p className="mt-5 text-[12px] text-ink-400">
          Los datos demo incluyen 4 propiedades de ejemplo con historial completo de pagos.
        </p>
      </Card>
    </div>
  );
};
