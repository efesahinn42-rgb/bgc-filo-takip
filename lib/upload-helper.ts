import { writeFile } from "fs/promises";
import { join } from "path";

export async function uploadImage(file: File): Promise<string | null> {
  if (!file) return null;

  try {
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Dosya adını benzersiz yap (Zaman damgası ekle)
    const filename = `${Date.now()}-${file.name.replaceAll(" ", "_")}`;

    // Kaydedilecek yol (public/uploads klasörü)
    const path = join(process.cwd(), "public/uploads", filename);

    // Dosyayı diske yaz
    await writeFile(path, buffer);

    // Veritabanına kaydedilecek URL'i döndür
    return `/uploads/${filename}`;
  } catch (error) {
    console.error("Dosya yükleme hatası:", error);
    return null;
  }
}
