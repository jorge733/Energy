"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Building2, ClipboardCheck, Cpu, Gauge, Loader2, NotebookPen, Save } from "lucide-react";
import { guardarInforme } from "@/lib/store";
import {
  ESTADO_GENERAL_LABEL,
  ESTADO_ITEM_LABEL,
  EstadoGeneral,
  EstadoItem,
  Informe,
  SECCIONES_REVISION,
  TIPO_SERVICIO_LABEL,
  TipoServicio,
} from "@/lib/types";
import { ITEM_ESTILO } from "./Estado";

type CampoTexto = { [K in keyof Informe]: Informe[K] extends string ? K : never }[keyof Informe];

export default function InformeForm({ inicial }: { inicial: Informe }) {
  const router = useRouter();
  const [inf, setInf] = useState<Informe>(inicial);
  const [guardando, setGuardando] = useState(false);

  const set = <K extends keyof Informe>(k: K, v: Informe[K]) => setInf((p) => ({ ...p, [k]: v }));

  const setItem = (id: string, cambios: Partial<{ estado: EstadoItem; nota: string }>) =>
    setInf((p) => ({ ...p, items: p.items.map((it) => (it.id === id ? { ...it, ...cambios } : it)) }));

  const campo = (k: CampoTexto, label: string, props: React.InputHTMLAttributes<HTMLInputElement> = {}) => (
    <div>
      <label htmlFor={k} className="etiqueta">{label}</label>
      <input id={k} className="campo" value={inf[k]} onChange={(e) => set(k, e.target.value)} {...props} />
    </div>
  );

  const conUnidad = (k: CampoTexto, label: string, unidad: string) => (
    <div>
      <label htmlFor={k} className="etiqueta">{label}</label>
      <div className="relative">
        <input id={k} className="campo pr-12" inputMode="decimal" value={inf[k]} onChange={(e) => set(k, e.target.value)} />
        <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-sm text-grafito-400">{unidad}</span>
      </div>
    </div>
  );

  function enviar(e: React.FormEvent) {
    e.preventDefault();
    setGuardando(true);
    const guardado = guardarInforme(inf);
    router.push(`/informes/${guardado.id}`);
  }

  const resumen = inf.items.reduce(
    (acc, it) => ({ ...acc, [it.estado]: acc[it.estado] + 1 }),
    { ok: 0, observacion: 0, falla: 0, na: 0 } as Record<EstadoItem, number>,
  );

  return (
    <form onSubmit={enviar} className="space-y-6 pb-24">
      <Seccion icono={Building2} titulo="Cliente y servicio">
        <div className="grid gap-4 sm:grid-cols-2">
          {campo("cliente", "Cliente", { required: true, placeholder: "Nombre de la empresa" })}
          {campo("ubicacion", "Ubicación", { placeholder: "Dirección o faena" })}
          {campo("contacto", "Contacto en sitio", { placeholder: "Nombre y teléfono" })}
          {campo("tecnico", "Técnico responsable")}
          {campo("fecha", "Fecha de visita", { type: "date", required: true })}
          <div>
            <label htmlFor="tipoServicio" className="etiqueta">Tipo de servicio</label>
            <select
              id="tipoServicio"
              className="campo"
              value={inf.tipoServicio}
              onChange={(e) => set("tipoServicio", e.target.value as TipoServicio)}
            >
              {Object.entries(TIPO_SERVICIO_LABEL).map(([v, l]) => (
                <option key={v} value={v}>{l}</option>
              ))}
            </select>
          </div>
        </div>
      </Seccion>

      <Seccion icono={Cpu} titulo="Datos del equipo">
        <div className="grid gap-4 sm:grid-cols-3">
          {campo("marca", "Marca", { placeholder: "Cummins, CAT, Perkins…" })}
          {campo("modelo", "Modelo")}
          {campo("serie", "N° de serie")}
          {conUnidad("potenciaKva", "Potencia", "kVA")}
          {conUnidad("horometro", "Horómetro", "h")}
          {conUnidad("combustiblePct", "Combustible", "%")}
        </div>
      </Seccion>

      <Seccion
        icono={ClipboardCheck}
        titulo="Revisión de componentes"
        extra={
          <div className="flex gap-3 text-xs font-semibold">
            <span className="text-marca-600">{resumen.ok} OK</span>
            <span className="text-amber-600">{resumen.observacion} Obs.</span>
            <span className="text-red-600">{resumen.falla} Falla</span>
          </div>
        }
      >
        <div className="space-y-6">
          {SECCIONES_REVISION.map((sec) => (
            <div key={sec.titulo}>
              <h3 className="mb-2 text-sm font-bold text-grafito-700">{sec.titulo}</h3>
              <div className="divide-y divide-grafito-100 rounded-xl border border-grafito-100">
                {sec.items.map(({ id, label }) => {
                  const it = inf.items.find((x) => x.id === id) ?? { id, estado: "ok" as EstadoItem, nota: "" };
                  return (
                    <div key={id} className="p-3 sm:px-4">
                      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                        <span className="text-sm font-medium">{label}</span>
                        <div className="flex gap-1" role="radiogroup" aria-label={label}>
                          {(Object.keys(ESTADO_ITEM_LABEL) as EstadoItem[]).map((e) => (
                            <button
                              key={e}
                              type="button"
                              role="radio"
                              aria-checked={it.estado === e}
                              onClick={() => setItem(id, { estado: e })}
                              className={`min-w-14 rounded-md border px-2.5 py-1.5 text-xs font-semibold transition ${
                                it.estado === e
                                  ? ITEM_ESTILO[e].activo
                                  : "border-grafito-200 bg-white text-grafito-500 hover:border-grafito-400"
                              }`}
                            >
                              {ESTADO_ITEM_LABEL[e]}
                            </button>
                          ))}
                        </div>
                      </div>
                      {(it.estado === "observacion" || it.estado === "falla") && (
                        <input
                          className="campo mt-2 py-2 text-sm"
                          placeholder="Describe el hallazgo…"
                          value={it.nota}
                          onChange={(e) => setItem(id, { nota: e.target.value })}
                        />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </Seccion>

      <Seccion icono={Gauge} titulo="Prueba en carga">
        <div className="grid gap-4 sm:grid-cols-3">
          {conUnidad("voltajeL1", "Voltaje L1", "V")}
          {conUnidad("voltajeL2", "Voltaje L2", "V")}
          {conUnidad("voltajeL3", "Voltaje L3", "V")}
          {conUnidad("frecuencia", "Frecuencia", "Hz")}
          {conUnidad("cargaPct", "Carga aplicada", "%")}
          {conUnidad("presionAceite", "Presión de aceite", "psi")}
          {conUnidad("temperatura", "Temperatura motor", "°C")}
        </div>
      </Seccion>

      <Seccion icono={NotebookPen} titulo="Conclusión">
        <div className="space-y-4">
          <div>
            <span className="etiqueta">Estado general del equipo</span>
            <div className="grid gap-2 sm:grid-cols-3">
              {(Object.keys(ESTADO_GENERAL_LABEL) as EstadoGeneral[]).map((e) => {
                const activo = inf.estadoGeneral === e;
                const color =
                  e === "operativo"
                    ? "border-marca-500 bg-marca-50 text-marca-700"
                    : e === "con_observaciones"
                      ? "border-amber-500 bg-amber-50 text-amber-800"
                      : "border-red-500 bg-red-50 text-red-700";
                return (
                  <button
                    key={e}
                    type="button"
                    onClick={() => set("estadoGeneral", e)}
                    className={`rounded-xl border-2 px-4 py-3 text-sm font-semibold transition ${
                      activo ? color : "border-grafito-100 text-grafito-500 hover:border-grafito-200"
                    }`}
                  >
                    {ESTADO_GENERAL_LABEL[e]}
                  </button>
                );
              })}
            </div>
          </div>
          <div>
            <label htmlFor="observaciones" className="etiqueta">Observaciones</label>
            <textarea
              id="observaciones"
              rows={4}
              className="campo resize-y"
              value={inf.observaciones}
              onChange={(e) => set("observaciones", e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="recomendaciones" className="etiqueta">Recomendaciones</label>
            <textarea
              id="recomendaciones"
              rows={3}
              className="campo resize-y"
              value={inf.recomendaciones}
              onChange={(e) => set("recomendaciones", e.target.value)}
            />
          </div>
        </div>
      </Seccion>

      <div className="fixed inset-x-0 bottom-0 z-10 border-t border-grafito-100 bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-end gap-3 px-4 py-3 sm:px-6">
          <span className="mr-auto hidden font-mono text-sm text-grafito-500 sm:block">{inf.folio}</span>
          <button type="button" onClick={() => router.back()} className="boton-sec">Cancelar</button>
          <button className="boton" disabled={guardando}>
            {guardando ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            Guardar informe
          </button>
        </div>
      </div>
    </form>
  );
}

function Seccion({
  icono: Icono,
  titulo,
  extra,
  children,
}: {
  icono: typeof Cpu;
  titulo: string;
  extra?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section className="tarjeta p-5 sm:p-6">
      <div className="mb-5 flex items-center gap-3">
        <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-marca-50 text-marca-600">
          <Icono className="h-[18px] w-[18px]" />
        </span>
        <h2 className="text-lg font-bold">{titulo}</h2>
        {extra && <div className="ml-auto">{extra}</div>}
      </div>
      {children}
    </section>
  );
}
