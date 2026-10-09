"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import InformeForm from "@/components/InformeForm";
import { informeVacio } from "@/lib/store";
import { obtenerSesion } from "@/lib/session";
import { Informe } from "@/lib/types";

export default function NuevoInformePage() {
  const [inicial, setInicial] = useState<Informe | null>(null);

  useEffect(() => {
    const s = obtenerSesion();
    setInicial(informeVacio(s && !s.invitado ? s.nombre : ""));
  }, []);

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div>
        <Link href="/informes" className="inline-flex items-center gap-1.5 text-sm font-medium text-grafito-500 hover:text-grafito-900">
          <ArrowLeft className="h-4 w-4" /> Volver a informes
        </Link>
        <h1 className="mt-3 text-2xl font-bold tracking-tight sm:text-3xl">Nuevo informe</h1>
        <p className="mt-1 text-grafito-500">Completa la evaluación técnica del grupo electrógeno.</p>
      </div>
      {inicial && <InformeForm inicial={inicial} />}
    </div>
  );
}
