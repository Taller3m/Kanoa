import { baseGame } from '../base'
import type { Game } from '../types'

/** Juegos de ejemplo de tipo «Crece conmigo» para el listado inicial. */
export const creceSeed: Game[] = [
  baseGame({
    id: 7, tipo: 'Crece conmigo', nombre: 'Mi cafetal',
    desc: 'Cuida tu planta de café con agua y luz hasta que dé sus cerezas.',
    fecha: '10 nov 2026', editada: '10 nov 2026',
    crece: { ser: 'Café', pers: 'Cafecito', dif: 'Normal', dur: 6, msgs: ['', '', ''] },
  }),
]
