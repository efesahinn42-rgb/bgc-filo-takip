"use client";

import { useState } from "react";
import { createLogAction } from "./log-actions"; // Server Action
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

  // Dosya seçilince önizleme göster
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
    // userId'yi form verisine ekle (Input hidden yerine buradan da eklenebilir ama form içinde hidden var)

    // Server Action'ı çağır
    const result = await createLogAction(null, formData);

    if (result?.error) {
      alert(result.error);
    } else if (result?.success) {
      alert(result.success);
      // Formu temizle
      (e.target as HTMLFormElement).reset();
      setPreview(null);
    }

    setLoading(false);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh]">
      <div className="w-full max-w-md bg-[#111] border border-[#222] rounded-2xl p-8 shadow-2xl">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-white">KM Takip Girişi</h1>
          <p className="text-gray-400 text-sm mt-2">
            Lütfen işlem yapmak istediğiniz aracı seçin.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* GİZLİ USER ID */}
          <input type="hidden" name="userId" value={userId} />

          {/* ARAÇ SEÇİMİ */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-400">
              Araç Seçiniz
            </label>
            <select
              name="vehicleId"
              required
              className="w-full bg-[#1a1a1a] border border-[#333] rounded-lg p-3 text-white focus:border-red-600 focus:ring-1 focus:ring-red-600 outline-none transition-all appearance-none"
            >
              <option value="">Plaka Seçin...</option>
              {vehicles.map((v) => (
                <option key={v.id} value={v.id}>
                  {v.plate} {v.model ? `(${v.model})` : ""}
                </option>
              ))}
            </select>
          </div>

          {/* KM GİRİŞİ */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-400">
              Güncel Kilometre
            </label>
            <div className="relative">
              <input
                type="number"
                name="km"
                required
                placeholder="0"
                className="w-full bg-[#1a1a1a] border border-[#333] rounded-lg p-3 text-white focus:border-red-600 outline-none transition-all"
              />
              <span className="absolute right-4 top-3 text-gray-500 text-sm font-bold">
                KM
              </span>
            </div>
          </div>

          {/* FOTOĞRAF YÜKLEME */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-400">
              Kadran Fotoğrafı
            </label>
            <div className="relative border-2 border-dashed border-[#333] rounded-lg p-4 hover:border-gray-500 transition-colors bg-[#1a1a1a]/50">
              <input
                type="file"
                name="photo"
                accept="image/*"
                onChange={handleFileChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <div className="flex flex-col items-center justify-center text-center">
                {preview ? (
                  <div className="relative w-full h-32 rounded-lg overflow-hidden">
                    <Image
                      src={preview}
                      alt="Önizleme"
                      fill
                      className="object-cover"
                    />
                  </div>
                ) : (
                  <>
                    <span className="bg-red-900/20 text-red-500 px-3 py-1 rounded text-xs font-bold mb-2">
                      Dosya Seç
                    </span>
                    <span className="text-xs text-gray-500">
                      Opsiyonel: JPG, PNG formatında.
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* GÖNDER BUTONU */}
          <button
            disabled={loading}
            className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-4 rounded-lg transition-all transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Kaydediliyor..." : "Kaydı Gönder"}
          </button>
        </form>
      </div>
    </div>
  );
}
