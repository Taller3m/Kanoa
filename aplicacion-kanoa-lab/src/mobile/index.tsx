import { useEffect, useId, useRef, type CSSProperties, type ReactNode } from 'react'
import { Avatar, Icon, IconButton, ProgressBar, Snackbar, Spinner, StatusTag } from '../ui'
import { go } from '../app/router'
import { useApp, useConexion, type Descarga } from '../app/store'
import type { Area, AreaColor, EstadoClase } from '../app/data'
import './mobile.css'

/* Kit móvil de la app del estudiante. Se apoya en los componentes del sistema (src/ui) y en mobile.css (solo tokens).
   Íconos: Material Symbols Outlined por nombre, con <Icon name="…" /> del sistema. */

const cx = (...a: (string | false | null | undefined)[]) => a.filter(Boolean).join(' ')
export { cx }

export type Tone = AreaColor | 'primary' | 'secondary' | 'grey' | 'prevent' | 'success' | 'error'
export const tone = (t: Tone) => `m-tone-${t}`

/* ── Estructura ─────────────────────────────────────── */

/** Pantalla completa dentro del marco. `white` = fondo surface-container-lowest (ingreso, clase). */
export function Screen({ white, children, label }: { white?: boolean; children: ReactNode; label?: string }) {
  return <main className={cx('m-screen', white && 'm-screen--white')} aria-label={label}>{children}</main>
}

/** Área con scroll. `overlap`: la primera tarjeta se monta sobre el encabezado de color. `nav`: deja sitio a la barra inferior (por defecto). */
export function Scroll({ children, overlap, center, pager, noNav, style, className }: {
  children: ReactNode; overlap?: boolean; center?: boolean; pager?: boolean; noNav?: boolean; style?: CSSProperties; className?: string
}) {
  return <div className={cx('m-scroll', overlap && 'm-scroll--overlap', center && 'm-center', pager && 'm-scroll--pager', noNav && 'm-scroll--nonav', className)} style={style}>{children}</div>
}

/** Encabezado de color primario con saludo o título y chip de estado. */
export function Hero({ compact, children }: { compact?: boolean; children: ReactNode }) {
  return <header className={cx('m-hero', compact && 'm-hero--compact')}>{children}</header>
}

/** Encabezado compacto de una pantalla principal: título, subtítulo y chip de conexión a la derecha. */
export function HeroTitle({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <Hero compact>
      <div className="m-row" style={{ gap: 12 }}>
        <div className="m-col m-grow" style={{ gap: 2 }}>
          <h1 className="t-headline-sm">{title}</h1>
          {subtitle && <p className="t-body-md">{subtitle}</p>}
        </div>
        <StatusChip />
      </div>
    </Hero>
  )
}

/** Encabezado del área en su color, con volver y acciones. */
export function AreaHeader({ area, onBack, actions, children }: { area: Area; onBack: () => void; actions?: ReactNode; children?: ReactNode }) {
  return (
    <header className={cx('m-areahead', tone(area.color))}>
      <div className="m-row">
        <IconButton icon="arrow_back" label="Volver" onClick={onBack} />
        <span className="m-grow" />
        {actions}
      </div>
      {children}
    </header>
  )
}

/** Barra superior simple con volver, título, subtítulo y acciones. */
export function AppBar({ title, subtitle, onBack, actions, style }: { title: string; subtitle?: string; onBack?: () => void; actions?: ReactNode; style?: CSSProperties }) {
  return (
    <div className="m-appbar" style={style}>
      {onBack && <IconButton icon="arrow_back" label="Volver" onClick={onBack} />}
      <div className="m-appbar__title" style={onBack ? undefined : { paddingLeft: 12 }}>
        <h1 className="t-title-md">{title}</h1>
        {subtitle && <p className="t-body-sm">{subtitle}</p>}
      </div>
      {actions}
    </div>
  )
}

/* ── Navegación ─────────────────────────────────────── */

export type Destino = 'inicio' | 'descargas' | 'kit' | 'grupo' | 'perfil'
const DESTINOS: { id: Destino; label: string; icon: string }[] = [
  { id: 'inicio', label: 'Inicio', icon: 'home' },
  { id: 'descargas', label: 'Descargas', icon: 'download' },
  { id: 'kit', label: 'Kit', icon: 'mood' },
  { id: 'grupo', label: 'Mi grupo', icon: 'group' },
  { id: 'perfil', label: 'Perfil', icon: 'person' },
]

/** Barra inferior con los 5 destinos principales. */
export function BottomNav({ active }: { active: Destino }) {
  return (
    <nav className="m-bottomnav" aria-label="Navegación principal">
      {DESTINOS.map((d) => (
        <button key={d.id} type="button" aria-current={active === d.id ? 'page' : undefined} onClick={() => go(d.id)}>
          <span className="m-bottomnav__pill"><Icon name={d.icon} /></span>
          <span>{d.label}</span>
        </button>
      ))}
    </nav>
  )
}

