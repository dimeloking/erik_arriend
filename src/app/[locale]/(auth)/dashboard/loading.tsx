import { CaseroLoadingScene } from '@/features/casero/components/CaseroLoadingScene';

export default function Loading() {
  return (
    <main className="grid min-h-[calc(100dvh-90px)] place-items-center overflow-hidden bg-cream-50 px-5 py-10">
      <section className="relative flex w-full max-w-2xl animate-fade-in flex-col items-center justify-center text-center">
        <div className="-mb-8 flex items-center justify-center">
          <CaseroLoadingScene />
        </div>
        <div className="relative z-10 text-center">
          <div className="serif text-[32px] leading-tight text-ink-900">Casero</div>
          <div className="mt-1 flex items-center justify-center gap-2 text-[13px] text-ink-500">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-mint-700" />
            Preparando tu panel
          </div>
        </div>
      </section>
    </main>
  );
}
