import type { Game, Req } from '../types'
import type { CruciWord } from './types'

/** Mínimo de palabras por tamaño de tablero (`J_MINW`). */
export const CRUCI_MINW: Record<number, number> = { 8: 3, 10: 4, 12: 6, 15: 8 }
export const cruciMin = (size: number) => CRUCI_MINW[size] || 3

/** Requisitos para que un juego de «Crucigrama» quede Completado (además del nombre, que valida el asistente). */
export function cruciReqs(g: Game): Req[] {
  const n = g.cruci.words.length
  const mn = cruciMin(g.cruci.size)
  return [{ t: `Mínimo ${mn} palabras con su pista para ${g.cruci.size}×${g.cruci.size} (${n} agregadas)`, ok: n >= mn }]
}

/* ───────── Lógica del tablero (J_key, J_norm, J_cellsOf, J_buildMap, J_numerar, J_validar) ───────── */

export const cruciKey = (r: number, c: number) => `${r},${c}`

/** Solo letras A–Z y Ñ, sin tildes ni espacios, en mayúsculas. */
export const cruciNorm = (s: string) =>
  (s || '').toUpperCase().replace(/Ñ/g, '\u0001').normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/\u0001/g, 'Ñ').replace(/[^A-ZÑ]/g, '')

export const cruciCellsOf = (w: CruciWord): [number, number][] => {
  const a: [number, number][] = []
  for (let i = 0; i < w.ans.length; i++) a.push([w.r + (w.dir === 'V' ? i : 0), w.c + (w.dir === 'H' ? i : 0)])
  return a
}

export type CruciMap = Record<string, { L: string; ws: CruciWord[] }>
export const cruciBuildMap = (ws: CruciWord[]): CruciMap => {
  const m: CruciMap = {}
  ws.forEach((w) => cruciCellsOf(w).forEach(([r, c], i) => {
    const k = cruciKey(r, c)
    ;(m[k] = m[k] || { L: w.ans[i], ws: [] }).ws.push(w)
  }))
  return m
}

/** Numeración automática: una casilla de inicio comparte número entre H y V. */
export const cruciNumerar = (ws: CruciWord[]) => {
  const byStart: Record<string, number> = {}
  const byId: Record<number, number> = {}
  let n = 0
  ws.forEach((w) => {
    const k = cruciKey(w.r, w.c)
    if (!byStart[k]) byStart[k] = ++n
    byId[w.id] = byStart[k]
  })
  return { byStart, byId }
}

export interface CruciCx { sel: { r: number; c: number } | null; dir: 'H' | 'V'; ans: string; clue: string; editId: number | null }
export const CRUCI_CX0: CruciCx = { sel: null, dir: 'H', ans: '', clue: '', editId: null }

export type RuleState = 'ok' | 'err' | 'pend' | 'info'
export interface CruciRule { t: string; st: RuleState; msg: string }
export interface CruciVal { maxLen: number; path: string[]; conflicts: Record<string, 1>; rules: CruciRule[]; can: boolean; map: CruciMap }

