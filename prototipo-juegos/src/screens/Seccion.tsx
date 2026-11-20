import { useEffect, useRef, useState, type DragEvent, type KeyboardEvent } from 'react'
import { Button, Icon, TextArea, TextField } from '../ui'
import { detalleDe, sinJuegos, type Contenido, type EstadoCont, type Seccion as S } from '../portal/data'
import type { Game } from '../games/types'
import { ActionMenu, type MenuAction } from './ActionMenu'

/** Etiqueta de estado con contorno (Figma: StudIA2.0 - Status - Tag - Extra). */
export function OTag({ tone, children }: { tone: 'success' | 'prevent' | 'grey' | 'error'; children: string }) {
  return <span className={`otag otag--${tone}`}>{children}</span>
}
export function EstadoContTag({ estado }: { estado: EstadoCont }) {
  return <OTag tone={estado === 'Publicado' ? 'success' : estado === 'Borrador' ? 'prevent' : 'grey'}>{estado}</OTag>
}

/** Título visible: el del contenido o, en Juego sin título, los nombres de sus juegos. */
export function tituloDe(c: Contenido, games: Game[]): string {
  if (c.titulo.trim()) return c.titulo
  const n = (c.juego?.ids ?? []).map((id) => games.find((g) => g.id === id)?.nombre).filter(Boolean)
  return n.length ? n.join(' / ') : 'Juego sin título'
}

export interface SeccionProps {
  seccion: S
  contenidos: Contenido[] // solo los de esta sección, en su orden
  games: Game[]
  onCrear: () => void
  onEditar: (c: Contenido) => void
  onVisualizar: (c: Contenido) => void
  onEstado: (c: Contenido, estado: EstadoCont) => void
  onEliminar: (c: Contenido) => void
  onFueraDeAlcance: () => void
  /** Abre la página pública de la sección (simulación del Portal WEB). */
  onVerPortal: () => void
  /** Mueve el contenido `id` antes o después de `destino` (orden en que se muestra en el portal). */
  onMover: (id: number, destino: number, pos: 'antes' | 'despues', viaTeclado?: boolean) => void
}

const ESTADOS: EstadoCont[] = ['Publicado', 'Borrador', 'Inactivo']

