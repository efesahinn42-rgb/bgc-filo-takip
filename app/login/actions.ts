"use server";

import { prisma } from "@/lib/prisma";
import { createSession } from "@/lib/auth";
import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";

export async function loginAction(prevState: any, formData: FormData) {
  const username = formData.get("username") as string;
  const password = formData.get("password") as string;

  if (!username || !password) {
    return { error: "Lütfen tüm alanları doldurun." };
  }

  let isSuccess = false;

  try {
    const user = await prisma.user.findUnique({
      where: { username: username },
    });

    // Şifre kontrolü
    if (!user || password !== user.password) {
      return { error: "Kullanıcı adı veya şifre hatalı!" };
    }

    // Session oluşturma
    await createSession({
      userId: user.id,
      role: user.role,
    });

    isSuccess = true;
  } catch (error) {
    console.error("GİRİŞ HATASI:", error);
    return { error: "Teknik bir hata oluştu veya bilgiler uyuşmuyor." };
  }

  // KRİTİK DÜZELTME: Redirect her zaman try/catch bloğunun DIŞINDA olmalıdır.
  if (isSuccess) {
    redirect("/dashboard");
  }
}
