'use client';

import Script from 'next/script';

export const ConciergeChat = () => {
  // Create the FULL configuration object, based on the V3 widget's default structure
  const finalConfig = {
    webhookUrl: 'https://n8n.novapsis.site/webhook/27f14a4f-62e5-4f12-b8b0-9ab1cec11f0c/chat',
    autoOpen: false, // Keep at top level just in case
    button: {
      icon: '💬',
      color: '#0891b2', // Custom site color
      size: '60px',
      position: { bottom: '25px', right: '25px' },
      effects: { vibrate: true, jump: false, colorChange: { enabled: false, colors: [], interval: 3000 } }
    },
    chat: {
      title: 'CochesToday',
      autoOpen: false, // Add to chat object as well
      width: '350px',
      height: '500px',
      position: { bottom: '95px', right: '25px' }, // Adjust based on button position
      backgroundColor: '#ffffff',
      borderRadius: '10px',
      fontFamily: 'Arial, sans-serif',
      windowStyle: 'modern',
      logoUrl: '/logo.png',
      botAvatar: '',
      inputPlaceholder: 'Escribe tu mensaje...',
      audioEnabled: false
    },
    sounds: { enabled: true, volume: 0.5 }
  };

  const configJson = JSON.stringify(finalConfig);

  // A simplified initializer that uses the directly injected config
  const initializerScript = `
    (function() {
      const config = ${configJson};
      function loadCSS() { const link = document.createElement('link'); link.rel = 'stylesheet'; link.href = 'https://chat.novapsis.com/public_html/v3/chat-widget.css'; document.head.appendChild(link); }
      function loadJS(callback) { const script = document.createElement('script'); script.src = 'https://chat.novapsis.com/public_html/v3/chat-widget.js'; script.onload = callback; document.body.appendChild(script); }
      loadCSS();
      loadJS(() => {
        window.novapsisChat = new NovapsisChatWidget(config);
      });
    })();
  `;

  return (
    <Script
      id="novapsis-chat-v3-initializer"
      strategy="afterInteractive"
      dangerouslySetInnerHTML={{ __html: initializerScript }}
    />
  );
};
