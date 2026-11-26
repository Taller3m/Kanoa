import { useEffect, useState } from 'react'

/* Router por hash (#/ruta?param=valor): funciona servido desde cualquier carpeta (GitHub Pages) sin configurar el servidor. */

export interface Location { path: string; query: URLSearchParams }

const read = (): Location => {
  const raw = window.location.hash.replace(/^#\/?/, '')
  const [path = '', qs = ''] = raw.split('?')
  return { path: path.replace(/\/$/, ''), query: new URLSearchParams(qs) }
}

/** Navega a una ruta de la app, p. ej. go('area/naturales') o go('clase/celula/2?estado=sheet'). */
export function go(to: string) {
  const next = '#/' + to.replace(/^#?\/?/, '')
  if (window.location.hash !== next) window.location.hash = next
  else window.dispatchEvent(new HashChangeEvent('hashchange'))
}


export function useLocation(): Location {
  const [loc, setLoc] = useState(read)
  useEffect(() => {
    const on = () => setLoc(read())
    window.addEventListener('hashchange', on)
    return () => window.removeEventListener('hashchange', on)
  }, [])
  return loc
}

/** Compara una ruta con un patrón tipo 'clase/:claseId/:pagina'. Devuelve los parámetros o null. */
export function match(pattern: string, path: string): Record<string, string> | null {
  const p = pattern.split('/').filter(Boolean)
  const s = path.split('/').filter(Boolean)
  if (p.length !== s.length) return null
  const params: Record<string, string> = {}
  for (let i = 0; i < p.length; i++) {
    const seg = p[i]!
    if (seg.startsWith(':')) params[seg.slice(1)] = decodeURIComponent(s[i]!)
    else if (seg !== s[i]) return null
  }
  return params
}
