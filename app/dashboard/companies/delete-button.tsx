"use client"; // Bu satır çok önemli, tarayıcıda çalışacağını belirtir

import { deleteCompanyAction } from "@/app/dashboard/actions";
import { useState } from "react";

export default function DeleteCompanyButton({ id }: { id: string }) {
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    if (
      confirm(
        "Bu şirketi ve bağlı tüm araç/personelleri silmek istediğinize emin misiniz?"
      )
    ) {
      setLoading(true);
      await deleteCompanyAction(id);
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleDelete}
      disabled={loading}
      className="text-red-500 hover:text-red-700 text-sm font-medium ml-4 disabled:opacity-50"
    >
      {loading ? "Siliniyor..." : "Sil"}
    </button>
  );
}
