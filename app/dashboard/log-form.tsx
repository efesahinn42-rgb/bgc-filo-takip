"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { put } from "@vercel/blob"; // Blob paketini ekledik

export async function createLogAction(prevState: any, formData: FormData) {
  const km = formData.get("km") as string;
  const vehicleId = formData.get("vehicleId") as string;
  const userId = formData.get("userId") as string;
  const photoFile = formData.get("photo") as File; // Formdan dosyayı alıyoruz

  if (!km || !vehicleId || !userId) {
    return { error: "Lütfen tüm zorunlu alanları doldurun." };
  }

  try {
    let photoUrl = "";

    // 1. Fotoğraf seçilmişse Vercel Blob'a yükle
    if (photoFile && photoFile.size > 0) {
      const blob = await put(`log-${Date.now()}-${photoFile.name}`, photoFile, {
        access: "public",
      });
      photoUrl = blob.url; // Veritabanına kaydedilecek URL (https://...)
    }

    // 2. Veritabanına (Neon) kaydı oluştur
    await prisma.log.create({
      data: {
        kmValue: parseInt(km),
        vehicleId: vehicleId,
        userId: userId,
        photoUrl: photoUrl, // Artık internetten erişilebilir link kaydediliyor
      },
    });

    // 3. İlgili sayfaları güncelle
    revalidatePath("/dashboard");
    revalidatePath("/dashboard/reports");

    return { success: "KM kaydı ve fotoğraf başarıyla kaydedildi!" };
  } catch (error) {
    console.error("Log oluşturma hatası:", error);
    return { error: "Kayıt sırasında teknik bir hata oluştu." };
  }
}
