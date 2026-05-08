import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import { CustomSignInForm } from '@/features/casero/components/CustomSignInForm';
import { Icon } from '@/features/casero/ui/Icon';
import { getI18nPath } from '@/utils/Helpers';

type SignInPageProps = {
  params: Promise<{ locale: string }>;
};

export const metadata: Metadata = {
  title: 'Casero — Iniciar sesión',
};

export default async function SignInPage(props: SignInPageProps) {
  const { locale } = await props.params;
  setRequestLocale(locale);

  return (
    <main className="min-h-screen px-6 py-8">
      <section className="mx-auto flex min-h-[calc(100vh-120px)] w-full max-w-sm flex-col justify-center">
        <div className="mb-10 flex items-center justify-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-ink-900 text-cream-50">
            <Icon name="home" size={20} />
          </div>
          <div className="serif text-[28px] leading-none tracking-tight text-ink-900">
            RentCheck
          </div>
        </div>
        <CustomSignInForm redirectUrl={getI18nPath('/dashboard', locale)} />
        <p className="mt-6 flex items-center gap-1.5 text-[12px] text-ink-400">
          <Icon name="shield" size={13} /> Acceso restringido. Solo usuarios autorizados.
        </p>
      </section>
    </main>
  );
}
