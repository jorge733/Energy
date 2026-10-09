"use client";

// Sesión de prueba guardada en el navegador. No es autenticación real:
// sirve solo para probar la app mientras no hay backend conectado.

const KEY = "le-energy:sesion";

export interface Sesion {
  nombre: string;
  correo: string;
  invitado: boolean;
}

export function obtenerSesion(): Sesion | null {
  try {
    const raw = localStorage.getItem(KEY) ?? sessionStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as Sesion) : null;
  } catch {
    return null;
  }
}

export function iniciarSesion(correo: string, recordar: boolean): Sesion {
  const limpio = correo.trim();
  const sesion: Sesion = limpio
    ? { nombre: nombreDesdeCorreo(limpio), correo: limpio, invitado: false }
    : { nombre: "Invitado", correo: "", invitado: true };
  try {
    (recordar ? localStorage : sessionStorage).setItem(KEY, JSON.stringify(sesion));
  } catch {
    // sin almacenamiento disponible
  }
  return sesion;
}

export function cerrarSesion() {
  try {
    localStorage.removeItem(KEY);
    sessionStorage.removeItem(KEY);
  } catch {
    // sin almacenamiento disponible
  }
}

function nombreDesdeCorreo(correo: string) {
  const local = correo.split("@")[0].replace(/[._-]+/g, " ");
  return local.replace(/\b\w/g, (c) => c.toUpperCase());
}
