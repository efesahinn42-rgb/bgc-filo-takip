// prisma/seed.ts
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs"; // Şifreleme kütüphanesini ekledik

const prisma = new PrismaClient();

async function main() {
  // "admin123" şifresini hash'le (şifreli hale getir)
  const hashedPassword = await bcrypt.hash("admin123", 10);

  const admin = await prisma.user.upsert({
    where: { username: "admin" },
    update: {
      password: hashedPassword, // Mevcutsa şifreyi güncelle
      role: "ADMIN", // Rolün admin olduğundan emin ol
    },
    create: {
      username: "admin",
      password: hashedPassword, // Şifreli halini kaydet
      role: "ADMIN",
      fullName: "Sistem Yöneticisi",
      // Eğer companyId zorunlu değilse kaldırabilirsin, zorunluysa bir company ID ekle
    },
  });

  console.log("Admin kullanıcısı şifrelenerek oluşturuldu:", admin);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
