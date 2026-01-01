import Link from "next/link";
import { prisma } from "@/lib/prisma"; // Merkezi prisma dosyasını kullanıyoruz
import DeleteButton from "./DeleteButton"; // Yeni buton bileşeni

export const dynamic = "force-dynamic"; // Verilerin her zaman güncel kalmasını sağlar

export default async function VehiclesPage() {
  const vehicles = await prisma.vehicle.findMany({
    include: {
      company: true,
    },
    orderBy: {
      id: "desc",
    },
  });

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-white">Araç Listesi</h1>
        <Link
          href="/dashboard/vehicles/new"
          className="bg-red-700 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors"
        >
          + Yeni Araç
        </Link>
      </div>

      <div className="bg-neutral-900 border border-neutral-800 rounded-lg overflow-hidden">
        <table className="w-full text-left text-sm text-neutral-400">
          <thead className="bg-neutral-950 text-neutral-200 uppercase font-medium">
            <tr>
              <th className="px-6 py-4">Plaka</th>
              <th className="px-6 py-4">Marka / Model</th>
              <th className="px-6 py-4">Şirket</th>
              <th className="px-6 py-4 text-right">İşlemler</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-800">
            {vehicles.map((vehicle) => (
              <tr
                key={vehicle.id}
                className="hover:bg-neutral-800/50 transition-colors"
              >
                <td className="px-6 py-4 font-medium text-white">
                  {vehicle.plate}
                </td>
                <td className="px-6 py-4">{vehicle.model || "-"}</td>
                <td className="px-6 py-4">
                  {vehicle.company?.name || "Bilinmiyor"}
                </td>
                <td className="px-6 py-4 text-right flex justify-end gap-3 items-center">
                  <Link
                    href={`/dashboard/vehicles/${vehicle.id}`}
                    className="text-yellow-500 hover:text-yellow-400 transition-colors"
                  >
                    Düzenle
                  </Link>

                  {/* Silme işlemini yapan Client Component */}
                  <DeleteButton vehicleId={vehicle.id} />
                </td>
              </tr>
            ))}
            {vehicles.length === 0 && (
              <tr>
                <td
                  colSpan={4}
                  className="px-6 py-8 text-center text-neutral-500"
                >
                  Henüz kayıtlı araç bulunmuyor.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
