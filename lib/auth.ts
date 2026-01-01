// lib/auth.ts
import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const secretKey = "gizli-anahtar-buraya-cok-gizli-olmali";
const key = new TextEncoder().encode(secretKey);

// Payload tipini tanımlayalım
type SessionPayload = {
  userId: string;
  role: string;
  expires: Date;
};

export async function encrypt(payload: any) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("24h")
    .sign(key);
}

export async function decrypt(input: string): Promise<any> {
  try {
    const { payload } = await jwtVerify(input, key, {
      algorithms: ["HS256"],
    });
    return payload;
  } catch (error) {
    return null;
  }
}

// BURASI GÜNCELLENDİ: Artık role bilgisini de alıyor
export async function createSession(payload: { userId: string; role: string }) {
  const expires = new Date(Date.now() + 24 * 60 * 60 * 1000);

  // Session içine rolü de şifreliyoruz
  const session = await encrypt({ ...payload, expires });

  (await cookies()).set("admin_session", session, {
    expires,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
  });
}

export async function getSession() {
  const session = (await cookies()).get("admin_session")?.value;
  if (!session) return null;
  return await decrypt(session);
}

export async function deleteSession() {
  (await cookies()).delete("admin_session");
}

// BURASI GÜNCELLENDİ: Rolü de döndürüyor
export async function verifySession() {
  const session = await getSession();

  if (!session || !session.userId) {
    redirect("/login");
  }

  return {
    isAuth: true,
    userId: session.userId as string,
    role: session.role as string, // Layout bu bilgiyi kullanarak menüyü açacak
  };
}
