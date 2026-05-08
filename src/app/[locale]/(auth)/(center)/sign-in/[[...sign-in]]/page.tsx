import { SignIn } from '@clerk/nextjs';
import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
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
    <div className="grid min-h-screen w-full lg:grid-cols-2">
      {/* Brand panel */}
      <div className="relative hidden overflow-hidden bg-mint-50 grid-paper p-10 lg:flex lg:flex-col lg:justify-between">
        <div className="relative z-10 flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-ink-900 text-cream-50">
            <Icon name="home" size={18} />
          </div>
          <div className="serif text-[22px] tracking-tight">Casero</div>
        </div>
        <div className="relative z-10 max-w-md">
          <div className="mb-4 text-[13px] tracking-[0.16em] text-mint-700 uppercase">
            Control de arriendos
          </div>
          <h1 className="serif text-[44px] leading-[1.05] tracking-tight text-ink-900">
            Tus propiedades,
            <br /> mes a mes,
            <br />
            <span className="text-mint-700 italic">sin Excel.</span>
          </h1>
          <p className="mt-5 text-[15px] leading-relaxed text-ink-500">
            Lleva el balance de cada arriendo, programa el reajuste anual y guarda el historial de
            pagos en un solo lugar.
          </p>
        </div>
        <div className="relative z-10 grid max-w-md grid-cols-3 gap-3">
          {[
            { k: '4', l: 'propiedades' },
            { k: '$2.34M', l: 'mensual' },
            { k: '94%', l: 'al día' },
          ].map((s) => (
            <div key={s.l} className="rounded-2xl border border-mint-100 bg-white/70 p-3.5">
              <div className="num text-[20px] text-ink-900">{s.k}</div>
              <div className="mt-0.5 text-[12px] text-ink-500">{s.l}</div>
            </div>
          ))}
        </div>
        {/* decorative */}
        <div className="absolute -top-10 -right-10 h-64 w-64 rounded-full bg-peach-100/50" />
        <div className="absolute -right-20 bottom-20 h-80 w-80 rounded-full bg-lavender-100/40" />
      </div>

      {/* SignIn form panel */}
      <div className="flex items-center justify-center bg-cream-50 p-6 lg:p-10">
        <div className="w-full max-w-sm">
          <div className="mb-6 flex items-center gap-2.5 lg:hidden">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-ink-900 text-cream-50">
              <Icon name="home" size={18} />
            </div>
            <div className="serif text-[22px]">Casero</div>
          </div>
          <SignIn
            path={getI18nPath('/sign-in', locale)}
            // No sign-up link: signUpUrl points to a non-existent route
            // Clerk will hide the "Don't have an account? Sign up" link
            appearance={{
              elements: {
                rootBox: 'w-full',
                card: 'bg-transparent shadow-none border-0 p-0',
                headerTitle: 'serif text-[28px] text-ink-900',
                headerSubtitle: 'text-[14px] text-ink-500',
                socialButtonsBlockButton: 'hidden',
                socialButtonsRoot: 'hidden',
                dividerRow: 'hidden',
                formFieldLabel: 'text-[12px] uppercase tracking-[0.08em] text-ink-500',
                formFieldInput:
                  'bg-cream-50 border border-cream-200 rounded-xl h-11 text-[15px] focus:border-ink-900',
                formFieldInput__invalid:
                  'border-red-500 text-red-950 focus:border-red-600 focus:ring-red-100',
                formFieldErrorText: 'text-[12px] font-medium text-red-700',
                formFieldErrorIcon: 'text-red-700',
                formGlobalError:
                  'rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-[13px] text-red-700',
                formButtonPrimary:
                  'bg-ink-900 hover:bg-ink-700 text-cream-50 rounded-full h-11 text-sm font-medium normal-case',
                footer: 'hidden',
                footerAction: 'hidden',
                footerActionLink: 'hidden',
              },
              variables: {
                colorPrimary: '#2d2a26',
                colorDanger: '#b91c1c',
                colorBackground: '#fbf8f2',
                colorForeground: '#2d2a26',
                colorMutedForeground: '#7a7368',
                colorInput: '#fbf8f2',
                colorInputForeground: '#2d2a26',
                borderRadius: '0.75rem',
                fontFamily: 'var(--font-sans)',
              },
            }}
          />
          <p className="mt-6 flex items-center gap-1.5 text-[12px] text-ink-400">
            <Icon name="shield" size={13} /> Acceso restringido. Solo usuarios autorizados.
          </p>
        </div>
      </div>
    </div>
  );
}
