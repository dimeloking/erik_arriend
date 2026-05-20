'use client';

import { useSignIn } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import type { ComponentProps } from 'react';
import { useState } from 'react';
import { Icon } from '../ui/Icon';

type CustomSignInFormProps = {
  redirectUrl: string;
};

const ERROR_MESSAGES: Record<string, string> = {
  form_identifier_not_found: 'No existe una cuenta con este correo electrónico.',
  form_param_format_invalid__email_address: 'Escribe un correo electrónico válido.',
  form_password_incorrect: 'La contraseña es incorrecta.',
  form_password_or_identifier_incorrect: 'El correo o la contraseña no son correctos.',
  form_param_nil: 'Escribe tu correo y contraseña.',
};

const getErrorMessage = (code?: string, fallback?: string) => {
  if (code && ERROR_MESSAGES[code]) {
    return ERROR_MESSAGES[code];
  }

  return fallback ?? 'No se pudo iniciar sesión. Revisa tus datos e intenta de nuevo.';
};

const inputClassName =
  'h-12 w-full rounded-none border-0 border-b border-cream-300 bg-transparent px-0 text-[15px] text-ink-900 outline-none transition placeholder:text-ink-400 focus:border-ink-900 focus:ring-0';

const invalidInputClassName = 'border-red-500 text-red-950 focus:border-red-600';

const getFormValue = (formData: FormData, key: string) => {
  const value = formData.get(key);

  return typeof value === 'string' ? value : '';
};

export const CustomSignInForm = (props: CustomSignInFormProps) => {
  const { signIn, errors, fetchStatus } = useSignIn();
  const router = useRouter();
  const [formError, setFormError] = useState<string | null>(null);
  const isPending = fetchStatus === 'fetching';

  const identifierError = errors.fields.identifier;
  const passwordError = errors.fields.password;

  const handleSubmit: NonNullable<ComponentProps<'form'>['onSubmit']> = async (event) => {
    event.preventDefault();
    setFormError(null);

    const formData = new FormData(event.currentTarget);
    const identifier = getFormValue(formData, 'identifier').trim();
    const password = getFormValue(formData, 'password');

    if (!identifier || !password) {
      setFormError('Escribe tu correo y contraseña.');
      return;
    }

    const { error } = await signIn.password({
      identifier,
      password,
    });

    if (error) {
      setFormError(getErrorMessage(error.code, error.longMessage ?? error.message));
      return;
    }

    if (signIn.status === 'complete') {
      await signIn.finalize({
        navigate: ({ session, decorateUrl }) => {
          const destination = session?.currentTask
            ? `/sign-in/tasks/${session.currentTask.key}`
            : props.redirectUrl;
          const url = decorateUrl(destination);

          if (url.startsWith('http')) {
            window.location.href = url;
            return;
          }

          router.push(url);
        },
      });
      return;
    }

    if (signIn.status === 'needs_client_trust' || signIn.status === 'needs_second_factor') {
      setFormError(
        'Clerk está pidiendo verificación adicional para esta cuenta o dispositivo. Revisa Client Trust o MFA en el Dashboard de Clerk si quieres solo correo y contraseña.',
      );
      return;
    }

    setFormError('No se pudo completar el inicio de sesión. Revisa la configuración de Clerk.');
  };

  return (
    <form onSubmit={handleSubmit} className="w-full" noValidate>
      <div className="mb-8">
        <h1 className="serif text-[34px] leading-tight text-ink-900">Iniciar sesión</h1>
        <p className="mt-2 text-[14px] text-ink-500">Acceso privado para administrar arriendos.</p>
      </div>

      <div className="space-y-7">
        <div>
          <label
            htmlFor="identifier"
            className="block text-[12px] tracking-[0.14em] text-ink-500 uppercase"
          >
            Correo electrónico
          </label>
          <input
            id="identifier"
            name="identifier"
            type="email"
            autoComplete="email"
            placeholder="correo@ejemplo.com"
            className={`${inputClassName} ${identifierError ? invalidInputClassName : ''}`}
            aria-label="Correo electrónico"
            aria-invalid={identifierError ? 'true' : undefined}
            aria-describedby={identifierError ? 'identifier-error' : undefined}
          />
          {identifierError ? (
            <p id="identifier-error" className="mt-2 text-[12px] font-medium text-red-700">
              {getErrorMessage(identifierError.code, identifierError.longMessage)}
            </p>
          ) : null}
        </div>

        <div>
          <label
            htmlFor="password"
            className="block text-[12px] tracking-[0.14em] text-ink-500 uppercase"
          >
            Contraseña
          </label>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            placeholder="Tu contraseña"
            className={`${inputClassName} ${passwordError ? invalidInputClassName : ''}`}
            aria-label="Contraseña"
            aria-invalid={passwordError ? 'true' : undefined}
            aria-describedby={passwordError ? 'password-error' : undefined}
          />
          {passwordError ? (
            <p id="password-error" className="mt-2 text-[12px] font-medium text-red-700">
              {getErrorMessage(passwordError.code, passwordError.longMessage)}
            </p>
          ) : null}
        </div>
      </div>

      {formError ? (
        <p className="mt-6 border-l-2 border-red-500 pl-3 text-[13px] leading-relaxed text-red-700">
          {formError}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={isPending}
        className="mt-8 flex h-12 w-full items-center justify-center gap-2 rounded-full bg-ink-900 px-5 text-[14px] font-medium text-cream-50 transition hover:bg-ink-700 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isPending ? 'Entrando...' : 'Entrar'}
        <Icon name="chev_r" size={15} />
      </button>
    </form>
  );
};
