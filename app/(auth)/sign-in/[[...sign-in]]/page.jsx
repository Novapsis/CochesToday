'use client';
import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { createClient } from '@/lib/supabase';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function SignInPage() {
  const supabase = createClient();
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get('redirect') || '/';

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session) {
        router.push(redirect);
      }
    });

    return () => subscription.unsubscribe();
  }, [supabase, router, redirect]);

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-br from-blue-50 to-indigo-100 px-4">
      <div className="w-full max-w-xl">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/">
            <Image
              src="/logo.png"
              alt="CochesToday"
              width={200}
              height={60}
              className="mx-auto mb-4"
            />
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Bienvenido de vuelta</h1>
          <p className="text-gray-600 mt-2">Inicia sesión para continuar</p>
        </div>

        {/* Auth Form */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <Auth
            supabaseClient={supabase}
            appearance={{
              theme: ThemeSupa,
              variables: {
                default: {
                  colors: {
                    brand: '#3b82f6',
                    brandAccent: '#2563eb',
                  },
                },
              },
              className: {
                button: 'rounded-lg',
                input: 'rounded-lg',
              },
            }}
            providers={['google']}
            redirectTo={`${typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000'}/auth/callback?redirect=${encodeURIComponent(redirect)}`}
            magicLink={true}
            view="magic_link"
            showLinks={false}
            onlyThirdPartyProviders={false}
            localization={{
              variables: {
                sign_in: {
                  email_label: 'Correo electrónico',
                  password_label: 'Contraseña',
                  email_input_placeholder: 'tu@email.com',
                  password_input_placeholder: 'Tu contraseña',
                  button_label: 'Iniciar sesión',
                  loading_button_label: 'Iniciando sesión...',
                  social_provider_text: 'Continuar con {{provider}}',
                  link_text: '¿Ya tienes cuenta? Inicia sesión',
                  confirmation_text: 'Revisa tu email para el enlace de confirmación',
                },
                magic_link: {
                  email_input_label: 'Correo electrónico',
                  email_input_placeholder: 'tu@email.com',
                  button_label: 'Enviar enlace mágico',
                  loading_button_label: 'Enviando enlace...',
                  link_text: '¿Prefieres usar enlace mágico?',
                  confirmation_text: '¡Revisa tu email! Te hemos enviado un enlace mágico',
                },
                sign_up: {
                  email_label: 'Correo electrónico',
                  password_label: 'Contraseña',
                  email_input_placeholder: 'tu@email.com',
                  password_input_placeholder: 'Tu contraseña',
                  button_label: 'Registrarse',
                  loading_button_label: 'Registrando...',
                  social_provider_text: 'Continuar con {{provider}}',
                  link_text: '¿No tienes cuenta? Regístrate',
                  confirmation_text: 'Revisa tu email para confirmar tu cuenta',
                },
              },
            }}
          />
        </div>

        {/* Footer */}
        <p className="text-center text-sm text-gray-600 mt-6">
          ¿No tienes cuenta?{' '}
          <Link href="/sign-up" className="text-blue-600 hover:text-blue-700 font-semibold">
            Regístrate aquí
          </Link>
        </p>
      </div>
    </div>
  );
}