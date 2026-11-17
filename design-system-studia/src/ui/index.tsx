import {
  cloneElement, useEffect, useId, useRef, useState,
  type AnchorHTMLAttributes, type ButtonHTMLAttributes, type HTMLAttributes, type InputHTMLAttributes, type KeyboardEvent, type ReactElement, type ReactNode,
  type SelectHTMLAttributes, type TextareaHTMLAttributes,
} from 'react'
import logo from '../assets/kanoalab-simbolo.svg'
import './ui.css'

const cx = (...a: (string | false | null | undefined)[]) => a.filter(Boolean).join(' ')

/* ═════════════ ÁTOMOS ═════════════ */

/* Iconos propios del sistema (no existen en Material Symbols): SVG con currentColor sobre una cuadrícula de 24 px */
const HEART = 'M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z'
/* Memoria: 4 cartas en 2×2; la diagonal está volteada (relleno con un corazón recortado) y las otras dos están boca abajo (solo contorno) */
function MemoryCardsIcon({ size, className }: { size: number; className?: string }) {
  const uid = useId().replace(/:/g, '')
  const pos = [0.5, 13.5]
  const flipped = new Set(['1-0', '0-1'])
  return (
    <svg className={cx('ds-icon-svg', className)} width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true" focusable="false">
      {pos.flatMap((y, r) => pos.map((x, c) => {
        const k = `${c}-${r}`
        if (!flipped.has(k)) return <rect key={k} x={x + 0.8} y={y + 0.8} width="8.4" height="8.4" rx="2.2" stroke="currentColor" strokeWidth="1.6" />
        return (
          <g key={k}>
            <mask id={`${uid}-${k}`}>
              <rect x={x} y={y} width="10" height="10" fill="#fff" />
              <path d={HEART} fill="#000" transform={`translate(${x + 5 - 12 * 0.27} ${y + 5 - 12.2 * 0.27}) scale(0.27)`} />
            </mask>
            <rect x={x} y={y} width="10" height="10" rx="2.8" fill="currentColor" mask={`url(#${uid}-${k})`} />
          </g>
        )
      }))}
    </svg>
  )
}
/* Crucigrama: cuadrícula 3×3 continua (palabras de 3 letras) con la casilla central negra */
function CrosswordIcon({ size, className }: { size: number; className?: string }) {
  return (
    <svg className={cx('ds-icon-svg', className)} width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true" focusable="false">
      <rect x="1" y="1" width="22" height="22" rx="3" stroke="currentColor" strokeWidth="1.5" />
      <path d="M8.33 1v22M15.67 1v22M1 8.33h22M1 15.67h22" stroke="currentColor" strokeWidth="1.5" />
      <rect x="8.33" y="8.33" width="7.34" height="7.34" fill="currentColor" />
    </svg>
  )
}
const CUSTOM_ICONS: Record<string, (p: { size: number; className?: string }) => ReactNode> = { memory_cards: MemoryCardsIcon, crossword: CrosswordIcon }

export function Icon({ name, size = 24, className }: { name: string; size?: number; className?: string }) {
  const Custom = CUSTOM_ICONS[name]
  if (Custom) return <Custom size={size} className={className} />
  return <span className={cx('ds-icon', className)} style={{ fontSize: size }} aria-hidden="true">{name}</span>
}

export type ButtonVariant = 'fill' | 'outline' | 'text' | 'flat' | 'raised'
export type Size = 'small' | 'medium' | 'big'

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?: Size
  tone?: 'primary' | 'error'
  icon?: string
  iconEnd?: string
  block?: boolean
}
export function Button({ variant = 'fill', size = 'medium', tone = 'primary', icon, iconEnd, block, className, children, type = 'button', ...rest }: ButtonProps) {
  return (
    <button type={type} className={cx('ds-btn', `ds-btn--${variant}`, size !== 'medium' && `ds-btn--${size}`, tone === 'error' && 'ds-btn--error', block && 'ds-btn--block', className)} {...rest}>
      {icon && <Icon name={icon} size={18} />}
      {children}
      {iconEnd && <Icon name={iconEnd} size={18} />}
    </button>
  )
}

export function IconButton({ icon, label, primary, className, ...rest }: { icon: string; label: string; primary?: boolean } & ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button type="button" aria-label={label} title={label} className={cx('ds-iconbtn', primary && 'ds-iconbtn--primary', className)} {...rest}>
      <Icon name={icon} />
    </button>
  )
}

