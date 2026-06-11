import { setRequestLocale } from 'next-intl/server';
import Link from 'next/link';
import { CaseroLoadingScene } from '@/features/casero/components/CaseroLoadingScene';
import { Icon } from '@/features/casero/ui/Icon';

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function LoadingPreviewPage(props: Props) {
  const { locale } = await props.params;
  setRequestLocale(locale);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-cream-50 p-10">
      <div className="mb-10 text-center">
        <Link
          href="/dashboard"
          className="flex items-center justify-center gap-2 text-sm text-ink-500 hover:text-ink-900"
        >
          <Icon name="chev_l" size={14} /> Volver
        </Link>
        <h1 className="mt-4 serif text-4xl text-ink-900">Preview de Carga 3D</h1>
        <p className="text-ink-500">
          Si acá no se ve la casa, el problema es de soporte WebGL/GPU del navegador.
        </p>
      </div>

      <div className="relative flex flex-col items-center justify-center">
        {/* Contenedor transparente y ajustado */}
        <div className="-mb-8 flex items-center justify-center">
          <CaseroLoadingScene />
        </div>

        <div className="relative z-10 text-center">
          <div className="serif text-[32px] text-ink-900">Casero</div>
          <div className="mt-1 flex items-center justify-center gap-2 text-sm text-ink-500">
            <span className="h-2 w-2 animate-pulse rounded-full bg-mint-700" />
            Probando motor Babylon.js
          </div>
        </div>
      </div>

      <div className="mt-10 max-w-md text-center text-xs text-ink-400">
        Tip: Si ves el texto pero no la casa, revisá la consola del navegador (F12) para ver si hay
        errores de "WebGPU" o "WebGL".
      </div>
    </main>
  );
}
