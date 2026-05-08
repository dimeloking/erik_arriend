import { ClerkProvider } from '@clerk/nextjs';
import { setRequestLocale } from 'next-intl/server';
import { Env } from '@/libs/Env';
import { ClerkLocalizations } from '@/utils/AppConfig';
import { getI18nPath } from '@/utils/Helpers';

const getLocalizedClerkUrl = (url: string, locale: string) => {
  if (!url.startsWith('/') || url.startsWith('//')) {
    return url;
  }

  return getI18nPath(url, locale);
};

export default async function AuthLayout(props: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await props.params;
  setRequestLocale(locale);

  const clerkLocale =
    ClerkLocalizations.supportedLocales[locale] ?? ClerkLocalizations.defaultLocale;

  const signInUrl = getLocalizedClerkUrl(Env.NEXT_PUBLIC_CLERK_SIGN_IN_URL ?? '/sign-in', locale);
  const signInFallbackRedirectUrl = getLocalizedClerkUrl(
    Env.NEXT_PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL ?? '/dashboard',
    locale,
  );

  return (
    <ClerkProvider
      appearance={{
        cssLayerName: 'clerk', // Ensure Clerk is compatible with Tailwind CSS v4
      }}
      localization={clerkLocale}
      signInUrl={signInUrl}
      signInFallbackRedirectUrl={signInFallbackRedirectUrl}
      afterSignOutUrl={signInUrl}
    >
      {props.children}
    </ClerkProvider>
  );
}
