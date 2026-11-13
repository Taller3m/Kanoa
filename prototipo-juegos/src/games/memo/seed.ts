import { baseGame } from '../base'
import type { Game } from '../types'
import type { MemoItem } from './types'
import { blankItem, blankMemo, fixMemo } from './defaults'

const E = (v: string, msg = ''): MemoItem => ({ a: { tipo: 'Emoción', v }, b: { tipo: 'Igual', v: '' }, msg })
const T = (a: string, b: string): MemoItem => ({ a: { tipo: 'Texto', v: a }, b: { tipo: 'Texto', v: b }, msg: '' })

/** Juegos de ejemplo de tipo «Memoria» para el listado inicial. */
export const memoSeed: Game[] = [
  baseGame({
    id: 3, tipo: 'Memoria', nombre: 'Memorama de emociones', desc: 'Encuentra las parejas de emociones.', fecha: '31 oct 2026', editada: '5 nov 2026',
    memo: { ...blankMemo(false), modo: 'Idénticos', rep: 'Emoji', parejas: 6, intentos: { on: true, n: 10 },
      items: [E('Alegría', '¡Bien! La alegría se siente cuando algo nos gusta.'), E('Tristeza'), E('Miedo'), E('Ira'), E('Sorpresa'), E('Serenidad', 'La serenidad nos ayuda a pensar mejor.')] },
  }),
  baseGame({
    id: 5, tipo: 'Memoria', nombre: 'Capitales de Colombia', fecha: '7 nov 2026', editada: '7 nov 2026',
    memo: { ...blankMemo(false), modo: 'Concepto – definición', parejas: 4, tiempo: { on: true, min: 2 },
      items: [T('Bogotá', 'Capital de Colombia'), T('Medellín', 'Capital de Antioquia'), blankItem('Concepto – definición'), blankItem('Concepto – definición')] },
  }),
].map(fixMemo)
