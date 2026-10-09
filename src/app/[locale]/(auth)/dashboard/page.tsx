import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import { Dashboard } from '@/features/casero/components/Dashboard';
import { listPropertiesWithPayments, listExpenses } from '@/features/casero/queries';

type DashboardPageProps = {
  params: Promise<{ locale: string }>;
};

export const metadata: Metadata = {
  title: 'Casero — Panel',
};

export default async function DashboardPage(props: DashboardPageProps) {
  const { locale } = await props.params;
  setRequestLocale(locale);

  const [properties, expenses] = await Promise.all([listPropertiesWithPayments(), listExpenses()]);

  return <Dashboard properties={properties} expenses={expenses} />;
}
