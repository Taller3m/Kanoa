/* Contenido de ejemplo de las clases (lienzo «La clase», D01–D12).
   «Partes de la célula» sale del diseño; las demás clases reciben páginas simples generadas. */

import { claseDe, type AreaColor } from '../../app/data'

export type TipoArchivo = 'pdf' | 'excel' | 'word' | 'powerpoint'

export type Bloque =
  | { t: 'titulo'; texto: string }
  | { t: 'parrafo'; texto: string }
  | { t: 'imagen'; titulo: string }
  | { t: 'archivo'; nombre: string; tipo: TipoArchivo; detalle: string }
  | { t: 'audio'; titulo: string; duracion: string; actual: string; avance: number }
  | { t: 'video'; titulo: string; duracion: string; youtube?: boolean }
  | { t: 'enlace'; titulo: string }
  | {
      t: 'interactivo'; titulo: string; infografia: string; puntos: string[]
      ejercicio: { pregunta: string; opciones: string[]; correcta: number; explicacion: string }
    }

export interface Pagina { bloques: Bloque[] }

/** Cómo se muestra cada tipo de archivo: color del mosaico, ícono, nombre de la app y si se abre dentro de Kanoa Lab. */
export const ARCHIVO: Record<TipoArchivo, { color: AreaColor; icono: string; app: string; enApp: boolean }> = {
  pdf: { color: 'red', icono: 'picture_as_pdf', app: 'PDF', enApp: true },
  excel: { color: 'green', icono: 'table_chart', app: 'Excel', enApp: false },
  word: { color: 'blue', icono: 'description', app: 'Word', enApp: false },
  powerpoint: { color: 'orange', icono: 'slideshow', app: 'PowerPoint', enApp: false },
}

const PARTES_CELULA: Pagina[] = [
  {
    bloques: [
      { t: 'titulo', texto: '¿Qué hay dentro de una célula?' },
      { t: 'parrafo', texto: 'Las células tienen partes con tareas distintas, como si fueran una pequeña fábrica. En esta clase vas a conocer cada una.' },
      { t: 'imagen', titulo: 'La célula como una fábrica' },
    ],
  },
  {
    bloques: [
      { t: 'titulo', texto: 'La célula: la unidad de la vida' },
      { t: 'parrafo', texto: 'Todos los seres vivos están formados por células. Algunas son tan pequeñas que solo las vemos con un microscopio.' },
      { t: 'imagen', titulo: 'Partes fundamentales de la célula' },
      { t: 'archivo', nombre: 'Guía de observación.pdf', tipo: 'pdf', detalle: 'PDF · 1,2 MB · se abre aquí' },
      { t: 'archivo', nombre: 'Tabla de organelos.xlsx', tipo: 'excel', detalle: 'Excel · se abre con otra app' },
      { t: 'parrafo', texto: 'Mira, escucha y explora cada recurso.' },
      { t: 'audio', titulo: 'Cuento: el viaje de Cito', duracion: '3:42', actual: '1:10', avance: 32 },
      { t: 'video', titulo: 'La célula en el microscopio', duracion: '4:10' },
      { t: 'enlace', titulo: 'Juego en línea sobre organelos' },
    ],
  },
  {
    bloques: [
      {
        t: 'interactivo', titulo: 'Recorrido por la célula animal', infografia: 'Infografía · Célula animal',
        puntos: ['Núcleo', 'Mitocondria', 'Membrana'],
        ejercicio: {
          pregunta: '¿Qué organelo produce la energía de la célula?',
          opciones: ['El núcleo', 'La mitocondria', 'La membrana'],
          correcta: 1,
          explicacion: 'Las mitocondrias transforman los alimentos en energía para la célula.',
        },
      },
    ],
  },
  {
    bloques: [
      { t: 'titulo', texto: 'Núcleo, citoplasma y membrana' },
      { t: 'parrafo', texto: 'El núcleo guarda la información de la célula, el citoplasma es el lugar donde trabajan los organelos y la membrana decide qué entra y qué sale.' },
      { t: 'video', titulo: '¿Cómo funciona la mitocondria?', duracion: '6:25', youtube: true },
      { t: 'archivo', nombre: 'Resumen de la clase.docx', tipo: 'word', detalle: 'Word · se abre con otra app' },
      { t: 'archivo', nombre: 'Presentación de organelos.pptx', tipo: 'powerpoint', detalle: 'PowerPoint · se abre con otra app' },
    ],
  },
]

