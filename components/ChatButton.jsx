'use client';

import { Button } from '@/components/ui/button';

export function ChatButton() {
  const handleChatOpen = () => {
    if (window.NovapisChat && typeof window.NovapisChat.open === 'function') {
      window.NovapisChat.open();
    } else {
      console.error('NovapisChat no está listo o no se encontró.');
      alert('El servicio de chat no está disponible en este momento. Por favor, inténtelo de nuevo más tarde.');
    }
  };

  return (
    <Button
      size="lg"
      className="bg-cyan-500 hover:bg-cyan-600 text-white font-bold text-lg"
      onClick={handleChatOpen}
    >
      Hablar con un experto
    </Button>
  );
}