/** Chip de estado de conexión (Al día · Actualizando · Sin internet). Al tocarlo abre «Estado de tu información» (B05). */
export function StatusChip({ surface }: { surface?: boolean }) {
  const c = useConexion()
  const label = c === 'al-dia' ? 'Al día' : c === 'actualizando' ? 'Actualizando' : 'Sin internet'
  return (
    <button type="button" className={cx('m-statuschip', surface ? 'm-statuschip--surface' : 'm-statuschip--on-primary')}
      aria-label={`${label}. Ver el estado de tu información`} onClick={() => go('estado')}>
      {c === 'actualizando' ? <Spinner size={16} label="Actualizando" /> : <Icon name={c === 'al-dia' ? 'cloud_done' : 'cloud_off'} size={18} />}
      <span>{label}</span>
    </button>
  )
}

/** Barra de páginas de la clase: «Anterior» (desde la página 2), «Página n de m» y «Siguiente». */
export function PagerBar({ children }: { children: ReactNode }) {
  return <div className="m-pagerbar">{children}</div>
}

/** Avance por páginas de la clase en segmentos. */
export function Segments({ total, current }: { total: number; current: number }) {
  return (
    <div className="m-segments" role="img" aria-label={`Página ${current} de ${total}`}>
      {Array.from({ length: total }, (_, i) => <span key={i} data-on={i < current} />)}
    </div>
  )
}

/* ── Piezas de contenido ────────────────────────────── */

/** Saludo con avatar de iniciales. */
export function UserAvatar({ name, size = 44 }: { name: string; size?: number }) {
  return <Avatar name={name} size={size} />
}

/** Mosaico de color con un número o un ícono (número de clase en el color del área). */
export function Tile({ t, size = 40, children }: { t: Tone; size?: number; children: ReactNode }) {
  return <span className={cx('m-tile', tone(t))} style={{ ['--s' as string]: `${size}px` }}>{children}</span>
}

/** Círculo de color con ícono (diálogos, estados vacíos). */
export function Circle({ t, size = 56, icon, iconSize = 28 }: { t: Tone; size?: number; icon: string; iconSize?: number }) {
  return <span className={cx('m-circle', tone(t))} style={{ ['--s' as string]: `${size}px` }}><Icon name={icon} size={iconSize} /></span>
}

/** Bloque de área: color Portalweb + nombre + docente + avance (sin ícono). */
export function AreaTile({ area, onClick }: { area: Area; onClick: () => void }) {
  const pct = area.total ? Math.round((area.completadas / area.total) * 100) : 0
  return (
    <button type="button" className={cx('m-areatile', tone(area.color))} onClick={onClick}>
      <span className="t-title-lg">{area.nombre}</span>
      <span className="t-body-sm" style={{ opacity: 0.9 }}>{area.docente}</span>
      <span className="m-grow" />
      <span className="m-row m-progress-on-color" style={{ gap: 8 }}>
        <ProgressBar value={pct} label={`Avance en ${area.nombre}`} />
        <span className="t-label-md" style={{ flex: 'none' }}>{area.completadas} de {area.total}</span>
      </span>
    </button>
  )
}

/** Etiqueta con el nombre del área en su color (Status Tag del sistema). */
export function AreaTag({ area }: { area: Area }) {
  return <StatusTag color={area.color}>{area.nombre}</StatusTag>
}

/** Número o estado de la clase: completada (check), en curso (número) o cerrada (candado). */
export function ClassBadge({ estado, numero }: { estado: EstadoClase; numero: number }) {
  return (
    <span className={cx('m-classbadge', `m-classbadge--${estado}`)} aria-label={estado === 'completada' ? 'Completada' : estado === 'cerrada' ? 'Cerrada' : `Clase ${numero}`}>
      {estado === 'completada' ? <Icon name="check" /> : estado === 'cerrada' ? <Icon name="lock" size={20} /> : numero}
    </span>
  )
}

/** Texto de estado pequeño con ícono opcional. */
export function Caption({ kind, icon, children }: { kind?: 'primary' | 'success' | 'prevent' | 'error'; icon?: string; children: ReactNode }) {
  return <span className={cx('m-caption', kind && `m-caption--${kind}`)}>{icon && <Icon name={icon} size={16} />}{children}</span>
}

/** Aviso con la superficie del sistema (Message) e ícono propio; admite acciones debajo del texto. */
export function Notice({ type = 'primary', icon, title, children, actions }: {
  type?: 'primary' | 'prevent' | 'success' | 'error'; icon: string; title?: string; children?: ReactNode; actions?: ReactNode
}) {
  return (
    <div className={cx('ds-message', `ds-message--${type}`, 'm-notice')} role={type === 'error' ? 'alert' : 'status'}>
      <Icon name={icon} size={22} />
      <div className="ds-message__body">
        {title && <div className="ds-message__title">{title}</div>}
        {children && <div className="t-body-md">{children}</div>}
        {actions && <div className="m-notice__actions">{actions}</div>}
      </div>
    </div>
  )
}

/** Barra de espacio del teléfono por segmentos. */
export function SpaceBar({ segments, label }: { segments: { pct: number; color: string }[]; label: string }) {
  return (
    <div className="m-spacebar" role="img" aria-label={label}>
      {segments.map((s, i) => <span key={i} style={{ width: `${s.pct}%`, background: s.color }} />)}
    </div>
  )
}