export function Link({ quiet, className, ...rest }: { quiet?: boolean } & AnchorHTMLAttributes<HTMLAnchorElement>) {
  return <a className={cx('ds-link', quiet && 'ds-link--quiet', className)} {...rest} />
}

export function Kbd({ children }: { children: ReactNode }) { return <kbd className="ds-kbd">{children}</kbd> }

export function Divider({ label, vertical }: { label?: string; vertical?: boolean }) {
  if (vertical) return <span className="ds-divider ds-divider--vertical" role="separator" aria-orientation="vertical" />
  if (label) return <div className="ds-divider--label t-label-md" role="separator">{label}</div>
  return <hr className="ds-divider" />
}

/* Campos */
interface FieldShellProps {
  label?: string; help?: string; error?: string; counter?: string; required?: boolean; disabled?: boolean; id: string; children: ReactNode; className?: string
}
function FieldShell({ label, help, error, counter, required, disabled, id, children, className }: FieldShellProps) {
  return (
    <div className={cx('ds-field', error && 'ds-field--error', disabled && 'ds-field--disabled', className)}>
      {label && <label className="ds-field__label" htmlFor={id}>{label}{required && <span className="ds-field__req" aria-hidden="true">*</span>}</label>}
      {children}
      {(error || help || counter) && (
        <div className="ds-field__foot">
          <span className="ds-field__help" id={`${id}-help`} role={error ? 'alert' : undefined}>{error ?? help}</span>
          {counter && <span className="ds-field__counter">{counter}</span>}
        </div>
      )}
    </div>
  )
}

export interface TextFieldProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label?: string; help?: string; error?: string; counter?: string; icon?: string; trailingIcon?: string; size?: Size
}
export function TextField({ label, help, error, counter, icon, trailingIcon, size = 'small', required, disabled, id, className, ...rest }: TextFieldProps) {
  const uid = useId(); const fid = id ?? uid
  return (
    <FieldShell {...{ label, help, error, counter, required, disabled }} id={fid} className={className}>
      <div className={cx('ds-control', size !== 'small' && `ds-control--${size}`)}>
        {icon && <Icon name={icon} size={20} />}
        <input id={fid} required={required} disabled={disabled} aria-invalid={!!error} aria-describedby={error || help ? `${fid}-help` : undefined} {...rest} />
        {trailingIcon && <Icon name={trailingIcon} size={20} />}
      </div>
    </FieldShell>
  )
}

export function PasswordField({ label, help, error, size = 'small', required, disabled, id, className, autoComplete = 'current-password', ...rest }:
  Omit<TextFieldProps, 'type' | 'trailingIcon' | 'icon'>) {
  const [show, setShow] = useState(false)
  const uid = useId(); const fid = id ?? uid
  return (
    <FieldShell {...{ label, help, error, required, disabled }} id={fid} className={className}>
      <div className={cx('ds-control', size !== 'small' && `ds-control--${size}`)}>
        <Icon name="lock" size={20} />
        <input id={fid} type={show ? 'text' : 'password'} required={required} disabled={disabled} autoComplete={autoComplete}
          aria-invalid={!!error} aria-describedby={error || help ? `${fid}-help` : undefined} {...rest} />
        <button type="button" className="ds-iconbtn ds-iconbtn--inset" disabled={disabled} aria-label={show ? 'Ocultar contraseña' : 'Mostrar contraseña'} aria-pressed={show} onClick={() => setShow(!show)}>
          <Icon name={show ? 'visibility_off' : 'visibility'} size={20} />
        </button>
      </div>
    </FieldShell>
  )
}

export interface TextAreaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> { label?: string; help?: string; error?: string; counter?: string }
export function TextArea({ label, help, error, counter, required, disabled, id, className, ...rest }: TextAreaProps) {
  const uid = useId(); const fid = id ?? uid
  return (
    <FieldShell {...{ label, help, error, counter, required, disabled }} id={fid} className={className}>
      <div className="ds-control ds-control--textarea">
        <textarea id={fid} required={required} disabled={disabled} aria-invalid={!!error} {...rest} />
      </div>
    </FieldShell>
  )
}

