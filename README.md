# Informes de Generadores · LE Energy

App web para registrar evaluaciones técnicas de grupos electrógenos: inspecciones,
mantenciones preventivas/correctivas y pruebas en carga, con informe imprimible en PDF.

Hecha con Next.js 15, React 19, Tailwind CSS 4 y lucide-react.

## Modo prueba

Por ahora la app funciona **sin backend**:

- El inicio de sesión no valida credenciales: se puede entrar con los campos vacíos
  (o con el botón "Entrar como invitado").
- Los informes se guardan en el `localStorage` del navegador. La primera vez se cargan
  3 informes de ejemplo.

Para producción hay que conectar autenticación y base de datos (p. ej. Supabase)
reemplazando las funciones de `lib/session.ts` y `lib/store.ts`, que ya están
aisladas con esa intención.

## Desarrollo

```bash
npm install
npm run dev
```

Abre http://localhost:3000.

## Estructura

```
app/login                 Inicio de sesión
app/(app)/layout.tsx      Encabezado y control de sesión
app/(app)/informes        Listado con búsqueda, filtros y resumen
app/(app)/informes/nuevo  Formulario de nuevo informe
app/(app)/informes/[id]   Informe imprimible (+ /editar)
components/               Formulario y badges de estado
lib/                      Tipos, almacenamiento y sesión
```
