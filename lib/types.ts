export type EstadoItem = "ok" | "observacion" | "falla" | "na";

export type EstadoGeneral = "operativo" | "con_observaciones" | "fuera_de_servicio";

export type TipoServicio = "preventivo" | "correctivo" | "inspeccion" | "puesta_en_marcha";

export interface ItemRevision {
  id: string;
  estado: EstadoItem;
  nota: string;
}

export interface Informe {
  id: string;
  folio: string;
  creadoEn: string;
  actualizadoEn: string;
  fecha: string;
  tecnico: string;
  tipoServicio: TipoServicio;
  // Cliente
  cliente: string;
  ubicacion: string;
  contacto: string;
  // Equipo
  marca: string;
  modelo: string;
  serie: string;
  potenciaKva: string;
  horometro: string;
  combustiblePct: string;
  // Revisión
  items: ItemRevision[];
  // Prueba en carga
  voltajeL1: string;
  voltajeL2: string;
  voltajeL3: string;
  frecuencia: string;
  cargaPct: string;
  presionAceite: string;
  temperatura: string;
  // Cierre
  estadoGeneral: EstadoGeneral;
  observaciones: string;
  recomendaciones: string;
}

export const SECCIONES_REVISION: { titulo: string; items: { id: string; label: string }[] }[] = [
  {
    titulo: "Motor",
    items: [
      { id: "aceite", label: "Nivel y estado de aceite" },
      { id: "refrigerante", label: "Nivel de refrigerante" },
      { id: "filtro_aire", label: "Filtro de aire" },
      { id: "filtro_combustible", label: "Filtro de combustible" },
      { id: "correas", label: "Correas y mangueras" },
      { id: "fugas", label: "Fugas (aceite, agua, combustible)" },
    ],
  },
  {
    titulo: "Sistema eléctrico",
    items: [
      { id: "bateria", label: "Batería y bornes" },
      { id: "cargador", label: "Cargador de batería" },
      { id: "alternador", label: "Alternador" },
      { id: "tablero", label: "Tablero de control" },
      { id: "transferencia", label: "Transferencia automática (ATS)" },
    ],
  },
  {
    titulo: "Generales",
    items: [
      { id: "escape", label: "Sistema de escape" },
      { id: "estanque", label: "Estanque de combustible" },
      { id: "limpieza", label: "Limpieza y entorno del equipo" },
    ],
  },
];

export const TIPO_SERVICIO_LABEL: Record<TipoServicio, string> = {
  preventivo: "Mantención preventiva",
  correctivo: "Mantención correctiva",
  inspeccion: "Inspección técnica",
  puesta_en_marcha: "Puesta en marcha",
};

export const ESTADO_GENERAL_LABEL: Record<EstadoGeneral, string> = {
  operativo: "Operativo",
  con_observaciones: "Con observaciones",
  fuera_de_servicio: "Fuera de servicio",
};

export const ESTADO_ITEM_LABEL: Record<EstadoItem, string> = {
  ok: "OK",
  observacion: "Obs.",
  falla: "Falla",
  na: "N/A",
};
