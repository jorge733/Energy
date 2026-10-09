"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import InformeForm from "@/components/InformeForm";
import { obtenerInforme } from "@/lib/store";
import { Informe } from "@/lib/types";

export default function EditarInformePage() {
  const { id } = useParams<{ id: string }>();
  const [inf, setInf] = useState<Informe | null | undefined>(undefined);

  useEffect(() => setInf(obtenerInforme(id) ?? null), [id]);

  if (inf === undefined) return null;
  if (inf === null)
    return (
      <div className="tarjeta mx-auto max-w-md p-8 text-center">
        <p className="font-semibold">Informe no encontrado</p>
        <Link href="/informes" className="boton mt-4">Volver a informes</Link>
      </div>
    );

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div>
        <Link href={`/informes/${id}`} className="inline-flex items-center gap-1.5 text-sm font-medium text-grafito-500 hover:text-grafito-900">
          <ArrowLeft className="h-4 w-4" /> Volver al informe
        </Link>
        <h1 className="mt-3 text-2xl font-bold tracking-tight sm:text-3xl">Editar {inf.folio}</h1>
      </div>
      <InformeForm inicial={inf} />
    </div>
  );
}
