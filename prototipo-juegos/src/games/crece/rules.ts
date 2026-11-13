import type { Game, Req } from '../types'

/** Requisitos para que un juego de «Crece conmigo» quede Completado (además del nombre, que valida el asistente). */
export function creceReqs(g: Game): Req[] {
  return [{ t: 'Ser vivo seleccionado', ok: !!(g.crece && g.crece.ser) }]
}
