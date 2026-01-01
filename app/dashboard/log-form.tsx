"use client";

import { useActionState } from "react";
import { createLogAction } from "./log-actions";

type VehicleProp = {
  id: string;
  plate: string;
  model: string | null;
};

export default function LogEntryForm({
  vehicles,
  userId,
}: {
  vehicles: VehicleProp[];
  userId: string;
}) {
  const [state, formAction, isPending] = useActionState<any, any>(
    createLogAction,
    {
      error: "",
      success: "",
    }
  );

  return (
    <form action={formAction} className="space-y-6">
      {/* Başarı Mesajı */}
      {state?.success && (
        <div className="p-4 bg-green-900/30 border border-green-500/50 rounded-lg text-green-400 text-center font-bold animate-pulse">
          {state.success}
        </div>
      )}

      {/* Hata Mesajı */}
      {state?.error && (
        <div className="p-4 bg-red-900/30 border border-red-500/50 rounded-lg text-red-400 text-center font-medium">
          {state.error}
        </div>
      )}

      <input type="hidden" name="userId" value={userId} />

      {/* Araç Seçimi */}
      <div>
        <label className="block text-sm font-medium text-neutral-400 mb-2">
          Araç Seçiniz
        </label>
        <select
          name="vehicleId"
          required
          className="w-full bg-black border border-neutral-700 text-white rounded-xl px-4 py-4 focus:ring-2 focus:ring-red-600 outline-none text-lg"
        >
          <option value="">Plaka Seçin...</option>
          {vehicles.map((v) => (
            <option key={v.id} value={v.id}>
              {v.plate} — {v.model}
            </option>
          ))}
        </select>
      </div>

      {/* KM Girişi */}
      <div>
        <label className="block text-sm font-medium text-neutral-400 mb-2">
          Güncel Kilometre
        </label>
        <div className="relative">
          <input
            type="number"
            name="km"
            placeholder="0"
            required
            className="w-full bg-black border border-neutral-700 text-white rounded-xl px-4 py-4 focus:ring-2 focus:ring-red-600 outline-none text-2xl font-mono tracking-wider pl-4"
          />
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-500 font-bold">
            KM
          </span>
        </div>
      </div>

      {/* Fotoğraf Yükleme Alanı */}
      <div>
        <label className="block text-sm font-medium text-neutral-400 mb-2">
          Kadran Fotoğrafı
        </label>
        <div className="relative border border-neutral-700 border-dashed rounded-xl p-4 hover:border-red-500 transition-colors bg-black/40">
          <input
            type="file"
            name="photo"
            accept="image/*"
            className="w-full text-sm text-neutral-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-red-900/20 file:text-red-400 hover:file:bg-red-900/40 cursor-pointer"
          />
          <p className="text-xs text-neutral-600 mt-2 text-center">
            Opsiyonel: JPG, PNG formatında yükleyebilirsiniz.
          </p>
        </div>
      </div>

      {/* Kaydet Butonu */}
      <button
        type="submit"
        disabled={isPending}
        className="w-full bg-red-700 hover:bg-red-600 text-white font-bold py-4 rounded-xl shadow-lg shadow-red-900/40 transition-all active:scale-[0.98] text-lg mt-4"
      >
        {isPending ? "Kaydediliyor..." : "Kaydı Gönder"}
      </button>
    </form>
  );
}
