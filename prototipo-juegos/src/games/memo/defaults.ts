import type { Game } from '../types'
import type { MemoCarta, MemoData, MemoItem, MemoNivel } from './types'

const clone = <T,>(o: T): T => JSON.parse(JSON.stringify(o)) as T

/** Sin parejas por defecto; si `conParejas` (juego nuevo de este tipo) arranca con 6 parejas en blanco. */
export const blankMemo = (conParejas: boolean): MemoData => ({
  modo: 'Idénticos', rep: 'Emoji', msgModo: 'cada', msgGlobal: '', parejas: 6, dorso: '',
  tiempo: { on: false, min: 2 }, intentos: { on: false, n: 10 },
  items: conParejas ? Array.from({ length: 6 }, () => ({ a: { tipo: 'Imagen', v: '' }, b: { tipo: 'Igual', v: '' }, msg: '' })) : [],
})

/** Tipos de emparejamiento: [nombre, descripción]. */
export const MEMO_MODOS: [string, string][] = [
  ['Idénticos', 'Dos cartas iguales: imagen, texto o emoción.'],
  ['Concepto – definición', 'Un concepto y su definición, en texto.'],
  ['Imagen – texto', 'Una imagen y la palabra que la nombra.'],
]
/** Opciones de número de parejas y su tablero sugerido [filas, columnas]. */
export const MEMO_PAREJAS = [4, 6, 8, 12]
/** Tablero [filas, columnas] por número de parejas: apaisado para aprovechar el ancho del modal (en pantallas angostas bajan las columnas). */
export const MEMO_GRID: Record<number, [number, number]> = { 4: [2, 4], 6: [2, 6], 8: [2, 8], 12: [3, 8] }
export const MEMO_MAX_NIVELES = 3

export const defA = (m: string): string =>
  ({ 'Idénticos': 'Imagen', 'Concepto – definición': 'Texto', 'Imagen – texto': 'Imagen', 'Emociones': 'Emoción', 'Emoji – emoción': 'Emoción' } as Record<string, string>)[m] ?? 'Texto'
export const defB = (m: string): string =>
  (m === 'Idénticos' || m === 'Emociones') ? 'Igual' : m === 'Emoji – emoción' ? 'Nombre' : 'Texto'

/** Pareja en blanco según el modo (equivale a `J_blankItem`). */
export const blankItem = (m: string): MemoItem => ({ a: { tipo: defA(m), v: '' }, b: { tipo: defB(m), v: '' }, msg: '' })
/** Pareja en blanco con el contenido de A fijado (modo «Idénticos»). */
export const blankItemTipo = (tipo: string): MemoItem => ({ a: { tipo, v: '' }, b: { tipo: 'Igual', v: '' }, msg: '' })

/** Marca las cartas de emoción que exigen imagen (equivale a `J_syncRep`). */
export function syncRep(memo: MemoData) {
  memo.items.forEach((it) => { if (it.a.tipo === 'Emoción') it.a.needImg = memo.rep === 'Imagen' })
}

/* ───── Niveles: los campos «activos» (parejas, items, tiempo) reflejan el nivel `lv` ───── */
const nivelDe = (m: MemoData): MemoNivel => ({ parejas: m.parejas, items: clone(m.items || []), tiempo: clone(m.tiempo || { on: false, min: 2 }) })

/** Guarda los campos activos en `lvs[lv]` (equivale a `J_lvSync`). Muta `m`. */
export function lvSync(m: MemoData): MemoData {
  if (!m.lvs || !m.lvs.length) { m.lvs = [nivelDe(m)]; m.lv = 0 }
  m.lv = m.lv || 0
  m.lvs[m.lv] = nivelDe(m)
  return m
}
/** Carga el nivel `i` en los campos activos (equivale a `J_lvLoad`). Muta `m`. */
export function lvLoad(m: MemoData, i: number) {
  const L = m.lvs![i]!
  m.lv = i; m.parejas = L.parejas; m.items = clone(L.items); m.tiempo = clone(L.tiempo)
}
/** Niveles con el activo ya sincronizado, sin mutar `m`. */
export const memoNiveles = (m: MemoData): MemoNivel[] => lvSync(clone(m)).lvs!

const fixIt = (it: Partial<MemoItem> | undefined, m: string): MemoItem => {
  const o = it || {}
  const a = (o.a || {}) as Partial<MemoCarta>, b = (o.b || {}) as Partial<MemoCarta>
  return { ...o, a: { tipo: defA(m), v: '', ...a }, b: { tipo: defB(m), v: '', ...b }, msg: o.msg || '' }
}

/** Normaliza juegos viejos / de semilla (equivale a `J_fix`). No muta; el asistente la llama al abrir un juego de Memoria. */
export function fixMemo(g: Game): Game {
  if (!g || !g.memo) return g
  let m: MemoData = g.memo
  if (m.modo === 'Emociones' || m.modo === 'Emoji – emoción')
    m = { ...m, modo: 'Idénticos', rep: 'Emoji', items: (m.items || []).map((it) => ({ ...it, a: { ...it.a, needImg: false }, b: { tipo: 'Igual', v: '' } })) }
  const base = { rep: 'Emoji', msgModo: 'cada', msgGlobal: '', tiempo: { on: false, min: 2 }, intentos: { on: false, n: 10 } }
  const items = (m.items || []).map((it) => fixIt(it, m.modo))
  const lvs = (m.lvs && m.lvs.length) ? {} : { lv: 0, lvs: [nivelDe(m)] }
  return { ...g, memo: { ...base, ...m, items, ...lvs } as MemoData }
}
