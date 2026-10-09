"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { AlertTriangle, CheckCircle2, ChevronRight, FilePlus2, FileText, Search, XCircle } from "lucide-react";
import { listarInformes } from "@/lib/store";
import { EstadoGeneral, Informe, TIPO_SERVICIO_LABEL } from "@/lib/types";
import { BadgeEstado } from "@/components/Estado";
import { fechaCorta } from "@/lib/formato";

const FILTROS: { valor: EstadoGeneral | "todos"; label: string }[] = [
  { valor: "todos", label: "Todos" },
  { valor: "operativo", label: "Operativos" },
  { valor: "con_observaciones", label: "Con observaciones" },
  { valor: "fuera_de_servicio", label: "Fuera de servicio" },
];

export default function InformesPage() {
  const [informes, setInformes] = useState<Informe[] | null>(null);
  const [q, setQ] = useState("");
  const [filtro, setFiltro] = useState<EstadoGeneral | "todos">("todos");

  useEffect(() => setInformes(listarInformes()), []);

  const visibles = useMemo(() => {
    if (!informes) return [];
    const t = q.trim().toLowerCase();
    return informes.filter(
      (i) =>
        (filtro === "todos" || i.estadoGeneral === filtro) &&
        (!t || [i.folio, i.cliente, i.ubicacion, i.marca, i.modelo, i.serie, i.tecnico].join(" ").toLowerCase().includes(t)),
    );
  }, [informes, q, filtro]);

  const cuenta = (e: EstadoGeneral) => informes?.filter((i) => i.estadoGeneral === e).length ?? 0;

  const stats = [
    { label: "Informes", valor: informes?.length ?? 0, icono: FileText, color: "text-grafito-700 bg-grafito-100" },
    { label: "Operativos", valor: cuenta("operativo"), icono: CheckCircle2, color: "text-marca-700 bg-marca-50" },
    { label: "Con observaciones", valor: cuenta("con_observaciones"), icono: AlertTriangle, color: "text-amber-700 bg-amber-50" },
    { label: "Fuera de servicio", valor: cuenta("fuera_de_servicio"), icono: XCircle, color: "text-red-700 bg-red-50" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Informes técnicos</h1>
          <p className="mt-1 text-grafito-500">Evaluaciones de grupos electrógenos registradas.</p>
        </div>
        <Link href="/informes/nuevo" className="boton">
          <FilePlus2 className="h-4 w-4" /> Nuevo informe
        </Link>
      </div>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {stats.map(({ label, valor, icono: Icono, color }) => (
          <div key={label} className="tarjeta flex items-center gap-3 p-4">
            <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${color}`}>
              <Icono className="h-5 w-5" />
            </span>
            <div className="min-w-0">
              <p className="text-2xl font-bold leading-none">{valor}</p>
              <p className="mt-1 truncate text-xs font-medium text-grafito-500">{label}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="tarjeta overflow-hidden">
        <div className="flex flex-col gap-3 border-b border-grafito-100 p-4 md:flex-row md:items-center">
          <div className="relative md:max-w-xs md:flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-grafito-400" />
            <input
              className="campo py-2 pl-9"
              placeholder="Buscar cliente, equipo, serie…"
              value={q}
              onChange={(e) => setQ(e.target.value)}
            />
          </div>
          <div className="-mx-1 flex gap-1 overflow-x-auto px-1 md:ml-auto">
            {FILTROS.map((f) => (
              <button
                key={f.valor}
                onClick={() => setFiltro(f.valor)}
                className={`whitespace-nowrap rounded-lg px-3 py-1.5 text-sm font-medium transition ${
                  filtro === f.valor ? "bg-grafito-900 text-white" : "text-grafito-500 hover:bg-grafito-100"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {informes === null ? (
          <div className="p-10" />
        ) : visibles.length === 0 ? (
          <div className="flex flex-col items-center gap-3 px-6 py-16 text-center">
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-grafito-100 text-grafito-400">
              <FileText className="h-6 w-6" />
            </span>
            <p className="font-semibold">{informes.length === 0 ? "Aún no hay informes" : "Sin resultados"}</p>
            <p className="max-w-xs text-sm text-grafito-500">
              {informes.length === 0 ? "Crea el primer informe de evaluación." : "Prueba con otra búsqueda o filtro."}
            </p>
          </div>
        ) : (
          <ul className="divide-y divide-grafito-100">
            {visibles.map((i) => (
              <li key={i.id}>
                <Link
                  href={`/informes/${i.id}`}
                  className="group flex items-center gap-4 px-4 py-4 transition hover:bg-grafito-50 sm:px-5"
                >
                  <div className="hidden w-24 shrink-0 sm:block">
                    <p className="font-mono text-xs font-semibold text-grafito-500">{i.folio}</p>
                    <p className="mt-0.5 text-xs text-grafito-400">{fechaCorta(i.fecha)}</p>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-semibold">{i.cliente || "Sin cliente"}</p>
                    <p className="mt-0.5 truncate text-sm text-grafito-500">
                      {[i.marca, i.modelo].filter(Boolean).join(" ") || "Equipo sin datos"}
                      {i.potenciaKva && ` · ${i.potenciaKva} kVA`}
                      <span className="sm:hidden"> · {fechaCorta(i.fecha)}</span>
                    </p>
                  </div>
                  <p className="hidden w-44 shrink-0 text-sm text-grafito-500 lg:block">{TIPO_SERVICIO_LABEL[i.tipoServicio]}</p>
                  <div className="shrink-0">
                    <BadgeEstado estado={i.estadoGeneral} />
                  </div>
                  <ChevronRight className="h-4 w-4 shrink-0 text-grafito-400 transition group-hover:translate-x-0.5" />
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
