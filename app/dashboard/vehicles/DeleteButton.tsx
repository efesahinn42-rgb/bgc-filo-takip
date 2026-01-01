"use client"; // Bu satır tarayıcı özelliklerini kullanmamızı sağlar

import { deleteVehicleAction } from "./new/actions";

export default function DeleteButton({ vehicleId }: { vehicleId: string }) {
  const handleDelete = async () => {
    // confirm() sadece client-side'da çalıştığı için burada güvenli
    if (confirm("Bu aracı silmek istediğinize emin misiniz?")) {
      await deleteVehicleAction(vehicleId);
    }
  };

  return (
    <button
      onClick={handleDelete}
      className="text-red-500 hover:text-red-400 transition-colors"
    >
      Sil
    </button>
  );
}
