import { Button, Icon, Panel, Select, StatusTag, TextField } from '../ui'
import { ActionMenu } from './ActionMenu'
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
  /** Secciones donde el juego está en un contenido publicado. */
  publicadoEn: (g: Game) => string[]
}

export function EstadoTag({ game }: { game: Game }) {
  const e = estadoDe(game)
  return e === 'Completado' ? <StatusTag color="blue" dot>Completado</StatusTag> : <StatusTag type="prevent" dot>Borrador</StatusTag>
}

export function Lista(p: ListaProps) {
  const q = p.q.trim().toLowerCase()
  const rows = p.games.filter((g) =>
    (!q || g.nombre.toLowerCase().includes(q)) &&
    (p.fTipo === 'Todos los tipos' || g.tipo === p.fTipo) &&
    (p.fEstado === 'Todos los estados' || estadoDe(g) === p.fEstado))

  return (
    <section className="screen" aria-label="Listado de juegos">

      {p.games.length > 0 && (
        <Panel className="filters" role="search">
          <TextField className="filters__search" label="Buscar" icon="search" placeholder="Buscar por nombre" value={p.q} onChange={(e) => p.setQ(e.target.value)} />
          <Select label="Tipo" value={p.fTipo} onChange={(e) => p.setFTipo(e.target.value)}
            options={['Todos los tipos', 'Crucigrama', 'Cuenta cuentos', 'Memoria', 'Crece conmigo'].map((v) => ({ value: v, label: v }))} />
          <Select label="Estado" value={p.fEstado} onChange={(e) => p.setFEstado(e.target.value)}
            options={['Todos los estados', 'Borrador', 'Completado'].map((v) => ({ value: v, label: v }))} />
        </Panel>
      )}

      {/* La tabla se muestra siempre; sin juegos (o sin resultados) el mensaje va dentro de ella. */}
      <div className="table-wrap">
        <table className="ds-table">
          <thead>
            <tr><th scope="col">Título del juego</th><th scope="col">Estado</th><th scope="col">Autor</th><th scope="col">Fecha de modificación</th><th scope="col"><span className="sr-only">Acciones</span></th></tr>
          </thead>
          <tbody>
            {p.games.length === 0 ? (
              <tr className="table-empty">
                <td colSpan={5}>
                  <div className="empty">
                    <Icon name="sports_esports" size={36} />
                    <h2 className="t-section">Aún no has creado ningún juego</h2>
                    <p className="t-body-md">Usa el botón «Crear juego» para configurar un crucigrama, un cuenta cuentos, un juego de memoria o un Crece conmigo.</p>
                    <Button icon="add" onClick={p.onCrear}>Crear juego</Button>
                  </div>
                </td>
              </tr>
            ) : rows.length === 0 ? (
              <tr className="table-empty">
                <td colSpan={5}><div className="empty"><p className="t-body-md">No se encontraron juegos con los criterios de búsqueda seleccionados.</p></div></td>
              </tr>
            ) : (
              rows.map((g) => {
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
                      <ActionMenu label={`Acciones del juego ${g.nombre}`} actions={[
                        { label: 'Editar', icon: 'edit', onClick: () => p.onEditar(g) },
                        { label: 'Visualizar', icon: 'visibility', onClick: () => p.onVisualizar(g) },
                        p.publicadoEn(g).length > 0
                          ? { label: 'Eliminar', icon: 'delete', disabledHelp: 'No se puede eliminar: está publicado', onClick: () => p.onEliminar(g) }
                          : { label: 'Eliminar', icon: 'delete', danger: true, onClick: () => p.onEliminar(g) },
                      ]} />
                    </td>
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
        {p.games.length > 0 && (
          <div className="table-foot t-body-sm">
            <span>Mostrando {rows.length} de {p.games.length} juegos</span>
            <div className="legend">
              <span><StatusTag type="prevent" dot>Borrador</StatusTag> Configuración incompleta</span>
              <span><StatusTag color="blue" dot>Completado</StatusTag> Listo para agregarse a una sección</span>
            </div>
          </div>
        )}
      </div>

    </section>
  )
}
