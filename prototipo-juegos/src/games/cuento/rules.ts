import type { Game, Req } from '../types'
import type { CuentoPagina } from './types'

/** Una página está completa si tiene ilustración, texto y pregunta (≥ 3 caracteres), 2+ opciones con texto, exactamente una correcta y ambos mensajes. */
export const paginaCompleta = (p: CuentoPagina): boolean =>
  !!p.img && p.texto.trim().length >= 3 && p.pregunta.trim().length >= 3 &&
  p.opciones.length >= 2 && p.opciones.every((o) => o.t.trim()) &&
  p.opciones.filter((o) => o.ok).length === 1 && !!p.fbOk.trim() && !!p.fbNo.trim()

/** Requisitos para que un juego de «Cuenta cuentos» quede Completado (además del nombre, que valida el asistente). */
export function cuentoReqs(g: Game): Req[] {
  const ps = g.cuento.paginas
  const k = ps.filter(paginaCompleta).length
  return [
    { t: `Mínimo 2 páginas (${ps.length} creadas)`, ok: ps.length >= 2 },
    { t: `Todas las páginas completas (${k} de ${ps.length})`, ok: ps.length > 0 && k === ps.length },
  ]
}
