import { setRequestLocale } from 'next-intl/server';
import { TopBar } from '@/features/casero/components/TopBar';

export default async function DashboardLayout(props: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await props.params;
  setRequestLocale(locale);

  return (
    <div className="min-h-screen bg-cream-50">
      <TopBar />
      <main className="mx-auto max-w-6xl px-6 py-8">{props.children}</main>
    </div>
  );
}
