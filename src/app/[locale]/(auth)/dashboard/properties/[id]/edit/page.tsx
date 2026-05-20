import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { PropertyForm } from '@/features/casero/components/PropertyForm';
import { getPropertyWithPayments } from '@/features/casero/queries';
import { Icon } from '@/features/casero/ui/Icon';
import { Card } from '@/features/casero/ui/primitives';

type EditPropertyPageProps = {
  params: Promise<{ locale: string; id: string }>;
};

export const metadata: Metadata = {
  title: 'Casero — Editar propiedad',
};

export default async function EditPropertyPage(props: EditPropertyPageProps) {
  const { locale, id } = await props.params;
  setRequestLocale(locale);

  const property = await getPropertyWithPayments(id);
  if (!property) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-3xl animate-fade-up space-y-5">
      <Link
        href={`/dashboard/properties/${property.id}`}
        className="inline-flex items-center gap-1 text-[13px] text-ink-500 hover:text-ink-900"
      >
        <Icon name="chev_l" size={14} /> Volver al detalle
      </Link>
      <div>
        <h1 className="serif text-[34px] leading-tight text-ink-900">Editar propiedad</h1>
        <p className="mt-1 text-[14px] text-ink-500">
          Actualiza los datos del inmueble. Los cobros pendientes toman el nuevo arriendo.
        </p>
      </div>
      <Card className="p-6">
        <PropertyForm initial={property} />
      </Card>
    </div>
  );
}
