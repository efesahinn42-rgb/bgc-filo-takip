//app/dashboard/user-view.tsx


"use client";

import { useState } from "react";
import { createLogAction } from "./log-actions";
import Image from "next/image";

interface Vehicle {
  id: string;
  plate: string;
  model?: string | null;
}

export default function UserView({
  vehicles,
  userId,
}: {
  vehicles: Vehicle[];
  userId: string;
}) {
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setPreview(url);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const result = await createLogAction(null, formData);

    if (result?.error) {
      alert(result.error);
    } else if (result?.success) {
      alert(result.success);
      (e.target as HTMLFormElement).reset();
      setPreview(null);
    }

    setLoading(false);
  };

  return (
    <div className="flex flex-col items-center p-4 md:justify-center min-h-[90vh]">
      <div className="w-full max-w-md bg-[#111] border border-[#222] rounded-[2rem] p-6 md:p-8 shadow-2xl">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-red-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-red-900/20">
            <svg
              className="w-8 h-8 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight">
            KM Takip Girişi
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Lütfen güncel verileri sisteme girin.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <input type="hidden" name="userId" value={userId} />

          {/* ARAÇ SEÇİMİ - Daha büyük dokunma alanı */}
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-1">
              Araç Seçiniz
            </label>
            <div className="relative">
              <select
                name="vehicleId"
                required
                className="w-full bg-[#1a1a1a] border border-[#222] rounded-2xl p-4 text-white focus:ring-2 focus:ring-red-600 outline-none transition-all appearance-none text-lg font-medium"
              >
                <option value="">Plaka Seçin...</option>
                {vehicles.map((v) => (
                  <option key={v.id} value={v.id}>
                    {v.plate} {v.model ? `— ${v.model}` : ""}
                  </option>
                ))}
              </select>
              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>
            </div>
          </div>

          {/* KM GİRİŞİ - Büyük rakamlar */}
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-1">
              Güncel Kilometre
            </label>
            <div className="relative">
              <input
                type="number"
                name="km"
                inputMode="numeric" // Mobilde direkt sayı klavyesini açar
                required
                placeholder="0"
                className="w-full bg-[#1a1a1a] border border-[#222] rounded-2xl p-4 text-white text-2xl font-mono focus:ring-2 focus:ring-red-600 outline-none transition-all pl-4"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 text-sm font-black">
                KM
              </span>
            </div>
          </div>

          {/* FOTOĞRAF YÜKLEME - Kamera Odaklı */}
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-1">
              Kadran Fotoğrafı
            </label>
            <div className="relative group">
              <input
                type="file"
                name="photo"
                accept="image/*"
                capture="environment" // Mobilde direkt arka kamerayı açar
                onChange={handleFileChange}
                className="absolute inset-0 w-full h-full opacity-0 z-20 cursor-pointer"
              />
              <div
                className={`
                relative border-2 border-dashed rounded-2xl p-8 transition-all flex flex-col items-center justify-center text-center overflow-hidden
                ${
                  preview
                    ? "border-red-600/50 bg-red-600/5"
                    : "border-[#333] bg-[#1a1a1a] hover:border-gray-500"
                }
              `}
              >
                {preview ? (
                  <div className="flex flex-col items-center">
                    <div className="relative w-24 h-24 rounded-xl overflow-hidden mb-2 border-2 border-red-600 shadow-xl">
                      <Image
                        src={preview}
                        alt="Önizleme"
                        fill
                        className="object-cover"
                      />
                    </div>
                    <span className="text-[10px] text-red-500 font-bold uppercase">
                      Fotoğraf Değiştir
                    </span>
                  </div>
                ) : (
                  <>
                    <div className="w-12 h-12 bg-neutral-800 rounded-full flex items-center justify-center mb-3">
                      <svg
                        className="w-6 h-6 text-neutral-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                    </div>
                    <span className="text-sm font-bold text-white mb-1">
                      Fotoğraf Çek veya Yükle
                    </span>
                    <span className="text-[10px] text-gray-500 uppercase tracking-tighter">
                      JPG, PNG (Opsiyonel)
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* GÖNDER BUTONU */}
          <button
            disabled={loading}
            className="w-full bg-red-600 hover:bg-red-700 text-white font-black py-5 rounded-2xl transition-all shadow-xl shadow-red-900/30 transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed text-lg uppercase tracking-widest"
          >
            {loading ? (
              <div className="flex items-center justify-center gap-2">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Kaydediliyor...</span>
              </div>
            ) : (
              "Kaydı Gönder"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
