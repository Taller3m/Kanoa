import type { TipoJuego } from '../games/types'

/**
 * Simulación de Micrositios según el diseño de Figma (archivo «Comunicador», sección Micrositios):
 * listado de micrositios › micrositio con sus secciones › sección con su listado de contenidos › Crear contenido.
 * Solo lo necesario para la HU de agregar y publicar juegos como contenido de una sección.
 */
export interface SeccionDef { slug: string; nombre: string; desc: string; activa: boolean }
export interface Micrositio { slug: string; nombre: string; desc: string; activo: boolean; secciones: SeccionDef[] }

const DESC_BE = 'Recursos, guías y acompañamiento para la salud mental de la comunidad académica.'
const opc = (n: number): SeccionDef => ({ slug: `opcion-${n}`, nombre: `Opción ${n}`, desc: 'Sección sin configurar.', activa: false })

export const MICROSITIOS: Micrositio[] = [
  { slug: 'bienestar-emocional', nombre: 'Bienestar emocional', desc: DESC_BE, activo: true, secciones: [
    { slug: 'nombrar', nombre: 'Nombrar', desc: 'Ponerle nombre a lo que sentimos para entenderlo y gestionarlo.', activa: true },
    { slug: 'conocete', nombre: 'Conócete', desc: 'Contenidos para reconocer y nombrar lo que sentimos.', activa: true },
    { slug: 'gestiona-emociones', nombre: 'Gestiona tus emociones', desc: 'Actividades para expresar lo que sentimos de forma segura.', activa: true },
    { slug: 'conciencia-entorno-seguro', nombre: 'Conciencia y entorno seguro', desc: 'Herramientas para cuidar de ti y de quienes te rodean.', activa: true },
    { slug: 'habitos-saludables', nombre: 'Hábitos saludables', desc: DESC_BE, activa: false },
    { slug: 'pedir-ayuda', nombre: 'Pedir ayuda', desc: DESC_BE, activa: false },
    opc(6), opc(7),
  ] },
  { slug: 'ser-stem', nombre: 'Ser+STEM', desc: 'Ciencia, tecnología, ingeniería y matemáticas para aprender en familia.', activo: true, secciones: [
    { slug: 'ciencia-en-casa', nombre: 'Ciencia en casa', desc: 'Experimentos y retos de ciencia para hacer en familia.', activa: true },
    { slug: 'retos-matematicos', nombre: 'Retos matemáticos', desc: 'Problemas y juegos para practicar matemáticas.', activa: true },
    opc(3), opc(4), opc(5), opc(6), opc(7),
  ] },
  { slug: 'observatorio-ser-stem', nombre: 'Observatorio Ser+STEM', desc: 'Datos e investigaciones sobre la educación STEM en la región.', activo: true, secciones: [1, 2, 3, 4, 5, 6, 7].map(opc) },
  { slug: 'formacion-cursos', nombre: 'Formación y Cursos', desc: 'Oferta de cursos y rutas de formación para la comunidad.', activo: true, secciones: [1, 2, 3, 4, 5, 6, 7].map(opc) },
  { slug: 'maestros', nombre: 'Maestros', desc: 'Recursos y acompañamiento para docentes en el aula.', activo: true, secciones: [1, 2, 3, 4, 5, 6, 7].map(opc) },
  { slug: 'directivos', nombre: 'Directivos', desc: 'Recursos para directivos docentes y equipos de gestión.', activo: true, secciones: [1, 2, 3, 4, 5, 6, 7].map(opc) },
  { slug: 'familias', nombre: 'Familias', desc: 'Guías para acompañar el aprendizaje desde casa.', activo: false, secciones: [1, 2, 3, 4, 5, 6, 7].map(opc) },
]

/** Sección resuelta con su micrositio. `id` = «micrositio/seccion» (se usa en la URL). */
export interface Seccion { id: string; microSlug: string; micro: string; sec: string; desc: string }

export const microDe = (slug: string) => MICROSITIOS.find((m) => m.slug === slug)
export function seccionDe(id: string): Seccion | undefined {
  const [m, s] = id.split('/')
  const mi = microDe(m ?? ''), se = mi?.secciones.find((x) => x.slug === s)
  return mi && se ? { id, microSlug: mi.slug, micro: mi.nombre, sec: se.nombre, desc: se.desc } : undefined
}
export const lugarDe = (s: Seccion) => `${s.micro} › ${s.sec}`

