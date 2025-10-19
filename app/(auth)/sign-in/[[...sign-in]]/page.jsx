'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/auth/AuthProvider';
import { createClient } from '@/lib/supabase';
import { Logo } from '@/components/logo';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Link from 'next/link';
import { CheckCircle, Shield, Zap, BarChart } from 'lucide-react';
import { ConciergeChat } from '@/components/concierge-chat';

const FeatureListItem = ({ icon, text }) => (
  <li className="flex items-start gap-3">
    <div className="flex-shrink-0">{icon}</div>
    <span className="text-foreground/80">{text}</span>
  </li>
);

export default function SignInPage() {
  const { signInWithMagicLink } = useAuth();
  const supabase = createClient();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');
    const { error } = await signInWithMagicLink(email);
    if (error) {
      setError(error.message);
    } else {
      setMessage('¡Revisa tu correo! Te hemos enviado un enlace para iniciar sesión.');
    }
    setLoading(false);
  };

  const handleOAuthSignIn = async (provider) => {
    await supabase.auth.signInWithOAuth({ 
      provider,
      options: {
        redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`
      }
    });
  };

  return (
    <div className="min-h-screen w-full lg:grid lg:grid-cols-2">
      {/* --- Left Column: Form --- */}
      <div className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md space-y-8 border border-cyan-500 rounded-xl p-10 shadow-lg shadow-cyan-500/10">
          <div>
            <Logo className="h-12 w-auto mx-auto" />
            <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-foreground">
              Accede a la experiencia CochesToday
            </h2>
            <p className="mt-2 text-center text-sm text-muted-foreground">
              Todos tus servicios en un solo lugar.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid gap-2">
              <Label htmlFor="email">Correo electrónico</Label>
              <Input
                id="email"
                type="email"
                placeholder="tu@email.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-12"
              />
            </div>
            
            {message && <p className="text-sm text-green-600 bg-green-50 dark:bg-green-900/20 p-3 rounded-md border border-green-200 dark:border-green-800">{message}</p>}
            {error && <p className="text-sm text-red-600">{error}</p>}

            <Button type="submit" className="w-full h-12 text-base" disabled={loading}>
              {loading ? 'Enviando...' : 'Recibir enlace mágico'}
            </Button>
          </form>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                O continúa con
              </span>
            </div>
          </div>

          <Button variant="outline" className="w-full h-12 text-base bg-white hover:bg-gray-50" onClick={() => handleOAuthSignIn('google')}>
            <span className="font-semibold">
              <span style={{ color: '#4285F4' }}>G</span>
              <span style={{ color: '#EA4335' }}>o</span>
              <span style={{ color: '#FBBC05' }}>o</span>
              <span style={{ color: '#4285F4' }}>g</span>
              <span style={{ color: '#34A853' }}>l</span>
              <span style={{ color: '#EA4335' }}>e</span>
            </span>
          </Button>
        </div>
      </div>

      {/* --- Right Column: Marketing (with transparent background) --- */}
      <div className="hidden lg:flex items-center justify-center p-12">
        <div className="max-w-md space-y-10">
          <div>
            <h3 className="text-lg font-semibold tracking-widest uppercase text-cyan-500">VENTAJAS PREMIUM</h3>
            <ul className="mt-4 space-y-4 text-lg">
              <FeatureListItem icon={<Shield size={24} className="text-cyan-500" />} text="Servicio Concierge 360º para vender sin esfuerzo." />
              <FeatureListItem icon={<Zap size={24} className="text-cyan-500" />} text="IA que recomienda vehículos a tu medida." />
              <FeatureListItem icon={<BarChart size={24} className="text-cyan-500" />} text="Control total desde tu panel personal." />
            </ul>
          </div>
          <div className="border-t border-gray-200 dark:border-gray-700 pt-8">
            <h4 className="font-bold text-xl text-foreground">Aumenta el valor de tu coche</h4>
            <p className="mt-2 text-foreground/80">
              Descubre cómo nuestro servicio de concierge prepara tu vehículo, negocia por ti y maximiza el precio de venta.
            </p>
            <ConciergeChat />
          </div>
           <div className="border-t border-gray-200 dark:border-gray-700 pt-8">
            <h4 className="font-bold text-xl text-foreground">Presupuesto y diagnóstico profesional</h4>
            <p className="mt-2 text-foreground/80">
              Ofrecemos revisión técnica y escaneo integral para certificar el estado real de tu coche antes de publicarlo.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}