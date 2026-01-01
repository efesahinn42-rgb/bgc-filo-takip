import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

// --- YENİ KAYIT OLUŞTURMA (POST) ---
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      name,
      type,
      tckn,
      taxNumber,
      taxOffice,
      phone,
      city,
      username,
      password,
    } = body;

    const newCompany = await prisma.$transaction(async (tx) => {
      // 1. Şirketi Oluştur
      const company = await tx.company.create({
        data: { name, type, tckn, taxNumber, taxOffice, phone, city },
      });

      // 2. Kullanıcıyı Oluştur
      if (username && password) {
        const hashedPassword = await bcrypt.hash(password, 10);
        await tx.user.create({
          data: {
            username,
            password: hashedPassword,
            role: "USER",
            companyId: company.id,
            fullName: name,
          },
        });
      }
      return company;
    });

    return NextResponse.json(newCompany);
  } catch (error) {
    console.error("Kayıt hatası:", error);
    return NextResponse.json({ error: "Hata oluştu." }, { status: 500 });
  }
}

// --- VERİ GÜNCELLEME (PUT) - YENİ EKLENDİ ---
export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const {
      id,
      name,
      type,
      tckn,
      taxNumber,
      taxOffice,
      phone,
      city,
      username,
      password,
    } = body;

    if (!id) return NextResponse.json({ error: "ID gerekli" }, { status: 400 });

    const updatedCompany = await prisma.$transaction(async (tx) => {
      // 1. Şirket Bilgilerini Güncelle
      const company = await tx.company.update({
        where: { id },
        data: { name, type, tckn, taxNumber, taxOffice, phone, city },
      });

      // 2. Kullanıcı Bilgilerini Güncelle
      // Şirkete bağlı ilk kullanıcıyı buluyoruz
      const existingUser = await tx.user.findFirst({
        where: { companyId: id },
      });

      if (existingUser) {
        const updateData: any = { username }; // Kullanıcı adını güncelle

        // Eğer yeni şifre girildiyse, onu hashle ve güncellemeye ekle
        if (password && password.trim() !== "") {
          updateData.password = await bcrypt.hash(password, 10);
        }

        await tx.user.update({
          where: { id: existingUser.id },
          data: updateData,
        });
      } else if (username && password) {
        // Eğer eskiden kullanıcısı yoksa ama şimdi ekleniyorsa
        const hashedPassword = await bcrypt.hash(password, 10);
        await tx.user.create({
          data: {
            username,
            password: hashedPassword,
            role: "USER",
            companyId: id,
            fullName: name,
          },
        });
      }

      return company;
    });

    return NextResponse.json(updatedCompany);
  } catch (error) {
    console.error("Güncelleme hatası:", error);
    return NextResponse.json(
      { error: "Güncelleme başarısız." },
      { status: 500 }
    );
  }
}

// --- VERİ LİSTELEME (GET) ---
export async function GET() {
  try {
    const companies = await prisma.company.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        _count: { select: { vehicles: true } },
        // Düzenleme ekranı için kullanıcı adını da çekiyoruz
        users: {
          select: { username: true },
          take: 1,
        },
      },
    });
    return NextResponse.json(companies);
  } catch (error) {
    return NextResponse.json({ error: "Veriler çekilemedi" }, { status: 500 });
  }
}
