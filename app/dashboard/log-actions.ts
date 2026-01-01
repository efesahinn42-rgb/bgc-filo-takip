"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { put } from "@vercel/blob"; // Vercel Blob paketini ekledik

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

    // 4. Fotoğraf Yükleme İşlemi (Vercel Blob)
    let photoUrl = null;

    // Eğer bir dosya seçildiyse ve boyutu 0'dan büyükse
    if (photoFile && photoFile.size > 0 && photoFile.name !== "undefined") {
      // Benzersiz bir dosya adı oluşturuyoruz
      const fileName = `km-log-${vehicleId}-${Date.now()}-${photoFile.name}`;

      // Vercel Blob'a yükleme yapıyoruz
      const blob = await put(fileName, photoFile, {
        access: "public",
      });

      photoUrl = blob.url; // Artık veritabanına "https://..." şeklinde internet linki kaydolacak
    }

    // 5. Veritabanına Kayıt
    await prisma.log.create({
      data: {
        vehicleId: vehicleId,
        userId: userId,
        km: kmValue,
        photoUrl: photoUrl,
      },
    });

    // 6. Başarılı Dönüş
    revalidatePath("/dashboard");
    revalidatePath("/dashboard/reports"); // Raporlar sayfasını da yenilemesini söyledik

    return { success: "Kayıt ve fotoğraf başarıyla eklendi! ✅" };
  } catch (error) {
    console.error("LOG ERROR:", error);
    return { error: "Kayıt sırasında teknik bir hata oluştu." };
  }
}
