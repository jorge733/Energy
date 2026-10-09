"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Pencil, Printer, Trash2 } from "lucide-react";
import { eliminarInforme, obtenerInforme } from "@/lib/store";
import { Informe, SECCIONES_REVISION, TIPO_SERVICIO_LABEL } from "@/lib/types";
import { BadgeEstado, IconoItem } from "@/components/Estado";
import { fechaLarga } from "@/lib/formato";

export default function InformePage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
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

  const item = (itemId: string) => inf.items.find((x) => x.id === itemId);
  const medidas: [string, string, string][] = [
    ["Voltaje L1", inf.voltajeL1, "V"],
    ["Voltaje L2", inf.voltajeL2, "V"],
    ["Voltaje L3", inf.voltajeL3, "V"],
    ["Frecuencia", inf.frecuencia, "Hz"],
    ["Carga", inf.cargaPct, "%"],
    ["Presión aceite", inf.presionAceite, "psi"],
    ["Temperatura", inf.temperatura, "°C"],
  ];

  return (
    <div className="mx-auto max-w-4xl space-y-5">
      <div className="no-print flex flex-wrap items-center gap-2">
        <Link href="/informes" className="mr-auto inline-flex items-center gap-1.5 text-sm font-medium text-grafito-500 hover:text-grafito-900">
          <ArrowLeft className="h-4 w-4" /> Volver a informes
        </Link>
        <button
          onClick={() => {
            if (confirm(`¿Eliminar el informe ${inf.folio}? Esta acción no se puede deshacer.`)) {
              eliminarInforme(inf.id);
              router.replace("/informes");
            }
          }}
          className="boton-sec text-red-600 hover:bg-red-50"
        >
          <Trash2 className="h-4 w-4" /> <span className="hidden sm:inline">Eliminar</span>
        </button>
        <Link href={`/informes/${inf.id}/editar`} className="boton-sec">
          <Pencil className="h-4 w-4" /> Editar
        </Link>
        <button onClick={() => window.print()} className="boton">
          <Printer className="h-4 w-4" /> Imprimir / PDF
        </button>
      </div>

      <article className="tarjeta print-plain overflow-hidden">
        {/* Encabezado del documento */}
        <header className="flex flex-wrap items-center gap-5 bg-grafito-900 px-6 py-6 text-white sm:px-8 print:[-webkit-print-color-adjust:exact] print:[print-color-adjust:exact]">
          <img src="/logo-le-energy.png" alt="LE Energy" className="h-14 w-auto" />
          <div className="min-w-0 flex-1">
            <p className="text-xs font-semibold uppercase tracking-wider text-marca-400">Informe técnico</p>
            <h1 className="text-xl font-bold sm:text-2xl">{TIPO_SERVICIO_LABEL[inf.tipoServicio]}</h1>
          </div>
          <div className="text-right">
            <p className="font-mono text-lg font-bold">{inf.folio}</p>
            <p className="text-sm text-grafito-400">{fechaLarga(inf.fecha)}</p>
          </div>
        </header>

        <div className="space-y-8 p-6 sm:p-8">
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl bg-grafito-50 px-4 py-3">
            <span className="text-sm font-medium text-grafito-500">Estado del equipo</span>
            <BadgeEstado estado={inf.estadoGeneral} />
          </div>

          <div className="grid gap-8 sm:grid-cols-2">
            <Bloque titulo="Cliente">
              <Dato label="Empresa" valor={inf.cliente} />
              <Dato label="Ubicación" valor={inf.ubicacion} />
              <Dato label="Contacto" valor={inf.contacto} />
              <Dato label="Técnico" valor={inf.tecnico} />
            </Bloque>
            <Bloque titulo="Equipo">
              <Dato label="Marca / modelo" valor={[inf.marca, inf.modelo].filter(Boolean).join(" ")} />
              <Dato label="N° de serie" valor={inf.serie} />
              <Dato label="Potencia" valor={inf.potenciaKva && `${inf.potenciaKva} kVA`} />
              <Dato label="Horómetro" valor={inf.horometro && `${inf.horometro} h`} />
              <Dato label="Combustible" valor={inf.combustiblePct && `${inf.combustiblePct} %`} />
            </Bloque>
          </div>

          <Bloque titulo="Revisión de componentes">
            <div className="grid gap-x-8 gap-y-6 sm:grid-cols-2">
              {SECCIONES_REVISION.map((sec) => (
                <div key={sec.titulo} className="break-inside-avoid">
                  <p className="mb-1 text-xs font-bold uppercase tracking-wide text-grafito-400">{sec.titulo}</p>
                  <ul className="divide-y divide-grafito-100">
                    {sec.items.map(({ id: itemId, label }) => {
                      const it = item(itemId);
                      return (
                        <li key={itemId} className="py-2">
                          <div className="flex items-center justify-between gap-3">
                            <span className="text-sm">{label}</span>
                            {it && <IconoItem estado={it.estado} />}
                          </div>
                          {it?.nota && <p className="mt-0.5 text-xs text-grafito-500">{it.nota}</p>}
                        </li>
                      );
                    })}
                  </ul>
                </div>
              ))}
            </div>
          </Bloque>

          <Bloque titulo="Prueba en carga">
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              {medidas.map(([label, valor, unidad]) => (
                <div key={label} className="rounded-lg border border-grafito-100 px-3 py-2.5">
                  <p className="text-xs text-grafito-500">{label}</p>
                  <p className="mt-0.5 font-semibold">
                    {valor ? (
                      <>
                        {valor} <span className="text-sm font-normal text-grafito-400">{unidad}</span>
                      </>
                    ) : (
                      <span className="text-grafito-400">—</span>
                    )}
                  </p>
                </div>
              ))}
            </div>
          </Bloque>

          {(inf.observaciones || inf.recomendaciones) && (
            <div className="grid gap-8 sm:grid-cols-2">
              <Bloque titulo="Observaciones">
                <p className="whitespace-pre-line text-sm leading-relaxed">{inf.observaciones || "—"}</p>
              </Bloque>
              <Bloque titulo="Recomendaciones">
                <p className="whitespace-pre-line text-sm leading-relaxed">{inf.recomendaciones || "—"}</p>
              </Bloque>
            </div>
          )}

          <div className="grid grid-cols-2 gap-10 pt-10">
            {["Técnico responsable", "Recibe conforme"].map((f) => (
              <div key={f} className="border-t border-grafito-400 pt-2 text-center text-xs text-grafito-500">{f}</div>
            ))}
          </div>
        </div>
      </article>
    </div>
  );
}

function Bloque({ titulo, children }: { titulo: string; children: React.ReactNode }) {
  return (
    <section className="break-inside-avoid">
      <h2 className="mb-3 border-b-2 border-marca-500 pb-1.5 text-sm font-bold uppercase tracking-wide text-grafito-700">{titulo}</h2>
      {children}
    </section>
  );
}

function Dato({ label, valor }: { label: string; valor: string }) {
  return (
    <div className="flex gap-3 py-1.5 text-sm">
      <span className="w-32 shrink-0 text-grafito-500">{label}</span>
      <span className="font-medium">{valor || <span className="text-grafito-400">—</span>}</span>
    </div>
  );
}
