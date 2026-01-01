import { prisma } from "@/lib/prisma";
import { verifySession } from "@/lib/auth";
import Link from "next/link";
import UserView from "./user-view"; // Az önce oluşturduğumuz bileşen

// İstatistikleri çeken fonksiyon (SADECE ADMİN İÇİN)
async function getAdminStats() {
  const [totalCompanies, totalVehicles, totalUsers, recentLogs] =
    await Promise.all([
      prisma.company.count(),
      prisma.vehicle.count(),
      prisma.user.count(),
      prisma.log.findMany({
        take: 5,
        orderBy: { createdAt: "desc" },
        include: { vehicle: true, user: true },
      }),
    ]);
  return { totalCompanies, totalVehicles, totalUsers, recentLogs };
}

// Kullanıcı verilerini çeken fonksiyon (SADECE NORMAL USER İÇİN)
async function getUserData(userId: string) {
  // Kullanıcının bağlı olduğu şirketi ve o şirketin araçlarını bul
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      company: {
        include: {
          vehicles: true, // Şirketin araçlarını çek
        },
      },
    },
  });

  return {
    vehicles: user?.company?.vehicles || [], // Araç yoksa boş dizi döndür
    userId: userId,
  };
}

export default async function DashboardPage() {
  // 1. Oturum Kontrolü ve Rolü Al
  const session = await verifySession(); // { isAuth: true, userId: '...', role: '...' }

  // ==========================================
  // SENARYO 1: KULLANICI NORMAL BİR USER İSE
  // ==========================================
  if (session.role !== "ADMIN") {
    const userData = await getUserData(session.userId);
    return <UserView vehicles={userData.vehicles} userId={session.userId} />;
  }

  // ==========================================
  // SENARYO 2: KULLANICI ADMİN İSE (Aşağıdaki İstatistik Ekranı)
  // ==========================================
  const stats = await getAdminStats();

  return (
    <div className="p-6 space-y-8">
      {/* BAŞLIK */}
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-white">Genel Bakış</h1>
          <p className="text-gray-400 mt-1">Admin paneline hoş geldiniz.</p>
        </div>
        <div className="text-right hidden sm:block">
          <p className="text-sm text-gray-500">Bugün</p>
          <p className="text-white font-medium">
            {new Date().toLocaleDateString("tr-TR", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>
      </div>

      {/* İSTATİSTİK KARTLARI */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* KART 1: ŞİRKETLER */}
        <Link href="/dashboard/companies" className="block group">
          <div className="bg-[#111] p-6 rounded-xl border border-[#222] hover:border-red-900/30 transition-all cursor-pointer h-full relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="flex justify-between items-start relative z-10">
              <div>
                <p className="text-gray-500 text-sm font-medium uppercase tracking-wider">
                  Kayıtlı Müşteri
                </p>
                <h3 className="text-4xl font-bold text-white mt-2 group-hover:text-red-500 transition-colors">
                  {stats.totalCompanies}
                </h3>
              </div>
              <div className="p-3 bg-red-900/10 rounded-lg text-red-500 group-hover:scale-110 transition-transform">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect width="16" height="20" x="4" y="2" rx="2" ry="2" />
                  <path d="M9 22v-4h6v4" />
                  <path d="M8 6h.01" />
                  <path d="M16 6h.01" />
                  <path d="M12 6h.01" />
                  <path d="M12 10h.01" />
                  <path d="M12 14h.01" />
                  <path d="M16 10h.01" />
                  <path d="M16 14h.01" />
                  <path d="M8 10h.01" />
                  <path d="M8 14h.01" />
                </svg>
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm text-gray-500 group-hover:text-red-400 transition-colors relative z-10">
              <span>Tüm şirketleri görüntüle</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 ml-1 transform group-hover:translate-x-1 transition-transform"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </div>
          </div>
        </Link>

        {/* KART 2: ARAÇLAR */}
        <Link href="/dashboard/vehicles" className="block group">
          <div className="bg-[#111] p-6 rounded-xl border border-[#222] hover:border-blue-900/30 transition-all cursor-pointer h-full relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="flex justify-between items-start relative z-10">
              <div>
                <p className="text-gray-500 text-sm font-medium uppercase tracking-wider">
                  Toplam Araç
                </p>
                <h3 className="text-4xl font-bold text-white mt-2 group-hover:text-blue-500 transition-colors">
                  {stats.totalVehicles}
                </h3>
              </div>
              <div className="p-3 bg-blue-900/10 rounded-lg text-blue-500 group-hover:scale-110 transition-transform">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2" />
                  <circle cx="7" cy="17" r="2" />
                  <circle cx="17" cy="17" r="2" />
                </svg>
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm text-gray-500 group-hover:text-blue-400 transition-colors relative z-10">
              <span>Araç listesine git</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 ml-1 transform group-hover:translate-x-1 transition-transform"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </div>
          </div>
        </Link>

        {/* KART 3: KULLANICILAR */}
        <div className="block group">
          <div className="bg-[#111] p-6 rounded-xl border border-[#222] hover:border-green-900/30 transition-all h-full relative overflow-hidden">
            <div className="flex justify-between items-start relative z-10">
              <div>
                <p className="text-gray-500 text-sm font-medium uppercase tracking-wider">
                  Kullanıcı & Şoför
                </p>
                <h3 className="text-4xl font-bold text-white mt-2 group-hover:text-green-500 transition-colors">
                  {stats.totalUsers}
                </h3>
              </div>
              <div className="p-3 bg-green-900/10 rounded-lg text-green-500 group-hover:scale-110 transition-transform">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                  <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
              </div>
            </div>
            <p className="text-sm text-gray-500 mt-4 relative z-10">
              Sisteme erişimi olan personel sayısı.
            </p>
          </div>
        </div>
      </div>

      {/* SON HAREKETLER TABLOSU */}
      <div className="bg-[#111] rounded-xl border border-[#222] overflow-hidden">
        <div className="p-6 border-b border-[#222] flex justify-between items-center">
          <h2 className="text-xl font-bold text-white">
            Son Girilen KM Kayıtları
          </h2>
          <span className="text-xs bg-[#222] text-gray-400 px-2 py-1 rounded">
            Son 5 Hareket
          </span>
        </div>
        <table className="w-full text-left">
          <thead className="bg-[#1a1a1a] text-xs uppercase text-gray-500">
            <tr>
              <th className="px-6 py-4">Araç Plakası</th>
              <th className="px-6 py-4">Sürücü / Gönderen</th>
              <th className="px-6 py-4">KM Değeri</th>
              <th className="px-6 py-4">Tarih</th>
              <th className="px-6 py-4 text-right">Fotoğraf</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#222]">
            {stats.recentLogs.map((log) => (
              <tr
                key={log.id}
                className="hover:bg-[#1a1a1a] transition-colors group"
              >
                <td className="px-6 py-4">
                  <div className="font-bold text-white bg-zinc-800 px-2 py-1 rounded inline-block border border-zinc-700">
                    {log.vehicle.plate}
                  </div>
                </td>
                <td className="px-6 py-4 text-gray-300">
                  {log.user.fullName || log.user.username}
                </td>
                <td className="px-6 py-4 text-white font-mono">
                  {log.km.toLocaleString("tr-TR")} km
                </td>
                <td className="px-6 py-4 text-gray-400 text-sm">
                  {new Date(log.createdAt).toLocaleString("tr-TR", {
                    day: "numeric",
                    month: "short",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </td>
                <td className="px-6 py-4 text-right">
                  {log.photoUrl ? (
                    <a
                      href={log.photoUrl}
                      target="_blank"
                      className="text-blue-500 hover:text-blue-400 text-sm underline"
                    >
                      Görüntüle
                    </a>
                  ) : (
                    <span className="text-gray-600 text-sm">-</span>
                  )}
                </td>
              </tr>
            ))}
            {stats.recentLogs.length === 0 && (
              <tr>
                <td
                  colSpan={5}
                  className="px-6 py-12 text-center text-gray-500"
                >
                  Kayıt bulunamadı.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
