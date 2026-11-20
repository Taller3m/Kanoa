/**
 * Contrato de datos del portal público (lo que el Portal WEB recibe para pintar una sección).
 *
 * En el prototipo se arma en memoria a partir de la administración (portal/data.ts). En producción lo
 * entregaría el backend: el portal NO decide qué está publicado ni qué juegos están completos, solo pinta
 * lo que recibe y elige al azar uno de los juegos de cada bloque Juego. Ver README.md de esta carpeta.
 */
import type { Game } from '../games/types'
import { estadoDe } from '../games/registry'
import { microDe, seccionDe, type Activos, type Contenido, type TipoContenido } from '../portal/data'

/** Un juego tal como lo necesita el componente de juego: su configuración completa (la misma que guarda la administración). */
export type JuegoPublico = Game

export type BloquePublico =
  | { tipo: 'texto'; id: number; titulo: string; parrafos: string[] }
  /** Bloque Juego: `juegos` ya viene filtrado (solo Completados). El portal muestra uno al azar en cada visita (HU-PW-185). */
  | { tipo: 'juego'; id: number; titulo?: string; juegos: JuegoPublico[] }
  /** Otros tipos de contenido que este prototipo no pinta (imágenes, video, documentos, tablero BI). */
  | { tipo: 'otro'; id: number; titulo: string; formato: TipoContenido }

export interface SeccionPublica {
  micrositio: { slug: string; nombre: string }
  seccion: { slug: string; nombre: string }
  /** false si el micrositio o la sección están inactivos o no hay contenido publicado → página «disponible próximamente». */
  disponible: boolean
  bloques: BloquePublico[]
}

/**
 * Arma la sección pública con las reglas de visibilidad de la HU-PW-185:
 *  · solo contenidos Publicados, en el orden de la sección;
 *  · si el micrositio o la sección están inactivos, no se ve nada (sin cambiar estados);
 *  · un bloque Juego solo lleva sus juegos Completados.
 */
export function seccionPublica(secId: string, contenidos: Contenido[], games: Game[], activos: Activos): SeccionPublica | null {
  const s = seccionDe(secId)
  const m = s && microDe(s.microSlug)
  if (!s || !m) return null
  const visible = !!activos[m.slug] && !!activos[secId]
  const bloques: BloquePublico[] = !visible ? [] : contenidos
    .filter((c) => c.sec === secId && c.estado === 'Publicado')
    .map((c): BloquePublico => {
      if (c.juego) {
        const juegos = c.juego.ids.map((id) => games.find((g) => g.id === id)).filter((g): g is Game => !!g && estadoDe(g) === 'Completado')
        return { tipo: 'juego', id: c.id, titulo: c.titulo.trim() || undefined, juegos }
      }
      if (c.tipo === 'Solo texto') return { tipo: 'texto', id: c.id, titulo: c.titulo, parrafos: c.cuerpo ?? [] }
      return { tipo: 'otro', id: c.id, titulo: c.titulo, formato: c.tipo }
    })
  return {
    micrositio: { slug: m.slug, nombre: m.nombre },
    seccion: { slug: secId.split('/')[1]!, nombre: s.sec },
    disponible: visible && bloques.length > 0,
    bloques,
  }
}
