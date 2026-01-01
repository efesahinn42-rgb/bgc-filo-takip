// app/dashboard/companies/new/page.tsx
"use client";

import Link from "next/link";
import { useActionState } from "react";
import { createCompanyAction } from "./actions";

const initialState = {
  error: "",
};

export default function NewCompanyPage() {
  const [state, formAction, isPending] = useActionState(
    createCompanyAction,
    initialState
  );

  return (
    <div className="max-w-2xl mx-auto">
      {/* Başlık */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">Yeni Şirket Tanımla</h1>
        <p className="text-neutral-400 mt-1">
          Sisteme yeni bir filo müşterisi ekleyin.
        </p>
      </div>

      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-8 shadow-xl">
        {/* Hata Mesajı */}
        {state?.error && (
          <div className="mb-6 p-4 bg-red-900/20 border border-red-900/50 rounded-lg flex items-center gap-3">
            <svg
              className="w-6 h-6 text-red-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <p className="text-red-400 text-sm font-medium">{state.error}</p>
          </div>
        )}

        <form action={formAction} className="space-y-8">
          {/* Bölüm 1: Şirket Bilgileri */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white border-b border-neutral-800 pb-2">
              Şirket Bilgileri
            </h3>

            <div>
              <label className="block text-sm font-medium text-neutral-400 mb-1">
                Şirket Ticari Ünvanı
              </label>
              <input
                type="text"
                name="companyName"
                placeholder="Örn: ABC Lojistik A.Ş."
                required
                className="w-full bg-neutral-950 border border-neutral-700 text-white rounded-lg px-4 py-3 focus:ring-2 focus:ring-red-600 focus:border-transparent outline-none transition-all placeholder:text-neutral-600"
              />
            </div>
          </div>

          {/* Bölüm 2: Giriş Bilgileri */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white border-b border-neutral-800 pb-2">
              Yetkili Giriş Bilgileri
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-neutral-400 mb-1">
                  Kullanıcı Adı
                </label>
                <input
                  type="text"
                  name="username"
                  placeholder="örn: abclojistik"
                  required
                  autoComplete="off"
                  className="w-full bg-neutral-950 border border-neutral-700 text-white rounded-lg px-4 py-3 focus:ring-2 focus:ring-red-600 focus:border-transparent outline-none transition-all placeholder:text-neutral-600"
                />
                <p className="text-xs text-neutral-500 mt-1">
                  Şirket bu isimle giriş yapacak.
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-400 mb-1">
                  Şifre
                </label>
                <input
                  type="text" // Kullanıcı şifreyi görerek yazsın diye text yaptık (admin panelindeyiz)
                  name="password"
                  placeholder="Güçlü bir şifre belirleyin"
                  required
                  autoComplete="off"
                  className="w-full bg-neutral-950 border border-neutral-700 text-white rounded-lg px-4 py-3 focus:ring-2 focus:ring-red-600 focus:border-transparent outline-none transition-all placeholder:text-neutral-600"
                />
              </div>
            </div>
          </div>

          {/* Butonlar */}
          <div className="flex items-center justify-end gap-4 pt-4 border-t border-neutral-800">
            <Link
              href="/dashboard/companies"
              className="text-neutral-400 hover:text-white text-sm font-medium transition-colors"
            >
              İptal
            </Link>

            <button
              type="submit"
              disabled={isPending}
              className={`px-6 py-3 rounded-lg font-bold text-white transition-all shadow-lg
                ${
                  isPending
                    ? "bg-neutral-700 cursor-not-allowed text-neutral-400"
                    : "bg-red-700 hover:bg-red-600 shadow-red-900/30"
                }`}
            >
              {isPending ? "Kaydediliyor..." : "Şirketi ve Kullanıcıyı Oluştur"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
