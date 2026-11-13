import { useEffect, useRef, useState } from 'react'
import { Button, Icon, IconButton, Select, StatusTag, TextField } from '../ui'
import { estadoDe, tipoInfo } from '../games/registry'
import type { Game } from '../games/types'

export interface ListaProps {
  games: Game[]
  q: string; fTipo: string; fEstado: string
  setQ: (v: string) => void; setFTipo: (v: string) => void; setFEstado: (v: string) => void
  onCrear: () => void
  onEditar: (g: Game) => void
  onVisualizar: (g: Game) => void
  onEliminar: (g: Game) => void
}

export function EstadoTag({ game }: { game: Game }) {
  const e = estadoDe(game)
  return e === 'Completado' ? <StatusTag color="blue" dot>Completado</StatusTag> : <StatusTag type="prevent" dot>Borrador</StatusTag>
}

function RowMenu({ game, anchor, onClose, onEditar, onVisualizar, onEliminar }: { game: Game; anchor: DOMRect; onClose: () => void; onEditar: () => void; onVisualizar: () => void; onEliminar: () => void }) {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    ref.current?.querySelector<HTMLButtonElement>('button:not(:disabled)')?.focus()
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [onClose])
  const top = Math.min(anchor.bottom + 4, window.innerHeight - 140)
  const left = Math.max(16, anchor.right - 180)
  return (
    <>
      <div style={{ position: 'fixed', inset: 0, zIndex: 39 }} onClick={onClose} aria-hidden="true" />
      <div ref={ref} className="menu" role="menu" aria-label={`Acciones de ${game.nombre}`} style={{ top, left }}>
        <button type="button" role="menuitem" className="ds-menuitem" onClick={onEditar}><Icon name="edit" size={20} /><span className="ds-menuitem__label">Editar</span></button>
        <button type="button" role="menuitem" className="ds-menuitem" onClick={onVisualizar}><Icon name="visibility" size={20} /><span className="ds-menuitem__label">Visualizar</span></button>
        <button type="button" role="menuitem" className="ds-menuitem ds-menuitem--danger" onClick={onEliminar}
          title={game.usos > 0 ? 'No se puede eliminar: está publicado' : undefined}><Icon name="delete" size={20} /><span className="ds-menuitem__label">Eliminar</span></button>
      </div>
    </>
  )
}

export function Lista(p: ListaProps) {
  const [menu, setMenu] = useState<{ game: Game; rect: DOMRect } | null>(null)
  const q = p.q.trim().toLowerCase()
  const rows = p.games.filter((g) =>
    (!q || g.nombre.toLowerCase().includes(q)) &&
    (p.fTipo === 'Todos los tipos' || g.tipo === p.fTipo) &&
    (p.fEstado === 'Todos los estados' || estadoDe(g) === p.fEstado))

  return (
    <section className="screen" aria-labelledby="t-lista">
      <div className="screen__bar">
        <p className="screen__lead t-body-lg" id="t-lista">
          Crea y parametriza los juegos del portal. Cuando un juego está completo, queda disponible para agregarlo como contenido en cualquier sección de un micrositio.
        </p>
        <Button icon="add" onClick={p.onCrear}>Crear juego</Button>
      </div>

      {p.games.length > 0 && (
        <div className="filters" role="search">
          <TextField className="filters__search" label="Buscar" icon="search" placeholder="Buscar por nombre" value={p.q} onChange={(e) => p.setQ(e.target.value)} />
          <Select label="Tipo" value={p.fTipo} onChange={(e) => p.setFTipo(e.target.value)}
            options={['Todos los tipos', 'Crucigrama', 'Cuenta cuentos', 'Memoria', 'Crece conmigo'].map((v) => ({ value: v, label: v }))} />
          <Select label="Estado" value={p.fEstado} onChange={(e) => p.setFEstado(e.target.value)}
            options={['Todos los estados', 'Borrador', 'Completado'].map((v) => ({ value: v, label: v }))} />
        </div>
      )}

      {p.games.length === 0 ? (
        <div className="table-wrap">
          <div className="empty">
            <Icon name="sports_esports" size={36} />
            <h2 className="t-title-lg">Aún no has creado ningún juego</h2>
            <p className="t-body-md">Usa el botón «Crear juego» para configurar un crucigrama, un cuenta cuentos o un juego de memoria. Cuando esté completo, podrás agregarlo como contenido en las secciones de los micrositios.</p>
            <Button icon="add" onClick={p.onCrear}>Crear juego</Button>
          </div>
        </div>
      ) : rows.length === 0 ? (
        <div className="table-wrap"><div className="empty"><p className="t-body-md">No se encontraron juegos con los criterios de búsqueda seleccionados.</p></div></div>
      ) : (
        <div className="table-wrap">
          <table className="gtable">
            <thead>
              <tr><th scope="col">Título del juego</th><th scope="col">Estados</th><th scope="col">Autor</th><th scope="col">Fecha de modificación</th><th scope="col"><span className="sr-only">Acciones</span></th></tr>
            </thead>
            <tbody>
              {rows.map((g) => {
                const t = tipoInfo(g.tipo)
                return (
                  <tr key={g.id}>
                    <td>
                      <div className="gname">
                        <span className={`tile tile--${t.tone}`} title={g.tipo}><Icon name={t.icon} size={20} /></span>
                        <div><strong className="t-title-sm">{g.nombre}</strong><small>{g.tipo} · Creado el {g.fecha}</small></div>
                      </div>
                    </td>
                    <td><EstadoTag game={g} /></td>
                    <td>{g.autor}</td>
                    <td>{g.editada}</td>
                    <td style={{ textAlign: 'right' }}>
                      <IconButton icon="more_vert" label={`Acciones de ${g.nombre}`} aria-haspopup="menu"
                        onClick={(e) => setMenu({ game: g, rect: e.currentTarget.getBoundingClientRect() })} />
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
          <div className="table-foot t-body-sm">
            <span>Mostrando {rows.length} de {p.games.length} juegos</span>
            <div className="legend">
              <span><StatusTag type="prevent" dot>Borrador</StatusTag> Configuración incompleta</span>
              <span><StatusTag color="blue" dot>Completado</StatusTag> Listo para agregarse a una sección</span>
            </div>
          </div>
        </div>
      )}

      {menu && (
        <RowMenu game={menu.game} anchor={menu.rect} onClose={() => setMenu(null)}
          onEditar={() => { const g = menu.game; setMenu(null); p.onEditar(g) }}
          onVisualizar={() => { const g = menu.game; setMenu(null); p.onVisualizar(g) }}
          onEliminar={() => { const g = menu.game; setMenu(null); p.onEliminar(g) }} />
      )}
    </section>
  )
}
