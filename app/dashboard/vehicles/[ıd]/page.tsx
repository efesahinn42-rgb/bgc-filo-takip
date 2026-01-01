import { PrismaClient } from "@prisma/client";
import { notFound } from "next/navigation";
import VehicleForm from "../new/form";

const prisma = new PrismaClient();

interface EditVehiclePageProps {
  // Params artık bir Promise
  params: Promise<{
    id: string;
  }>;
}

export default async function EditVehiclePage({
  params,
}: EditVehiclePageProps) {
  // 1. Önce params'ı await ile çözümlüyoruz (Next.js 15/16 kuralı)
  const { id } = await params;

  // 2. Çözülen id ile sorgu atıyoruz
  const vehicle = await prisma.vehicle.findUnique({
    where: { id: id },
  });

  const companies = await prisma.company.findMany({
    orderBy: { name: "asc" },
  });

  if (!vehicle) {
    notFound();
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold text-white mb-6">Aracı Düzenle</h1>
      <VehicleForm companies={companies} vehicle={vehicle} />
    </div>
  );
}