export function cruciValidar(N: number, words: CruciWord[], cx: CruciCx & { sel: { r: number; c: number } }): CruciVal {
  const others = words.filter((w) => w.id !== cx.editId)
  const map = cruciBuildMap(others)
  const nums = cruciNumerar(words).byId
  const { r, c } = cx.sel
  const dir = cx.dir, a = cx.ans, len = a.length
  const dr = dir === 'V' ? 1 : 0, dc = dir === 'H' ? 1 : 0
  const maxLen = dir === 'H' ? N - c : N - r
  const path: string[] = []
  const conflicts: Record<string, 1> = {}
  for (let i = 0; i < Math.min(len, maxLen); i++) path.push(cruciKey(r + dr * i, c + dc * i))
  const at = (rr: number, cc: number) => (rr < 0 || cc < 0 || rr >= N || cc >= N) ? null : map[cruciKey(rr, cc)]
  const sentido = dir === 'H' ? 'hacia la derecha.' : 'hacia abajo.'
  let r1: { st: RuleState; msg: string }, r2: { st: RuleState; msg: string }, r3: { st: RuleState; msg: string }
  if (!len) r1 = { st: 'pend', msg: `Desde esta casilla caben hasta ${maxLen} letras ${sentido}` }
  else if (len > maxLen) r1 = { st: 'err', msg: `La palabra no cabe: desde esta casilla solo caben ${maxLen} letras ${sentido}` }
  else if (len < 2) r1 = { st: 'err', msg: 'La palabra debe tener mínimo 2 letras.' }
  else r1 = { st: 'ok', msg: `La palabra cabe en el tablero (${len} de ${maxLen} letras posibles).` }
  let cross = 0
  const bad: string[] = []
  path.forEach((k, i) => {
    const m = map[k]
    if (!m) return
    if (m.L === a[i]) cross++
    else {
      conflicts[k] = 1
      const [rr, cc] = k.split(',').map(Number)
      bad.push(`en la fila ${rr + 1}, columna ${cc + 1} debe ir «${m.L}»`)
    }
  })
  if (!len) r2 = { st: 'pend', msg: 'Si la palabra cruza otra, la letra del cruce debe ser la misma.' }
  else if (bad.length) r2 = { st: 'err', msg: `La letra del cruce no coincide: ${bad.join('; ')}.` }
  else r2 = { st: 'ok', msg: cross ? `Se cruza correctamente con ${cross}${cross > 1 ? ' palabras.' : ' palabra.'}` : 'No se cruza con otras palabras.' }
  const probs: string[] = []
  if (len && len <= maxLen) {
    if (path.some((k) => map[k] && map[k].ws.some((w) => w.dir === dir))) probs.push('se superpone con otra palabra en la misma dirección')
    if (at(r - dr, c - dc) || at(r + dr * len, c + dc * len)) probs.push('queda pegada a otra palabra al inicio o al final')
    let par = false
    for (let i = 0; i < len; i++) {
      const rr = r + dr * i, cc = c + dc * i
      ;([[dc, dr], [-dc, -dr]] as const).forEach(([o1, o2]) => {
        const n = at(rr + o1, cc + o2)
        if (n && n.ws.some((w) => w.dir === dir)) par = true
      })
    }
    if (par) probs.push('queda pegada en paralelo a otra palabra sin una casilla vacía de por medio')
    const ext: number[] = []
    others.forEach((w) => {
      const wr = w.dir === 'V' ? 1 : 0, wc = w.dir === 'H' ? 1 : 0
      if (path.includes(cruciKey(w.r - wr, w.c - wc)) || path.includes(cruciKey(w.r + wr * w.ans.length, w.c + wc * w.ans.length))) ext.push(nums[w.id])
    })
    if (ext.length) probs.push(`alarga la palabra ${ext.join(', ')}`)
  }
  if (!len) r3 = { st: 'pend', msg: 'Dos palabras en la misma dirección no pueden quedar pegadas; debe haber una casilla vacía entre ellas.' }
  else if (probs.length) r3 = { st: 'err', msg: `La palabra ${probs.join(' y ')}.` }
  else r3 = { st: 'ok', msg: 'No queda pegada a otras palabras.' }
  const used = Object.keys(cruciBuildMap(words)).length + path.filter((k) => !map[k]).length
  const r4 = { st: 'info' as RuleState, msg: `Las ${N * N - used} casillas que no uses se convertirán en negras al guardar.` }
  const clueOk = cx.clue.trim().length >= 3
  return {
    maxLen, path, conflicts, map,
    rules: [
      { t: 'Ajuste al límite', ...r1 }, { t: 'Intersección perfecta', ...r2 },
      { t: 'Sin palabras pegadas', ...r3 }, { t: 'Casillas negras automáticas', ...r4 },
    ],
    can: r1.st === 'ok' && r2.st === 'ok' && r3.st === 'ok' && clueOk,
  }
}
