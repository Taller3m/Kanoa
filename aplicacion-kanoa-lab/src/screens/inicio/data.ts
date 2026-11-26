import type { Tone } from '../../mobile'

/* Datos propios del grupo «Inicio y áreas»: portada del periodo y material del docente (tomados de C02 y C06). */

export const PERIODOS = [1, 2, 3, 4]

export interface Portada {
  titulo: string; pregunta: string; texto: string; imagen: string; video: string; duracion: string
}

const PORTADAS: Record<string, Portada> = {
  naturales: {
    titulo: 'La célula, unidad de la vida',
    pregunta: '¿De qué estamos hechos los seres vivos?',
    texto: '¿Alguna vez te has preguntado cómo funciona tu propio cuerpo? En este periodo vamos a explorar la estructura básica de los seres vivos: la célula.',
    imagen: 'La célula',
    video: 'Video de presentación',
    duracion: '2:15',
  },
}

/** Portada del periodo de un área (las áreas sin portada propia usan un texto genérico). */
export const portadaDe = (areaId: string, nombreArea: string): Portada => PORTADAS[areaId] ?? {
  titulo: `Bienvenida a ${nombreArea}`,
  pregunta: '¿Qué vamos a aprender en este periodo?',
  texto: 'Tu docente te cuenta en esta portada los temas del periodo y cómo vamos a trabajar.',
  imagen: nombreArea,
  video: 'Video de presentación',
  duracion: '1:30',
}

export type TipoRecurso = 'Video' | 'Imagen' | 'Documento' | 'Enlace'
export interface Recurso { id: string; titulo: string; tipo: TipoRecurso; fecha: string }

export const ICONO_RECURSO: Record<TipoRecurso, { icon: string; tone: Tone }> = {
  Video: { icon: 'smart_display', tone: 'orange' },
  Imagen: { icon: 'image', tone: 'blue' },
  Documento: { icon: 'description', tone: 'red' },
  Enlace: { icon: 'link', tone: 'teal' },
}

const MATERIAL: Record<string, Recurso[]> = {
  naturales: [
    { id: 'video-celula', titulo: 'Video: la célula explicada', tipo: 'Video', fecha: '20/11/2026' },
    { id: 'mapa-celula', titulo: 'Mapa conceptual de la célula', tipo: 'Imagen', fecha: '18/11/2026' },
    { id: 'lectura-hooke', titulo: 'Lectura: Robert Hooke y el corcho', tipo: 'Documento', fecha: '12/11/2026' },
    { id: 'juego-organelos', titulo: 'Juego en línea sobre organelos', tipo: 'Enlace', fecha: '15/09/2026' },
  ],
}

/** Material que comparte el docente del área. */
export const materialDe = (areaId: string): Recurso[] => MATERIAL[areaId] ?? []
