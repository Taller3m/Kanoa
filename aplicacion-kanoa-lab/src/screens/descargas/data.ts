import { AREAS, CLASES, PORTADA_MB, areaDe, type Area } from '../../app/data'

/* Datos propios de Descargas (E01–E06) que el store compartido no tiene: uso de cada descarga, clases extra del lienzo
   y tamaño del teléfono para dibujar la barra de espacio. */

/** Clases que aparecen en E05 y no están en los datos compartidos. */
export const CLASES_EXTRA = [
  { id: 'leyendas-region', areaId: 'lenguaje', periodo: 1, numero: 4, titulo: 'Leyendas de mi región', tamanoMB: 52 },
]

/** Días desde la última vez que el estudiante abrió cada descarga (para ordenar la limpieza de E05). */
export const DIAS_SIN_ABRIR: Record<string, number> = {
  'sumas-fracciones': 20,
  'leyendas-region': 12,
  'portada:naturales:1': 3,
  'partes-celula': 0,
}

/** A partir de cuántos días sin abrir se avisa «No la abres hace n días» y se preselecciona para quitar. */
export const DIAS_POCO_USO = 10

/** Por debajo de este espacio libre se muestra el aviso de poco espacio (E04). */
export const POCO_ESPACIO_MB = 300

/** Capacidad simulada del teléfono, para repartir la barra de espacio. */
export const TELEFONO_MB = 16 * 1024

/** Clase republicada en E03 y cuántos archivos cambiaron. */
export const ACTUALIZACION = { id: 'partes-celula', archivos: 3 }

/** Una descarga del teléfono (clase o portada) con lo que necesita la lista. */
export interface ItemDescarga { id: string; titulo: string; area: Area; numero?: number; portada: boolean; tamanoMB: number }

export function itemDe(id: string): ItemDescarga | null {
  if (id.startsWith('portada:')) {
    const [, areaId = '', periodo = '1'] = id.split(':')
    const area = AREAS.find((a) => a.id === areaId)
    if (!area) return null
    return { id, titulo: `Portada del periodo ${periodo}`, area, portada: true, tamanoMB: PORTADA_MB }
  }
  const c = CLASES.find((x) => x.id === id) ?? CLASES_EXTRA.find((x) => x.id === id)
  if (!c) return null
  return { id, titulo: c.titulo, area: areaDe(c.areaId), numero: c.numero, portada: false, tamanoMB: c.tamanoMB }
}

/** 95 → «95 MB»; 2150 → «2,1 GB». */
export function formatoMB(mb: number) {
  return mb < 1024 ? `${Math.round(mb)} MB` : `${(mb / 1024).toFixed(1).replace('.', ',')} GB`
}

/** Texto de uso: «No la abres hace 20 días», «La abriste hace 3 días», «La abriste hoy». */
export function textoUso(id: string): string | null {
  const d = DIAS_SIN_ABRIR[id]
  if (d === undefined) return null
  if (d >= DIAS_POCO_USO) return `No la abres hace ${d} días`
  return d === 0 ? 'La abriste hoy' : d === 1 ? 'La abriste ayer' : `La abriste hace ${d} días`
}
