//app/dashboard/actions.ts

"use server";

import { prisma } from "@/lib/prisma"; // Ortak prisma client
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

// --- ÇIKIŞ YAPMA İŞLEMİ (LOGOUT) ---
export async function logoutAction() {
  try {
    // Oturum çerezini sil
    const cookieStore = await cookies();
    cookieStore.delete("admin_session");
  } catch (error) {
    console.error("Logout hatası:", error);
  } finally {
    // Her durumda login sayfasına yönlendir
    redirect("/login");
  }
}

// --- ŞİRKET SİLME İŞLEMİ ---
export async function deleteCompanyAction(companyId: string) {
  if (!companyId) return { success: false, error: "Şirket ID bulunamadı." };

  try {
    // 1. Bu şirkete bağlı kullanıcıların ID'lerini bul
    const users = await prisma.user.findMany({
      where: { companyId },
      select: { id: true },
    });
    const userIds = users.map((u) => u.id);

    // 2. Bu şirkete bağlı araçların ID'lerini bul
    const vehicles = await prisma.vehicle.findMany({
      where: { companyId },
      select: { id: true },
    });
    const vehicleIds = vehicles.map((v) => v.id);

    // 3. İlgili Logları (Kayıtları) Sil
    // Hem kullanıcıların hem de araçların oluşturduğu tüm logları temizle
    await prisma.log.deleteMany({
      where: {
        OR: [{ userId: { in: userIds } }, { vehicleId: { in: vehicleIds } }],
      },
    });

    // 4. Araçları Sil
    await prisma.vehicle.deleteMany({
      where: { companyId },
    });

    // 5. Kullanıcıları Sil
    await prisma.user.deleteMany({
      where: { companyId },
    });

    // 6. En Son Şirketi Sil
    await prisma.company.delete({
      where: { id: companyId },
    });

    // Listeyi güncelle
    revalidatePath("/dashboard/companies");
    return { success: true };
  } catch (error) {
    console.error("Şirket silme hatası:", error);
    return {
      success: false,
      error: "Silme işlemi sırasında teknik bir hata oluştu.",
    };
  }
}

// --- ARAÇ SİLME İŞLEMİ ---
export async function deleteVehicleAction(vehicleId: string) {
  if (!vehicleId) return { success: false, error: "Araç ID bulunamadı." };

  try {
    // 1. Araca ait logları sil
    await prisma.log.deleteMany({
      where: { vehicleId },
    });

    // 2. Aracı sil
    await prisma.vehicle.delete({
      where: { id: vehicleId },
    });

    // Listeyi güncelle
    revalidatePath("/dashboard/vehicles");
    return { success: true };
  } catch (error) {
    console.error("Araç silme hatası:", error);
    return { success: false, error: "Araç silinemedi." };
  }
}
