// app/dashboard/vehicles/new/form.tsx
"use client";

import Link from "next/link";
import { useActionState } from "react";
import { createVehicleAction, updateVehicleAction } from "./actions";

// Typescript tipleri
type CompanyProp = {
  id: string;
  name: string;
};

// Düzenleme için gelecek araç verisinin tipi
type VehicleProp = {
  id: string;
  plate: string;
  model: string | null;
  companyId: string;
};

interface VehicleFormProps {
  companies: CompanyProp[];
  vehicle?: VehicleProp | null; // Opsiyonel (Sadece düzenlemede dolu gelir)
}

export default function VehicleForm({ companies, vehicle }: VehicleFormProps) {
  const isEditing = !!vehicle; // Araç verisi varsa düzenleme modudur

  // Eğer düzenleme modundaysak update aksiyonunu ID ile bağla (bind),
  // değilse create aksiyonunu kullan.
  const action = isEditing
    ? updateVehicleAction.bind(null, vehicle.id)
    : createVehicleAction;

  const [state, formAction, isPending] = useActionState(action, {
    error: "",
  });

  return (
    <form action={formAction} className="space-y-6">
      {state?.error && (
        <div className="p-3 bg-red-900/20 border border-red-500/50 rounded text-red-400 text-sm">
          {state.error}
        </div>
      )}

      {/* Plaka */}
      <div>
        <label className="block text-sm font-medium text-neutral-400 mb-1">
          Araç Plakası
        </label>
        <input
          type="text"
          name="plate"
          defaultValue={vehicle?.plate || ""}
          placeholder="34 BGC 100"
          required
          className="w-full bg-neutral-950 border border-neutral-700 text-white rounded-lg px-4 py-3 focus:ring-2 focus:ring-red-600 focus:border-transparent outline-none uppercase placeholder:normal-case"
        />
      </div>

      {/* Marka Model */}
      <div>
        <label className="block text-sm font-medium text-neutral-400 mb-1">
          Marka / Model
        </label>
        <input
          type="text"
          name="model"
          defaultValue={vehicle?.model || ""}
          placeholder="Renault Megane 1.5 dCi"
          className="w-full bg-neutral-950 border border-neutral-700 text-white rounded-lg px-4 py-3 focus:ring-2 focus:ring-red-600 focus:border-transparent outline-none"
        />
      </div>

      {/* Şirket Seçimi */}
      <div>
        <label className="block text-sm font-medium text-neutral-400 mb-1">
          Bağlı Olduğu Şirket
        </label>
        <select
          name="companyId"
          defaultValue={vehicle?.companyId || ""}
          required
          className="w-full bg-neutral-950 border border-neutral-700 text-white rounded-lg px-4 py-3 focus:ring-2 focus:ring-red-600 focus:border-transparent outline-none appearance-none"
        >
          <option value="">Şirket Seçiniz...</option>
          {companies.map((company) => (
            <option key={company.id} value={company.id}>
              {company.name}
            </option>
          ))}
        </select>
      </div>

      {/* Butonlar */}
      <div className="flex items-center justify-end gap-4 pt-4 border-t border-neutral-800">
        <Link
          href="/dashboard/vehicles"
          className="text-neutral-400 hover:text-white text-sm"
        >
          İptal
        </Link>
        <button
          type="submit"
          disabled={isPending}
          className="bg-red-700 hover:bg-red-600 text-white px-6 py-3 rounded-lg font-bold transition-colors disabled:opacity-50"
        >
          {isPending
            ? isEditing
              ? "Güncelleniyor..."
              : "Kaydediliyor..."
            : isEditing
            ? "Değişiklikleri Kaydet"
            : "Aracı Kaydet"}
        </button>
      </div>
    </form>
  );
}
