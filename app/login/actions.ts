"use server";

import { prisma } from "@/lib/prisma";
import { createSession } from "@/lib/auth";
import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";

export async function loginAction(prevState: any, formData: FormData) {
  const username = formData.get("username") as string;
  const password = formData.get("password") as string;

  // 1. Girdi Kontrolü
  if (!username || !password) {
    return { error: "Lütfen tüm alanları doldurun." };
  }

  let isSuccess = false;

  console.log("Giriş denemesi:", username);

  const user = await prisma.user.findUnique({
    where: { username: username },
  });

  console.log("DB'den gelen kullanıcı:", user ? "Bulundu" : "BULUNAMADI");
  if (user) {
    console.log("DB'deki Hash:", user.password);
    console.log("Girilen Şifre:", password);

    const isMatch = await bcrypt.compare(password, user.password);
    console.log("Şifre Eşleşti mi?:", isMatch);
  }

  try {
    // 2. Kullanıcıyı Veritabanında Bul
    const user = await prisma.user.findUnique({
      where: { username: username },
    });

    // 3. Kullanıcı Var mı ve Şifre Doğru mu (Bcrypt Karşılaştırması)
    // Şifreli şifre ile girilen düz şifreyi bcrypt.compare ile kontrol ediyoruz
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return { error: "Kullanıcı adı veya şifre hatalı!" };
    }

    // 4. Session (Oturum) Oluşturma
    await createSession({
      userId: user.id,
      role: user.role,
    });

    isSuccess = true;
  } catch (error) {
    // Next.js redirect hatasını catch bloğundan muaf tutmak için (Kritik)
    if (error instanceof Error && error.message.includes("NEXT_REDIRECT")) {
      throw error;
    }

    console.error("GİRİŞ HATASI:", error);
    return { error: "Teknik bir hata oluştu veya bilgiler uyuşmuyor." };
  }

  // 5. Yönlendirme (Try-Catch dışında güvenli yönlendirme)
  if (isSuccess) {
    redirect("/dashboard");
  }
}
