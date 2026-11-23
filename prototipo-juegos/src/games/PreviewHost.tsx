import type { Game } from './types'
import { CruciPreview } from './cruci/Preview'
import { CuentoPreview } from './cuento/Preview'
import { MemoPreview } from './memo/Preview'
import { CrecePreview } from './crece/Preview'
import { parOk } from './memo/rules'
import { fixMemo } from './memo/defaults'

export function PreviewHost({ game, onClose, portal }: { game: Game; onClose?: () => void; portal?: boolean }) {
  switch (game.tipo) {
    case 'Crucigrama': return <CruciPreview game={game} onClose={onClose} portal={portal} />
    case 'Cuenta cuentos': return <CuentoPreview game={game} onClose={onClose} portal={portal} />
    case 'Memoria': return <MemoPreview game={game} onClose={onClose} portal={portal} />
    case 'Crece conmigo': return <CrecePreview game={game} onClose={onClose} portal={portal} />
  }
}

/** Mensaje si el juego aún no tiene contenido suficiente para una vista previa (igual que `openPv` del original); null si se puede abrir. */
export function previewBlocker(g: Game): string | null {
  if (g.tipo === 'Crucigrama' && !g.cruci.words.length) return 'Agrega al menos una palabra para ver la vista previa.'
  if (g.tipo === 'Cuenta cuentos' && !g.cuento.paginas.some((p) => p.opciones.some((o) => o.t.trim()))) return 'Completa al menos una página para ver la vista previa.'
  if (g.tipo === 'Memoria' && !fixMemo(structuredClone(g)).memo.items.some(parOk)) return 'Completa al menos una pareja para ver la vista previa.'
  if (g.tipo === 'Crece conmigo' && !g.crece?.ser) return 'Elige el ser vivo para ver la vista previa.'
  return null
}
