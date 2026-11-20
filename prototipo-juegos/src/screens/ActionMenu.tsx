import { useEffect, useId, useRef, useState, type KeyboardEvent } from 'react'
import { Icon, IconButton } from '../ui'

export interface MenuAction {
  label: string
  icon?: string
  onClick?: () => void
  danger?: boolean
  /** Si viene, la opción se muestra deshabilitada (en gris) con este texto de ayuda debajo. Si además trae onClick, al seleccionarla se ejecuta (p. ej. para explicar el motivo). */
  disabledHelp?: string
  /** Opciones de un submenú que se abre a un lado (p. ej. «Cambiar estado» › Publicado / Inactivo). */
  submenu?: MenuAction[]
}

const MENU_W = 240
const SUB_W = 180

/**
 * Botón ⋮ con su menú de acciones.
 * Teclado: ↑/↓ recorren las opciones (en ciclo), Inicio/Fin van a la primera/última; → o Enter abren un submenú y ← lo cierra;
 * Esc, Tab o clic fuera cierran y devuelven el foco al botón ⋮. Las opciones deshabilitadas son enfocables (aria-disabled)
 * para que se anuncie el motivo.
 */
export function ActionMenu({ label, actions }: { label: string; actions: MenuAction[] }) {
  const [rect, setRect] = useState<DOMRect | null>(null)
  const [sub, setSub] = useState<number | null>(null)
  const btn = useRef<HTMLButtonElement>(null)
  const ref = useRef<HTMLDivElement>(null)
  const subRef = useRef<HTMLDivElement>(null)
  const uid = useId()

  useEffect(() => { if (rect) ref.current?.querySelector<HTMLButtonElement>('[role="menuitem"]')?.focus() }, [rect])
  useEffect(() => { if (sub != null) subRef.current?.querySelector<HTMLButtonElement>('[role="menuitem"]')?.focus() }, [sub])

  const cerrar = () => { setRect(null); setSub(null); btn.current?.focus() }
  const elegir = (a: MenuAction, i: number) => {
    if (a.disabledHelp && !a.onClick) return
    if (a.submenu) { setSub(sub === i ? null : i); return }
    setRect(null); setSub(null); a.onClick?.()
  }
  const cerrarSub = () => { const i = sub; setSub(null); if (i != null) ref.current?.querySelectorAll<HTMLButtonElement>('[role="menuitem"]')[i]?.focus() }

  const navegar = (e: KeyboardEvent, cont: HTMLDivElement | null, enSub: boolean) => {
    const items = [...(cont?.querySelectorAll<HTMLButtonElement>(':scope > [role="menuitem"]') ?? [])]
    const i = items.indexOf(document.activeElement as HTMLButtonElement)
    const ir = (n: number) => { e.preventDefault(); e.stopPropagation(); items[(n + items.length) % items.length]?.focus() }
    if (e.key === 'ArrowDown') ir(i + 1)
    else if (e.key === 'ArrowUp') ir(i - 1)
    else if (e.key === 'Home') ir(0)
    else if (e.key === 'End') ir(items.length - 1)
    else if (!enSub && e.key === 'ArrowRight' && actions[i]?.submenu) { e.preventDefault(); setSub(i) }
    else if (enSub && (e.key === 'ArrowLeft' || e.key === 'Escape')) { e.preventDefault(); e.stopPropagation(); cerrarSub() }
    else if (e.key === 'Escape' || e.key === 'Tab') { e.preventDefault(); cerrar() }
  }

  const item = (a: MenuAction, i: number, onPick: () => void, idx: string) => a.disabledHelp ? (
    <button key={a.label} type="button" role="menuitem" className="ds-menuitem menu__item--off" aria-disabled="true" aria-describedby={`${uid}-${idx}`} onClick={onPick}>
      {a.icon && <Icon name={a.icon} size={20} />}
      <span className="ds-menuitem__label">{a.label}<small id={`${uid}-${idx}`}>{a.disabledHelp}</small></span>
    </button>
  ) : (
    <button key={a.label} type="button" role="menuitem" className={'ds-menuitem' + (a.danger ? ' ds-menuitem--danger' : '')} onClick={onPick}
      aria-haspopup={a.submenu ? 'menu' : undefined} aria-expanded={a.submenu ? sub === i : undefined}>
      {a.icon && <Icon name={a.icon} size={20} />}<span className="ds-menuitem__label">{a.label}</span>
      {a.submenu && <Icon name="chevron_right" size={20} />}
    </button>
  )

  const alto = actions.reduce((h, a) => h + (a.disabledHelp ? 64 : 44), 16)
  const top = rect ? Math.min(rect.bottom + 4, window.innerHeight - alto) : 0
  const left = rect ? Math.max(16, rect.right - MENU_W) : 0
  const subLeft = left + MENU_W + 4 + SUB_W > window.innerWidth - 8 ? left - SUB_W - 4 : left + MENU_W + 4
  const subAcc = sub != null ? actions[sub] : undefined

  return (
    <>
      <IconButton icon="more_vert" label={label} aria-haspopup="menu" aria-expanded={!!rect}
        onClick={(e) => { btn.current = e.currentTarget; setRect(e.currentTarget.getBoundingClientRect()) }} />
      {rect && (
        <>
          <div style={{ position: 'fixed', inset: 0, zIndex: 39 }} onClick={cerrar} aria-hidden="true" />
          <div ref={ref} className="menu" role="menu" aria-label={label} onKeyDown={(e) => navegar(e, ref.current, false)} style={{ top, left, width: MENU_W }}>
            {actions.map((a, i) => item(a, i, () => elegir(a, i), String(i)))}
          </div>
          {subAcc?.submenu && (
            <div ref={subRef} className="menu" role="menu" aria-label={subAcc.label} onKeyDown={(e) => navegar(e, subRef.current, true)}
              style={{ top: top + 4 + (sub ?? 0) * 44, left: subLeft, width: SUB_W }}>
              {subAcc.submenu.map((s, j) => item(s, j, () => { setRect(null); setSub(null); s.onClick?.() }, `${sub}-${j}`))}
            </div>
          )}
        </>
      )}
    </>
  )
}
