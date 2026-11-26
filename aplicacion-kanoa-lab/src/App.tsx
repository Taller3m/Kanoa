import { useEffect, useState } from 'react'
import { AppProvider, useApp } from './app/store'
import { go, match, useLocation } from './app/router'
import { Toaster } from './mobile'
import { Button, Icon, IconButton, Switch } from './ui'
import { GROUPS } from './screens'
import type { Scenario } from './screens/types'
import './app.css'

export function App() {
  return (
    <AppProvider>
      <Stage />
    </AppProvider>
  )
}

function Stage() {
  const [panel, setPanel] = useState(false)
  return (
    <div className="m-stage">
      <PrototypePanel open={panel} onClose={() => setPanel(false)} />
      <div className="m-phone">
        <Router />
        {GROUPS.map((g) => g.Overlay && <g.Overlay key={g.id} />)}
        <Toaster />
      </div>
      <button type="button" className="proto-fab" aria-label="Abrir el panel del prototipo" onClick={() => setPanel(true)}><Icon name="tune" /></button>
    </div>
  )
}

function Router() {
  const { path, query } = useLocation()
  const { s } = useApp()
  const enIngreso = path.startsWith('ingreso') || path.startsWith('preparando')
  useEffect(() => {
    if (!path) go(s.sesion ? 'inicio' : 'ingreso')
    else if (!s.sesion && !enIngreso) go('ingreso')
  }, [path, s.sesion, enIngreso])
  for (const g of GROUPS) {
    for (const r of g.routes) {
      const params = match(r.pattern, path)
      if (params) return <>{r.render(params, query)}</>
    }
  }
  return null
}

/** Panel del prototipo: conexión simulada y acceso directo a cada estado del lienzo de diseño (A01…H04). */
function PrototypePanel({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { s, setOnline, reset } = useApp()
  const { path } = useLocation()
  const abrir = (sc: Scenario) => { reset(sc.state); go(sc.route); onClose() }
  return (
    <aside className={`proto-panel${open ? ' proto-panel--open' : ''}`} aria-label="Panel del prototipo">
      <div className="proto-panel__head">
        <div className="m-col m-grow" style={{ gap: 2 }}>
          <h2 className="t-title-md" style={{ margin: 0, color: 'var(--title)' }}>Prototipo app Kanoa Lab</h2>
          <p className="t-body-sm" style={{ margin: 0, color: 'var(--muted)' }}>Estudiante · datos de ejemplo</p>
        </div>
        <IconButton icon="close" label="Cerrar panel" className="proto-panel__close" onClick={onClose} />
      </div>
      <div className="proto-panel__controls">
        <Switch label="Conexión a internet" checked={s.online} onChange={(e) => setOnline(e.target.checked)} />
        <Button variant="text" size="small" icon="restart_alt" onClick={() => { reset(); go('inicio'); onClose() }}>Reiniciar</Button>
      </div>
      <nav className="proto-panel__list" aria-label="Estados del diseño">
        {GROUPS.map((g) => (
          <section key={g.id}>
            <h3 className="t-label-md proto-panel__group">{g.name}</h3>
            {g.scenarios.map((sc) => (
              <button key={sc.id} type="button" className="proto-panel__item" aria-current={sc.route.split('?')[0] === path ? 'true' : undefined} onClick={() => abrir(sc)}>
                <span className="proto-panel__id">{sc.id}</span><span>{sc.title}</span>
              </button>
            ))}
          </section>
        ))}
      </nav>
    </aside>
  )
}
