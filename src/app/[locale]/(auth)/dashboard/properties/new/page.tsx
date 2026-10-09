import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import Link from 'next/link';
import { PropertyForm } from '@/features/casero/components/PropertyForm';
import { Icon } from '@/features/casero/ui/Icon';
import { Card } from '@/features/casero/ui/primitives';

type NewPropertyPageProps = {
  params: Promise<{ locale: string }>;
};

export const metadata: Metadata = {
  title: 'Casero — Nueva propiedad',
};

export default async function NewPropertyPage(props: NewPropertyPageProps) {
  const { locale } = await props.params;
  setRequestLocale(locale);

  return (
    <div className="mx-auto max-w-3xl animate-fade-up space-y-5">
      <Link
        href="/dashboard"
        className="inline-flex items-center gap-1 text-[13px] text-ink-500 hover:text-ink-900"
      >
        <Icon name="chev_l" size={14} /> Volver al panel
      </Link>
      <div>
        <h1 className="serif text-[34px] leading-tight text-ink-900">Nueva propiedad</h1>
        <p className="mt-1 text-[14px] text-ink-500">
          Carga los datos del inmueble y de quien lo arrienda. Los pagos pendientes desde la fecha
          de inicio se generan automáticamente.
        </p>
      </div>
      <Card className="p-6">
        <PropertyForm />
      </Card>
    </div>
  );
}
