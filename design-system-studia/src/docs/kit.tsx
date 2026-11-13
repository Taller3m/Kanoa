import { useState, type ReactNode } from 'react'
import { Button, Icon } from '../ui'

export function PageHead({ title, children }: { title: string; children?: ReactNode }) {
  return (
    <header className="page-head">
      <h1 className="t-display-sm">{title}</h1>
      {children && <p className="t-body-lg">{children}</p>}
    </header>
  )
}

export function Section({ id, title, lead, children }: { id: string; title: string; lead?: ReactNode; children: ReactNode }) {
  return (
    <section className="doc-section" id={id} data-doc-section aria-labelledby={`${id}-h`}>
      <h2 className="t-headline-sm" id={`${id}-h`}>{title}</h2>
      {lead && <p className="lead t-body-lg">{lead}</p>}
      {children}
    </section>
  )
}

export function Demo({ title, desc, code, children, layout }: {
  title: string; desc?: string; code: string; children: ReactNode; layout?: 'col' | 'grid'
}) {
  const [show, setShow] = useState(false)
  const [copied, setCopied] = useState(false)
  const copy = () => { navigator.clipboard?.writeText(code); setCopied(true); setTimeout(() => setCopied(false), 1200) }
  return (
    <div className="demo">
      <div className="demo__head">
        <h3 className="t-title-sm" style={{ margin: 0 }}>{title}</h3>
        <div className="row" style={{ gap: 4 }}>
          <Button variant="text" size="small" icon={copied ? 'check' : 'content_copy'} onClick={copy}>{copied ? 'Copiado' : 'Copiar'}</Button>
          <Button variant="text" size="small" icon="code" aria-expanded={show} onClick={() => setShow(!show)}>{show ? 'Ocultar código' : 'Ver código'}</Button>
        </div>
      </div>
      {desc && <p className="demo__desc t-body-md">{desc}</p>}
      <div className={`demo__stage ${layout === 'col' ? 'demo__stage--col' : ''} ${layout === 'grid' ? 'demo__stage--grid' : ''}`}>{children}</div>
      {show && <pre className="demo__code" tabIndex={0}><code>{code}</code></pre>}
      <span className="sr-only" role="status">{copied ? 'Código copiado' : ''}</span>
    </div>
  )
}

export function PropsTable({ rows }: { rows: [name: string, type: string, def: string, desc: string][] }) {
  return (
    <div className="props-wrap">
      <table className="props">
        <thead><tr><th scope="col">Propiedad</th><th scope="col">Tipo</th><th scope="col">Por defecto</th><th scope="col">Descripción</th></tr></thead>
        <tbody>
          {rows.map(([n, t, d, desc]) => (
            <tr key={n}><th scope="row"><code>{n}</code></th><td><code>{t}</code></td><td>{d === '—' ? '—' : <code>{d}</code>}</td><td>{desc}</td></tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

/** Notas de accesibilidad por componente: qué hace el teclado y qué anuncia el lector de pantalla. */
export function A11y({ items }: { items: string[] }) {
  return (
    <div className="a11y">
      <h3 className="t-title-sm"><Icon name="accessibility_new" size={18} /> Accesibilidad</h3>
      <ul>{items.map((i) => <li key={i} className="t-body-md">{i}</li>)}</ul>
    </div>
  )
}

export function Note({ children }: { children: ReactNode }) {
  return <div className="doc-note t-body-md"><Icon name="lightbulb" size={18} /><span>{children}</span></div>
}
