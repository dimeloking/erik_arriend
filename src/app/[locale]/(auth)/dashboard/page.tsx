import type { Metadata } from 'next';
import { Dashboard } from '@/features/casero/components/Dashboard';
import { listPropertiesWithPayments, listExpenses } from '@/features/casero/queries';

export const metadata: Metadata = {
  title: 'Casero — Panel',
};

export default async function DashboardPage() {
  const [properties, expenses] = await Promise.all([listPropertiesWithPayments(), listExpenses()]);

  return <Dashboard properties={properties} expenses={expenses} />;
}
