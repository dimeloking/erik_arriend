import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { PropertyDetail } from '@/features/casero/components/PropertyDetail';
import { getPropertyWithPayments } from '@/features/casero/queries';

// @next-codemod-ignore Cache Components adoption: this segment temporarily allows blocking.
// Remove this opt-out after verifying the segment passes validation without it.
// See: https://nextjs.org/docs/app/guides/migrating-to-cache-components
export const instant = false;

type PropertyPageProps = {
  params: Promise<{ locale: string; id: string }>;
  searchParams: Promise<{ paymentId?: string; tab?: string }>;
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
  return <PropertyDetail openPaymentId={sp.paymentId} property={property} tab={tab} />;
}