export interface SelectProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'size'> {
  label?: string; help?: string; error?: string; size?: Size; options: { value: string; label: string }[]; placeholder?: string
}
export function Select({ label, help, error, size = 'small', options, placeholder, required, disabled, id, className, ...rest }: SelectProps) {
  const uid = useId(); const fid = id ?? uid
  return (
    <FieldShell {...{ label, help, error, required, disabled }} id={fid} className={className}>
      <div className={cx('ds-control ds-control--select', size !== 'small' && `ds-control--${size}`)}>
        <select id={fid} required={required} disabled={disabled} aria-invalid={!!error} {...rest}>
          {placeholder && <option value="">{placeholder}</option>}
          {options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
        <Icon name="expand_more" size={20} />
      </div>
    </FieldShell>
  )
}

export function Checkbox({ label, indeterminate, disabled, className, ...rest }: { label: string; indeterminate?: boolean } & InputHTMLAttributes<HTMLInputElement>) {
  const ref = useRef<HTMLInputElement>(null)
  useEffect(() => { if (ref.current) ref.current.indeterminate = !!indeterminate }, [indeterminate])
  return (
    <label className={cx('ds-choice', disabled && 'ds-choice--disabled', className)}>
      <input ref={ref} type="checkbox" disabled={disabled} {...rest} />
      <span className="ds-choice__box"><Icon name={indeterminate ? 'remove' : 'check'} size={16} /></span>
      {label}
    </label>
  )
}

export function Radio({ label, disabled, className, ...rest }: { label: string } & InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className={cx('ds-choice ds-choice--radio', disabled && 'ds-choice--disabled', className)}>
      <input type="radio" disabled={disabled} {...rest} />
      <span className="ds-choice__box" />
      {label}
    </label>
  )
}

export function Switch({ label, disabled, className, ...rest }: { label: string } & InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className={cx('ds-choice', disabled && 'ds-choice--disabled', className)}>
      <input type="checkbox" role="switch" disabled={disabled} {...rest} />
      <span className="ds-switch__track" />
      {label}
    </label>
  )
}

/* Etiquetas de estado */
export type TagType = 'general' | 'success' | 'prevent' | 'error' | 'draft'
export type TagColor = 'red' | 'green' | 'blue' | 'orange' | 'teal' | 'indigo'
export function StatusTag({ type, color, grey, dot, shape = 'circle', children }: {
  type?: TagType; color?: TagColor; grey?: boolean; dot?: boolean; shape?: 'circle' | 'square'; children: ReactNode
}) {
  const kind = grey ? 'grey' : (color ?? type ?? 'general')
  return (
    <span className={cx('ds-tag', `ds-tag--${kind}`)}>
      {dot && <span className={cx('ds-tag__dot', shape === 'square' && 'ds-tag__dot--square')} />}
      {children}
    </span>
  )
}

export function Badge({ count, max = 99 }: { count: number; max?: number }) {
  return <span className="ds-badge" aria-label={`${count} pendientes`}>{count > max ? `${max}+` : count}</span>
}

export function Chip({ active, small, primitive, icon, onClick, children }: {
  active?: boolean; small?: boolean; primitive?: boolean; icon?: string; onClick?: () => void; children: ReactNode
}) {
  return (
    <button type="button" aria-pressed={!!active} onClick={onClick}
      className={cx('ds-chip', small && 'ds-chip--small', primitive && 'ds-chip--primitive', active && 'ds-chip--active')}>
      {active ? <Icon name="check" size={18} /> : icon && <Icon name={icon} size={18} />}
      {children}
    </button>
  )
}

export function Avatar({ name, src, size = 40 }: { name: string; src?: string; size?: number }) {
  const initials = name.split(/\s+/).filter(Boolean).slice(0, 2).map((w) => w[0]!.toUpperCase()).join('')
  return (
    <span className="ds-avatar" style={{ ['--s' as string]: `${size}px` }} role="img" aria-label={name}>
      {src ? <img src={src} alt="" /> : initials}
    </span>
  )
}

export function Spinner({ size = 24, label = 'Cargando' }: { size?: number; label?: string }) {
  return <span className="ds-spinner" style={{ ['--s' as string]: `${size}px` }} role="status" aria-label={label} />
}

export function ProgressBar({ value, vertical, label }: { value: number; vertical?: boolean; label?: string }) {
  const v = Math.max(0, Math.min(100, value))
  return (
    <div className={cx('ds-progress', vertical && 'ds-progress--vertical')} role="progressbar" aria-valuenow={v} aria-valuemin={0} aria-valuemax={100} aria-label={label}>
      <span style={vertical ? { height: `${v}%` } : { width: `${v}%` }} />
    </div>
  )
}

