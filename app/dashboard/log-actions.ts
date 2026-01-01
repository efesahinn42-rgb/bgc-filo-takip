// app/dashboard/log-actions.ts
"use server";

import { prisma } from "@/lib/prisma"; // DÜZELTME: Ortak bağlantıyı kullanıyoruz
import { revalidatePath } from "next/cache";
import { uploadImage } from "@/lib/upload-helper";

export async function createLogAction(prevState: any, formData: FormData) {
  // 1. Form verilerini al
  const vehicleId = formData.get("vehicleId") as string;
  const km = formData.get("km") as string;
  const userId = formData.get("userId") as string;
  const photoFile = formData.get("photo") as File;

  // 2. Temel Validasyonlar
  if (!vehicleId || !km) {
    return { error: "Lütfen araç seçin ve KM girin." };
  }

  // KM'yi sayıya çevir
  const kmValue = parseInt(km);
  if (isNaN(kmValue) || kmValue < 0) {
    return { error: "Geçerli bir kilometre değeri giriniz." };
  }

  try {
    // 3. Mantıksal Kontrol: Girilen KM, son KM'den düşük olamaz
    const lastLog = await prisma.log.findFirst({
      where: { vehicleId: vehicleId },
      orderBy: { createdAt: "desc" },
    });

    if (lastLog && kmValue <= lastLog.km) {
      return {
        error: `Hata: Girilen KM (${kmValue}), aracın son kilometresinden (${lastLog.km}) düşük olamaz!`,
      };
    }

    // 4. Fotoğraf Yükleme İşlemi (Varsa)
    let photoUrl = null;
    if (photoFile && photoFile.size > 0 && photoFile.name !== "undefined") {
      // uploadImage fonksiyonu lib/upload-helper.ts dosyasından gelir
      photoUrl = await uploadImage(photoFile);
    }

    // 5. Veritabanına Kayıt
    await prisma.log.create({
      data: {
        vehicleId: vehicleId,
        userId: userId, // Formdan gelen userId (hidden input)
        km: kmValue,
        photoUrl: photoUrl,
      },
    });

    // 6. Başarılı Dönüş
    revalidatePath("/dashboard");
    return { success: "Kayıt ve fotoğraf başarıyla eklendi! ✅" };
  } catch (error) {
    console.error("LOG ERROR:", error);
    return { error: "Kayıt sırasında teknik bir hata oluştu." };
  }
}
