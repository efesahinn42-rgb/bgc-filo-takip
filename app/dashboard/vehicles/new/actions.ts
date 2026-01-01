// app/dashboard/vehicles/new/actions.ts
"use server";

import { PrismaClient } from "@prisma/client";
import { redirect } from "next/navigation";
import { verifySession } from "@/lib/auth";
import { revalidatePath } from "next/cache";

const prisma = new PrismaClient();

// --- ARAÇ EKLEME (CREATE) ---
export async function createVehicleAction(prevState: any, formData: FormData) {
  const session = await verifySession();
  if (session?.role !== "ADMIN") return { error: "Yetkisiz işlem!" };

  const plate = formData.get("plate") as string;
  const model = formData.get("model") as string;
  const companyId = formData.get("companyId") as string;

  if (!plate || !companyId) {
    return { error: "Plaka ve Şirket seçimi zorunludur." };
  }

  try {
    // Plaka daha önce eklenmiş mi? (Boşlukları silip kontrol et)
    const existing = await prisma.vehicle.findUnique({
      where: { plate: plate.toUpperCase().replace(/\s/g, "") },
    });

    if (existing) {
      return { error: "Bu plaka zaten sistemde kayıtlı." };
    }

    await prisma.vehicle.create({
      data: {
        plate: plate.toUpperCase(),
        model: model,
        companyId: companyId,
      },
    });
  } catch (error) {
    console.error("Ekleme hatası:", error);
    return { error: "Araç eklenirken bir hata oluştu." };
  }

  // İşlem başarılıysa listeye yönlendir
  revalidatePath("/dashboard/vehicles");
  redirect("/dashboard/vehicles");
}

// --- ARAÇ GÜNCELLEME (UPDATE) ---
export async function updateVehicleAction(
  id: string,
  prevState: any,
  formData: FormData
) {
  const session = await verifySession();
  if (session?.role !== "ADMIN") return { error: "Yetkisiz işlem!" };

  const plate = formData.get("plate") as string;
  const model = formData.get("model") as string;
  const companyId = formData.get("companyId") as string;

  if (!plate || !companyId) {
    return { error: "Plaka ve Şirket seçimi zorunludur." };
  }

  try {
    // Güncellenen plaka başka bir araçta var mı? (Kendi ID'miz hariç)
    const formattedPlate = plate.toUpperCase().replace(/\s/g, "");

    const existing = await prisma.vehicle.findFirst({
      where: {
        plate: formattedPlate,
        NOT: {
          id: id, // Kendisi hariç ara
        },
      },
    });

    if (existing) {
      return { error: "Bu plaka başka bir araçta kayıtlı." };
    }

    await prisma.vehicle.update({
      where: { id },
      data: {
        plate: plate.toUpperCase(),
        model: model,
        companyId: companyId,
      },
    });
  } catch (error) {
    console.error("Güncelleme hatası:", error);
    return { error: "Araç güncellenirken bir hata oluştu." };
  }

  revalidatePath("/dashboard/vehicles");
  redirect("/dashboard/vehicles");
}

// --- ARAÇ SİLME (DELETE) ---
export async function deleteVehicleAction(id: string) {
  const session = await verifySession();
  if (session?.role !== "ADMIN") return { error: "Yetkisiz işlem!" };

  try {
    await prisma.vehicle.delete({
      where: { id },
    });

    // Listeyi yenile ki silinen araç hemen kaybolsun
    revalidatePath("/dashboard/vehicles");
    return { success: true };
  } catch (error) {
    console.error("Silme hatası:", error);
    return { error: "Araç silinirken bir hata oluştu." };
  }
}
