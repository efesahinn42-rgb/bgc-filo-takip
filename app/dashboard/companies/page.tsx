"use client";

import { useState, useEffect } from "react";
import { deleteCompanyAction } from "@/app/dashboard/actions";

export default function CompaniesPage() {
  const [companies, setCompanies] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

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

  const handleEditClick = (company: any) => {
    setEditingId(company.id);
    setType(company.type);

    let fName = "",
      lName = "";
    if (company.type === "INDIVIDUAL") {
      const parts = company.name.split(" ");
      lName = parts.pop() || "";
      fName = parts.join(" ");
    }

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
      password: "",
    });

    setIsModalOpen(true);
  };

  const handleNewClick = () => {
    setEditingId(null);
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
      id: editingId,
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
      const method = editingId ? "PUT" : "POST";
      const res = await fetch("/api/customers", {
        method: method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setIsModalOpen(false);
        fetchData();
      } else {
        alert("İşlem sırasında hata oluştu.");
      }
    } catch (error) {
      console.error(error);
    }
    setIsLoading(false);
  };

  return (
    <div className="p-4 md:p-6 pb-24">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-white tracking-tight">
            Müşteri ve Şirket Yönetimi
          </h1>
          <p className="text-gray-400 text-xs md:text-sm">
            Firmaları, şahısları ve giriş bilgilerini yönetin.
          </p>
        </div>
        <button
          onClick={handleNewClick}
          className="w-full md:w-auto bg-red-600 hover:bg-red-700 text-white px-5 py-3 md:py-2 rounded-xl font-bold transition-all active:scale-95 shadow-lg shadow-red-900/20"
        >
          + Yeni Kayıt Ekle
        </button>
      </div>

      <div className="bg-[#111] rounded-2xl border border-[#222] overflow-hidden">
        <div className="overflow-x-auto shadow-2xl">
          <table className="w-full text-left text-gray-400 min-w-[800px]">
            <thead className="bg-[#1a1a1a] text-[10px] md:text-xs uppercase text-gray-500 font-bold tracking-widest">
              <tr>
                <th className="px-6 py-4">Tip</th>
                <th className="px-6 py-4">Ünvan / Ad Soyad</th>
                <th className="px-6 py-4">Vergi / TC No</th>
                <th className="px-6 py-4">Kullanıcı Adı</th>
                <th className="px-6 py-4 text-right">İşlemler</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#222] text-sm">
              {companies.map((item: any) => (
                <tr
                  key={item.id}
                  className="hover:bg-[#1a1a1a]/50 transition-colors"
                >
                  <td className="px-6 py-4">
                    <span
                      className={`text-[10px] font-bold px-2 py-1 rounded-md uppercase tracking-tighter ${
                        item.type === "INDIVIDUAL"
                          ? "bg-blue-900/20 text-blue-400 border border-blue-900/30"
                          : "bg-purple-900/20 text-purple-400 border border-purple-900/30"
                      }`}
                    >
                      {item.type === "INDIVIDUAL" ? "Bireysel" : "Kurumsal"}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-white font-medium whitespace-nowrap">
                    {item.name}
                  </td>
                  <td className="px-6 py-4 font-mono text-xs">
                    {item.tckn || item.taxNumber || "-"}
                  </td>
                  <td className="px-6 py-4 text-gray-500 text-xs italic">
                    {item.users && item.users.length > 0
                      ? item.users[0].username
                      : "-"}
                  </td>
                  <td className="px-6 py-4 text-right space-x-3 whitespace-nowrap">
                    <button
                      onClick={() => handleEditClick(item)}
                      className="text-yellow-500 hover:text-yellow-400 font-bold text-xs transition-colors"
                    >
                      DÜZENLE
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="text-red-500 hover:text-red-400 font-bold text-xs transition-colors"
                    >
                      SİL
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-[100] p-0 md:p-4 backdrop-blur-md">
          <div className="bg-[#111] border-t md:border border-[#333] rounded-t-3xl md:rounded-3xl w-full max-w-2xl p-6 relative max-h-screen md:max-h-[90vh] overflow-y-auto mt-auto md:mt-0">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-6 right-6 text-gray-500 hover:text-white bg-[#222] w-8 h-8 rounded-full flex items-center justify-center"
            >
              ✕
            </button>

            <h2 className="text-xl font-bold text-white mb-6 pr-8">
              {editingId ? "Kaydı Düzenle" : "Yeni Kayıt Ekle"}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6 pb-8 md:pb-0">
              <div className="grid grid-cols-2 gap-2 bg-[#1a1a1a] p-1.5 rounded-xl border border-[#222]">
                <button
                  type="button"
                  onClick={() => setType("CORPORATE")}
                  className={`py-2.5 rounded-lg text-xs font-bold uppercase transition-all ${
                    type === "CORPORATE"
                      ? "bg-red-600 text-white"
                      : "text-gray-500 hover:text-white"
                  }`}
                >
                  Kurumsal
                </button>
                <button
                  type="button"
                  onClick={() => setType("INDIVIDUAL")}
                  className={`py-2.5 rounded-lg text-xs font-bold uppercase transition-all ${
                    type === "INDIVIDUAL"
                      ? "bg-red-600 text-white"
                      : "text-gray-500 hover:text-white"
                  }`}
                >
                  Bireysel
                </button>
              </div>

              <div className="space-y-4">
                {type === "CORPORATE" ? (
                  <>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-1">
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
                        className="w-full bg-[#1a1a1a] border border-[#222] rounded-xl p-4 text-white focus:ring-2 focus:ring-red-600 outline-none transition-all"
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-1">
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
                          className="w-full bg-[#1a1a1a] border border-[#222] rounded-xl p-4 text-white focus:ring-2 focus:ring-red-600 outline-none transition-all"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-1">
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
                          className="w-full bg-[#1a1a1a] border border-[#222] rounded-xl p-4 text-white focus:ring-2 focus:ring-red-600 outline-none transition-all"
                        />
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-1">
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
                          className="w-full bg-[#1a1a1a] border border-[#222] rounded-xl p-4 text-white focus:ring-2 focus:ring-red-600 outline-none transition-all"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-1">
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
                          className="w-full bg-[#1a1a1a] border border-[#222] rounded-xl p-4 text-white focus:ring-2 focus:ring-red-600 outline-none transition-all"
                        />
                      </div>
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-1">
                        TCKN
                      </label>
                      <input
                        type="text"
                        maxLength={11}
                        value={formData.tckn}
                        onChange={(e) =>
                          setFormData({ ...formData, tckn: e.target.value })
                        }
                        className="w-full bg-[#1a1a1a] border border-[#222] rounded-xl p-4 text-white focus:ring-2 focus:ring-red-600 outline-none transition-all"
                      />
                    </div>
                  </>
                )}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-1">
                      Telefon
                    </label>
                    <input
                      type="text"
                      value={formData.phone}
                      onChange={(e) =>
                        setFormData({ ...formData, phone: e.target.value })
                      }
                      className="w-full bg-[#1a1a1a] border border-[#222] rounded-xl p-4 text-white focus:ring-2 focus:ring-red-600 outline-none transition-all"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-1">
                      Şehir
                    </label>
                    <input
                      type="text"
                      value={formData.city}
                      onChange={(e) =>
                        setFormData({ ...formData, city: e.target.value })
                      }
                      className="w-full bg-[#1a1a1a] border border-[#222] rounded-xl p-4 text-white focus:ring-2 focus:ring-red-600 outline-none transition-all"
                    />
                  </div>
                </div>
              </div>

              <div className="bg-[#111] p-5 rounded-2xl border border-red-900/10 space-y-4">
                <h3 className="text-[10px] font-bold text-red-500 uppercase tracking-[0.2em]">
                  Sistem Giriş Bilgileri
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-1">
                      Kullanıcı Adı
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.username}
                      onChange={(e) =>
                        setFormData({ ...formData, username: e.target.value })
                      }
                      className="w-full bg-black border border-[#222] rounded-xl p-4 text-white focus:ring-2 focus:ring-red-600 outline-none transition-all"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-1">
                      {editingId ? "Yeni Şifre" : "Şifre"}
                    </label>
                    <input
                      type="password"
                      required={!editingId}
                      value={formData.password}
                      onChange={(e) =>
                        setFormData({ ...formData, password: e.target.value })
                      }
                      className="w-full bg-black border border-[#222] rounded-xl p-4 text-white focus:ring-2 focus:ring-red-600 outline-none transition-all"
                      placeholder="******"
                    />
                  </div>
                </div>
              </div>

              <button
                disabled={isLoading}
                className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-5 rounded-2xl mt-4 transition-all active:scale-[0.98] shadow-xl shadow-red-900/20 uppercase tracking-widest text-sm"
              >
                {isLoading
                  ? "İşleniyor..."
                  : editingId
                  ? "Kayıt Güncelle"
                  : "Yeni Kayıt Oluştur"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
