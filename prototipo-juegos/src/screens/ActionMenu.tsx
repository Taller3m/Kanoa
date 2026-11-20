import { useEffect, useId, useRef, useState, type KeyboardEvent } from 'react'
import { Icon, IconButton } from '../ui'

export interface MenuAction {
  label: string
  icon: string
  onClick?: () => void
  danger?: boolean
  /** Si viene, la opción se muestra deshabilitada (en gris) con este texto de ayuda debajo. */
  disabledHelp?: string
}

const MENU_W = 240

/**
 * Botón ⋮ con su menú de acciones.
 * Teclado: ↑/↓ recorren las opciones (en ciclo), Inicio/Fin van a la primera/última; Esc, Tab o clic fuera cierran
 * y devuelven el foco al botón ⋮. Las opciones deshabilitadas son enfocables (aria-disabled) para que se anuncie el motivo.
 */
export function ActionMenu({ label, actions }: { label: string; actions: MenuAction[] }) {
  const [rect, setRect] = useState<DOMRect | null>(null)
  const btn = useRef<HTMLButtonElement>(null)
  const ref = useRef<HTMLDivElement>(null)
  const uid = useId()

  useEffect(() => { if (rect) ref.current?.querySelector<HTMLButtonElement>('[role="menuitem"]')?.focus() }, [rect])

  const cerrar = () => { setRect(null); btn.current?.focus() }
  const elegir = (a: MenuAction) => { if (a.disabledHelp) return; setRect(null); a.onClick?.() }

  const onKeyDown = (e: KeyboardEvent) => {
    const items = [...(ref.current?.querySelectorAll<HTMLButtonElement>('[role="menuitem"]') ?? [])]
    const i = items.indexOf(document.activeElement as HTMLButtonElement)
    const ir = (n: number) => { e.preventDefault(); items[(n + items.length) % items.length]?.focus() }
    if (e.key === 'ArrowDown') ir(i + 1)
    else if (e.key === 'ArrowUp') ir(i - 1)
    else if (e.key === 'Home') ir(0)
    else if (e.key === 'End') ir(items.length - 1)
    else if (e.key === 'Escape' || e.key === 'Tab') { e.preventDefault(); cerrar() }
  }

  const alto = actions.reduce((h, a) => h + (a.disabledHelp ? 64 : 44), 16)
  return (
    <>
      <IconButton icon="more_vert" label={label} aria-haspopup="menu" aria-expanded={!!rect}
        onClick={(e) => { btn.current = e.currentTarget; setRect(e.currentTarget.getBoundingClientRect()) }} />
      {rect && (
        <>
          <div style={{ position: 'fixed', inset: 0, zIndex: 39 }} onClick={cerrar} aria-hidden="true" />
          <div ref={ref} className="menu" role="menu" aria-label={label} onKeyDown={onKeyDown}
            style={{ top: Math.min(rect.bottom + 4, window.innerHeight - alto), left: Math.max(16, rect.right - MENU_W), width: MENU_W }}>
            {actions.map((a, i) => a.disabledHelp ? (
              <button key={a.label} type="button" role="menuitem" className="ds-menuitem menu__item--off" aria-disabled="true" aria-describedby={`${uid}-${i}`}>
                <Icon name={a.icon} size={20} />
                <span className="ds-menuitem__label">{a.label}<small id={`${uid}-${i}`}>{a.disabledHelp}</small></span>
              </button>
            ) : (
              <button key={a.label} type="button" role="menuitem" className={'ds-menuitem' + (a.danger ? ' ds-menuitem--danger' : '')} onClick={() => elegir(a)}>
                <Icon name={a.icon} size={20} /><span className="ds-menuitem__label">{a.label}</span>
              </button>
            ))}
          </div>
        </>
      )}
    </>
  )
}
