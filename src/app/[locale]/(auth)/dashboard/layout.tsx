import { Suspense } from 'react';
import { TopBar, TopBarFallback } from '@/features/casero/components/TopBar';

export default function DashboardLayout(props: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-cream-50">
      <Suspense fallback={<TopBarFallback />}>
        <TopBar />
      </Suspense>
      <main className="mx-auto max-w-6xl px-6 py-8">{props.children}</main>
    </div>
  );
}