/**
 * Control circular de descarga (decisión de C01): descargar · en cola · avance · en pausa · disponible · necesita internet.
 * `onClick` recibe el estado actual para que la pantalla decida (descargar, cancelar, abrir hoja…).
 */
export function DownloadButton({ d, sizeMB, offline, onClick }: { d: Descarga; sizeMB: number; offline?: boolean; onClick?: () => void }) {
  const r = 20; const c = 2 * Math.PI * r
  const st = d.estado
  const label = st === 'descargada' ? 'Disponible sin internet'
    : st === 'descargando' ? `Descargando ${d.progreso} %. Toca para cancelar`
    : st === 'pausada' ? `Descarga en pausa, ${d.progreso} %. Se reanuda con internet`
    : st === 'en-cola' ? 'En cola para descargar. Toca para cancelar'
    : offline ? 'Necesitas internet para descargar' : `Descargar clase, ${sizeMB} MB`
  const cls = st === 'descargada' ? 'm-dl--done' : st === 'descargando' ? 'm-dl--active' : st === 'pausada' ? 'm-dl--paused' : st === 'en-cola' ? 'm-dl--queued' : offline ? 'm-dl--offline' : ''
  const icon = st === 'descargada' ? 'download_done' : st === 'descargando' ? 'close' : st === 'pausada' ? 'pause' : st === 'en-cola' ? 'schedule' : offline ? 'cloud_off' : 'download'
  const ring = st === 'descargando' || st === 'pausada'
  return (
    <button type="button" className={cx('m-dl', cls)} aria-label={label} title={label} onClick={onClick} disabled={!onClick}>
      {ring && (
        <svg className="m-dl__ring" width="44" height="44" viewBox="0 0 44 44" aria-hidden="true">
          <circle className="m-dl__track" cx="22" cy="22" r={r} />
          <circle className="m-dl__value" cx="22" cy="22" r={r} strokeDasharray={c} strokeDashoffset={c * (1 - d.progreso / 100)} />
        </svg>
      )}
      <Icon name={icon} size={ring ? 20 : 24} />
    </button>
  )
}

/* ── Capas: hoja inferior, diálogo y avisos ─────────── */

function useEscape(open: boolean, onClose?: () => void) {
  useEffect(() => {
    if (!open || !onClose) return
    const on = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', on)
    return () => window.removeEventListener('keydown', on)
  }, [open, onClose])
}
function useAutoFocus<T extends HTMLElement>(open: boolean) {
  const ref = useRef<T>(null)
  useEffect(() => { if (open) ref.current?.focus() }, [open])
  return ref
}

/** Hoja inferior dentro del marco del teléfono (tokens del Modal: radio 20). */
export function Sheet({ open, onClose, title, children }: { open: boolean; onClose?: () => void; title?: string; children: ReactNode }) {
  const id = useId()
  useEscape(open, onClose)
  const ref = useAutoFocus<HTMLDivElement>(open)
  if (!open) return null
  return (
    <>
      <div className="m-scrim" onClick={onClose} />
      <div ref={ref} tabIndex={-1} className="m-sheet" role="dialog" aria-modal="true" aria-labelledby={title ? id : undefined}>
        <span className="m-sheet__handle" aria-hidden="true" />
        {title && <h2 id={id} className="m-sheet__title t-title-lg">{title}</h2>}
        {children}
      </div>
    </>
  )
}

/** Diálogo centrado dentro del marco (Modal del sistema, radio 20). `onClose` ausente = obligatorio (p. ej. sesión vencida). */
export function Dialog({ open, onClose, icon, iconTone = 'primary', title, children, actions }: {
  open: boolean; onClose?: () => void; icon?: string; iconTone?: Tone; title: string; children?: ReactNode; actions: ReactNode
}) {
  const id = useId()
  useEscape(open, onClose)
  const ref = useAutoFocus<HTMLDivElement>(open)
  if (!open) return null
  return (
    <>
      <div className="m-scrim" onClick={onClose} />
      <div ref={ref} tabIndex={-1} className="m-dialog" role="alertdialog" aria-modal="true" aria-labelledby={id}>
        {icon && <span style={{ alignSelf: 'center' }}><Circle t={iconTone} icon={icon} /></span>}
        <p id={id} className="m-dialog__title t-title-lg" style={{ textAlign: icon ? 'center' : undefined }}>{title}</p>
        {children && <div className="t-body-md" style={{ color: 'var(--on-surface-variant)', textAlign: icon ? 'center' : undefined }}>{children}</div>}
        <div className="m-actions">{actions}</div>
      </div>
    </>
  )
}

/** Snackbar global (lo dispara `toast()` del store). Se dibuja sobre la barra inferior. */
export function Toaster() {
  const { s, set } = useApp()
  if (!s.toast) return null
  const t = s.toast
  return (
    <div className="m-toast">
      <Snackbar type={t.tipo} action={t.accion} onAction={() => { t.onAccion?.(); set({ toast: null }) }}>{t.texto}</Snackbar>
    </div>
  )
}
