import { baseGame } from '../base'
import type { Game } from '../types'
import type { CuentoPagina } from './types'

const P = (id: number, img: string, texto: string, pregunta: string, ops: string[], ok: number, fbOk: string, fbNo: string): CuentoPagina =>
  ({ id, img, texto, pregunta, opciones: ops.map((t, i) => ({ t, ok: i === ok })), fbOk, fbNo })

/** Juegos de ejemplo de tipo «Cuenta cuentos» para el listado inicial. */
export const cuentoSeed: Game[] = [
  baseGame({
    id: 2, tipo: 'Cuenta cuentos', nombre: 'Simón, el cóndor de los Andes',
    desc: 'Lee la historia de Simón y responde cómo se siente en cada momento.', fecha: '30 oct 2026', editada: '5 nov 2026',
    cuento: { paginas: [
      P(21, 'condor-montana.png', 'Había una vez un cóndor llamado Simón que vivía en lo alto de los Andes colombianos. Cada mañana volaba solo sobre las montañas.', '¿Cómo crees que se siente Simón al volar solo?', ['Feliz', 'Solo y un poco triste', 'Enojado'], 1, 'Así es. Volar sin compañía a veces nos hace sentir solos.', 'Piensa de nuevo: Simón vuela sin compañía todos los días.'),
      P(22, 'condor-colibri.png', 'Un día, Simón conoció a Paco, un pequeño colibrí que le enseñó las flores del páramo.', '¿Cómo se siente Simón ahora?', ['Feliz', 'Asustado', 'Aburrido'], 0, '¡Correcto! Tener un amigo le dio alegría.', 'Mira la imagen: Simón encontró un amigo.'),
      P(23, 'condor-tormenta.png', 'Una tarde llegó una tormenta y Paco no aparecía. Simón lo buscó por todo el valle.', '¿Qué emoción siente Simón?', ['Calma', 'Preocupación', 'Alegría'], 1, 'Sí. Cuando no sabemos dónde está un amigo, nos preocupamos.', 'Piensa en cómo te sentirías si no encuentras a un amigo.'),
    ] },
  }),
]