/** El hijo debe ser un único elemento enfocable: recibe aria-describedby. Escape cierra el tip sin mover el foco (WCAG 1.4.13). */
export function Tooltip({ text, children }: { text: string; children: ReactElement<{ 'aria-describedby'?: string }> }) {
  const id = useId()
  const [dismissed, setDismissed] = useState(false)
  return (
    <span className={cx('ds-tooltip', dismissed && 'ds-tooltip--dismissed')}
      onMouseLeave={() => setDismissed(false)} onBlur={() => setDismissed(false)}
      onKeyDown={(e) => { if (e.key === 'Escape') setDismissed(true) }}>
      {cloneElement(children, { 'aria-describedby': id })}
      <span className="ds-tooltip__tip"><span className="ds-tooltip__text" role="tooltip" id={id}>{text}</span></span>
    </span>
  )
}

/* ═════════════ MOLÉCULAS ═════════════ */

export type MessageType = 'primary' | 'error' | 'prevent' | 'success'
const messageIcon: Record<MessageType, string> = { primary: 'info', error: 'error', prevent: 'warning', success: 'check_circle' }

export function Message({ type = 'primary', title, children, onClose }: { type?: MessageType; title?: string; children?: ReactNode; onClose?: () => void }) {
  return (
    <div className={cx('ds-message', `ds-message--${type}`)} role={type === 'error' ? 'alert' : 'status'}>
      <Icon name={messageIcon[type]} size={22} />
      <div className="ds-message__body">
        {title && <div className="ds-message__title">{title}</div>}
        {children && <div className="t-body-md">{children}</div>}
      </div>
      {onClose && <IconButton icon="close" label="Cerrar" onClick={onClose} style={{ width: 28, height: 28, color: 'inherit' }} />}
    </div>
  )
}

export function Snackbar({ type, children, action, onAction }: { type?: 'error' | 'prevent' | 'success'; children: ReactNode; action?: string; onAction?: () => void }) {
  return (
    <div className={cx('ds-snackbar', type && `ds-snackbar--${type}`)} role="status">
      <span className="t-body-md">{children}</span>
      {action && <Button variant="text" size="small" onClick={onAction}>{action}</Button>}
    </div>
  )
}

/** Patrón APG: una sola pestaña en el orden de tabulación; ←/→/Inicio/Fin mueven y activan. Con `idPrefix`, enlaza cada pestaña con su <TabPanel>. */
export function Tabs({ tabs, value, onChange, pill, label, idPrefix }: {
  tabs: { id: string; label: string; disabled?: boolean }[]; value: string; onChange: (id: string) => void; pill?: boolean; label?: string; idPrefix?: string
}) {
  const refs = useRef<Record<string, HTMLButtonElement | null>>({})
  const enabled = tabs.filter((t) => !t.disabled)
  const onKey = (e: KeyboardEvent<HTMLButtonElement>) => {
    const i = enabled.findIndex((t) => t.id === value)
    let next: number | null = null
    if (e.key === 'ArrowRight') next = (i + 1) % enabled.length
    else if (e.key === 'ArrowLeft') next = (i - 1 + enabled.length) % enabled.length
    else if (e.key === 'Home') next = 0
    else if (e.key === 'End') next = enabled.length - 1
    if (next === null) return
    e.preventDefault()
    const t = enabled[next]!
    onChange(t.id); refs.current[t.id]?.focus()
  }
  return (
    <div className={cx('ds-tabs', pill && 'ds-tabs--pill')} role="tablist" aria-label={label}>
      {tabs.map((t) => (
        <button key={t.id} ref={(el) => { refs.current[t.id] = el }} type="button" role="tab" className="ds-tab"
          id={idPrefix ? `${idPrefix}-tab-${t.id}` : undefined} aria-controls={idPrefix ? `${idPrefix}-panel-${t.id}` : undefined}
          aria-selected={value === t.id} tabIndex={value === t.id ? 0 : -1} disabled={t.disabled} onKeyDown={onKey} onClick={() => onChange(t.id)}>{t.label}</button>
      ))}
    </div>
  )
}