/** Estado activo/inactivo de micrositios y secciones (se puede cambiar desde los switches de las tarjetas). */
export type Activos = Record<string, boolean>
export function activosIniciales(): Activos {
  const a: Activos = {}
  for (const m of MICROSITIOS) { a[m.slug] = m.activo; for (const s of m.secciones) a[`${m.slug}/${s.slug}`] = s.activa }
  return a
}

export type EstadoCont = 'Publicado' | 'Borrador' | 'Inactivo'
export type TipoContenido = 'Solo texto' | 'Imágenes' | 'Video' | 'Documentos descargables' | 'Tablero BI' | 'Juego'

export interface Contenido {
  id: number
  sec: string // Seccion.id
  tipo: TipoContenido
  titulo: string // en Juego es opcional: si está vacío se muestran los nombres de los juegos
  detalle?: string // resumen para los tipos que no son Juego (p. ej. «Imágenes · 4»)
  cuerpo?: string[] // párrafos de un contenido «Solo texto» (se muestran en el portal)
  estado: EstadoCont
  autor: string
  creado: string
  editada: string
  juego?: { tipo: TipoJuego; ids: number[] }
}

/** Tarjetas de «¿Qué tipo de contenido quieres crear?» (Figma: SeleccionContenido) más la nueva tarjeta Juego. */
export const TIPOS_CONTENIDO: { nombre: TipoContenido; desc: string; icon: string; tone: 'teal' | 'blue' | 'orange' | 'indigo' | 'red' | 'green' }[] = [
  { nombre: 'Solo texto', desc: 'Título y texto enriquecido como base del contenido.', icon: 'format_size', tone: 'teal' },
  { nombre: 'Imágenes', desc: 'Hasta 5 imágenes con descripción. Con más de una se muestran en carrusel.', icon: 'image', tone: 'blue' },
  { nombre: 'Video', desc: 'Un video subido o embebido desde YouTube con descripción.', icon: 'play_circle', tone: 'orange' },
  { nombre: 'Documentos descargables', desc: 'Hasta 3 archivos adjuntos (PDF, DOC, DOCX, XLS, XLSX, PPTX) con descripción.', icon: 'description', tone: 'indigo' },
  { nombre: 'Tablero BI', desc: 'Un tablero de Power BI publicado en la web, con título, descripción, fuente y fecha de actualización.', icon: 'bar_chart', tone: 'red' },
  { nombre: 'Juego', desc: 'Uno o varios juegos creados en el módulo Juegos: crucigrama, cuenta cuentos, memoria o Crece conmigo.', icon: 'sports_esports', tone: 'green' },
]

const C = (id: number, sec: string, tipo: TipoContenido, titulo: string, estado: EstadoCont, extra: Partial<Contenido> = {}): Contenido =>
  ({ id, sec, tipo, titulo, estado, autor: 'María Castaño', creado: '15 ago 2026', editada: '12 sep 2026', ...extra })

/**
 * Contenidos de ejemplo. Casos de la HU que permiten probar:
 *  · «Memorama de emociones» (3) publicado en dos secciones → «Publicado en:» con las dos (escenario 3).
 *  · «El café colombiano» (1) publicado → no se puede eliminar desde Juegos.
 *  · Contenido inactivo con «Partes de la planta» (6) en Borrador → no se puede volver a publicar (escenario 9).
 *  · Contenido inactivo sin juegos → etiqueta «Sin juegos» (escenarios 11 y 12).
 */
export function seedContenidos(): Contenido[] {
  const N = 'bienestar-emocional/nombrar', S = 'bienestar-emocional/conocete', E = 'bienestar-emocional/gestiona-emociones', K = 'ser-stem/ciencia-en-casa'
  return [
    // Ejemplo del portal: https://kanoalab.com.co/kanoa/bienestar-emocional/nombrar con el crucigrama «Las emociones básicas».
    C(401, N, 'Solo texto', 'Lo que no se nombra se actúa', 'Publicado', { creado: '10 nov 2026', editada: '12 nov 2026', cuerpo: [
      'Cuando no sabemos qué sentimos, la emoción decide por nosotros. Ponerle nombre es el primer paso para entenderla y elegir qué hacer con ella.',
      'La rueda de Plutchik propone ocho emociones básicas que se combinan y cambian de intensidad. Reconocerlas nos da un vocabulario común para hablar de lo que nos pasa.',
    ] }),
    C(402, N, 'Juego', 'Pon nombre a lo que sientes', 'Publicado', { juego: { tipo: 'Crucigrama', ids: [8] }, creado: '12 nov 2026', editada: '12 nov 2026' }),
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
