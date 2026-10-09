import { CheckCircle2, AlertTriangle, XCircle, MinusCircle } from "lucide-react";
import { ESTADO_GENERAL_LABEL, ESTADO_ITEM_LABEL, EstadoGeneral, EstadoItem } from "@/lib/types";

const GENERAL_ESTILO: Record<EstadoGeneral, string> = {
  operativo: "bg-marca-50 text-marca-700 ring-marca-200",
  con_observaciones: "bg-amber-50 text-amber-800 ring-amber-200",
  fuera_de_servicio: "bg-red-50 text-red-700 ring-red-200",
};

const GENERAL_PUNTO: Record<EstadoGeneral, string> = {
  operativo: "bg-marca-500",
  con_observaciones: "bg-amber-500",
  fuera_de_servicio: "bg-red-500",
};

export function BadgeEstado({ estado }: { estado: EstadoGeneral }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset ${GENERAL_ESTILO[estado]}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${GENERAL_PUNTO[estado]}`} />
      {ESTADO_GENERAL_LABEL[estado]}
    </span>
  );
}

export const ITEM_ESTILO: Record<EstadoItem, { activo: string; icono: typeof CheckCircle2; texto: string }> = {
  ok: { activo: "bg-marca-500 text-white border-marca-500", icono: CheckCircle2, texto: "text-marca-600" },
  observacion: { activo: "bg-amber-500 text-white border-amber-500", icono: AlertTriangle, texto: "text-amber-600" },
  falla: { activo: "bg-red-500 text-white border-red-500", icono: XCircle, texto: "text-red-600" },
  na: { activo: "bg-grafito-500 text-white border-grafito-500", icono: MinusCircle, texto: "text-grafito-400" },
};

export function IconoItem({ estado }: { estado: EstadoItem }) {
  const { icono: Icono, texto } = ITEM_ESTILO[estado];
  return (
    <span className={`inline-flex items-center gap-1 text-xs font-semibold ${texto}`}>
      <Icono className="h-4 w-4" />
      {ESTADO_ITEM_LABEL[estado]}
    </span>
  );
}
