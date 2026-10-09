import { getTranslations, setRequestLocale } from 'next-intl/server';
import { cacheLife } from 'next/cache';
import { LocaleSwitcher } from '@/components/LocaleSwitcher';
import { Link } from '@/libs/I18nNavigation';
import { BaseTemplate } from '@/templates/BaseTemplate';

// @next-codemod-ignore Cache Components adoption: this segment temporarily allows blocking.
// Remove this opt-out after verifying the segment passes validation without it.
// See: https://nextjs.org/docs/app/guides/migrating-to-cache-components
export const instant = false;

async function getCurrentYear() {
  'use cache';

  cacheLife('days');
  // 'use cache' functions must be async; keep an await to satisfy require-await.
  await Promise.resolve();
  return new Date().getFullYear();
}

export default async function Layout(props: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await props.params;
  setRequestLocale(locale);
  const t = await getTranslations({
    locale,
    namespace: 'RootLayout',
  });

  return (
    <>
      <BaseTemplate
        year={await getCurrentYear()}
        leftNav={
          <>
            <li>
              <Link href="/" className="border-none text-gray-700 hover:text-gray-900">
                {t('home_link')}
              </Link>
            </li>
            <li>
              <Link href="/sign-in/" className="border-none text-gray-700 hover:text-gray-900">
                {t('dashboard_link')}
              </Link>
            </li>
          </>
        }
        rightNav={
          <>
            <li>
              <Link href="/sign-in/" className="border-none text-gray-700 hover:text-gray-900">
                {t('sign_in_link')}
              </Link>
            </li>

            <li>
              <Link href="/sign-up/" className="border-none text-gray-700 hover:text-gray-900">
                {t('sign_up_link')}
              </Link>
            </li>

            <li>
              <LocaleSwitcher />
            </li>
          </>
        }
      >
        <div className="py-5 text-xl [&_p]:my-6">{props.children}</div>
      </BaseTemplate>
    </>
  );
}
