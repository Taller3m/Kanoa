import { EMO_CAT } from './catalog'
import { CARA } from './caras'
import './emo.css'

/** Rasgos de la cara de una emoción (ilustración de ilustraciones/2610009_6336.eps), sin fondo: lo pone el contenedor. */
export function CaraSvg({ emo, className }: { emo: string; className?: string }) {
  const svg = CARA[emo]
  if (!svg) return null
  return <svg className={className} viewBox="8 8 150 150" aria-hidden="true" focusable="false" dangerouslySetInnerHTML={{ __html: svg }} />
}

/** Clase de color de la emoción: fondo y trazo según su categoría (tokens de Kanoa). */
export const emoTone = (emo: string) => `kl-emo kl-emo--${EMO_CAT[emo] ?? 'none'}`
