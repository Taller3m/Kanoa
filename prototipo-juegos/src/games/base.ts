import type { Game } from './types'
import { blankCruci } from './cruci/defaults'
import { blankCuento } from './cuento/defaults'
import { blankMemo } from './memo/defaults'
import { blankCrece } from './crece/defaults'

export const HOY = '9 nov 2026'

/** Juego con todos los valores por defecto (equivale a `J_base` del prototipo original). */
export function baseGame(o: Partial<Game> & Pick<Game, 'tipo' | 'nombre'>): Game {
  return {
    id: null, desc: '', cierre: '', autor: 'María Castaño', usos: 0, fecha: '', editada: '',
    cruci: blankCruci(), cuento: blankCuento(false), memo: blankMemo(false), crece: blankCrece(),
    ...o,
  }
}

/** Juego nuevo del tipo elegido (equivale a `nuevo(tipo)`): cuento arranca con 2 páginas y memoria con 6 parejas en blanco. */
export function newGame(tipo: Game['tipo']): Game {
  return baseGame({
    tipo, nombre: '',
    cuento: blankCuento(tipo === 'Cuenta cuentos'),
    memo: blankMemo(tipo === 'Memoria'),
  })
}
