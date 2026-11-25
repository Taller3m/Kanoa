/** Catálogo de emociones (contenido): cada una tiene su cara ilustrada (caras.ts) y una categoría de color. */
export const EMOCIONES = [
  'Serenidad', 'Alegría', 'Éxtasis', 'Aceptación', 'Confianza', 'Admiración',
  'Aprensión', 'Miedo', 'Terror', 'Distracción', 'Sorpresa', 'Asombro',
  'Melancolía', 'Tristeza', 'Luto', 'Aburrimiento', 'Aversión', 'Odio',
  'Molestia', 'Ira', 'Rabia', 'Interés', 'Anticipación', 'Vigilancia',
]

/** Categoría de color (emo.css la mapea a tonos de Kanoa: kl-emo--<cat>). */
const grupos: [string, string[]][] = [
  ['joy', ['Serenidad', 'Alegría', 'Éxtasis']],
  ['trust', ['Aceptación', 'Confianza', 'Admiración']],
  ['fear', ['Aprensión', 'Miedo', 'Terror']],
  ['surprise', ['Distracción', 'Sorpresa', 'Asombro']],
  ['sad', ['Melancolía', 'Tristeza', 'Luto']],
  ['disgust', ['Aburrimiento', 'Aversión', 'Odio']],
  ['anger', ['Molestia', 'Ira', 'Rabia']],
  ['antic', ['Interés', 'Anticipación', 'Vigilancia']],
]
export const EMO_CAT: Record<string, string> = Object.fromEntries(grupos.flatMap(([c, ns]) => ns.map((n) => [n, c])))

/** Igual que `J_isEmoMode` del original: hoy ningún modo muestra la elección «Representación de las emociones». */
export const repVisible = (_modo: string): boolean => false
