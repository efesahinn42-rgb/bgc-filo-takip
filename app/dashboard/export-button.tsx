// app/dashboard/export-button.tsx
"use client";

import * as XLSX from "xlsx";

export default function ExportButton({ data }: { data: any[] }) {
  const handleExport = () => {
    // 1. Veriyi Excel formatına uygun hale getirelim
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(workbook, worksheet, "Filo Raporu");

    // 2. Dosyayı indir
    XLSX.writeFile(
      workbook,
      `BGC_Filo_Rapor_${new Date().toLocaleDateString()}.xlsx`
    );
  };

  return (
    <button
      onClick={handleExport}
      className="bg-green-700 hover:bg-green-600 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors shadow-lg shadow-green-900/20"
    >
      {/* Excel İkonu */}
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
          d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
        />
      </svg>
      Excel'e Aktar
    </button>
  );
}
