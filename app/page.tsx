import Image from "next/image";
import Link from "next/link";

// Bu sayfa projenin kök dizinidir (/).
// Next.js'de 'page.tsx' dosyaları birer rotadır (route).

export default function Home() {
  return (
    // ANA KAPLAYICI (MAIN CONTAINER)
    // bg-neutral-950: Siyaha çok yakın koyu bir arka plan.
    // text-white: Yazılar varsayılan olarak beyaz.
    <main className="flex min-h-screen flex-col items-center justify-center bg-neutral-950 text-white p-4 relative overflow-hidden">
      {/* Arka plana hafif bir kırmızı ambiyans ışığı ekleyelim */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-red-900/20 blur-[120px] rounded-full pointer-events-none z-0"></div>

      {/* İÇERİK KUTUSU (Z-index ile ambiyansın önüne alıyoruz) */}
      <div className="z-10 flex flex-col items-center">
        {/* Şirket Logosu Alanı (Placeholder) */}
        <div className="mb-10 relative">
          {/* Logo buraya gelecek. Şimdilik yer tutucu: */}
          <div className="w-36 h-36 bg-neutral-900/80 rounded-2xl flex items-center justify-center border border-red-900/50 shadow-[0_0_30px_-5px_rgba(220,38,38,0.3)] backdrop-blur-sm">
            {/* Logoyu attığında burayı <Image ... /> ile değiştireceğiz */}
            <span className="text-red-500 font-bold text-xl tracking-widest">
              BGC
            </span>
          </div>
        </div>

        {/* Başlık ve Karşılama Metinleri */}
        <div className="text-center max-w-2xl px-4">
          <h1 className="text-4xl md:text-5xl font-black mb-6 tracking-tight leading-tight">
            BGC Filo <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-red-800">
              Araç Yönetim Sistemi
            </span>
          </h1>

          <p className="text-neutral-400 mb-10 text-lg md:text-xl font-light leading-relaxed">
            Kurumsal filo takibi, anlık km kontrolü ve dijital raporlama
            platformuna hoş geldiniz.
          </p>

          {/* Giriş Butonu */}
          {/* Link componenti, sayfayı yenilemeden (SPA mantığıyla) /login sayfasına yönlendirir. */}
          <Link
            href="/login"
            className="group relative inline-flex items-center justify-center overflow-hidden rounded-lg bg-gradient-to-r from-red-700 to-red-900 p-0.5 font-bold text-white shadow-2xl shadow-red-900/30 transition-all hover:scale-[1.02] hover:shadow-red-700/50 focus:outline-none"
          >
            {/* Butonun içindeki asıl tıklanabilir alan ve gradyan efekti */}
            <span className="relative flex items-center gap-2 rounded-md bg-neutral-950/50 px-10 py-4 transition-all duration-300 group-hover:bg-opacity-0">
              Sisteme Giriş Yap
              {/* Sağa ok ikonu (Heroicons tarzı basit bir SVG) */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2.5}
                stroke="currentColor"
                className="w-5 h-5 transition-transform group-hover:translate-x-1"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
                />
              </svg>
            </span>
          </Link>
        </div>
      </div>

      {/* Alt Bilgi */}
      <footer className="absolute bottom-6 text-neutral-600 text-sm font-medium">
        © 2024 BGC Filo - Tüm hakları saklıdır.
      </footer>
    </main>
  );
}
