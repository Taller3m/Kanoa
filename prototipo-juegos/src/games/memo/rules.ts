import type { Game, Req } from '../types'
import type { MemoItem } from './types'
import { memoNiveles } from './defaults'

/** Una pareja está completa (equivale a `J_parOk`). */
export const parOk = (it: MemoItem): boolean =>
  !!(it.a.v || '').trim() && (!it.a.needImg || !!it.a.img) &&
  (it.b.tipo === 'Igual' || it.b.tipo === 'Nombre' || !!(it.b.v || '').trim())

/** Requisitos para que un juego de «Memoria» quede Completado (además del nombre, que valida el asistente). */
export function memoReqs(g: Game): Req[] {
  return memoNiveles(g.memo).map((L, i) => {
    const k = L.items.filter(parOk).length
    return { t: `Nivel ${i + 1}: parejas completas (${k} de ${L.parejas})`, ok: k === L.parejas }
  })
}
