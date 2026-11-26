/* Datos de ejemplo compartidos por todas las pantallas (tomados del lienzo «Prototipo app Kanoa Lab · Estudiante»).
   Cada grupo de pantallas puede tener datos propios en su carpeta; aquí solo va lo que usan varios grupos. */

export type AreaColor = 'green' | 'blue' | 'indigo' | 'orange' | 'red' | 'teal'

export interface Estudiante { nombre: string; apellido: string; correo: string; institucion: string; grado: string }
export const ESTUDIANTE: Estudiante = {
  nombre: 'Valentina', apellido: 'Acosta Ríos', correo: 'vacosta@iesanjose.edu.co', institucion: 'IE San José', grado: '5° 5A',
}

export interface Area { id: string; nombre: string; docente: string; color: AreaColor; completadas: number; total: number }
export const AREAS: Area[] = [
  { id: 'naturales', nombre: 'Ciencias Naturales', docente: 'Prof. Laura Méndez', color: 'green', completadas: 4, total: 9 },
  { id: 'matematicas', nombre: 'Matemáticas', docente: 'Prof. Andrés Quintero', color: 'blue', completadas: 7, total: 10 },
  { id: 'lenguaje', nombre: 'Lenguaje', docente: 'Prof. Diana Restrepo', color: 'indigo', completadas: 5, total: 10 },
  { id: 'sociales', nombre: 'Ciencias Sociales', docente: 'Prof. Carlos Ruiz', color: 'orange', completadas: 2, total: 8 },
  { id: 'artistica', nombre: 'Educación Artística', docente: 'Prof. Sofía Arango', color: 'red', completadas: 6, total: 6 },
  { id: 'ingles', nombre: 'Inglés', docente: 'Prof. Mónica Duarte', color: 'teal', completadas: 0, total: 4 },
]
export const areaDe = (id: string) => AREAS.find((a) => a.id === id) ?? AREAS[0]!

/** Estado de una clase según el docente: completada, abierta (en curso) o cerrada (aún no la abre). */
export type EstadoClase = 'completada' | 'abierta' | 'cerrada'

export interface Clase {
  id: string; areaId: string; periodo: number; numero: number; titulo: string
  estado: EstadoClase; fecha: string; detalle?: string; paginas: number; tamanoMB: number
}
export const CLASES: Clase[] = [
  { id: 'que-es-celula', areaId: 'naturales', periodo: 1, numero: 1, titulo: '¿Qué es una célula?', estado: 'completada', fecha: 'mar 17 nov', paginas: 4, tamanoMB: 85 },
  { id: 'partes-celula', areaId: 'naturales', periodo: 1, numero: 2, titulo: 'Partes de la célula', estado: 'abierta', fecha: 'mar 24 nov', detalle: '7:00 a. m. · Aula 204', paginas: 5, tamanoMB: 85 },
  { id: 'celula-animal-vegetal', areaId: 'naturales', periodo: 1, numero: 3, titulo: 'Célula animal y célula vegetal', estado: 'cerrada', fecha: 'mar 1 dic', paginas: 5, tamanoMB: 90 },
  { id: 'sumas-fracciones', areaId: 'matematicas', periodo: 1, numero: 6, titulo: 'Sumas de fracciones', estado: 'completada', fecha: 'lun 2 nov', paginas: 6, tamanoMB: 38 },
  { id: 'fracciones-equivalentes', areaId: 'matematicas', periodo: 1, numero: 7, titulo: 'Fracciones equivalentes', estado: 'abierta', fecha: 'lun 23 nov', paginas: 6, tamanoMB: 38 },
  { id: 'cuento-partes', areaId: 'lenguaje', periodo: 1, numero: 6, titulo: 'El cuento y sus partes', estado: 'abierta', fecha: 'mié 25 nov', paginas: 4, tamanoMB: 52 },
]
export const claseDe = (id: string) => CLASES.find((c) => c.id === id) ?? CLASES[1]!

/** Portada del periodo: se descarga aparte de las clases (imagen, video y textos). */
export const PORTADA_MB = 24
