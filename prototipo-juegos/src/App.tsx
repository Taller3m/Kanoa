import { useCallback, useEffect, useRef, useState } from 'react'
import { Button, ConfirmDialog, Icon, IconButton, Snackbar, StatusTag } from './ui'
import { estadoDe, fixGame, reqsOf, seedGames } from './games/registry'
import { HOY, newGame } from './games/base'
import type { Game, TipoJuego } from './games/types'
import { Lista } from './screens/Lista'
import { Tipo } from './screens/Tipo'
import { Asistente } from './screens/Asistente'
import './app.css'

type Screen = 'lista' | 'tipo' | 'editor'
type ToastKind = 'ok' | 'err' | 'info'
interface Confirm { title: string; msg: string; label: string; danger?: boolean; yes: () => void }

const RAIL: { label: string; icon: string; on?: boolean }[] = [
  { label: 'Portada', icon: 'home' }, { label: 'Cifras destacadas', icon: 'bar_chart' }, { label: 'Bloques de contenido', icon: 'view_agenda' },
  { label: 'Noticias', icon: 'newspaper' }, { label: 'Micrositios', icon: 'language' }, { label: 'Páginas informativas', icon: 'description' },
  { label: 'Menús', icon: 'menu' }, { label: 'Juegos', icon: 'sports_esports', on: true },
]

