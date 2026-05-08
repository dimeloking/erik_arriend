import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { PropertyDetail } from '@/features/casero/components/PropertyDetail';
import { getPropertyWithPayments } from '@/features/casero/queries';

type PropertyPageProps = {
  params: Promise<{ locale: string; id: string }>;
  searchParams: Promise<{ tab?: string }>;
};

export const metadata: Metadata = {
  title: 'Casero — Propiedad',
};

const VALID_TABS = ['historial', 'balance', 'reajustes'] as const;

type Tab = (typeof VALID_TABS)[number];

const isTab = (v: string | undefined): v is Tab =>
  v === 'historial' || v === 'balance' || v === 'reajustes';

export default async function PropertyPage(props: PropertyPageProps) {
  const { locale, id } = await props.params;
  const sp = await props.searchParams;
  setRequestLocale(locale);

  const property = await getPropertyWithPayments(id);
  if (!property) {
    notFound();
  }

  const tab: Tab = isTab(sp.tab) ? sp.tab : 'historial';
  return <PropertyDetail property={property} tab={tab} />;
}
