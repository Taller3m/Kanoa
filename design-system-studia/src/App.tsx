import { useCallback, useEffect, useState, type ReactNode } from 'react'
import { Icon, IconButton, Switch } from './ui'
import { Atomos, Moleculas, Organismos } from './docs/pages/components'
import { FormaEspacio, Iconos, Inicio, Paleta, Tipografia } from './docs/pages/foundations'
import './docs/docs.css'

type Route = { id: string; label: string; icon: string; group: string; sections: [string, string][]; render: (go: (r: string) => void) => ReactNode }

const routes: Route[] = [
  { id: 'inicio', label: 'Inicio', icon: 'home', group: 'Catálogo', sections: [], render: (go) => <Inicio go={go} /> },
  { id: 'paleta', label: 'Paleta', icon: 'palette', group: 'Fundamentos', render: () => <Paleta />,
    sections: [['marca', 'Marca'], ['error', 'Error'], ['superficies', 'Superficies'], ['contorno', 'Contorno'], ['texto', 'Texto'], ['estado', 'Estados'], ['categoricos', 'Categóricos'], ['capas', 'Capas de estado'], ['fijos', 'Fijos']] },
  { id: 'tipografia', label: 'Tipografía', icon: 'text_fields', group: 'Fundamentos', render: () => <Tipografia />, sections: [['escala', 'Escala'], ['reglas', 'Reglas de uso']] },
  { id: 'forma-espacio', label: 'Forma y espacio', icon: 'grid_view', group: 'Fundamentos', render: () => <FormaEspacio />,
    sections: [['radios', 'Radios'], ['espaciado', 'Espaciado'], ['tamanos', 'Tamaños'], ['elevacion', 'Elevación']] },
  { id: 'iconos', label: 'Iconos', icon: 'interests', group: 'Fundamentos', render: () => <Iconos />, sections: [['catalogo', 'Catálogo'], ['uso', 'Uso']] },
  { id: 'atomos', label: 'Átomos', icon: 'bubble_chart', group: 'Componentes', render: () => <Atomos />,
    sections: [['boton', 'Botón'], ['campo-texto', 'Campo de texto'], ['area-select', 'Área y selector'], ['seleccion', 'Casilla, radio, switch'], ['etiquetas', 'Etiquetas y chips'], ['avatar-progreso', 'Avatar y progreso'], ['texto', 'Enlace, tecla, tooltip']] },
  { id: 'moleculas', label: 'Moléculas', icon: 'hub', group: 'Componentes', render: () => <Moleculas />,
    sections: [['mensajes', 'Mensaje y snackbar'], ['tabs', 'Tabs'], ['paginacion', 'Paginación y pasos'], ['tarjetas', 'Tarjeta'], ['menu', 'Menú y acordeón'], ['listas', 'Lista de ítems']] },
  { id: 'organismos', label: 'Organismos', icon: 'dashboard', group: 'Componentes', render: () => <Organismos />, sections: [['modal', 'Modal'], ['navbar', 'Navbar'], ['header', 'Header']] },
]

const readRoute = () => {
  const id = window.location.hash.replace(/^#\/?/, '').split('?')[0]
  return routes.some((r) => r.id === id) ? id : 'inicio'
}

export function App() {
  const [route, setRoute] = useState(readRoute)
  const [dark, setDark] = useState(() => { try { return localStorage.getItem('ds-theme') === 'dark' } catch { return false } })
  const [menu, setMenu] = useState(false)
  const [section, setSection] = useState('')

  useEffect(() => {
    const on = () => { setRoute(readRoute()); setMenu(false); window.scrollTo(0, 0) }
    window.addEventListener('hashchange', on)
    return () => window.removeEventListener('hashchange', on)
  }, [])
  useEffect(() => {
    const el = document.documentElement
    el.classList.remove('light', 'dark'); el.classList.add(dark ? 'dark' : 'light')
    try { localStorage.setItem('ds-theme', dark ? 'dark' : 'light') } catch { /* sin storage */ }
  }, [dark])
  useEffect(() => {
    if (!menu) return
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') { setMenu(false); document.getElementById('menu-btn')?.focus() } }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [menu])
  const go = useCallback((id: string) => { window.location.hash = `/${id}` }, [])

  useEffect(() => {
    const io = new IntersectionObserver((es) => { const v = es.find((e) => e.isIntersecting); if (v) setSection(v.target.id) }, { rootMargin: '-80px 0px -70% 0px' })
    const t = setTimeout(() => document.querySelectorAll('[data-doc-section]').forEach((n) => io.observe(n)), 50)
    return () => { clearTimeout(t); io.disconnect() }
  }, [route])

  const current = routes.find((r) => r.id === route)!
  const groups = [...new Set(routes.map((r) => r.group))]
  const jump = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })

  return (
    <div className="docs">
      <a className="skip-link t-label-lg" href="#contenido" onClick={(e) => { e.preventDefault(); const m = document.getElementById('contenido'); m?.focus(); m?.scrollIntoView() }}>Saltar al contenido</a>
      <aside className={`docs__side ${menu ? 'docs__side--open' : ''}`} id="nav-catalogo" aria-label="Navegación del catálogo">
        <a className="docs__brand" href="#/inicio">
          <Icon name="school" size={32} />
          <span><span className="t-title-md">StudIA 2.0</span><small className="t-body-sm">Design System · Kanoa Lab</small></span>
        </a>
        {groups.map((g) => (
          <div key={g}>
            <div className="docs__group t-label-sm">{g}</div>
            {routes.filter((r) => r.group === g).map((r) => (
              <div key={r.id}>
                <button type="button" className="ds-menuitem ds-menuitem--small" aria-current={route === r.id ? 'page' : undefined} onClick={() => go(r.id)}>
                  <Icon name={r.icon} size={20} /><span className="ds-menuitem__label">{r.label}</span>
                </button>
                {route === r.id && r.sections.length > 0 && (
                  <div className="docs__sub">
                    {r.sections.map(([id, label]) => <button key={id} type="button" aria-current={section === id} onClick={() => jump(id)}>{label}</button>)}
                  </div>
                )}
              </div>
            ))}
          </div>
        ))}
      </aside>
      {menu && <div className="docs__scrim" onClick={() => setMenu(false)} aria-hidden="true" />}
      <div>
        <div className="docs__bar">
          <div className="row">
            <IconButton id="menu-btn" className="docs__menu-btn" icon="menu" label={menu ? 'Cerrar navegación' : 'Abrir navegación'} aria-expanded={menu} aria-controls="nav-catalogo" onClick={() => setMenu(!menu)} />
            <span className="t-label-lg" style={{ color: 'var(--muted)' }}>{current.group} / <span style={{ color: 'var(--title)' }}>{current.label}</span></span>
          </div>
          <Switch label={dark ? 'Tema oscuro' : 'Tema claro'} checked={dark} onChange={(e) => setDark(e.target.checked)} />
        </div>
        <main className="docs__main" id="contenido" tabIndex={-1}>{current.render(go)}</main>
      </div>
    </div>
  )
}