export function App() {
  const [games, setGames] = useState<Game[]>(seedGames)
  const [screen, setScreen] = useState<Screen>('lista')
  const [draft, setDraft] = useState<Game | null>(null)
  const [orig, setOrig] = useState('')
  const [paso, setPaso] = useState<1 | 2>(1)
  const [nombreErr, setNombreErr] = useState(false)
  const [q, setQ] = useState(''); const [fTipo, setFTipo] = useState('Todos los tipos'); const [fEstado, setFEstado] = useState('Todos los estados')
  const [toastMsg, setToastMsg] = useState<{ t: string; kind: ToastKind } | null>(null)
  const [confirm, setConfirm] = useState<Confirm | null>(null)
  const [dark, setDark] = useState(() => document.documentElement.classList.contains('dark'))
  const timer = useRef<number>(0)
  const main = useRef<HTMLElement>(null)

  useEffect(() => {
    const el = document.documentElement
    el.classList.remove('light', 'dark'); el.classList.add(dark ? 'dark' : 'light')
    try { localStorage.setItem('ds-theme', dark ? 'dark' : 'light') } catch { /* sin storage */ }
  }, [dark])
  useEffect(() => { main.current?.focus({ preventScroll: true }); window.scrollTo(0, 0) }, [screen])

  const toast = useCallback((t: string, kind: ToastKind = 'info') => {
    window.clearTimeout(timer.current); setToastMsg({ t, kind })
    timer.current = window.setTimeout(() => setToastMsg(null), 4200)
  }, [])

  const update = useCallback((fn: (d: Game) => void) => setDraft((d) => { if (!d) return d; const c = structuredClone(d); fn(c); return c }), [])

  const abrir = (g: Game) => { const d = fixGame(structuredClone(g)); setDraft(d); setOrig(JSON.stringify(d)); setPaso(1); setNombreErr(false); setScreen('editor') }
  const nuevo = (t: TipoJuego) => abrir(newGame(t))
  const aLista = () => { setScreen('lista'); setDraft(null); setNombreErr(false) }
  const cancelar = () => {
    if (draft && JSON.stringify(draft) !== orig) setConfirm({ title: 'Descartar cambios', msg: 'Hay cambios sin guardar. ¿Deseas descartarlos?', label: 'Descartar', danger: true, yes: aLista })
    else aLista()
  }
  const guardar = () => {
    if (!draft) return
    const n = draft.nombre.trim()
    if (n.length < 3) { setNombreErr(true); setPaso(1); toast('Revisa los campos obligatorios antes de guardar.', 'err'); return }
    if (draft.usos > 0 && !reqsOf(draft).every((r) => r.ok)) { toast('No puedes guardar: el juego está publicado y su configuración debe quedar completa.', 'err'); return }
    const g: Game = { ...draft, nombre: n, editada: HOY }
    if (!g.id) { g.id = Date.now(); g.fecha = HOY; setGames((gs) => [g, ...gs]) } else setGames((gs) => gs.map((x) => (x.id === g.id ? g : x)))
    const est = estadoDe(g)
    aLista()
    toast(draft.usos > 0 ? 'El juego ha sido actualizado. Los cambios ya se ven en el portal.'
      : est === 'Borrador' ? 'El juego se guardó en Borrador. Completa la configuración para poder agregarlo a una sección.'
      : 'El juego se guardó y quedó Completado. Ya puedes agregarlo a una sección.', 'ok')
  }
  const eliminar = (g: Game) => {
    if (g.usos > 0) { toast('No es posible eliminar este juego porque está en contenidos publicados. Retíralo de esos contenidos antes de continuar.', 'err'); return }
    setConfirm({ title: 'Eliminar juego', msg: `¿Estás seguro de que deseas eliminar el juego «${g.nombre}»? Esta acción no se puede deshacer.`, label: 'Eliminar', danger: true,
      yes: () => { setGames((gs) => gs.filter((x) => x.id !== g.id)); toast('El juego ha sido eliminado correctamente.', 'ok') } })
  }

  const accion = draft ? (draft.id ? 'Editar ' : 'Crear ') + draft.tipo.toLowerCase() : ''
  const title = screen === 'lista' ? 'Juegos' : screen === 'tipo' ? 'Crear juego' : accion
  const crumbs = screen === 'lista' ? ['Panel', 'Juegos'] : screen === 'tipo' ? ['Panel', 'Juegos', 'Crear juego'] : ['Panel', 'Juegos', accion]
  const back = screen === 'editor' ? cancelar : screen === 'tipo' ? aLista : undefined

  return (
    <div className="app">
      <nav className="rail" aria-label="Módulos de administración">
        <div className="rail__brand" aria-hidden="true">K</div>
        {RAIL.map((r) => (
          <button key={r.label} type="button" className="rail__item" disabled={!r.on} aria-current={r.on ? 'page' : undefined}
            title={r.on ? r.label : `${r.label} (fuera del alcance de este prototipo)`} onClick={r.on ? aLista : undefined}>
            <Icon name={r.icon} /><span className="rail__label">{r.label}</span>
          </button>
        ))}
        <div style={{ marginTop: 'auto' }}>
          <IconButton icon={dark ? 'light_mode' : 'dark_mode'} label={dark ? 'Cambiar a tema claro' : 'Cambiar a tema oscuro'} onClick={() => setDark(!dark)} />
        </div>
      </nav>

      <main className="main" ref={main} tabIndex={-1} style={{ outline: 'none' }}>
        <nav aria-label="Ruta de navegación" className="crumbs t-body-md">
          {crumbs.map((c, i) => (
            <span key={c}>
              {i > 0 && <span aria-hidden="true"> › </span>}
              {i === crumbs.length - 1 ? <span aria-current="page">{c}</span>
                : c === 'Juegos' ? <button type="button" className="ds-link ds-link--quiet" style={{ background: 'none', border: 0, padding: 0, font: 'inherit' }} onClick={screen === 'editor' ? cancelar : aLista}>{c}</button>
                : <span>{c}</span>}
            </span>
          ))}
        </nav>

        <header className="band">
          {back && <IconButton icon="chevron_left" label="Volver" onClick={back} />}
          <h1 className="band__title t-headline-md">
            <span>{title}</span>
            {screen === 'editor' && draft && (
              <span title="El estado se calcula automáticamente">
                {estadoDe(draft) === 'Completado' ? <StatusTag color="blue" dot>Completado</StatusTag> : <StatusTag type="prevent" dot>Borrador</StatusTag>}
              </span>
            )}
          </h1>
          <div className="band__actions">
            {screen === 'tipo' && <Button variant="outline" onClick={aLista}>Cancelar</Button>}
            {screen === 'editor' && (<><Button variant="outline" onClick={cancelar}>Cancelar</Button><Button onClick={guardar}>Guardar</Button></>)}
          </div>
        </header>

        {screen === 'lista' && (
          <Lista games={games} q={q} fTipo={fTipo} fEstado={fEstado} setQ={setQ} setFTipo={setFTipo} setFEstado={setFEstado}
            onCrear={() => setScreen('tipo')} onEditar={abrir} onEliminar={eliminar} />
        )}
        {screen === 'tipo' && <Tipo onPick={nuevo} />}
        {screen === 'editor' && draft && (
          <Asistente game={draft} paso={paso} setPaso={setPaso} nombreErr={nombreErr} update={update} toast={toast} clearNombreErr={() => setNombreErr(false)} />
        )}
      </main>

      {toastMsg && (
        <div className="toasts">
          <Snackbar type={toastMsg.kind === 'err' ? 'error' : undefined}>{toastMsg.t}</Snackbar>
        </div>
      )}
      {confirm && (
        <ConfirmDialog open title={confirm.title} message={confirm.msg} confirmLabel={confirm.label} danger={confirm.danger}
          onCancel={() => setConfirm(null)} onConfirm={() => { const y = confirm.yes; setConfirm(null); y() }} />
      )}
    </div>
  )
}
