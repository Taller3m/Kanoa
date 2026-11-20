import type { TipoJuego } from '../games/types'

/**
 * Simulación mínima de Micrositios para la HU-PW-181 (agregar y publicar juegos como contenido de una sección).
 * Solo existen las secciones necesarias para probar el flujo; el resto de la administración de micrositios está fuera del alcance.
 */
export interface Seccion { id: string; micro: string; sec: string; desc: string }

export type EstadoCont = 'Publicado' | 'Borrador' | 'Inactivo'
export type TipoContenido = 'Solo texto' | 'Imágenes' | 'Video' | 'Documentos descargables' | 'Tablero BI' | 'Juego'

export interface Contenido {
  id: number
  sec: string // Seccion.id
  tipo: TipoContenido
  titulo: string // en Juego es opcional: si está vacío se muestran los nombres de los juegos
  detalle?: string // resumen para los tipos que no son Juego (p. ej. «Imágenes · 4»)
  estado: EstadoCont
  autor: string
  creado: string
  editada: string
  juego?: { tipo: TipoJuego; ids: number[] }
}

export const SECCIONES: Seccion[] = [
  { id: 'bienestar-emocional/sentir', micro: 'Bienestar emocional', sec: 'Sentir', desc: 'Contenidos para reconocer y nombrar lo que sentimos.' },
  { id: 'bienestar-emocional/expresar', micro: 'Bienestar emocional', sec: 'Expresar', desc: 'Actividades para contar lo que sentimos de forma segura.' },
  { id: 'ser-stem/ciencia-en-casa', micro: 'Ser + Stem', sec: 'Ciencia en casa', desc: 'Experimentos y retos de ciencia para hacer en familia.' },
]
export const seccionDe = (id: string) => SECCIONES.find((s) => s.id === id)
export const lugarDe = (s: Seccion) => `${s.micro} › ${s.sec}`

export const TIPOS_CONTENIDO: { nombre: TipoContenido; desc: string; icon: string; tone: 'blue' | 'orange' | 'indigo' | 'green' }[] = [
  { nombre: 'Solo texto', desc: 'Título y texto enriquecido como base del contenido.', icon: 'notes', tone: 'green' },
  { nombre: 'Imágenes', desc: 'Hasta 5 imágenes con descripción. Con más de una se muestran en carrusel.', icon: 'photo_library', tone: 'blue' },
  { nombre: 'Video', desc: 'Un video subido o embebido desde YouTube, con descripción.', icon: 'smart_display', tone: 'orange' },
  { nombre: 'Documentos descargables', desc: 'Hasta 3 archivos adjuntos (PDF, DOC, DOCX, XLS, XLSX, PPTX) con descripción.', icon: 'description', tone: 'indigo' },
  { nombre: 'Tablero BI', desc: 'Un tablero de Power BI publicado en la web, con título, descripción, fuente y fecha de actualización.', icon: 'monitoring', tone: 'blue' },
  { nombre: 'Juego', desc: 'Uno o varios juegos creados en el módulo Juegos: crucigrama, cuenta cuentos, memoria o Crece conmigo.', icon: 'sports_esports', tone: 'green' },
]

const C = (id: number, sec: string, tipo: TipoContenido, titulo: string, estado: EstadoCont, extra: Partial<Contenido> = {}): Contenido =>
  ({ id, sec, tipo, titulo, estado, autor: 'María Castaño', creado: '15 ago 2026', editada: '12 sep 2026', ...extra })

/**
 * Contenidos de ejemplo. Casos de la HU-PW-181 que permiten probar:
 *  · «Memorama de emociones» (3) publicado en dos secciones → «Publicado en:» con las dos (escenario 3).
 *  · «El café colombiano» (1) publicado → no se puede eliminar desde Juegos.
 *  · Contenido inactivo con «Partes de la planta» (6) en Borrador → no se puede volver a publicar (escenario 9).
 *  · Contenido inactivo sin juegos → etiqueta «Sin juegos» (escenarios 11 y 12).
 */
export function seedContenidos(): Contenido[] {
  const S = 'bienestar-emocional/sentir', E = 'bienestar-emocional/expresar', K = 'ser-stem/ciencia-en-casa'
  return [
    C(101, S, 'Solo texto', '¿Quién soy cuando nadie me mira?', 'Publicado'),
    C(102, S, 'Imágenes', 'Mapa de fortalezas personales', 'Publicado', { detalle: 'Imágenes · 4 · plantilla Izquierda', editada: '9 sep 2026' }),
    C(103, S, 'Juego', 'Juega con tus emociones', 'Publicado', { juego: { tipo: 'Memoria', ids: [3] }, creado: '5 nov 2026', editada: '5 nov 2026' }),
    C(104, S, 'Video', 'Video: reconocer lo que siento', 'Borrador', { detalle: 'Video · plantilla Superior', autor: 'Julián Ospina', editada: '5 sep 2026' }),
    C(105, S, 'Documentos descargables', 'Diario emocional para imprimir', 'Inactivo', { detalle: 'Documentos · 1', editada: '24 ago 2026' }),
    C(201, E, 'Solo texto', 'Hablar de lo que siento', 'Publicado', { autor: 'Laura Pineda' }),
    C(202, E, 'Juego', '', 'Publicado', { juego: { tipo: 'Memoria', ids: [3] }, creado: '6 nov 2026', editada: '6 nov 2026' }),
    C(301, K, 'Video', 'Experimento: el volcán de bicarbonato', 'Publicado', { detalle: 'Video', autor: 'Carlos Silva' }),
    C(302, K, 'Juego', 'Juega y aprende sobre el café', 'Publicado', { juego: { tipo: 'Crucigrama', ids: [1] }, creado: '4 nov 2026', editada: '4 nov 2026' }),
    C(303, K, 'Juego', 'Crucigrama de las plantas', 'Inactivo', { juego: { tipo: 'Crucigrama', ids: [6] }, creado: '6 nov 2026', editada: '6 nov 2026' }),
    C(304, K, 'Juego', 'Reto de memoria científica', 'Inactivo', { juego: { tipo: 'Memoria', ids: [] }, creado: '2 nov 2026', editada: '8 nov 2026' }),
  ]
}

/** Secciones («Micrositio › Sección») donde el juego está en un contenido Publicado, sin repetir. */
export function lugaresDe(gameId: number | null, contenidos: Contenido[]): string[] {
  if (gameId == null) return []
  const out = new Set<string>()
  for (const c of contenidos) {
    const s = seccionDe(c.sec)
    if (s && c.estado === 'Publicado' && c.juego?.ids.includes(gameId)) out.add(lugarDe(s))
  }
  return [...out]
}

export const sinJuegos = (c: Contenido) => !!c.juego && c.juego.ids.length === 0

/** Resumen de la segunda línea de la fila: «Juego · Memoria · 2 juegos (aleatorio)». */
export function detalleDe(c: Contenido): string {
  if (!c.juego) return c.detalle ?? c.tipo
  const n = c.juego.ids.length
  return `Juego · ${c.juego.tipo} · ${n} ${n === 1 ? 'juego' : 'juegos'}${n > 1 ? ' (aleatorio)' : ''}`
}
