import imgCafe from '../../assets/crece-cafe-cara.svg'
import imgFrailejon from '../../assets/crece-frailejon-cara.svg'
import imgGato from '../../assets/crece-gato-cara.svg'
import imgGirasol from '../../assets/crece-girasol-cara.svg'
import imgPerro from '../../assets/crece-perro-cara.svg'
import imgPollito from '../../assets/crece-pollito-cara.svg'
import figGato from '../../assets/crece-gato.svg?raw'
import figPerro from '../../assets/crece-perro.svg?raw'

/** Catálogo de «Crece conmigo» (equivale a J_IND, J_SV, J_DIF y J_DUR del prototipo original). */
export type IndKey = 'agua' | 'luz' | 'comida' | 'carino' | 'descanso'

/** [emoji, nombre, acción] */
export const INDICADORES: Record<IndKey, [string, string, string]> = {
  agua: ['💧', 'Agua', 'Dar agua'],
  luz: ['☀️', 'Luz', 'Dar luz'],
  comida: ['🍖', 'Comida', 'Dar comida'],
  carino: ['💛', 'Cariño', 'Dar cariño'],
  descanso: ['🌙', 'Descanso', 'Dormir'],
}

export interface SerVivo {
  tipo: 'Planta' | 'Animal'
  /** Ilustración por etapa (emoji). */
  g: [string, string, string]
  /** Rostro ilustrado para la portada del paso 2; si falta, se usa el emoji de la última etapa. */
  img?: string
  /** SVG de cuerpo completo (en línea) para el juego; sus grupos kl-* se animan desde pv.css. Si falta, se usa el emoji de cada etapa. */
  fig?: string
  /** Variable de token del tono categórico. */
  c: string
  et: [string, string, string]
  cons: Partial<Record<IndKey, number>>
  msg: [string, string]
}

export const SERES: Record<string, SerVivo> = {
  'Café': { tipo: 'Planta', g: ['🌱', '🌿', '☕'], img: imgCafe, c: '--green-soft', et: ['Brote', 'Cafeto joven', 'Cafeto con cerezas'], cons: { agua: 25, luz: 15 }, msg: ['Me gusta crecer bajo la sombra de otros árboles.', '¡Ya tengo cerezas! De ellas sale el grano de café.'] },
  'Girasol': { tipo: 'Planta', g: ['🌱', '🌿', '🌻'], img: imgGirasol, c: '--secondary-container', et: ['Brote', 'Girasol joven', 'Girasol en flor'], cons: { agua: 20, luz: 30 }, msg: ['¿Sabías que giro buscando el sol?', '¡Florecí! Mis semillas alimentan a muchos pájaros.'] },
  'Frailejón': { tipo: 'Planta', g: ['🌱', '🪴', '🌼'], img: imgFrailejon, c: '--teal-soft', et: ['Brote', 'Frailejón joven', 'Frailejón en flor'], cons: { agua: 15, luz: 25 }, msg: ['Mis hojas peludas me protegen del frío del páramo.', '¡Florecí! Ayudo a guardar el agua del páramo.'] },
  'Perro': { tipo: 'Animal', g: ['🐶', '🐕', '🦮'], img: imgPerro, fig: figPerro, c: '--teal-soft', et: ['Cachorro', 'Perro joven', 'Perro adulto'], cons: { comida: 25, carino: 25, descanso: 25 }, msg: ['Me encanta correr y que me acaricies.', '¡Ya soy adulto! Gracias por cuidarme.'] },
  'Gato': { tipo: 'Animal', g: ['🐱', '🐈', '🐈‍⬛'], img: imgGato, fig: figGato, c: '--indigo-soft', et: ['Gatito', 'Gato joven', 'Gato adulto'], cons: { comida: 25, carino: 20, descanso: 30 }, msg: ['Me encanta jugar con una bolita de lana.', '¡Ya soy un gato adulto! Gracias por cuidarme.'] },
  'Pollito': { tipo: 'Animal', g: ['🐥', '🐤', '🐔'], img: imgPollito, c: '--blue-soft', et: ['Pollito', 'Pollo joven', 'Gallina'], cons: { comida: 30, carino: 15, descanso: 30 }, msg: ['Me gusta buscar granitos en la tierra.', '¡Ya soy una gallina! Gracias por cuidarme.'] },
}

/** Dificultad → [segundos por día, factor de bajada]. */
export const DIFICULTADES: Record<string, [number, number]> = { 'Fácil': [40, 0.7], 'Normal': [30, 1], 'Retador': [20, 1.3] }
/** Duración (días) → días bien cuidados por etapa. */
export const DURACIONES: Record<number, [number, number]> = { 6: [3, 3], 8: [4, 4], 12: [6, 6] }

export const GRUPOS_SERES: [string, SerVivo['tipo']][] = [['Plantas', 'Planta'], ['Animales', 'Animal']]

export const REGLAS_CRECE = [
  'Cada necesidad va de 0 a 100, empieza en 60 y cada toque suma 15.',
  'El día cuenta para crecer si al terminar todas las necesidades están entre 40 y 90; la falta y el exceso no suman.',
  'El último 30 % del día es de noche: las plantas no reciben luz y los animales solo duermen de noche.',
  'El ser vivo no muere: si una necesidad queda en 0 dos días seguidos, aparece «¡[Personaje] te necesita!» y se reintenta la etapa.',
  'No se guarda el progreso: al recargar la página el juego vuelve a empezar.',
]
