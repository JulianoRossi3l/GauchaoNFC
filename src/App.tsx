import React, { useState, useEffect } from 'react';
import QRCode from 'qrcode';

export default function App() {
  const [copied, setCopied] = useState(false);
  const [showWifiModal, setShowWifiModal] = useState(false);
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('');
  const [showQrCode, setShowQrCode] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  const wifiSSID = 'STARLINK CLIENTE';
  const wifiPass = 'Gauchao@310';
  const wifiQrString = `WIFI:S:${wifiSSID};T:WPA;P:${wifiPass};;`;

  // Listen to system theme preference changes
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = (e: MediaQueryListEvent) => {
      setIsDarkMode(e.matches);
    };
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  // Generate QR code data URL once
  useEffect(() => {
    QRCode.toDataURL(wifiQrString, {
      width: 260,
      margin: 2,
      color: {
        dark: '#000000',
        light: '#ffffff',
      },
      errorCorrectionLevel: 'M',
    })
      .then((url) => setQrCodeUrl(url))
      .catch((err) => console.error('Erro ao gerar QR code:', err));
  }, [wifiQrString]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 3500);
  };

  const copyWifiPassword = async (openModalAfter = true) => {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(wifiPass);
      } else {
        const textArea = document.createElement('textarea');
        textArea.value = wifiPass;
        textArea.style.position = 'fixed';
        textArea.style.left = '-9999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
      }

      // Haptic feedback if supported
      if ('vibrate' in navigator) {
        try {
          navigator.vibrate([40, 50, 40]);
        } catch {
          // ignore
        }
      }

      setCopied(true);
      showToast(`Senha "${wifiPass}" copiada! Conecte-se na rede ${wifiSSID}.`);

      if (openModalAfter) {
        setShowWifiModal(true);
      }

      setTimeout(() => setCopied(false), 4000);
    } catch {
      setCopied(true);
      setShowWifiModal(true);
      showToast(`Senha: ${wifiPass} (Selecione "${wifiSSID}")`);
    }
  };

  const openReviews = () => {
    window.location.href = 'https://search.google.com/local/reviews?placeid=ChIJ2cCOKZ6ZkJQRhQ7pqTl6xcc';
  };

  const openMaps = () => {
    const isApple = /iPhone|iPad|iPod/i.test(navigator.userAgent);
    const googleMapsUrl = 'https://maps.app.goo.gl/iGgJh7PN7FE4JvyS8';
    const appleMapsUrl = 'https://maps.apple.com/place?place-id=I8C3358EF33313C20';
    window.location.href = isApple ? appleMapsUrl : googleMapsUrl;
  };

  const openApp = (appUrl: string, webUrl: string) => {
    const start = Date.now();
    window.location.href = appUrl;
    setTimeout(() => {
      if (Date.now() - start < 800) {
        window.location.href = webUrl;
      }
    }, 500);
  };

  const tryDirectWifiConnect = () => {
    // Standard Wi-Fi URI scheme supported by barcode scanners and certain mobile profiles
    window.location.href = `WIFI:S:${wifiSSID};T:WPA;P:${wifiPass};;`;
  };

  const openDeviceWifiSettings = () => {
    const isAndroid = /Android/i.test(navigator.userAgent);
    if (isAndroid) {
      // Android intent to jump directly to Wi-Fi settings
      window.location.href = 'intent:#Intent;action=android.settings.WIFI_SETTINGS;end';
    } else {
      showToast('No iPhone: abra Ajustes > Wi-Fi e selecione a rede STARLINK CLIENTE');
    }
  };

  const downloadVCard = () => {
    const vcard = `BEGIN:VCARD
VERSION:3.0
FN:Gauchão Industrial
ORG:Gauchão Restaurante e Cozinha Industrial
TEL;TYPE=WORK,VOICE:+5567998500310
ADR;TYPE=WORK:;;Avenida Sobral, 310;Três Lagoas;MS;79630-660;Brazil
URL:https://gauchaoindustrial.com.br/
END:VCARD`;
    const blob = new Blob([vcard], { type: 'text/vcard;charset=utf-8' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.download = 'Gauchao_Industrial.vcf';
    link.href = url;
    link.click();
    showToast('Contato baixado com sucesso!');
  };

  const partners = [
    'https://gauchaoindustrial.com.br/wp-content/uploads/2025/07/image-12.fw_.png',
    'https://gauchaoindustrial.com.br/wp-content/uploads/2025/07/image-11.fw_.png',
    'https://gauchaoindustrial.com.br/wp-content/uploads/2024/05/image-13.png',
    'https://gauchaoindustrial.com.br/wp-content/uploads/2024/05/image-1-2.png',
    'https://gauchaoindustrial.com.br/wp-content/uploads/2024/05/image-2-2.png',
    'https://gauchaoindustrial.com.br/wp-content/uploads/2024/05/image-5-2.png',
    'https://gauchaoindustrial.com.br/wp-content/uploads/2024/05/image-4-2.png',
    'https://gauchaoindustrial.com.br/wp-content/uploads/2024/05/image-3-2.png',
    'https://gauchaoindustrial.com.br/wp-content/uploads/2024/05/image-6-2.png',
    'https://gauchaoindustrial.com.br/wp-content/uploads/2024/05/image-7-3.png',
    'https://gauchaoindustrial.com.br/wp-content/uploads/2024/05/image-9-3.png',
    'https://gauchaoindustrial.com.br/wp-content/uploads/2024/05/image-10-2.png',
    'https://gauchaoindustrial.com.br/wp-content/uploads/2024/05/parcetec-logo-2.png',
    'https://gauchaoindustrial.com.br/wp-content/uploads/2024/05/image-8-2.png',
  ];

  return (
    <div className="min-h-screen flex flex-col items-center justify-start px-4 py-5 select-none">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-5 z-50 max-w-[90vw] bg-black/95 text-white text-xs sm:text-sm font-semibold px-4 py-3 rounded-2xl shadow-2xl border border-[#ff007f]/50 flex items-center gap-3 backdrop-blur-md animate-fade-in">
          <i className="fas fa-check-circle text-emerald-400 text-base shrink-0"></i>
          <span>{toastMessage}</span>
        </div>
      )}

      <div className="w-full max-w-[420px] text-center flex flex-col">
        {/* HEADER COM LOGOTIPO INTELIGENTE */}
        <header className="my-5 mb-7">
          <div className="w-full max-w-[180px] mx-auto">
            <picture>
              <source
                srcSet="https://gauchaoindustrial.com.br/wp-content/uploads/2023/11/LOGO-BRANCA.png"
                media="(prefers-color-scheme: dark)"
              />
              <img
                src={
                  isDarkMode
                    ? 'https://gauchaoindustrial.com.br/wp-content/uploads/2023/11/LOGO-BRANCA.png'
                    : 'https://i.bj-share.info/5113cf48d47abe1abe1edc956fc96af2.png'
                }
                alt="Gauchão Industrial"
                className="w-full h-auto object-contain drop-shadow-sm"
              />
            </picture>
          </div>
        </header>

        <main className="flex flex-col">
          {/* Selo Google Reviews */}
          <button
            type="button"
            onClick={openReviews}
            className="w-full bg-[var(--card-bg)] p-[15px] rounded-[18px] mb-4 flex flex-col items-center border border-[var(--border)] shadow-[0_4px_12px_rgba(0,0,0,0.08)] cursor-pointer active:scale-95 transition-transform"
          >
            <div className="text-[var(--google-blue)] font-bold text-[0.75rem] flex items-center gap-1.5 uppercase tracking-wide">
              <i className="fab fa-google"></i> AVALIAÇÕES NO GOOGLE
            </div>
            <div className="text-[var(--accent-star)] text-[1.1rem] my-1 flex gap-0.5">
              <i className="fas fa-star"></i>
              <i className="fas fa-star"></i>
              <i className="fas fa-star"></i>
              <i className="fas fa-star"></i>
              <i className="fas fa-star"></i>
            </div>
            <div className="text-[0.75rem] text-[var(--text-sub)] font-semibold">
              Clique para deixar sua avaliação
            </div>
          </button>

          {/* Botão Site Oficial */}
          <a
            href="https://gauchaoindustrial.com.br/"
            className="bg-[var(--black)] text-[var(--white)] p-[18px] rounded-[18px] flex items-center justify-center font-bold mb-3 gap-2.5 border border-[var(--neon-pink)] shadow-[0_4px_15px_rgba(255,0,127,0.25)] active:scale-95 transition-transform text-decoration-none"
          >
            <i className="fas fa-globe text-base"></i> VISITE NOSSO SITE
          </a>

          {/* NOVO: BOTÃO CONECTAR AO WI-FI STARLINK CLIENTE */}
          <button
            type="button"
            onClick={() => copyWifiPassword(true)}
            className="w-full bg-gradient-to-r from-[#0369a1] via-[#0284c7] to-[#0ea5e9] text-white p-[17px] rounded-[18px] flex items-center justify-between font-bold mb-3.5 border border-[#38bdf8] shadow-[0_4px_16px_rgba(2,132,199,0.35)] active:scale-95 transition-all relative overflow-hidden group cursor-pointer text-left"
          >
            <div className="flex items-center gap-3.5 z-10">
              <div className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center shrink-0 border border-white/25">
                <i className="fas fa-wifi text-lg text-white wifi-pulse"></i>
              </div>
              <div className="flex flex-col">
                <span className="text-[0.72rem] uppercase tracking-wider text-sky-100 font-extrabold flex items-center gap-1.5">
                  <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                  WI-FI GRÁTIS DOS CLIENTES
                </span>
                <span className="text-[0.95rem] text-white font-black tracking-tight">
                  STARLINK CLIENTE
                </span>
              </div>
            </div>

            <div className="z-10 flex items-center gap-1.5 bg-black/25 px-2.5 py-1.5 rounded-lg border border-white/20 text-[0.75rem] font-medium text-white shrink-0">
              <i className="fas fa-copy text-xs text-sky-200"></i>
              <span>{copied ? 'Copiado!' : 'Copiar Senha'}</span>
            </div>

            {/* Subtle glow effect */}
            <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
          </button>

          {/* Grade Social */}
          <nav className="grid grid-cols-5 gap-2.5 mb-3.5">
            <a
              href="https://wa.me/5567998500310"
              className="bg-[var(--card-bg)] aspect-square rounded-[18px] flex items-center justify-center text-[1.6rem] border border-[var(--border)] shadow-[0_4px_10px_rgba(0,0,0,0.05)] active:scale-95 transition-transform"
              title="WhatsApp"
              target="_blank"
              rel="noreferrer"
            >
              <i className="fab fa-whatsapp" style={{ color: '#25D366' }}></i>
            </a>

            <button
              type="button"
              onClick={() =>
                openApp(
                  'instagram://user?username=gauchaochurrascaria',
                  'https://www.instagram.com/_u/gauchaochurrascaria/'
                )
              }
              className="bg-[var(--card-bg)] aspect-square rounded-[18px] flex items-center justify-center text-[1.6rem] border border-[var(--border)] shadow-[0_4px_10px_rgba(0,0,0,0.05)] active:scale-95 transition-transform cursor-pointer"
              title="Instagram"
            >
              <i className="fab fa-instagram" style={{ color: '#E1306C' }}></i>
            </button>

            <a
              href="https://www.facebook.com/gauchaoindustrial"
              target="_blank"
              rel="noreferrer"
              className="bg-[var(--card-bg)] aspect-square rounded-[18px] flex items-center justify-center text-[1.6rem] border border-[var(--border)] shadow-[0_4px_10px_rgba(0,0,0,0.05)] active:scale-95 transition-transform"
              title="Facebook"
            >
              <i className="fab fa-facebook" style={{ color: '#1877F2' }}></i>
            </a>

            <button
              type="button"
              onClick={() =>
                openApp(
                  'linkedin://company/gauchão-restaurante-e-cozinha-industrial',
                  'https://br.linkedin.com/company/gauch%C3%A3o-restaurante-e-cozinha-industrial'
                )
              }
              className="bg-[var(--card-bg)] aspect-square rounded-[18px] flex items-center justify-center text-[1.6rem] border border-[var(--border)] shadow-[0_4px_10px_rgba(0,0,0,0.05)] active:scale-95 transition-transform cursor-pointer"
              title="LinkedIn"
            >
              <i className="fab fa-linkedin" style={{ color: '#0077B5' }}></i>
            </button>

            <button
              type="button"
              onClick={openMaps}
              className="bg-[var(--card-bg)] aspect-square rounded-[18px] flex items-center justify-center text-[1.6rem] border border-[var(--border)] shadow-[0_4px_10px_rgba(0,0,0,0.05)] active:scale-95 transition-transform cursor-pointer"
              title="Ver no Mapa"
            >
              <i className="fas fa-map-marker-alt" style={{ color: '#EA4335' }}></i>
            </button>
          </nav>

          {/* Botão Salvar Contato na Agenda */}
          <button
            type="button"
            onClick={downloadVCard}
            className="w-full bg-[var(--save-contact-bg)] text-[var(--text-main)] p-4 rounded-[18px] flex items-center justify-center gap-2.5 font-bold border-2 border-[var(--black)] dark:border-[var(--border)] mb-6 text-[0.9rem] active:scale-95 transition-transform cursor-pointer"
          >
            <i className="fas fa-user-plus"></i> SALVAR CONTATO NA AGENDA
          </button>

          {/* Carrossel de Parceiros (Corrigido para Dark Mode) */}
          <section className="bg-[var(--partners-bg)] rounded-[22px] py-5 overflow-hidden border border-[var(--border)] shadow-[0_4px_10px_rgba(0,0,0,0.05)] transition-colors duration-300">
            <p className="text-[0.65rem] font-extrabold text-[#888888] dark:text-[#555555] uppercase tracking-wider mb-3.5">
              Parceiros que confiam em nós
            </p>
            <div className="slider-animated">
              {/* Duplicar 14 logos para efeito loop infinito */}
              {[...partners, ...partners].map((logoUrl, idx) => (
                <img
                  key={idx}
                  src={logoUrl}
                  alt={`Parceiro ${idx + 1}`}
                  loading="lazy"
                  className="w-[110px] h-[55px] object-contain mx-[15px] shrink-0 drop-shadow-[0_2px_4px_rgba(0,0,0,0.05)]"
                />
              ))}
            </div>
          </section>
        </main>

        <footer className="my-7 text-[0.7rem] text-[var(--text-sub)] font-medium flex flex-col gap-1">
          <div>&copy; {new Date().getFullYear()} Gauchão Restaurante e Cozinha Industrial</div>
          <div className="text-[0.65rem] opacity-75">
            Avenida Sobral, 310 • Três Lagoas - MS
          </div>
        </footer>
      </div>

      {/* MODAL DE CONEXÃO WI-FI (STARLINK CLIENTE) */}
      {showWifiModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in"
          onClick={() => setShowWifiModal(false)}
        >
          <div
            className="w-full max-w-[390px] bg-[var(--card-bg)] text-[var(--text-main)] rounded-[26px] p-6 shadow-2xl border border-[var(--border)] flex flex-col text-center relative overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Fechar Modal */}
            <button
              type="button"
              onClick={() => setShowWifiModal(false)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-black/5 dark:bg-white/10 text-[var(--text-sub)] hover:text-[var(--text-main)] flex items-center justify-center text-sm cursor-pointer transition-colors"
              aria-label="Fechar"
            >
              <i className="fas fa-times"></i>
            </button>

            {/* Ícone de Sucesso / Wi-Fi */}
            <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-sky-50 dark:bg-sky-950/60 border border-sky-200 dark:border-sky-800 flex items-center justify-center text-[#0284c7] text-2xl">
              <i className="fas fa-wifi wifi-pulse"></i>
            </div>

            <div className="inline-flex items-center justify-center gap-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 py-1 px-3 rounded-full mx-auto mb-2 border border-emerald-200 dark:border-emerald-800">
              <i className="fas fa-check-circle"></i>
              <span>Senha copiada para sua área de transferência!</span>
            </div>

            <h2 className="text-xl font-extrabold text-[var(--text-main)] mb-1">
              Conectar ao Wi-Fi
            </h2>
            <p className="text-xs text-[var(--text-sub)] mb-5">
              Use as credenciais abaixo para navegar gratuitamente em alta velocidade:
            </p>

            {/* Caixa de Credenciais */}
            <div className="bg-slate-50 dark:bg-[#121212] rounded-2xl p-4 border border-[var(--border)] mb-4 flex flex-col gap-3 text-left">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[0.68rem] uppercase font-bold text-[var(--text-sub)] tracking-wider block">
                    Nome da Rede (Wi-Fi)
                  </span>
                  <span className="text-[0.95rem] font-extrabold text-[var(--text-main)]">
                    {wifiSSID}
                  </span>
                </div>
                <span className="text-xs bg-sky-100 dark:bg-sky-900/60 text-[#0369a1] dark:text-sky-300 font-bold px-2.5 py-1 rounded-md">
                  Starlink
                </span>
              </div>

              <div className="border-t border-[var(--border)] pt-2.5 flex items-center justify-between">
                <div>
                  <span className="text-[0.68rem] uppercase font-bold text-[var(--text-sub)] tracking-wider block">
                    Senha da Rede
                  </span>
                  <span className="text-base font-mono font-bold text-[var(--text-main)] tracking-wider">
                    {wifiPass}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => copyWifiPassword(false)}
                  className="bg-black dark:bg-white text-white dark:text-black text-xs font-bold py-1.5 px-3 rounded-lg flex items-center gap-1.5 active:scale-95 transition-transform cursor-pointer"
                >
                  <i className="fas fa-copy"></i>
                  <span>Copiar</span>
                </button>
              </div>
            </div>

            {/* Instruções Rápidas */}
            <div className="text-left bg-blue-50/70 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900/40 rounded-xl p-3 mb-5 text-[0.78rem] text-[var(--text-main)] flex flex-col gap-1.5">
              <div className="font-bold flex items-center gap-1.5 text-[#0284c7]">
                <i className="fas fa-info-circle"></i>
                <span>Como se conectar:</span>
              </div>
              <ol className="list-decimal list-inside space-y-1 text-[var(--text-sub)] pl-1">
                <li>Abra as conexões de Wi-Fi do seu aparelho.</li>
                <li>
                  Selecione a rede <strong>{wifiSSID}</strong>.
                </li>
                <li>
                  Cole a senha <strong>{wifiPass}</strong> (já copiada!).
                </li>
              </ol>
            </div>

            {/* Ações Rápidas */}
            <div className="flex flex-col gap-2.5">
              {/* Abrir Ajustes de Wi-Fi */}
              <button
                type="button"
                onClick={openDeviceWifiSettings}
                className="w-full bg-[#0284c7] hover:bg-[#0369a1] text-white py-3 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 active:scale-95 transition-all cursor-pointer shadow-md"
              >
                <i className="fas fa-cog"></i>
                <span>Abrir Wi-Fi do Celular</span>
              </button>

              {/* Botão para alternar exibição do QR Code */}
              <button
                type="button"
                onClick={() => setShowQrCode(!showQrCode)}
                className="w-full bg-slate-100 dark:bg-neutral-800 hover:bg-slate-200 dark:hover:bg-neutral-700 text-[var(--text-main)] py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <i className="fas fa-qrcode"></i>
                <span>
                  {showQrCode ? 'Ocultar QR Code' : 'Ver QR Code para Conectar'}
                </span>
              </button>

              {/* Tentar conexão direta via link wifi: protocol */}
              <button
                type="button"
                onClick={tryDirectWifiConnect}
                className="text-[0.72rem] text-[var(--text-sub)] underline hover:text-[var(--text-main)] pt-1 cursor-pointer"
              >
                Tentar conexão automática direta
              </button>
            </div>

            {/* Seção QR Code Expansível */}
            {showQrCode && qrCodeUrl && (
              <div className="mt-4 pt-4 border-t border-[var(--border)] flex flex-col items-center animate-fade-in">
                <span className="text-[0.75rem] font-bold text-[var(--text-main)] mb-2">
                  Aponte a câmera para conectar automaticamente
                </span>
                <div className="p-3 bg-white rounded-2xl shadow-md border border-neutral-200 inline-block">
                  <img
                    src={qrCodeUrl}
                    alt="QR Code Wi-Fi STARLINK CLIENTE"
                    className="w-48 h-48 object-contain"
                  />
                </div>
                <span className="text-[0.65rem] text-[var(--text-sub)] mt-2">
                  Rede: {wifiSSID}
                </span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
