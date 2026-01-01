"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { logoutAction } from "./actions";

export default function Sidebar({ session }: { session: any }) {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const toggleMenu = () => setIsOpen(!isOpen);

  // Link tıklandığında mobilde menüyü kapatan yardımcı fonksiyon
  const NavLink = ({ href, children, icon }: any) => {
    const isActive = pathname === href;
    return (
      <Link
        href={href}
        onClick={() => setIsOpen(false)}
        className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
          isActive
            ? "bg-red-900/20 text-red-500 border border-red-900/30"
            : "text-neutral-400 hover:bg-neutral-800 hover:text-white"
        }`}
      >
        {icon}
        {children}
      </Link>
    );
  };

  return (
    <>
      {/* --- MOBİL ÜST BAR (Hamburger Butonu Burada) --- */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-neutral-900 border-b border-neutral-800 flex items-center px-4 z-50">
        <button
          onClick={toggleMenu}
          className="p-2 text-neutral-400 hover:text-white"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            {isOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            )}
          </svg>
        </button>
        <span className="ml-4 font-bold">BGC Filo</span>
      </div>

      {/* --- SIDEBAR --- */}
      <aside
        className={`
          fixed inset-y-0 left-0 z-40 w-64 bg-neutral-900 border-r border-neutral-800 flex flex-col transform transition-transform duration-300 ease-in-out
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0 lg:static lg:flex-shrink-0
        `}
      >
        {/* Logo Alanı */}
        <div className="h-16 flex items-center px-6 border-b border-neutral-800 shrink-0">
          <div className="w-8 h-8 bg-red-700 rounded-lg flex items-center justify-center mr-3 font-bold shadow-red-900/50 shadow-lg">
            B
          </div>
          <span className="font-bold text-lg tracking-wide">BGC Filo</span>
        </div>

        {/* Menü Linkleri */}
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          <NavLink
            href="/dashboard"
            icon={
              <svg
                className="w-5 h-5 mr-3"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
                />
              </svg>
            }
          >
            Genel Bakış
          </NavLink>

          {session.role === "ADMIN" && (
            <>
              <div className="pt-4 pb-2 text-xs font-semibold text-neutral-500 uppercase tracking-wider">
                Yönetim
              </div>
              <NavLink
                href="/dashboard/companies"
                icon={
                  <svg
                    className="w-5 h-5 mr-3"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                    />
                  </svg>
                }
              >
                Şirketler
              </NavLink>
              <NavLink
                href="/dashboard/vehicles"
                icon={
                  <svg
                    className="w-5 h-5 mr-3"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                  </svg>
                }
              >
                Araçlar
              </NavLink>
              <NavLink
                href="/dashboard/reports"
                icon={
                  <svg
                    className="w-5 h-5 mr-3"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                }
              >
                Raporlar
              </NavLink>
            </>
          )}
        </nav>

        {/* Alt Kısım */}
        <div className="p-4 border-t border-neutral-800">
          <div className="flex items-center mb-4">
            <div className="w-8 h-8 rounded-full bg-neutral-700 flex items-center justify-center text-xs font-bold uppercase">
              {session.role === "ADMIN" ? "A" : "U"}
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-white">Oturum Açık</p>
              <p className="text-xs text-neutral-500 uppercase">
                {session.role}
              </p>
            </div>
          </div>
          <form action={logoutAction}>
            <button className="w-full flex items-center justify-center px-4 py-2 text-xs font-medium text-neutral-400 bg-neutral-800 rounded-lg hover:bg-red-900/30 hover:text-red-400 transition-colors">
              Çıkış Yap
            </button>
          </form>
        </div>
      </aside>

      {/* Arka plan karartma (Mobilde menü açıkken) */}
      {isOpen && (
        <div
          onClick={toggleMenu}
          className="fixed inset-0 bg-black/60 z-30 lg:hidden"
        />
      )}
    </>
  );
}