export function TabPanel({ idPrefix, id, value, children }: { idPrefix: string; id: string; value: string; children: ReactNode }) {
  return <div role="tabpanel" id={`${idPrefix}-panel-${id}`} aria-labelledby={`${idPrefix}-tab-${id}`} hidden={value !== id} tabIndex={0}>{children}</div>
}

export function Pagination({ page, pages, onChange }: { page: number; pages: number; onChange: (p: number) => void }) {
  const items: (number | '…')[] = []
  for (let p = 1; p <= pages; p++) {
    if (p === 1 || p === pages || Math.abs(p - page) <= 1) items.push(p)
    else if (items[items.length - 1] !== '…') items.push('…')
  }
  return (
    <nav className="ds-pagination" aria-label="Paginación">
      <IconButton icon="chevron_left" label="Anterior" disabled={page === 1} onClick={() => onChange(page - 1)} />
      {items.map((it, i) => it === '…'
        ? <span key={`e${i}`} className="t-body-md" style={{ padding: '0 4px' }}>…</span>
        : <button key={it} type="button" className="ds-page" aria-current={it === page ? 'page' : undefined} onClick={() => onChange(it)}>{it}</button>)}
      <IconButton icon="chevron_right" label="Siguiente" disabled={page === pages} onClick={() => onChange(page + 1)} />
    </nav>
  )
}

export function Card({ title, children, media, horizontal, interactive, actions, onClick }: {
  title: string; children?: ReactNode; media?: ReactNode; horizontal?: boolean; interactive?: boolean; actions?: ReactNode; onClick?: () => void
}) {
  return (
    <article className={cx('ds-card', horizontal && 'ds-card--horizontal', interactive && 'ds-card--interactive')} tabIndex={interactive ? 0 : undefined}
      role={interactive ? 'link' : undefined} onClick={onClick} onKeyDown={interactive ? (e) => { if (e.key === 'Enter') onClick?.() } : undefined}>
      {media && <div className="ds-card__media">{media}</div>}
      <div className="ds-card__body">
        <h3 className="t-title-md">{title}</h3>
        {children && <p className="t-body-md">{children}</p>}
        {actions && <div className="ds-card__actions" style={{ padding: 0, marginTop: 'auto' }}>{actions}</div>}
      </div>
    </article>
  )
}

export function MenuItem({ icon, children, active, disabled, small, badge, tooltip, onClick }: {
  icon?: string; children: ReactNode; active?: boolean; disabled?: boolean; small?: boolean; badge?: number; tooltip?: string; onClick?: () => void
}) {
  return (
    <button type="button" className={cx('ds-menuitem', small && 'ds-menuitem--small')} aria-current={active ? 'page' : undefined} disabled={disabled} onClick={onClick} title={tooltip ?? (typeof children === 'string' ? children : undefined)}>
      {icon && <Icon name={icon} />}
      <span className="ds-menuitem__label">{children}</span>
      {badge ? <Badge count={badge} /> : null}
    </button>
  )
}

export function Accordion({ title, defaultOpen, children }: { title: string; defaultOpen?: boolean; children: ReactNode }) {
  const [open, setOpen] = useState(!!defaultOpen)
  const id = useId()
  return (
    <div className="ds-accordion">
      <button type="button" className="ds-accordion__head" aria-expanded={open} aria-controls={id} onClick={() => setOpen(!open)}>
        {title}<Icon name="expand_more" />
      </button>
      {open && <div className="ds-accordion__panel" id={id}>{children}</div>}
    </div>
  )
}

export function Breadcrumb({ items }: { items: (string | { label: string; href: string })[] }) {
  const list = items.map((it) => (typeof it === 'string' ? { label: it, href: '#' } : it))
  return (
    <nav aria-label="Ruta de navegación">
      <ol className="ds-breadcrumb">
        {list.map((it, i) => (
          <li key={it.label} style={{ display: 'contents' }}>
            {i === list.length - 1
              ? <span aria-current="page">{it.label}</span>
              : <><a href={it.href} onClick={it.href === '#' ? (e) => e.preventDefault() : undefined}>{it.label}</a><Icon name="chevron_right" size={16} /></>}
          </li>
        ))}
      </ol>
    </nav>
  )
}

