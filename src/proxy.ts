import { detectBot } from '@arcjet/next';
import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import createMiddleware from 'next-intl/middleware';
import type { NextFetchEvent, NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import arcjet from '@/libs/Arcjet';
import { routing } from './libs/I18nRouting';

const handleI18nRouting = createMiddleware(routing);

const isProtectedRoute = createRouteMatcher(['/dashboard(.*)', '/:locale/dashboard(.*)']);

const isAuthPage = createRouteMatcher(['/sign-in(.*)', '/:locale/sign-in(.*)']);

// Sign-up is disabled for this client — redirect any /sign-up* URL to /sign-in
const isSignUpPage = createRouteMatcher(['/sign-up(.*)', '/:locale/sign-up(.*)']);

// Home pages need clerkMiddleware so `auth()` in the page can read the session
// and redirect to dashboard or sign-in accordingly.
const isHomePage = (req: NextRequest) => {
  const { pathname } = req.nextUrl;
  if (pathname === '/') {
    return true;
  }
  return routing.locales.some((l) => pathname === `/${l}` || pathname === `/${l}/`);
};

// Improve security with Arcjet
const aj = arcjet.withRule(
  detectBot({
    mode: 'LIVE',
    // Block all bots except the following
    allow: [
      // See https://docs.arcjet.com/bot-protection/identifying-bots
      'CATEGORY:SEARCH_ENGINE', // Allow search engines
      'CATEGORY:PREVIEW', // Allow preview links to show OG images
      'CATEGORY:MONITOR', // Allow uptime monitoring services
    ],
  }),
);

export default async function proxy(request: NextRequest, event: NextFetchEvent) {
  // Verify the request with Arcjet
  // Use `process.env` instead of Env to reduce bundle size in middleware
  if (process.env.ARCJET_KEY) {
    const decision = await aj.protect(request);

    if (decision.isDenied()) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
  }

  if (isSignUpPage(request)) {
    const { pathname, search } = request.nextUrl;
    const localePrefix = routing.locales.find((l) => pathname.startsWith(`/${l}/sign-up`));
    const target = localePrefix ? `/${localePrefix}/sign-in${search}` : `/sign-in${search}`;
    return NextResponse.redirect(new URL(target, request.url));
  }

  // Clerk keyless mode doesn't work with i18n, this is why we need to run the middleware conditionally
  if (isAuthPage(request) || isProtectedRoute(request) || isHomePage(request)) {
    return await clerkMiddleware(async (auth, req) => {
      if (isProtectedRoute(req)) {
        const locale = req.nextUrl.pathname.match(/(\/.*)\/dashboard/u)?.at(1) ?? '';

        const signInUrl = new URL(`${locale}/sign-in`, req.url);

        await auth.protect({
          unauthenticatedUrl: signInUrl.toString(),
        });
      }

      return handleI18nRouting(req);
    })(request, event);
  }

  return handleI18nRouting(request);
}

export const config = {
  // Match all pathnames except for
  // - … if they start with `/_next`, `/_vercel` or `monitoring`
  // - … the ones containing a dot (e.g. `favicon.ico`)
  matcher: '/((?!_next|_vercel|monitoring|.*\\..*).*)',
};
