import type { Tone } from '../../mobile'

/* Datos de ejemplo del grupo «Kit, grupo y perfil» (tomados del lienzo: F01–F04, G01, H01–H04). */

/* ── Kit de Emociones ───────────────────────────────── */

/** Emociones del check-in «¿Cómo llegas hoy?» (F01). `id` va en la ruta; `texto` se usa en la frase del Kit. */
export const EMOCIONES = [
  { id: 'feliz', label: 'Feliz', texto: 'feliz' },
  { id: 'tranquila', label: 'Tranquila', texto: 'tranquila' },
  { id: 'cansada', label: 'Cansada', texto: 'cansada' },
  { id: 'preocupada', label: 'Preocupada', texto: 'preocupada' },
  { id: 'enojada', label: 'Enojada', texto: 'enojada' },
] as const
export const emocionDe = (id: string | null) => EMOCIONES.find((e) => e.id === id) ?? null

/** Avatares del Kit (F04): el mismo rostro en 8 colores. Se guarda el tono en `s.kit.avatar`. */
export const AVATARES: Tone[] = ['secondary', 'green', 'blue', 'indigo', 'orange', 'red', 'teal', 'primary']
export const AVATAR_INICIAL: Tone = 'secondary'
export const avatarDe = (a: string | null): Tone => AVATARES.find((t) => t === a) ?? AVATAR_INICIAL

export interface Burbuja { de: 'kit' | 'yo'; texto: string }

/** Conversación de ejemplo del lienzo (F02), después del saludo del Kit. */
export const CONVERSACION_EJEMPLO: Burbuja[] = [
  { de: 'yo', texto: 'Dormí poco porque tenía que terminar una tarea.' },
  { de: 'kit', texto: 'Gracias por contarme. A veces pasa. ¿Qué crees que te ayudaría a organizar mejor tus tareas?' },
]

/** Respuestas de ejemplo del Kit (en el producto las da el asistente en línea). Se usan en orden. */
export const RESPUESTAS_KIT = [
  'Te entiendo. Está bien sentirse así. ¿Quieres que pensemos juntos en algo pequeño que puedas hacer hoy?',
  'Gracias por confiar en mí. Si lo necesitas, también puedes hablar con el equipo de bienestar de tu colegio.',
  'Eso suena importante. ¿Cómo te sentirías si lo intentas mañana con más calma?',
  'Me alegra que me lo cuentes. Recuerda descansar y tomar agua entre clase y clase.',
]

/* ── Mi grupo ───────────────────────────────────────── */

export interface Companero { nombre: string; apellidos: string }

/** Integrantes del grupo (G01). La lista completa tiene 32; el lienzo muestra los primeros por apellido. */
export const GRUPO_INTEGRANTES = 32
export const COMPANEROS: Companero[] = [
  { nombre: 'Samuel', apellidos: 'Bermúdez Cano' },
  { nombre: 'Isabella', apellidos: 'Cárdenas Mejía' },
  { nombre: 'Matías', apellidos: 'Duque Henao' },
  { nombre: 'Sara', apellidos: 'Echeverri Ruiz' },
  { nombre: 'Emiliano', apellidos: 'Franco López' },
  { nombre: 'Mariana', apellidos: 'García Ospina' },
  { nombre: 'Tomás', apellidos: 'Hoyos Vélez' },
  { nombre: 'Antonella', apellidos: 'Jaramillo Toro' },
]

/* ── Apps para documentos ───────────────────────────── */

export interface AppDocumentos { id: string; nombre: string; detalle: string; tono: Tone; busqueda: string }

/** Apps recomendadas para abrir Word, Excel y PowerPoint (H02, por validar). */
export const APPS_DOCUMENTOS: AppDocumentos[] = [
  { id: 'microsoft', nombre: 'Microsoft Word, Excel y PowerPoint', detalle: 'Una app para cada tipo de archivo.', tono: 'blue', busqueda: 'Microsoft Word' },
  { id: 'wps', nombre: 'WPS Office', detalle: 'Abre los tres tipos de archivo en una sola app.', tono: 'orange', busqueda: 'WPS Office' },
  { id: 'google', nombre: 'Documentos, Hojas de cálculo y Presentaciones de Google', detalle: 'Una app para cada tipo de archivo.', tono: 'green', busqueda: 'Documentos de Google' },
]