/**
 * Páginas de contenido de una clase. La última página de la clase (n de n) es la de actividades,
 * así que aquí hay `paginas - 1` páginas de contenido.
 */
export function paginasDe(claseId: string): Pagina[] {
  if (claseId === 'partes-celula') return PARTES_CELULA
  const c = claseDe(claseId)
  return Array.from({ length: Math.max(1, c.paginas - 1) }, (_, i) => ({
    bloques: [
      { t: 'titulo', texto: i === 0 ? c.titulo : `${c.titulo}: parte ${i + 1}` },
      { t: 'parrafo', texto: 'Lee con calma esta página. Si tienes dudas, anótalas para preguntarle a tu docente en la próxima clase.' },
      { t: 'imagen', titulo: `Ilustración de la página ${i + 1}` },
    ],
  }))
}

/* ── Actividades ─────────────────────────────────────── */

export interface Actividad {
  id: string; titulo: string; tipo: 'cuestionario' | 'archivo'; detalle: string; plazo: string; icono: string
}

export function actividadesDe(claseId: string): Actividad[] {
  if (claseId === 'partes-celula') {
    return [
      { id: 'quiz', titulo: 'Quiz: partes de la célula', tipo: 'cuestionario', detalle: 'Cuestionario · 5 preguntas', icono: 'quiz',
        plazo: 'Puedes responder hasta el miércoles 2 de diciembre a las 11:59 p. m. Te quedan 2 intentos.' },
      { id: 'modelo', titulo: 'Mi modelo de célula', tipo: 'archivo', detalle: 'Cargue de archivos', icono: 'upload_file',
        plazo: 'Puedes entregar hasta el sábado 28 de noviembre a las 11:59 p. m.' },
    ]
  }
  const c = claseDe(claseId)
  return [
    { id: 'quiz', titulo: `Quiz: ${c.titulo.toLowerCase()}`, tipo: 'cuestionario', detalle: 'Cuestionario · 5 preguntas', icono: 'quiz',
      plazo: 'Puedes responder hasta el viernes 4 de diciembre a las 11:59 p. m. Te quedan 2 intentos.' },
  ]
}

/** Texto del aviso final: qué le falta al estudiante para completar la clase. */
export function faltaDe(claseId: string): string {
  return claseId === 'partes-celula'
    ? 'Para completarla te falta responder el quiz y entregar tu modelo de célula.'
    : 'Para completarla te falta responder el quiz.'
}

/* ── Cuestionario (D11) ─────────────────────────────── */

export interface Pregunta { texto: string; multiple: boolean; opciones: string[]; correctas: number[] }

export const PREGUNTAS: Pregunta[] = [
  { texto: '¿Qué parte de la célula guarda la información genética?', multiple: false, opciones: ['El núcleo', 'La membrana', 'El citoplasma'], correctas: [0] },
  { texto: '¿Qué partes tienen la célula animal y la vegetal?', multiple: true, opciones: ['Membrana', 'Núcleo', 'Pared celular'], correctas: [0, 1] },
  { texto: '¿Qué organelo produce la energía de la célula?', multiple: false, opciones: ['La mitocondria', 'El cloroplasto', 'La vacuola'], correctas: [0] },
  { texto: '¿Qué hace la membrana celular?', multiple: false, opciones: ['Decide qué entra y qué sale', 'Fabrica el alimento', 'Guarda el agua'], correctas: [0] },
  { texto: '¿Qué partes son propias de la célula vegetal?', multiple: true, opciones: ['Cloroplastos', 'Pared celular', 'Núcleo'], correctas: [0, 1] },
]

export const CUESTIONARIO = {
  titulo: 'Quiz: partes de la célula',
  detalle: 'Cuestionario · 5 preguntas',
  plazo: 'Puedes responder hasta el miércoles 2 de diciembre a las 11:59 p. m.',
  intentos: 'Te quedan 2 intentos',
  /** Tiempo restante al abrir, en segundos (17:42 en el diseño). */
  segundos: 17 * 60 + 42,
}
