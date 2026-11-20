import { baseGame } from '../base'
import type { Game } from '../types'
import type { CruciWord } from './types'

const W = (id: number, r: number, c: number, dir: 'H' | 'V', ans: string, clue: string): CruciWord => ({ id, r, c, dir, ans, clue })

/** Juegos de ejemplo de tipo «Crucigrama» para el listado inicial. */
export const cruciSeed: Game[] = [
  baseGame({
    id: 1, tipo: 'Crucigrama', nombre: 'El café colombiano', desc: 'Completa el crucigrama con palabras relacionadas con el cultivo del café.',
    fecha: '28 oct 2026', editada: '4 nov 2026',
    cruci: { size: 10, words: [
      W(11, 0, 0, 'H', 'CAFE', 'Bebida típica de Colombia preparada con granos tostados.'),
      W(12, 0, 1, 'V', 'AGUA', 'Recurso que la planta de café necesita todos los días.'),
      W(13, 3, 1, 'H', 'AROMA', 'Olor agradable que se siente al preparar café.'),
      W(14, 3, 4, 'V', 'MATA', 'Así se le dice en Colombia a una planta pequeña.'),
      W(15, 6, 2, 'H', 'GRANO', 'Semilla del café que se tuesta y se muele.'),
    ] },
  }),
  baseGame({
    id: 6, tipo: 'Crucigrama', nombre: 'Partes de la planta', fecha: '3 nov 2026', editada: '6 nov 2026',
    cruci: { size: 10, words: [
      W(61, 0, 0, 'H', 'TALLO', 'Parte de la planta que sostiene las hojas.'),
      W(62, 0, 0, 'V', 'TIERRA', 'Lugar donde crecen las raíces.'),
      W(63, 0, 4, 'V', 'OXIGENO', 'Gas que liberan las plantas y que respiramos.'),
    ] },
  }),
  baseGame({
    id: 4, tipo: 'Crucigrama', nombre: 'Ciencia en el aula', fecha: '6 nov 2026', editada: '6 nov 2026',
    cruci: { size: 12, words: [W(41, 2, 2, 'H', 'ATOMO', 'Unidad más pequeña de la materia.')] },
  }),
  // Juego del ejemplo en el portal: Bienestar emocional › Nombrar. Distribución validada con las reglas de construcción (HU-PW-173).
  baseGame({
    id: 8, tipo: 'Crucigrama', nombre: 'Las emociones básicas',
    desc: 'Lee cada pista y escribe en el tablero el nombre de la emoción. Cuando termines, selecciona COMPROBAR.',
    cierre: '¡Muy bien! Ponerle nombre a lo que sentimos es el primer paso para gestionarlo.',
    fecha: '12 nov 2026', editada: '12 nov 2026',
    cruci: { size: 10, words: [
      W(81, 2, 1, 'H', 'TRISTEZA', 'Emoción que sentimos ante una pérdida y que nos invita a buscar apoyo.'),
      W(82, 0, 6, 'V', 'MIEDO', 'Emoción que nos alerta ante un peligro y nos ayuda a protegernos.'),
      W(83, 2, 3, 'V', 'IRA', 'Emoción intensa que aparece cuando algo nos parece injusto.'),
      W(84, 4, 3, 'H', 'ASCO', 'Emoción que nos aleja de lo que puede hacernos daño, como un alimento en mal estado.'),
      W(85, 2, 8, 'V', 'ALEGRIA', 'Emoción que sentimos cuando algo bueno nos pasa.'),
    ] },
  }),
]
