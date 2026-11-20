import { useEffect, useState } from 'react'
import type { TipoJuego } from './games/types'
import { microDe, seccionDe } from './portal/data'

/**
 * Enrutador por hash. URLs según las reglas del proyecto: minúsculas, sin tildes, palabras separadas
 * por guiones, sin conectores y jerarquía dominio/módulo/sección.
 *
 *   #/juegos                                lista
 *   #/juegos/crear-juego                    elegir tipo
 *   #/juegos/crear-crucigrama               nuevo · paso Detalles
 *   #/juegos/crear-crucigrama/configuracion nuevo · paso Configuración
 *   #/juegos/editar-memoria/3               edición del juego 3 (y /configuracion)
 *
 *   #/micrositios                                           listado de micrositios
 *   #/micrositios/bienestar-emocional                       micrositio y sus secciones
 *   #/micrositios/bienestar-emocional/conocete              sección y su listado de contenidos
 *   #/micrositios/bienestar-emocional/conocete/crear-contenido        elegir tipo de contenido
 *   #/micrositios/bienestar-emocional/conocete/crear-contenido/juego  nuevo contenido Juego
 *   #/micrositios/bienestar-emocional/conocete/editar-contenido/103   edición del contenido 103
 */
export type Route =
  | { screen: 'lista' }
  | { screen: 'tipo' }
  | { screen: 'editor'; tipo: TipoJuego; id: number | null; paso: 1 | 2 }
  | { screen: 'secciones' }
  | { screen: 'micrositio'; micro: string }
  | { screen: 'seccion'; sec: string }
  | { screen: 'tipoCont'; sec: string }
  | { screen: 'contJuego'; sec: string; id: number | null }

const SLUG: Record<TipoJuego, string> = {
  'Crucigrama': 'crucigrama', 'Cuenta cuentos': 'cuenta-cuentos', 'Memoria': 'memoria', 'Crece conmigo': 'crece-conmigo',
}
const POR_SLUG = Object.fromEntries(Object.entries(SLUG).map(([k, v]) => [v, k])) as Record<string, TipoJuego>

function parseMicro(parts: string[]): Route {
  if (parts.length < 2 || !microDe(parts[1]!)) return { screen: 'secciones' }
  if (parts.length < 3) return { screen: 'micrositio', micro: parts[1]! }
  const sec = parts[1] + '/' + parts[2]
  if (!seccionDe(sec)) return { screen: 'micrositio', micro: parts[1]! }
  if (parts[3] === 'crear-contenido') return parts[4] === 'juego' ? { screen: 'contJuego', sec, id: null } : { screen: 'tipoCont', sec }
  if (parts[3] === 'editar-contenido' && Number.isFinite(Number(parts[4]))) return { screen: 'contJuego', sec, id: Number(parts[4]) }
  return { screen: 'seccion', sec }
}

export function parse(hash: string): Route {
  const parts = hash.replace(/^#\/?/, '').split('/').filter(Boolean)
  if (parts[0] === 'micrositios') return parseMicro(parts)
  if (parts[0] !== 'juegos' || parts.length === 1) return { screen: 'lista' }
  const seg = parts[1] ?? ''
  if (seg === 'crear-juego') return { screen: 'tipo' }
  const m = /^(crear|editar)-(.+)$/.exec(seg)
  const tipo = m ? POR_SLUG[m[2]!] : undefined
  if (!m || !tipo) return { screen: 'lista' }
  if (m[1] === 'crear') return { screen: 'editor', tipo, id: null, paso: parts[2] === 'configuracion' ? 2 : 1 }
  const id = Number(parts[2])
  if (!Number.isFinite(id)) return { screen: 'lista' }
  return { screen: 'editor', tipo, id, paso: parts[3] === 'configuracion' ? 2 : 1 }
}

export function href(r: Route): string {
  switch (r.screen) {
    case 'lista': return '#/juegos'
    case 'tipo': return '#/juegos/crear-juego'
    case 'secciones': return '#/micrositios'
    case 'micrositio': return '#/micrositios/' + r.micro
    case 'seccion': return '#/micrositios/' + r.sec
    case 'tipoCont': return '#/micrositios/' + r.sec + '/crear-contenido'
    case 'contJuego': return '#/micrositios/' + r.sec + (r.id ? '/editar-contenido/' + r.id : '/crear-contenido/juego')
    case 'editor': {
      const base = '#/juegos/' + (r.id ? 'editar-' : 'crear-') + SLUG[r.tipo] + (r.id ? '/' + r.id : '')
      return r.paso === 2 ? base + '/configuracion' : base
    }
  }
}

export function useRoute(): [Route, (r: Route, replace?: boolean) => void] {
  const [route, setRoute] = useState<Route>(() => parse(window.location.hash))
  useEffect(() => {
    if (!window.location.hash) window.history.replaceState(null, '', href({ screen: 'lista' }))
    const on = () => setRoute(parse(window.location.hash))
    window.addEventListener('hashchange', on)
    return () => window.removeEventListener('hashchange', on)
  }, [])
  const go = (r: Route, replace = false) => {
    if (replace) { window.history.replaceState(null, '', href(r)); setRoute(r) } else window.location.hash = href(r)
  }
  return [route, go]
}
