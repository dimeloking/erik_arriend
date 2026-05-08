import { auth } from '@clerk/nextjs/server';
import { setRequestLocale } from 'next-intl/server';
import { redirect } from 'next/navigation';
import { routing } from '@/libs/I18nRouting';

type IndexPageProps = {
  params: Promise<{ locale: string }>;
};

export default async function Index(props: IndexPageProps) {
  const { locale } = await props.params;
  setRequestLocale(locale);

  const { userId } = await auth();
  const prefix = locale === routing.defaultLocale ? '' : `/${locale}`;
  redirect(userId ? `${prefix}/dashboard` : `${prefix}/sign-in`);
}
