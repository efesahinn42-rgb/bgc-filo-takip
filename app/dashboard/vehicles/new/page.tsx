// app/dashboard/vehicles/new/page.tsx
import { PrismaClient } from "@prisma/client";
import VehicleForm from "./form"; // Formu ayrı bileşene ayırıyoruz (Client Component için)

const prisma = new PrismaClient();

// Bu sayfa Server Component'tir. Verileri çeker ve Client Component'e (Forma) gönderir.
export default async function NewVehiclePage() {
  // Sadece aktif şirketleri getir ki pasif olanlara araç eklemeyelim
  const companies = await prisma.company.findMany({
    where: { isActive: true },
    orderBy: { name: "asc" },
  });

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">Araca Plaka Tanımla</h1>
        <p className="text-neutral-400 mt-1">Araçları ilgili şirkete atayın.</p>
      </div>

      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-8 shadow-xl">
        {/* Formu aşağıda oluşturacağımız dosyadan çağırıyoruz */}
        <VehicleForm companies={companies} />
      </div>
    </div>
  );
}