export function ProgressSteps({ steps, current }: { steps: string[]; current: number }) {
  return (
    <ol className="ds-steps" aria-label="Progreso">
      {steps.map((s, i) => (
        <li key={s} className="ds-steps__item">
          <div className={cx('ds-step', i < current && 'ds-step--done', i === current && 'ds-step--current')} aria-current={i === current ? 'step' : undefined}>
            <span className="ds-step__dot">{i < current ? <Icon name="check" size={16} /> : i + 1}</span><span className="ds-step__label">{s}</span>
          </div>
          {i < steps.length - 1 && <span className={cx('ds-step__line', i < current && 'ds-step__line--done')} />}
        </li>
      ))}
    </ol>
  )
}

export function ItemList({ items }: { items: { title: string; meta: string; tag?: ReactNode }[] }) {
  return (
    <ul className="ds-itemlist">
      {items.map((it) => (
        <li key={it.title}>
          <div className="ds-itemlist__main"><strong className="t-title-sm">{it.title}</strong><span>{it.meta}</span></div>
          {it.tag}
        </li>
      ))}
    </ul>
  )
}

/* ═════════════ ORGANISMOS ═════════════ */

export function Modal({ open, title, onClose, children, footer, small, wide }: {
  open: boolean; title: string; onClose: () => void; children: ReactNode; footer?: ReactNode; small?: boolean; wide?: boolean
}) {
  const id = useId()
  const ref = useRef<HTMLDialogElement>(null)
  useEffect(() => {
    const d = ref.current
    if (!d) return
    if (open && !d.open) d.showModal()
    if (!open && d.open) d.close()
  }, [open])
  return (
    <dialog ref={ref} className={cx('ds-modal', small && 'ds-modal--small', wide && 'ds-modal--wide')} aria-labelledby={id}
      onCancel={(e) => { e.preventDefault(); onClose() }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}>
      {open && (
        <>
          <div className="ds-modal__head">
            <h2 id={id} className="t-headline-sm" style={{ margin: 0 }}>{title}</h2>
            <IconButton icon="close" label="Cerrar" onClick={onClose} />
          </div>
          <div className="ds-modal__body t-body-md">{children}</div>
          {footer && <div className="ds-modal__foot">{footer}</div>}
        </>
      )}
    </dialog>
  )
}

export function ConfirmDialog({ open, title, message, confirmLabel = 'Confirmar', cancelLabel = 'Cancelar', danger, onConfirm, onCancel }: {
  open: boolean; title: string; message: string; confirmLabel?: string; cancelLabel?: string; danger?: boolean; onConfirm: () => void; onCancel: () => void
}) {
  return (
    <Modal open={open} small title={title} onClose={onCancel}
      footer={<><Button variant="text" onClick={onCancel}>{cancelLabel}</Button><Button tone={danger ? 'error' : 'primary'} onClick={onConfirm}>{confirmLabel}</Button></>}>
      {message}
    </Modal>
  )
}

/* Símbolo Kanoa (Figma LogosKanoalab/Simbolo). Colores por token para que cambie con el tema (logo/Logo-Primary y Logo-Secondary). */
export function KanoaMark({ width = 36 }: { width?: number }) {
  return (
    <svg width={width} height={width * 1.1084} viewBox="0 0 36 39.9043" fill="none" aria-hidden="true" focusable="false">
      <g fill="var(--logo-primary)">
        <path d="M0.876725 4.73597H0V39.9034H6.76265V10.6219C6.76265 7.37074 4.12695 4.73505 0.875804 4.73505L0.876725 4.73597Z" />
        <path d="M36 39.9043L16.7774 20.9448L11.9954 25.7268L26.3947 39.9043H36Z" />
        <path d="M21.7047 8.38087L0.398346 29.6035L5.18031 34.3855L34.9457 4.73597H30.5262C27.2189 4.73597 24.0469 6.046 21.7038 8.37995L21.7047 8.38087Z" />
      </g>
      <path fill="var(--logo-secondary)" d="M13.5262 9.46826C16.1408 9.46826 18.2604 7.34872 18.2604 4.73413C18.2604 2.11954 16.1408 0 13.5262 0C10.9116 0 8.79209 2.11954 8.79209 4.73413C8.79209 7.34872 10.9116 9.46826 13.5262 9.46826Z" />
    </svg>
  )
}

export interface NavbarUser { name: string; email?: string; tag?: ReactNode }

