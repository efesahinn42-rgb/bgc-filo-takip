"use client";

import { useState, useEffect } from "react";
import { deleteCompanyAction } from "@/app/dashboard/actions";

export default function CompaniesPage() {
  const [companies, setCompanies] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Düzenleme modu için state (null ise yeni kayıt, id varsa düzenleme)
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form State
  const [type, setType] = useState("CORPORATE");
  const [formData, setFormData] = useState({
    companyName: "",
    firstName: "",
    lastName: "",
    taxNumber: "",
    taxOffice: "",
    tckn: "",
    phone: "",
    city: "",
    username: "",
    password: "",
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await fetch("/api/customers");
      const data = await res.json();
      setCompanies(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Hata:", error);
    }
  };

  // --- DÜZENLEME BUTONUNA BASINCA ---
  const handleEditClick = (company: any) => {
    setEditingId(company.id); // Düzenleme modunu aç
    setType(company.type);

    // İsimleri ayır (Eğer bireyselse ad soyad ayrımı basitçe yapılıyor)
    // Not: Daha gelişmiş bir yapı için veritabanında ad/soyad ayrı tutulabilir
    let fName = "",
      lName = "";
    if (company.type === "INDIVIDUAL") {
      const parts = company.name.split(" ");
      lName = parts.pop() || "";
      fName = parts.join(" ");
    }

    // O şirketin kullanıcı adını bul (API'den users array içinde geliyor)
    const companyUser =
      company.users && company.users.length > 0
        ? company.users[0].username
        : "";

    setFormData({
      companyName: company.type === "CORPORATE" ? company.name : "",
      firstName: fName,
      lastName: lName,
      taxNumber: company.taxNumber || "",
      taxOffice: company.taxOffice || "",
      tckn: company.tckn || "",
      phone: company.phone || "",
      city: company.city || "",
      username: companyUser,
      password: "", // Şifre güvenlik gereği boş gelir, isterse yeni yazar
    });

    setIsModalOpen(true);
  };

  // --- YENİ KAYIT BUTONUNA BASINCA ---
  const handleNewClick = () => {
    setEditingId(null); // Yeni kayıt modu
    setFormData({
      companyName: "",
      firstName: "",
      lastName: "",
      taxNumber: "",
      taxOffice: "",
      tckn: "",
      phone: "",
      city: "",
      username: "",
      password: "",
    });
    setType("CORPORATE");
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (
      confirm(
        "Bu kaydı ve bağlı tüm verileri silmek istediğinize emin misiniz?"
      )
    ) {
      await deleteCompanyAction(id);
      fetchData();
    }
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setIsLoading(true);

    const payload = {
      id: editingId, // Sadece güncellemede kullanılır
      type,
      name:
        type === "CORPORATE"
          ? formData.companyName
          : `${formData.firstName} ${formData.lastName}`,
      taxNumber: formData.taxNumber,
      taxOffice: formData.taxOffice,
      tckn: formData.tckn,
      phone: formData.phone,
      city: formData.city,
      username: formData.username,
      password: formData.password,
    };

    try {
      // Eğer editingId varsa PUT (Güncelle), yoksa POST (Ekle)
      const method = editingId ? "PUT" : "POST";

      const res = await fetch("/api/customers", {
        method: method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        alert(editingId ? "Güncelleme Başarılı!" : "Kayıt Başarılı!");
        setIsModalOpen(false);
        fetchData();
      } else {
        alert("İşlem sırasında hata oluştu.");
      }
    } catch (error) {
      console.error(error);
      alert("Sunucu hatası.");
    }
    setIsLoading(false);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">
            Müşteri ve Şirket Yönetimi
          </h1>
          <p className="text-gray-400">
            Firmaları, şahısları ve giriş bilgilerini yönetin.
          </p>
        </div>
        <button
          onClick={handleNewClick}
          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
        >
          + Yeni Kayıt Ekle
        </button>
      </div>

      <div className="bg-[#111] rounded-lg border border-[#222] overflow-hidden">
        <table className="w-full text-left text-gray-400">
          <thead className="bg-[#1a1a1a] text-xs uppercase text-gray-500 font-medium">
            <tr>
              <th className="px-6 py-4">Tip</th>
              <th className="px-6 py-4">Ünvan / Ad Soyad</th>
              <th className="px-6 py-4">Vergi / TC No</th>
              <th className="px-6 py-4">Kullanıcı Adı</th>
              <th className="px-6 py-4 text-right">İşlemler</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#222]">
            {companies.map((item: any) => (
              <tr
                key={item.id}
                className="hover:bg-[#1a1a1a] transition-colors"
              >
                <td className="px-6 py-4">
                  <span
                    className={`text-xs px-2 py-1 rounded ${
                      item.type === "INDIVIDUAL"
                        ? "bg-blue-900/30 text-blue-400"
                        : "bg-purple-900/30 text-purple-400"
                    }`}
                  >
                    {item.type === "INDIVIDUAL" ? "Bireysel" : "Kurumsal"}
                  </span>
                </td>
                <td className="px-6 py-4 text-white font-medium">
                  {item.name}
                </td>
                <td className="px-6 py-4">
                  {item.tckn || item.taxNumber || "-"}
                </td>
                <td className="px-6 py-4 text-gray-500">
                  {/* Kullanıcı Adını Göster */}
                  {item.users && item.users.length > 0
                    ? item.users[0].username
                    : "-"}
                </td>
                <td className="px-6 py-4 text-right space-x-2">
                  {/* DÜZENLE BUTONU */}
                  <button
                    onClick={() => handleEditClick(item)}
                    className="text-blue-500 hover:text-blue-400 bg-blue-900/20 hover:bg-blue-900/40 px-3 py-1 rounded text-sm transition-colors"
                  >
                    Düzenle
                  </button>
                  {/* SİL BUTONU */}
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="text-red-500 hover:text-red-400 bg-red-900/20 hover:bg-red-900/40 px-3 py-1 rounded text-sm transition-colors"
                  >
                    Sil
                  </button>
                </td>
              </tr>
            ))}
            {companies.length === 0 && (
              <tr>
                <td colSpan={5} className="text-center py-8">
                  Kayıt bulunamadı.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-[#111] border border-[#333] rounded-xl w-full max-w-2xl p-6 relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-white"
            >
              ✕
            </button>

            <h2 className="text-xl font-bold text-white mb-6">
              {editingId ? "Kaydı Düzenle" : "Yeni Kayıt Ekle"}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* TİP SEÇİCİ */}
              <div className="grid grid-cols-2 gap-2 bg-[#222] p-1 rounded-lg">
                <button
                  type="button"
                  onClick={() => setType("CORPORATE")}
                  className={`py-2 rounded-md text-sm font-medium transition-all ${
                    type === "CORPORATE"
                      ? "bg-[#333] text-white shadow"
                      : "text-gray-400"
                  }`}
                >
                  Kurumsal
                </button>
                <button
                  type="button"
                  onClick={() => setType("INDIVIDUAL")}
                  className={`py-2 rounded-md text-sm font-medium transition-all ${
                    type === "INDIVIDUAL"
                      ? "bg-[#333] text-white shadow"
                      : "text-gray-400"
                  }`}
                >
                  Bireysel
                </button>
              </div>

              {/* FORM ALANLARI */}
              <div className="bg-[#1a1a1a] p-4 rounded-lg border border-[#333] space-y-4">
                {type === "CORPORATE" ? (
                  <>
                    <div>
                      <label className="block text-sm text-gray-400 mb-1">
                        Şirket Ünvanı
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.companyName}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            companyName: e.target.value,
                          })
                        }
                        className="w-full bg-[#222] border border-[#333] rounded p-2 text-white focus:border-red-600 outline-none"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm text-gray-400 mb-1">
                          Vergi No
                        </label>
                        <input
                          type="text"
                          value={formData.taxNumber}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              taxNumber: e.target.value,
                            })
                          }
                          className="w-full bg-[#222] border border-[#333] rounded p-2 text-white focus:border-red-600 outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-gray-400 mb-1">
                          Vergi Dairesi
                        </label>
                        <input
                          type="text"
                          value={formData.taxOffice}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              taxOffice: e.target.value,
                            })
                          }
                          className="w-full bg-[#222] border border-[#333] rounded p-2 text-white focus:border-red-600 outline-none"
                        />
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm text-gray-400 mb-1">
                          Ad
                        </label>
                        <input
                          type="text"
                          required
                          value={formData.firstName}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              firstName: e.target.value,
                            })
                          }
                          className="w-full bg-[#222] border border-[#333] rounded p-2 text-white focus:border-red-600 outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-gray-400 mb-1">
                          Soyad
                        </label>
                        <input
                          type="text"
                          required
                          value={formData.lastName}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              lastName: e.target.value,
                            })
                          }
                          className="w-full bg-[#222] border border-[#333] rounded p-2 text-white focus:border-red-600 outline-none"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm text-gray-400 mb-1">
                        TCKN
                      </label>
                      <input
                        type="text"
                        maxLength={11}
                        value={formData.tckn}
                        onChange={(e) =>
                          setFormData({ ...formData, tckn: e.target.value })
                        }
                        className="w-full bg-[#222] border border-[#333] rounded p-2 text-white focus:border-red-600 outline-none"
                      />
                    </div>
                  </>
                )}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">
                      Telefon
                    </label>
                    <input
                      type="text"
                      value={formData.phone}
                      onChange={(e) =>
                        setFormData({ ...formData, phone: e.target.value })
                      }
                      className="w-full bg-[#222] border border-[#333] rounded p-2 text-white focus:border-red-600 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">
                      Şehir
                    </label>
                    <input
                      type="text"
                      value={formData.city}
                      onChange={(e) =>
                        setFormData({ ...formData, city: e.target.value })
                      }
                      className="w-full bg-[#222] border border-[#333] rounded p-2 text-white focus:border-red-600 outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* GİRİŞ BİLGİLERİ */}
              <div className="bg-[#1a1a1a] p-4 rounded-lg border border-[#333] space-y-4">
                <h3 className="text-sm font-semibold text-gray-500 uppercase">
                  Sistem Giriş Bilgileri
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">
                      Kullanıcı Adı
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.username}
                      onChange={(e) =>
                        setFormData({ ...formData, username: e.target.value })
                      }
                      className="w-full bg-[#222] border border-[#333] rounded p-2 text-white focus:border-red-600 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">
                      {editingId
                        ? "Yeni Şifre (Boş bırakırsan değişmez)"
                        : "Şifre"}
                    </label>
                    <input
                      type="password"
                      required={!editingId} // Yeni kayıtta zorunlu, güncellemede opsiyonel
                      value={formData.password}
                      onChange={(e) =>
                        setFormData({ ...formData, password: e.target.value })
                      }
                      className="w-full bg-[#222] border border-[#333] rounded p-2 text-white focus:border-red-600 outline-none"
                      placeholder="******"
                    />
                  </div>
                </div>
              </div>

              <button
                disabled={isLoading}
                className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-lg mt-4 transition-colors"
              >
                {isLoading ? "İşleniyor..." : editingId ? "Güncelle" : "Kaydet"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
