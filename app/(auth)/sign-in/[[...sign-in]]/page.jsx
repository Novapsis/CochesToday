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
    <div className="min-h-screen w-full bg-background text-foreground flex flex-col lg:flex-row transition-colors">
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-1/2 xl:w-2/5 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#1f3964] via-[#1b3154] to-[#111d38] dark:from-[#050a19] dark:via-[#081124] dark:to-[#03060d]" />
        <div className="absolute inset-0 bg-[url('/logo/pattern.svg')] opacity-5 mix-blend-screen" />
        <div className="relative z-10 flex flex-col justify-between px-12 py-14 text-accent-foreground">
          <div className="max-w-md ml-10">
            <Link href="/">
              <Image
                src="/logo.png"
                alt="CochesToday"
                width={220}
                height={68}
                className="mb-12"
              />
            </Link>
            <h1 className="text-4xl font-semibold leading-tight tracking-tight">
              Accede a la experiencia CochesToday
            </h1>
            <p className="mt-6 text-accent-foreground/80 text-lg">
              Gestiona la venta de tu coche, descubre oportunidades exclusivas y continúa donde lo dejaste.
            </p>
          </div>

          <div className="space-y-5 max-w-md ml-10">
            <div className="rounded-3xl bg-white/95 text-foreground shadow-2xl p-6 dark:bg-neutral-900/85">
              <p className="text-xs uppercase tracking-[0.35em] text-foreground/50 dark:text-foreground/60">Ventajas premium</p>
              <ul className="mt-4 space-y-2 text-sm leading-relaxed text-foreground/80 dark:text-foreground/70">
                <li className="flex gap-2">
                  <span className="text-accent font-semibold">•</span> Concierge 360º para vender sin esfuerzo
                </li>
                <li className="flex gap-2">
                  <span className="text-accent font-semibold">•</span> IA que recomienda vehículos a tu medida
                </li>
                <li className="flex gap-2">
                  <span className="text-accent font-semibold">•</span> Control total desde tu panel personal
                </li>
              </ul>
            </div>

            <div className="rounded-3xl bg-white text-foreground shadow-2xl border border-accent/20 p-6 dark:bg-neutral-900/90">
              <h3 className="text-lg font-semibold">Aumenta el valor de tu coche</h3>
              <p className="text-sm text-foreground/70 mt-3 dark:text-foreground/60">
                Descubre cómo nuestro servicio de concierge prepara tu vehículo, negocia por ti y maximiza el precio de venta.
              </p>
              <Link
                href="/contact"
                className="mt-4 inline-flex items-center justify-center rounded-full bg-accent text-accent-foreground px-5 py-2 text-sm font-medium hover:bg-accent/90 transition"
              >
                Hablar con concierge
              </Link>
            </div>

            <div className="rounded-3xl border border-white/50 bg-white/85 text-foreground shadow-xl p-6 dark:bg-neutral-900/80 dark:border-white/10">
              <h3 className="text-lg font-semibold">Presupuesto y diagnóstico profesional</h3>
              <p className="text-sm text-foreground/70 mt-3 dark:text-foreground/60">
                Ofrecemos revisión técnica y escaneo integral para certificar el estado real de tu coche antes de publicarlo.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center px-6 py-14">
        <div className="w-full max-w-lg">
          <div className="text-center mb-10 lg:hidden">
            <Link href="/">
              <Image
                src="/logo.png"
                alt="CochesToday"
                width={180}
                height={56}
                className="mx-auto mb-6"
              />
            </Link>
            <h2 className="text-3xl font-semibold">Bienvenido de nuevo</h2>
            <p className="text-foreground/70 mt-2">
              Inicia sesión para continuar con tus servicios.
            </p>
          </div>

          <div className="border border-accent/25 rounded-3xl bg-card/95 shadow-lg p-10">
            <Auth
              supabaseClient={supabase}
              appearance={{
                theme: ThemeSupa,
                variables: {
                  default: {
                    colors: {
                      brand: '#2f4a7c',
                      brandAccent: '#1f3c88',
                      inputBackground: '#ffffff',
                      inputText: '#131313',
                    },
                  },
                },
                className: {
                  button:
                    'rounded-xl text-sm font-medium tracking-wide h-11 bg-accent text-accent-foreground hover:bg-accent/90 transition',
                  input:
                    'rounded-xl h-11 bg-white text-[#161616] border border-accent/30 focus:border-accent focus:ring-0 placeholder:text-foreground/40 dark:bg-neutral-900 dark:text-foreground',
                  label: 'text-sm font-medium text-foreground/80 dark:text-foreground/70',
                  container: 'space-y-4',
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

          <p className="text-center text-sm text-foreground/70 mt-6">
            ¿Aún no te has unido?{' '}
            <Link href="/sign-up" className="text-accent font-semibold hover:text-accent/80">
              Crea tu cuenta ahora
            </Link>
          </p>

          {/* Mobile info cards */}
          <div className="lg:hidden mt-10 space-y-4">
            <div className="rounded-3xl bg-white text-foreground shadow-2xl border border-accent/20 p-6 dark:bg-neutral-900/90">
              <h3 className="text-base font-semibold">Aumenta el valor de tu coche</h3>
              <p className="text-sm text-foreground/70 mt-2 dark:text-foreground/60">
                Nuestro concierge prepara tu coche con reportaje fotográfico, detailing y negociación profesional.
              </p>
            </div>
            <div className="rounded-3xl border border-accent/20 bg-white/80 text-foreground p-6 shadow dark:bg-neutral-900/80">
              <h3 className="text-base font-semibold">Presupuesto con revisión</h3>
              <p className="text-sm text-foreground/70 mt-2 dark:text-foreground/60">
                Servicio de valoración con escaneo integral para publicar tu coche con total transparencia.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