/** Figma: seccion › Property 1=Micrositio (16:5477). */
export function Seccion(p: SeccionProps) {
  const [q, setQ] = useState('')
  const [fEstado, setFEstado] = useState('Todos los estados')
  const qq = q.trim().toLowerCase()
  const rows = p.contenidos.filter((c) =>
    (!qq || tituloDe(c, p.games).toLowerCase().includes(qq)) && (fEstado === 'Todos los estados' || c.estado === fEstado))

  /* ── Reordenar: arrastrando la fila o, con teclado, con ↑/↓ sobre el ícono ⠿ (alternativa a arrastrar, WCAG 2.5.7) ── */
  const filtrando = !!qq || fEstado !== 'Todos los estados'
  const [arrastra, setArrastra] = useState<number | null>(null)
  const [sobre, setSobre] = useState<{ id: number; pos: 'antes' | 'despues' } | null>(null)
  const [aviso, setAviso] = useState('')
  const enfocar = useRef<number | null>(null)
  const tabla = useRef<HTMLTableSectionElement>(null)
  // Al mover una fila el navegador le quita el foco; se devuelve al ícono ⠿ de la fila movida.
  useEffect(() => {
    if (enfocar.current == null) return
    tabla.current?.querySelector<HTMLButtonElement>(`[data-drag="${enfocar.current}"]`)?.focus()
    enfocar.current = null
  })
  const fin = () => { setArrastra(null); setSobre(null) }
  const onDragOver = (e: DragEvent<HTMLTableRowElement>, id: number) => {
    if (arrastra == null || filtrando) return
    e.preventDefault(); e.dataTransfer.dropEffect = 'move'
    const r = e.currentTarget.getBoundingClientRect()
    const pos = e.clientY < r.top + r.height / 2 ? 'antes' : 'despues'
    if (sobre?.id !== id || sobre.pos !== pos) setSobre({ id, pos })
  }
  const onDrop = (e: DragEvent<HTMLTableRowElement>, id: number) => {
    e.preventDefault()
    if (arrastra != null && sobre && arrastra !== id) p.onMover(arrastra, id, sobre.pos)
    fin()
  }
  const porTeclado = (e: KeyboardEvent<HTMLButtonElement>, c: Contenido, t: string) => {
    if (e.key !== 'ArrowUp' && e.key !== 'ArrowDown') return
    e.preventDefault()
    if (filtrando) { setAviso('Limpia la búsqueda y el filtro para reordenar los contenidos.'); return }
    const i = rows.findIndex((x) => x.id === c.id)
    const j = e.key === 'ArrowUp' ? i - 1 : i + 1
    if (j < 0 || j >= rows.length) return
    enfocar.current = c.id
    p.onMover(c.id, rows[j]!.id, e.key === 'ArrowUp' ? 'antes' : 'despues', true)
    setAviso(`«${t}» quedó en la posición ${j + 1} de ${rows.length}.`)
  }

  const acciones = (c: Contenido): MenuAction[] => {
    // Un contenido Juego no tiene Borrador: al guardar queda Publicado (HU) y solo se puede inactivar o volver a publicar.
    const destinos = ESTADOS.filter((e) => e !== c.estado && !(c.tipo === 'Juego' && e === 'Borrador'))
    return [
      { label: 'Editar', icon: 'edit', onClick: () => p.onEditar(c) },
      { label: 'Visualizar', icon: 'visibility', onClick: () => p.onVisualizar(c) },
      { label: 'Cambiar estado', icon: 'swap_horiz', submenu: destinos.map((e) => ({ label: e, onClick: () => p.onEstado(c, e) })) },
      { label: 'Eliminar', icon: 'delete', danger: true, onClick: () => p.onEliminar(c) },
    ]
  }

  return (
    <section className="screen" aria-label={`Sección ${p.seccion.sec}`}>
      <section className="mblock" aria-labelledby="t-info-sec">
        <h2 className="mblock__title" id="t-info-sec">Información general</h2>
        <div className="mpanel">
          <TextField label="Nombre de la sección" required readOnly value={p.seccion.sec} help="Mínimo 3, máximo 30 caracteres. Sin espacios al inicio o final." />
          <TextArea label="Descripción" required readOnly rows={3} value={p.seccion.desc} help="Mínimo 3, máximo 150 caracteres. Sin espacios al inicio o final." />
          <div className="mpanel__actions">
            <Button variant="outline" onClick={p.onFueraDeAlcance}>Cancelar</Button>
            <Button onClick={p.onFueraDeAlcance}>Guardar cambios</Button>
          </div>
        </div>
      </section>

      <div className="mpanel" role="search" aria-labelledby="t-contenidos">
        <div className="mlist__head">
          <h2 className="mlist__title" id="t-contenidos">Listado de contenidos</h2>
          <div className="mlist__acciones">
            <Button variant="outline" icon="public" onClick={p.onVerPortal}>Ver en el portal</Button>
            <Button icon="add" onClick={p.onCrear}>Crear contenido</Button>
          </div>
        </div>
        <div className="mlist__filters">
          <label className="msearch">
            <Icon name="search" size={24} />
            <input type="search" placeholder="Buscar por nombre" aria-label="Buscar contenidos por nombre" value={q} onChange={(e) => setQ(e.target.value)} />
          </label>
          <label className="mfilter">
            <span>Estado:</span>
            <select value={fEstado} onChange={(e) => setFEstado(e.target.value)}>
              {['Todos los estados', ...ESTADOS].map((v) => <option key={v}>{v}</option>)}
            </select>
          </label>
        </div>
      </div>

      {p.contenidos.length === 0 ? (
        <div className="mtable-empty">
          <Icon name="info" size={36} />
          <p>Aún no hay contenido creado en esta sección. Usa el botón «Crear contenido» para agregar el primero.</p>
          <Button icon="add" onClick={p.onCrear}>Crear contenido</Button>
        </div>
      ) : rows.length === 0 ? (
        <div className="mtable-empty"><p>No se encontraron contenidos con los criterios de búsqueda seleccionados.</p></div>
      ) : (
        <div className="table-wrap mtable">
          <table className="ds-table">
            <thead>
              <tr><th scope="col">Título del contenido</th><th scope="col">Estados</th><th scope="col">Autor</th><th scope="col">Fecha de modificación</th><th scope="col"><span className="sr-only">Acciones</span></th></tr>
            </thead>
            <tbody ref={tabla}>
              {rows.map((c) => {
                const t = tituloDe(c, p.games)
                const cls = [arrastra === c.id && 'mrow--drag', sobre?.id === c.id && arrastra !== c.id && `mrow--${sobre.pos}`].filter(Boolean).join(' ')
                return (
                  <tr key={c.id} className={cls || undefined} draggable={!filtrando}
                    onDragStart={(e) => { setArrastra(c.id); e.dataTransfer.effectAllowed = 'move'; e.dataTransfer.setData('text/plain', String(c.id)) }}
                    onDragOver={(e) => onDragOver(e, c.id)} onDrop={(e) => onDrop(e, c.id)} onDragEnd={fin}>
                    <td>
                      <div className="gname">
                        <button type="button" className={'drag' + (filtrando ? ' drag--off' : '')} data-drag={c.id}
                          title={filtrando ? 'Limpia la búsqueda y el filtro para reordenar' : 'Arrastra para reordenar'}
                          aria-label={`Reordenar «${t}». Usa las flechas arriba y abajo para moverlo.`} aria-disabled={filtrando || undefined}
                          onKeyDown={(e) => porTeclado(e, c, t)}>
                          <Icon name="drag_indicator" size={24} />
                        </button>
                        <div><strong className="t-title-sm">{t}</strong><small>{detalleDe(c)} · {c.creado}</small></div>
                      </div>
                    </td>
                    <td>
                      <span className="tags">
                        <EstadoContTag estado={c.estado} />
                        {c.estado === 'Inactivo' && sinJuegos(c) && <OTag tone="error">Sin juegos</OTag>}
                      </span>
                    </td>
                    <td>{c.autor}</td>
                    <td>{c.editada}</td>
                    <td className="mtable__act"><ActionMenu label={`Acciones del contenido ${t}`} actions={acciones(c)} /></td>
                  </tr>
                )
              })}
            </tbody>
          </table>
          <div className="table-foot t-body-sm">
            <span>Mostrando {rows.length} de {p.contenidos.length} contenidos</span>
            <span>{filtrando ? 'Limpia la búsqueda y el filtro para reordenar los contenidos.' : 'Arrastra los contenidos para definir el orden en que se muestran en el Portal WEB.'}</span>
          </div>
          <p className="sr-only" aria-live="polite">{aviso}</p>
        </div>
      )}
    </section>
  )
}
