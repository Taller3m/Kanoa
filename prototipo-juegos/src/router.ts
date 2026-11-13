import { useEffect, useState } from 'react'
import type { TipoJuego } from './games/types'

/**
 * Enrutador por hash. URLs según las reglas del proyecto: minúsculas, sin tildes, palabras separadas
 * por guiones, sin conectores y jerarquía dominio/módulo/sección.
 *
 *   #/juegos                                lista
 *   #/juegos/crear-juego                    elegir tipo
 *   #/juegos/crear-crucigrama               nuevo · paso Detalles
 *   #/juegos/crear-crucigrama/configuracion nuevo · paso Configuración
 *   #/juegos/editar-memoria/3               edición del juego 3 (y /configuracion)
 */
export type Route =
  | { screen: 'lista' }
  | { screen: 'tipo' }
  | { screen: 'editor'; tipo: TipoJuego; id: number | null; paso: 1 | 2 }

const SLUG: Record<TipoJuego, string> = {
  'Crucigrama': 'crucigrama', 'Cuenta cuentos': 'cuenta-cuentos', 'Memoria': 'memoria', 'Crece conmigo': 'crece-conmigo',
}
const POR_SLUG = Object.fromEntries(Object.entries(SLUG).map(([k, v]) => [v, k])) as Record<string, TipoJuego>

export function parse(hash: string): Route {
  const parts = hash.replace(/^#\/?/, '').split('/').filter(Boolean)
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
  if (r.screen === 'lista') return '#/juegos'
  if (r.screen === 'tipo') return '#/juegos/crear-juego'
  const base = '#/juegos/' + (r.id ? 'editar-' : 'crear-') + SLUG[r.tipo] + (r.id ? '/' + r.id : '')
  return r.paso === 2 ? base + '/configuracion' : base
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
