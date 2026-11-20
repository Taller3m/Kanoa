import type { Game } from './types'
import { blankCruci } from './cruci/defaults'
import { blankCuento } from './cuento/defaults'
import { blankMemo } from './memo/defaults'
import { blankCrece } from './crece/defaults'

export const HOY = '20 nov 2026'

const MESES = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic']
/** Convierte una fecha «d mmm aaaa» (p. ej. «28 oct 2026») en un número ordenable (aaaammdd); 0 si no se reconoce. */
export function fechaKey(f: string): number {
  const m = /^(\d{1,2}) (\w{3}) (\d{4})$/.exec(f.trim())
  const mes = m ? MESES.indexOf(m[2]!.toLowerCase()) : -1
  return m && mes >= 0 ? Number(m[3]) * 10000 + (mes + 1) * 100 + Number(m[1]) : 0
}
/** Ordena por fecha de modificación, de la más reciente a la más antigua. Es estable: en empates conserva el orden recibido. */
export const porModificacion = <T extends { editada: string }>(gs: T[]): T[] =>
  [...gs].sort((a, b) => fechaKey(b.editada) - fechaKey(a.editada))

/** Juego con todos los valores por defecto (equivale a `J_base` del prototipo original). */
export function baseGame(o: Partial<Game> & Pick<Game, 'tipo' | 'nombre'>): Game {
  return {
    id: null, desc: '', cierre: '', autor: 'María Castaño', fecha: '', editada: '',
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
