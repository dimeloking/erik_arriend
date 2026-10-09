import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { routing } from '@/libs/I18nRouting';

// TODO: Cache Components adoption — needs user decision: redirecting by auth state inside Suspense would stream the redirect instead of sending an HTTP 307.
export const instant = false;

type IndexPageProps = {
  params: Promise<{ locale: string }>;
};

export default async function Index(props: IndexPageProps) {
  const { locale } = await props.params;

  const { userId } = await auth();
  const prefix = locale === routing.defaultLocale ? '' : `/${locale}`;
  redirect(userId ? `${prefix}/dashboard` : `${prefix}/sign-in`);
}
