/** Catálogo de emociones (contenido): emoji y categoría de color de cada una. */
export const EMOJI: Record<string, string> = {
  Serenidad: '😌', Alegría: '😄', Éxtasis: '🤩', Aceptación: '🙂', Confianza: '🤗', Admiración: '😍',
  Aprensión: '😟', Miedo: '😨', Terror: '😱', Distracción: '😶', Sorpresa: '😮', Asombro: '😲',
  Melancolía: '😔', Tristeza: '😢', Luto: '😭', Aburrimiento: '😒', Aversión: '🤢', Odio: '🤮',
  Molestia: '😤', Ira: '😠', Rabia: '😡', Interés: '🤔', Anticipación: '👀', Vigilancia: '🧐',
}
export const EMOCIONES = Object.keys(EMOJI)

/** Categoría de color (memo.css la mapea a tonos del sistema: me-emo--<cat>). */
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
