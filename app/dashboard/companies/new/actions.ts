// app/dashboard/companies/new/actions.ts
"use server";

import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";
import { verifySession } from "@/lib/auth";

const prisma = new PrismaClient();

// prevState: React'in useActionState hook'undan gelen önceki durum
export async function createCompanyAction(prevState: any, formData: FormData) {
  // 1. Güvenlik Kontrolü (Sadece Admin işlem yapabilir)
  const session = await verifySession();
  if (session?.role !== "ADMIN") {
    return { error: "Yetkisiz işlem girişimi!" };
  }

  // 2. Form Verilerini Al
  const companyName = formData.get("companyName") as string;
  const username = formData.get("username") as string;
  const password = formData.get("password") as string;

  // 3. Basit Doğrulama
  if (!companyName || !username || !password) {
    return { error: "Lütfen tüm alanları doldurun." };
  }

  if (password.length < 6) {
    return { error: "Şifre en az 6 karakter olmalıdır." };
  }

  try {
    // 4. TRANSACTION BAŞLIYOR!
    // prisma.$transaction: İçindeki işlemlerden biri bile hata verirse hepsini geri alır.
    await prisma.$transaction(async (tx) => {
      // A) Önce Kullanıcı Adı Müsait mi Bakalım?
      const existingUser = await tx.user.findUnique({
        where: { username: username },
      });

      if (existingUser) {
        throw new Error("Bu kullanıcı adı zaten kullanılıyor.");
      }

      // B) Şirketi Oluştur
      const newCompany = await tx.company.create({
        data: {
          name: companyName,
          isActive: true,
        },
      });

      // C) Şifreyi Hash'le
      const hashedPassword = await bcrypt.hash(password, 10);

      // D) Şirkete Bağlı Yönetici Kullanıcısını Oluştur
      await tx.user.create({
        data: {
          username: username,
          password: hashedPassword,
          fullName: `${companyName} Yetkilisi`,
          role: "USER", // Şirket yetkilisi standart kullanıcıdır
          companyId: newCompany.id, // İşte ilişkiyi kurduğumuz yer!
        },
      });
    }); // Transaction Bitişi
  } catch (error: any) {
    console.error("Şirket Oluşturma Hatası:", error);
    // Hata mesajını kullanıcıya gösterelim
    // Eğer transaction içinde "throw new Error" yaptıysak o mesajı yakalarız
    return { error: error.message || "Bir hata oluştu." };
  }

  // 5. Başarılıysa Listeye Geri Dön
  redirect("/dashboard/companies");
}
