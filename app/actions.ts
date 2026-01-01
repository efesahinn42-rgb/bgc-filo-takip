"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

// --- ŞİRKET SİLME İŞLEMİ ---
export async function deleteCompanyAction(companyId: string) {
  try {
    // İlişkisel veritabanı olduğu için önce alt verileri silmeliyiz

    // 1. Şirkete ait tüm Logları sil (Araçlar üzerinden dolaylı bağlantı olabilir ama User üzerinden de var)
    // Log modelinde userId var, o yüzden önce kullanıcıları silmeden logları temizlemeliyiz.
    // Ancak Log silmek karmaşık olabilir, şimdilik basitçe şirkete bağlı User ve Vehicle kayıtlarını silelim.
    // Eğer Prisma'da "onDelete: Cascade" ayarlı değilse manuel silmeliyiz:

    // Şirkete ait kullanıcıları bul
    const users = await prisma.user.findMany({ where: { companyId } });
    const userIds = users.map((u) => u.id);

    // Şirkete ait araçları bul
    const vehicles = await prisma.vehicle.findMany({ where: { companyId } });
    const vehicleIds = vehicles.map((v) => v.id);

    // İlgili Logları sil (Kullanıcı veya araç bazlı)
    await prisma.log.deleteMany({
      where: {
        OR: [{ userId: { in: userIds } }, { vehicleId: { in: vehicleIds } }],
      },
    });

    // Araçları sil
    await prisma.vehicle.deleteMany({ where: { companyId } });

    // Kullanıcıları sil
    await prisma.user.deleteMany({ where: { companyId } });

    // En son Şirketi sil
    await prisma.company.delete({ where: { id: companyId } });

    // Sayfayı yenile
    revalidatePath("/dashboard/companies");
    return { success: true };
  } catch (error) {
    console.error("Şirket silme hatası:", error);
    return { success: false, error: "Silme işlemi başarısız" };
  }
}

// --- ARAÇ SİLME İŞLEMİ ---
export async function deleteVehicleAction(vehicleId: string) {
  try {
    // Önce araca ait logları sil
    await prisma.log.deleteMany({ where: { vehicleId } });

    // Sonra aracı sil
    await prisma.vehicle.delete({ where: { id: vehicleId } });

    revalidatePath("/dashboard/vehicles");
    return { success: true };
  } catch (error) {
    console.error("Araç silme hatası:", error);
    return { success: false, error: "Araç silinemedi" };
  }
}
