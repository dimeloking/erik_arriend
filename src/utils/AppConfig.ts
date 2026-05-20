import { esES } from '@clerk/localizations';
import type { LocalizationResource } from '@clerk/shared/types';
import type { LocalePrefixMode } from 'next-intl/routing';

/** Locale prefix strategy for next-intl routing. */
const localePrefix: LocalePrefixMode = 'as-needed';

export const AppConfig = {
  name: 'Casero',
  i18n: {
    locales: ['en', 'fr'],
    defaultLocale: 'en',
    localePrefix,
  },
};

const spanishClerkLocalization = {
  ...esES,
  formFieldInputPlaceholder__emailAddress: 'correo@ejemplo.com',
  formFieldInputPlaceholder__password: 'Tu contraseña',
  unstable__errors: {
    ...esES.unstable__errors,
    form_identifier_not_found: 'No existe una cuenta con este correo electrónico.',
    form_param_format_invalid__email_address: 'Escribe un correo electrónico válido.',
    form_password_incorrect: 'La contraseña es incorrecta.',
    form_password_or_identifier_incorrect: 'El correo o la contraseña no son correctos.',
    form_param_nil: 'Este campo es obligatorio.',
  },
} satisfies LocalizationResource;

const supportedLocales: Record<string, LocalizationResource> = {
  en: spanishClerkLocalization,
  fr: spanishClerkLocalization,
};

export const ClerkLocalizations = {
  defaultLocale: spanishClerkLocalization,
  supportedLocales,
};
