import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

// .env dosyasındaki anahtarı kullan, yoksa yedek bir anahtar ata
const secretKey =
  process.env.NEXTAUTH_SECRET || "bgc_filo_varsayilan_gizli_anahtar_2026";
const key = new TextEncoder().encode(secretKey);

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
    console.error("JWT Decrypt Hatası:", error);
    return null;
  }
}

export async function createSession(payload: { userId: string; role: string }) {
  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 saat
  const session = await encrypt({ ...payload, expiresAt });

  const cookieStore = await cookies();
  cookieStore.set("admin_session", session, {
    expires: expiresAt,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
  });
}

export async function getSession() {
  const cookieStore = await cookies();
  const session = cookieStore.get("admin_session")?.value;
  if (!session) return null;
  return await decrypt(session);
}

export async function deleteSession() {
  const cookieStore = await cookies();
  cookieStore.delete("admin_session");
}

export async function verifySession() {
  const session = await getSession();

  if (!session || !session.userId) {
    redirect("/login");
  }

  return {
    isAuth: true,
    userId: session.userId as string,
    role: session.role as string,
  };
}
