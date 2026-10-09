"use client";

import { Informe, SECCIONES_REVISION } from "./types";

// Almacenamiento local (modo demo). Para producción, reemplazar estas funciones
// por llamadas a la base de datos (p. ej. Supabase) manteniendo la misma firma.

const KEY = "le-energy:informes";

function leer(): Informe[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(KEY);
    if (raw === null) {
      const semilla = datosDemo();
      localStorage.setItem(KEY, JSON.stringify(semilla));
      return semilla;
    }
    return JSON.parse(raw) as Informe[];
  } catch {
    return [];
  }
}

function guardar(lista: Informe[]) {
  try {
    localStorage.setItem(KEY, JSON.stringify(lista));
  } catch {
    // almacenamiento no disponible (modo privado, cuota llena)
  }
}

export function listarInformes(): Informe[] {
  return leer().sort((a, b) => b.fecha.localeCompare(a.fecha) || b.creadoEn.localeCompare(a.creadoEn));
}

export function obtenerInforme(id: string): Informe | undefined {
  return leer().find((i) => i.id === id);
}

export function guardarInforme(informe: Informe): Informe {
  const lista = leer();
  const ahora = new Date().toISOString();
  const idx = lista.findIndex((i) => i.id === informe.id);
  const final = { ...informe, actualizadoEn: ahora };
  if (idx >= 0) lista[idx] = final;
  else lista.push(final);
  guardar(lista);
  return final;
}

export function eliminarInforme(id: string) {
  guardar(leer().filter((i) => i.id !== id));
}

export function siguienteFolio(): string {
  const max = leer().reduce((m, i) => Math.max(m, parseInt(i.folio.replace(/\D/g, ""), 10) || 0), 0);
  return `INF-${String(max + 1).padStart(4, "0")}`;
}

export function nuevoId(): string {
  return typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : Math.random().toString(36).slice(2) + Date.now().toString(36);
}

export function informeVacio(tecnico: string): Informe {
  return { ...plantilla(tecnico), folio: siguienteFolio() };
}

// No lee el almacenamiento, para poder usarse al generar los datos demo.
function plantilla(tecnico: string): Informe {
  const ahora = new Date().toISOString();
  return {
    id: nuevoId(),
    folio: "",
    creadoEn: ahora,
    actualizadoEn: ahora,
    fecha: ahora.slice(0, 10),
    tecnico,
    tipoServicio: "preventivo",
    cliente: "",
    ubicacion: "",
    contacto: "",
    marca: "",
    modelo: "",
    serie: "",
    potenciaKva: "",
    horometro: "",
    combustiblePct: "",
    items: SECCIONES_REVISION.flatMap((s) => s.items.map((it) => ({ id: it.id, estado: "ok" as const, nota: "" }))),
    voltajeL1: "",
    voltajeL2: "",
    voltajeL3: "",
    frecuencia: "",
    cargaPct: "",
    presionAceite: "",
    temperatura: "",
    estadoGeneral: "operativo",
    observaciones: "",
    recomendaciones: "",
  };
}

function datosDemo(): Informe[] {
  const base = (n: number, d: Partial<Informe>): Informe => {
    const i = plantilla("Técnico demo");
    const fecha = new Date(Date.now() - n * 86400000).toISOString();
    return { ...i, id: `demo-${n}`, folio: `INF-${String(100 - n).padStart(4, "0")}`, fecha: fecha.slice(0, 10), creadoEn: fecha, actualizadoEn: fecha, ...d };
  };
  const conFallas = (fallas: Record<string, ["observacion" | "falla", string]>) =>
    plantilla("").items.map((it) =>
      fallas[it.id] ? { ...it, estado: fallas[it.id][0], nota: fallas[it.id][1] } : it,
    );
  return [
    base(2, {
      cliente: "Clínica Los Andes",
      ubicacion: "Av. Las Condes 1234, Santiago",
      contacto: "Mario Rojas · +56 9 1234 5678",
      marca: "Cummins",
      modelo: "C150D5",
      serie: "CUM-77812",
      potenciaKva: "150",
      horometro: "2.430",
      combustiblePct: "85",
      voltajeL1: "380",
      voltajeL2: "381",
      voltajeL3: "379",
      frecuencia: "50,0",
      cargaPct: "60",
      presionAceite: "55",
      temperatura: "82",
      observaciones: "Equipo en buen estado general. Prueba en carga sin novedades.",
      recomendaciones: "Próxima mantención a las 2.680 horas o en 6 meses.",
    }),
    base(6, {
      tipoServicio: "inspeccion",
      cliente: "Minera Cerro Verde",
      ubicacion: "Faena Norte, Antofagasta",
      contacto: "Paula Fuentes",
      marca: "Caterpillar",
      modelo: "C18",
      serie: "CAT-55201",
      potenciaKva: "625",
      horometro: "11.902",
      combustiblePct: "40",
      items: conFallas({ bateria: ["observacion", "Bornes con sulfatación, se limpian"], correas: ["observacion", "Correa de ventilador con desgaste"] }),
      voltajeL1: "400",
      voltajeL2: "398",
      voltajeL3: "401",
      frecuencia: "50,1",
      cargaPct: "45",
      estadoGeneral: "con_observaciones",
      observaciones: "Operativo. Se detecta desgaste en correa y sulfatación en bornes.",
      recomendaciones: "Reemplazar correa de ventilador en próxima visita. Cotizar batería nueva.",
    }),
    base(13, {
      tipoServicio: "correctivo",
      cliente: "Centro Logístico Pudahuel",
      ubicacion: "Camino Lo Boza 500, Pudahuel",
      marca: "Perkins",
      modelo: "1106A-70TAG",
      serie: "PK-90311",
      potenciaKva: "200",
      horometro: "6.115",
      combustiblePct: "15",
      items: conFallas({ transferencia: ["falla", "ATS no conmuta a red"], cargador: ["falla", "Sin salida de carga"] }),
      estadoGeneral: "fuera_de_servicio",
      observaciones: "Transferencia automática no conmuta. Cargador de batería sin salida.",
      recomendaciones: "Reemplazo de módulo ATS y cargador. Equipo queda en modo manual.",
    }),
  ];
}
