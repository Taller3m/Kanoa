import { useState, type ReactNode } from 'react'
import { Button, IconButton, Modal } from '../../ui'
import type { Game } from '../types'
import './preview.css'

/** Props de la vista previa de cada tipo de juego. El anfitrión crea el componente con `key` = contenido del juego, así que se reinicia solo al cambiar. */
export interface PreviewProps { game: Game }

/** Cabecera común: tipo + nombre y botón «Cómo jugar». */
export function PvHeader({ game, onHelp }: { game: Game; onHelp?: () => void }) {
  return (
    <div className="pv-head">
      <div>
        <div className="pv-head__tipo t-label-md">{game.tipo}</div>
        <div className="pv-head__nombre t-title-lg">{game.nombre.trim() || 'Juego sin nombre'}</div>
      </div>
      {onHelp && <IconButton icon="help" label="Cómo jugar" onClick={onHelp} />}
    </div>
  )
}

/** Pantalla inicial «¿Listo para jugar?». */
export function PvStart({ instr, info, onStart }: { instr: string; info?: string; onStart: () => void }) {
  return (
    <div className="pv-center">
      <h3 className="t-headline-sm pv-title">¿Listo para jugar?</h3>
      <p className="t-body-lg pv-text">{instr}</p>
      {info && <p className="t-body-md pv-muted">{info}</p>}
      <Button size="big" onClick={onStart}>Iniciar</Button>
    </div>
  )
}

/** Pantalla final: título, mensaje de cierre y botones VOLVER A JUGAR / IR AL INICIO (o siguiente nivel). */
export function PvDone({ title, cierre, medal, onReplay, onHome, onNext, nextLabel }: {
  title: string; cierre: string; medal?: ReactNode; onReplay?: () => void; onHome?: () => void; onNext?: () => void; nextLabel?: string
}) {
  return (
    <div className="pv-center" role="status">
      {medal}
      <h3 className="t-headline-sm pv-title">{title}</h3>
      <p className="t-body-lg pv-text">{cierre}</p>
      <div className="pv-actions">
        {onNext && <Button size="big" onClick={onNext}>{nextLabel ?? 'Siguiente'}</Button>}
        {onReplay && <Button size="big" variant={onNext ? 'outline' : 'fill'} onClick={onReplay}>Volver a jugar</Button>}
        {onHome && <Button size="big" variant="outline" onClick={onHome}>Ir al inicio</Button>}
      </div>
    </div>
  )
}

/** Diálogo «Cómo jugar». */
export function PvHelp({ open, onClose, children }: { open: boolean; onClose: () => void; children: ReactNode }) {
  return <Modal open={open} small title="Cómo jugar" onClose={onClose} footer={<Button onClick={onClose}>Continuar jugando</Button>}>{children}</Modal>
}

/** Hook para abrir/cerrar «Cómo jugar». */
export function useHelp() {
  const [open, setOpen] = useState(false)
  return { open, show: () => setOpen(true), hide: () => setOpen(false) }
}

/** Mensaje de cierre por defecto cuando el administrador no escribió uno. */
export const CIERRE_DEFECTO = '¡Gracias por jugar! Sigue explorando esta sección.'
