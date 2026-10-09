"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { FilePlus2, FileText, LogOut } from "lucide-react";
import { cerrarSesion, obtenerSesion, Sesion } from "@/lib/session";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [sesion, setSesion] = useState<Sesion | null | undefined>(undefined);

  useEffect(() => {
    const s = obtenerSesion();
    if (!s) router.replace("/login");
    setSesion(s);
  }, [router]);

  if (!sesion) return <div className="min-h-screen bg-grafito-50" />;

  const nav = [
    { href: "/informes", label: "Informes", icon: FileText, activo: pathname === "/informes" },
    { href: "/informes/nuevo", label: "Nuevo informe", icon: FilePlus2, activo: pathname === "/informes/nuevo" },
  ];

  return (
    <div className="min-h-screen">
      <header className="no-print sticky top-0 z-20 border-b border-white/5 bg-grafito-900/95 text-white backdrop-blur">
        <div className="mx-auto flex h-16 max-w-6xl items-center gap-4 px-4 sm:px-6">
          <Link href="/informes" className="flex items-center gap-3">
            <img src="/logo-le-energy.png" alt="LE Energy" className="h-9 w-auto" />
            <span className="hidden border-l border-white/15 pl-3 text-sm font-semibold text-grafito-200 sm:block">
              Informes de Generadores
            </span>
          </Link>
          <nav className="ml-auto flex items-center gap-1">
            {nav.map(({ href, label, icon: Icon, activo }) => (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition ${
                  activo ? "bg-white/10 text-white" : "text-grafito-400 hover:bg-white/5 hover:text-white"
                }`}
              >
                <Icon className="h-4 w-4" />
                <span className="hidden sm:inline">{label}</span>
              </Link>
            ))}
            <div className="mx-2 hidden h-6 w-px bg-white/10 sm:block" />
            <div className="hidden items-center gap-2 sm:flex">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-marca-500 text-xs font-bold">
                {sesion.nombre.slice(0, 1).toUpperCase()}
              </span>
              <span className="max-w-32 truncate text-sm text-grafito-200">{sesion.nombre}</span>
            </div>
            <button
              onClick={() => {
                cerrarSesion();
                router.replace("/login");
              }}
              className="ml-1 rounded-lg p-2 text-grafito-400 transition hover:bg-white/5 hover:text-white"
              aria-label="Cerrar sesión"
              title="Cerrar sesión"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">{children}</main>
    </div>
  );
}
