import { useState } from 'react'
import { Button, Panel, Select, StatusTag, TextField } from '../ui'
import { detalleDe, sinJuegos, type Contenido, type EstadoCont } from '../portal/data'
import type { Game } from '../games/types'
import { ActionMenu, type MenuAction } from './ActionMenu'

export function EstadoContTag({ estado }: { estado: EstadoCont }) {
  if (estado === 'Publicado') return <StatusTag type="success" dot>Publicado</StatusTag>
  if (estado === 'Borrador') return <StatusTag type="prevent" dot>Borrador</StatusTag>
  return <StatusTag grey dot>Inactivo</StatusTag>
}

/** Título visible: el del contenido o, en Juego sin título, los nombres de sus juegos. */
export function tituloDe(c: Contenido, games: Game[]): string {
  if (c.titulo.trim()) return c.titulo
  const n = (c.juego?.ids ?? []).map((id) => games.find((g) => g.id === id)?.nombre).filter(Boolean)
  return n.length ? n.join(' / ') : 'Juego sin título'
}

export interface SeccionProps {
  contenidos: Contenido[] // solo los de esta sección, en su orden
  games: Game[]
  onCrear: () => void
  onEditar: (c: Contenido) => void
  onPublicar: (c: Contenido) => void
  onInactivar: (c: Contenido) => void
  onEliminar: (c: Contenido) => void
}

export function Seccion(p: SeccionProps) {
  const [q, setQ] = useState('')
  const [fEstado, setFEstado] = useState('Todos los estados')
  const qq = q.trim().toLowerCase()
  const rows = p.contenidos.filter((c) =>
    (!qq || tituloDe(c, p.games).toLowerCase().includes(qq)) && (fEstado === 'Todos los estados' || c.estado === fEstado))

  const acciones = (c: Contenido): MenuAction[] => [
    { label: 'Editar', icon: 'edit', onClick: () => p.onEditar(c) },
    c.estado === 'Publicado'
      ? { label: 'Inactivar', icon: 'visibility_off', onClick: () => p.onInactivar(c) }
      : { label: 'Publicar', icon: 'publish', onClick: () => p.onPublicar(c) },
    { label: 'Eliminar', icon: 'delete', danger: true, onClick: () => p.onEliminar(c) },
  ]

  return (
    <section className="screen" aria-labelledby="t-contenidos">
      <div className="section-head">
        <h2 className="t-section" id="t-contenidos">Listado de contenidos</h2>
        <Button icon="add" onClick={p.onCrear}>Crear contenido</Button>
      </div>

      {p.contenidos.length > 0 && (
        <Panel className="filters" role="search">
          <TextField className="filters__search" label="Buscar" icon="search" placeholder="Buscar por nombre" value={q} onChange={(e) => setQ(e.target.value)} />
          <Select label="Estado" value={fEstado} onChange={(e) => setFEstado(e.target.value)}
            options={['Todos los estados', 'Borrador', 'Publicado', 'Inactivo'].map((v) => ({ value: v, label: v }))} />
        </Panel>
      )}

      {p.contenidos.length === 0 ? (
        <div className="ds-panel"><div className="empty">
          <h2 className="t-section">Aún no hay contenido creado en esta sección.</h2>
          <p className="t-body-md">Usa el botón «Crear contenido» para agregar el primero.</p>
        </div></div>
      ) : rows.length === 0 ? (
        <div className="ds-panel"><div className="empty"><p className="t-body-md">No se encontraron contenidos con los criterios de búsqueda seleccionados.</p></div></div>
      ) : (
        <div className="table-wrap">
          <table className="ds-table">
            <thead>
              <tr><th scope="col">Título del contenido</th><th scope="col">Estado</th><th scope="col">Autor</th><th scope="col">Fecha de modificación</th><th scope="col"><span className="sr-only">Acciones</span></th></tr>
            </thead>
            <tbody>
              {rows.map((c) => {
                const t = tituloDe(c, p.games)
                return (
                  <tr key={c.id}>
                    <td>
                      <div className="gname">
                        <span className="drag" title="Arrastra para cambiar el orden del contenido en la sección" aria-hidden="true">⠿</span>
                        <div><strong className="t-title-sm">{t}</strong><small>{detalleDe(c)} · Creado el {c.creado}</small></div>
                      </div>
                    </td>
                    <td>
                      <span className="tags">
                        <EstadoContTag estado={c.estado} />
                        {c.estado === 'Inactivo' && sinJuegos(c) && <StatusTag color="orange">Sin juegos</StatusTag>}
                      </span>
                    </td>
                    <td>{c.autor}</td>
                    <td>{c.editada}</td>
                    <td style={{ textAlign: 'right' }}><ActionMenu label={`Acciones del contenido ${t}`} actions={acciones(c)} /></td>
                  </tr>
                )
              })}
            </tbody>
          </table>
          <div className="table-foot t-body-sm">
            <span>Mostrando {rows.length} de {p.contenidos.length} contenidos</span>
            <span>Arrastra un contenido para cambiar su orden en la sección (no simulado en este prototipo).</span>
          </div>
        </div>
      )}
    </section>
  )
}
