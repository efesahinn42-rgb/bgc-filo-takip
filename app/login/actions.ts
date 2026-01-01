// app/login/actions.ts
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

  try {
    const user = await prisma.user.findUnique({
      where: { username: username },
    });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return { error: "Kullanıcı adı veya şifre hatalı!" };
    }

    // DÜZELTME BURADA:
    // createSession artık bir obje bekliyor ve ROLE bilgisini gönderiyoruz.
    await createSession({
      userId: user.id,
      role: user.role, // Admin ise menüler açılacak
    });
  } catch (error) {
    console.error("GİRİŞ HATASI:", error);
    return { error: "Teknik bir hata oluştu." };
  }

  redirect("/dashboard");
}