/* Navbar de Figma (StudIA2.0 - Navbar, nodo 2142:13641): expandido (310 px) y comprimido (card de 72 px) con botón para abrir/cerrar */
export function Navbar({ items, active, onSelect, compress = false, onToggle, brand = 'StudIA 2.0', user, footer }: {
  items: { id: string; icon: string; label: string; badge?: number; disabled?: boolean; title?: string }[]; active: string; onSelect: (id: string) => void
  compress?: boolean; onToggle?: () => void; brand?: string; user?: NavbarUser; footer?: ReactNode
}) {
  const toggleRef = useRef<HTMLButtonElement>(null)
  const refocus = useRef(false)
  // El botón cambia de lugar al abrir/cerrar: se devuelve el foco al nuevo para no perder el contexto del teclado
  useEffect(() => { if (refocus.current) { refocus.current = false; toggleRef.current?.focus() } }, [compress])
  const toggle = onToggle && (
    <button ref={toggleRef} type="button" className="ds-navbar__toggle" aria-expanded={!compress} aria-controls="ds-navbar-panel"
      aria-label={compress ? 'Abrir navegación' : 'Cerrar navegación'} title={compress ? 'Abrir navegación' : 'Cerrar navegación'}
      onClick={() => { refocus.current = true; onToggle() }}>
      <Icon name={compress ? 'left_panel_open' : 'left_panel_close'} />
    </button>
  )
  return (
    <nav className={cx('ds-navbar', compress && 'ds-navbar--compress')} aria-label="Principal">
      <div className="ds-navbar__panel" id="ds-navbar-panel">
        <div className="ds-navbar__head">
          <span className="ds-navbar__logo"><KanoaMark /></span>
          {!compress && <span className="t-label-lg ds-navbar__name">{brand}</span>}
          {!compress && toggle}
        </div>
        <div className="ds-navbar__body">
          {items.map((it) => (
            <MenuItem key={it.id} icon={it.icon} badge={compress ? undefined : it.badge} active={active === it.id} disabled={it.disabled} tooltip={it.title} onClick={() => onSelect(it.id)}>{it.label}</MenuItem>
          ))}
        </div>
        {footer && <div className="ds-navbar__footer">{footer}</div>}
        {user && (
          <div className="ds-navbar__user" title={compress ? user.name : undefined}>
            <Avatar name={user.name} size={24} />
            {!compress && (
              <span className="ds-navbar__who">
                <span className="t-body-md ds-navbar__uname">{user.name}</span>
                {user.email && <span className="t-body-sm ds-navbar__umail">{user.email}</span>}
                {user.tag}
              </span>
            )}
          </div>
        )}
      </div>
      {compress && toggle && <span className="ds-navbar__float">{toggle}</span>}
    </nav>
  )
}

/* Header Group de Figma (pantalla Juegos, nodo 3427:36494): banda sólida surface-variant con volver, título y acciones; la descripción va debajo */
export function ContextBar({ title, titleAs: Title = 'h1', badge, onBack, description, actions }: {
  title: string; titleAs?: 'h1' | 'h2' | 'p'; badge?: ReactNode; onBack?: () => void; description?: ReactNode; actions?: ReactNode
}) {
  return (
    <div className="ds-contextbar">
      <div className="ds-contextbar__band">
        {onBack && <IconButton icon="chevron_left" label="Volver" onClick={onBack} />}
        <Title className="ds-contextbar__title">
          <span>{title}</span>
          {badge}
        </Title>
        {actions && <div className="ds-contextbar__actions">{actions}</div>}
      </div>
      {description && <p className="ds-contextbar__desc t-body-md">{description}</p>}
    </div>
  )
}

/* Contenedor de filtros/búsqueda (Figma: surface-container-lowest, borde outline-variant, radio 12, padding 24) */
export function Panel({ children, className, ...rest }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cx('ds-panel', className)} {...rest}>{children}</div>
}

export function Header({ title, user, onMenu, actions, titleAs: Title = 'h1' }: { title: string; user?: string; onMenu?: () => void; actions?: ReactNode; titleAs?: 'h1' | 'h2' | 'p' }) {
  return (
    <header className="ds-header">
      {onMenu && <IconButton icon="menu" label="Menú" onClick={onMenu} />}
      <Title className="ds-header__title t-title-lg" style={{ margin: 0 }}>{title}</Title>
      {actions}
      {user && <Avatar name={user} size={36} />}
    </header>
  )
}
