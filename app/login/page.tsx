// app/login/page.tsx
"use client";

import Link from "next/link";
import { useActionState } from "react"; // <-- GÜNCELLEME BURADA: react-dom yerine react, useFormState yerine useActionState
import { loginAction } from "./actions";

const initialState = {
  error: "",
};

export default function LoginPage() {
  // GÜNCELLEME: useActionState artık 3 değer döndürüyor:
  // 1. state: Sunucudan dönen cevap (hata mesajı vs.)
  // 2. formAction: Formu tetikleyen fonksiyon
  // 3. isPending: İşlem o an devam ediyor mu? (True/False) -> Bunu butonda kullanacağız!
  const [state, formAction, isPending] = useActionState(
    loginAction,
    initialState
  );

  return (
    <div className="flex min-h-screen items-center justify-center bg-neutral-950 p-4 relative overflow-hidden">
      {/* Arka Plan Efektleri */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-red-900/10 blur-[100px] rounded-full pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-neutral-800/20 blur-[100px] rounded-full pointer-events-none"></div>

      <div className="w-full max-w-md bg-neutral-900/50 backdrop-blur-md border border-neutral-800 rounded-2xl shadow-2xl p-8 z-10">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-xl bg-gradient-to-br from-red-700 to-red-900 shadow-lg shadow-red-900/40 mb-4">
            <span className="text-white font-bold text-xl">BGC</span>
          </div>
          <h2 className="text-2xl font-bold text-white tracking-tight">
            Panele Giriş Yap
          </h2>
        </div>

        {/* Hata Mesajı Kutusu */}
        {state?.error && (
          <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-500 text-sm text-center font-medium animate-pulse">
            {state.error}
          </div>
        )}

        <form action={formAction} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-neutral-300 mb-2">
              Kullanıcı Adı
            </label>
            <input
              type="text"
              name="username"
              required
              className="w-full bg-neutral-950 border border-neutral-800 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-300 mb-2">
              Şifre
            </label>
            <input
              type="password"
              name="password"
              required
              className="w-full bg-neutral-950 border border-neutral-800 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent transition-all"
            />
          </div>

          <button
            type="submit"
            disabled={isPending} // İşlem sürerken butonu kilitle
            className={`w-full font-bold py-3 px-4 rounded-lg shadow-lg transition-all active:scale-[0.98] flex justify-center items-center
              ${
                isPending
                  ? "bg-neutral-800 text-neutral-500 cursor-not-allowed"
                  : "bg-gradient-to-r from-red-700 to-red-900 hover:from-red-600 hover:to-red-800 text-white shadow-red-900/30"
              }`}
          >
            {isPending ? (
              // Yükleniyor animasyonu (Spinner)
              <svg
                className="animate-spin h-5 w-5 mr-2 text-current"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
            ) : (
              "Giriş Yap"
            )}
          </button>
        </form>

        <div className="mt-8 text-center">
          <Link
            href="/"
            className="text-sm text-neutral-500 hover:text-white transition-colors"
          >
            ← Anasayfaya Dön
          </Link>
        </div>
      </div>
    </div>
  );
}
