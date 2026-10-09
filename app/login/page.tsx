"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Eye, EyeOff, FlaskConical, Loader2, Lock, Mail } from "lucide-react";
import { iniciarSesion } from "@/lib/session";

export default function LoginPage() {
  const router = useRouter();
  const [correo, setCorreo] = useState("");
  const [clave, setClave] = useState("");
  const [verClave, setVerClave] = useState(false);
  const [recordar, setRecordar] = useState(true);
  const [cargando, setCargando] = useState(false);

  // Modo prueba: los campos son opcionales y cualquier valor permite entrar.
  function entrar(e?: React.FormEvent) {
    e?.preventDefault();
    setCargando(true);
    iniciarSesion(correo, recordar);
    router.push("/informes");
  }

  return (
    <main className="grid min-h-screen lg:grid-cols-[1.1fr_1fr]">
      {/* Panel de marca */}
      <section className="relative hidden overflow-hidden bg-grafito-950 lg:block">
        <img
          src="/fondo-inicio.jpg"
          alt=""
          className="absolute inset-0 h-full w-full object-cover object-[70%_center] opacity-70"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-grafito-950 via-grafito-950/40 to-grafito-950/10" />
        <div className="relative flex h-full flex-col justify-end p-12 text-white">
          <p className="mb-3 inline-flex w-fit items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider backdrop-blur">
            <span className="h-1.5 w-1.5 rounded-full bg-marca-400" />
            Servicio técnico
          </p>
          <h2 className="max-w-md text-4xl font-extrabold leading-tight">
            Energía confiable, respaldada por informes precisos.
          </h2>
          <p className="mt-4 max-w-md text-grafito-200">
            Registra inspecciones, mantenciones y pruebas en carga de grupos electrógenos desde terreno.
          </p>
        </div>
      </section>

      {/* Formulario */}
      <section className="relative flex items-center justify-center bg-grafito-900 px-4 py-12 sm:px-8">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_50%_at_50%_0%,rgba(58,166,74,0.18),transparent)]" />
        <div className="relative w-full max-w-sm">
          <div className="mb-8 text-center">
            <img src="/logo-le-energy.png" alt="LE Energy" className="mx-auto mb-5 h-20 w-auto" />
            <h1 className="text-2xl font-bold text-white">Informes de Generadores</h1>
            <p className="mt-1 text-sm text-grafito-400">Evaluaciones técnicas de grupos electrógenos</p>
          </div>

          <div className="rounded-2xl bg-white p-6 shadow-2xl shadow-black/40 sm:p-7">
            <div className="mb-5 flex items-start gap-2.5 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2.5 text-[13px] leading-snug text-amber-900">
              <FlaskConical className="mt-0.5 h-4 w-4 shrink-0" />
              <span>
                <b>Modo prueba:</b> puedes entrar sin escribir correo ni contraseña.
              </span>
            </div>

            <form onSubmit={entrar} className="space-y-4">
              <div>
                <label htmlFor="correo" className="etiqueta">Correo</label>
                <div className="relative">
                  <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-grafito-400" />
                  <input
                    id="correo"
                    className="campo pl-9"
                    type="email"
                    placeholder="nombre@empresa.cl"
                    autoComplete="email"
                    value={correo}
                    onChange={(e) => setCorreo(e.target.value)}
                  />
                </div>
              </div>
              <div>
                <label htmlFor="clave" className="etiqueta">Contraseña</label>
                <div className="relative">
                  <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-grafito-400" />
                  <input
                    id="clave"
                    className="campo px-9"
                    type={verClave ? "text" : "password"}
                    placeholder="••••••••"
                    autoComplete="current-password"
                    value={clave}
                    onChange={(e) => setClave(e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={() => setVerClave((v) => !v)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 text-grafito-400 hover:text-grafito-700"
                    aria-label={verClave ? "Ocultar contraseña" : "Mostrar contraseña"}
                  >
                    {verClave ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <label className="flex cursor-pointer items-center gap-2 text-sm text-grafito-700">
                <input
                  type="checkbox"
                  className="h-4 w-4 cursor-pointer accent-marca-500"
                  checked={recordar}
                  onChange={(e) => setRecordar(e.target.checked)}
                />
                Mantener sesión iniciada
              </label>

              <button className="boton w-full py-3" disabled={cargando}>
                {cargando ? <Loader2 className="h-4 w-4 animate-spin" /> : <>Entrar <ArrowRight className="h-4 w-4" /></>}
              </button>
            </form>

            <div className="my-5 flex items-center gap-3 text-xs text-grafito-400">
              <span className="h-px flex-1 bg-grafito-100" /> o <span className="h-px flex-1 bg-grafito-100" />
            </div>

            <button type="button" onClick={() => entrar()} className="boton-sec w-full" disabled={cargando}>
              Entrar como invitado
            </button>
          </div>

          <p className="mt-8 text-center text-xs text-grafito-500">© {new Date().getFullYear()} LE Energy</p>
        </div>
      </section>
    </main>
  );
}
