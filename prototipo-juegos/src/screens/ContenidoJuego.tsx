import { Checkbox, Icon, IconButton, Message, TextField } from '../ui'
import { OTag } from './Seccion'
import type { EstadoCont } from '../portal/data'
import { TIPOS, estadoDe } from '../games/registry'
import { porModificacion } from '../games/base'
import type { Game, TipoJuego } from '../games/types'
import { EstadoTag } from './Lista'

export interface ContDraft { titulo: string; tipo: TipoJuego; sel: number[]; err: boolean }

export interface ContenidoJuegoProps {
  draft: ContDraft
  setDraft: (fn: (d: ContDraft) => ContDraft) => void
  games: Game[]
  publicadoEn: (g: Game) => string[]
  onVer: (g: Game) => void
  /** Al editar: estado actual del contenido y dónde está, para avisar qué pasa al guardar. */
  edicion?: { estado: EstadoCont; lugar: string }
}

/** Formulario «Crear contenido · Juego» (HU-PW-181). */
export function ContenidoJuego({ draft, setDraft, games, publicadoEn, onVer, edicion }: ContenidoJuegoProps) {
  const completos = (t: TipoJuego) => games.filter((g) => g.tipo === t && estadoDe(g) === 'Completado')
  // Solo Completados; al editar se conservan visibles los ya seleccionados aunque hoy estén en Borrador, para poder quitarlos.
  const disp = porModificacion(games.filter((g) => g.tipo === draft.tipo && (estadoDe(g) === 'Completado' || (g.id != null && draft.sel.includes(g.id)))))
  const toggle = (id: number) => setDraft((d) => ({ ...d, err: false, sel: d.sel.includes(id) ? d.sel.filter((x) => x !== id) : [...d.sel, id] }))

  return (
    <section className="screen cont" aria-label="Contenido de tipo Juego">
      <div className="ds-panel cont__form">
        {/* Propuesta para validar con el PO: la HU-PW-185 no define este aviso al editar un contenido Juego. */}
        {edicion && (edicion.estado === 'Publicado' ? (
          <Message title="Este contenido está publicado">
            Está publicado en {edicion.lugar}. Los cambios se verán de inmediato en el portal al guardar.
          </Message>
        ) : (
          <Message type="prevent" title={`Este contenido está ${edicion.estado.toLowerCase()}`}>
            Al guardar, el contenido quedará Publicado y se mostrará en {edicion.lugar}. Todos sus juegos deben estar Completados.
          </Message>
        ))}
        <TextField label="Título (opcional)" value={draft.titulo} maxLength={150} counter={`${draft.titulo.length}/150`}
          placeholder="Ej. Juega y aprende sobre el café" help="Se muestra sobre el juego en la sección."
          onChange={(e) => { const v = e.target.value; setDraft((d) => ({ ...d, titulo: v })) }} />

        <fieldset className="cont__fs">
          <legend className="t-title-md">Tipo de juego <span className="req" aria-hidden="true">*</span><span className="sr-only">(obligatorio)</span></legend>
          <div className="cpick" role="radiogroup" aria-label="Tipo de juego">
            {TIPOS.map((t) => {
              const n = completos(t.nombre).length
              return (
                <label key={t.nombre} className={'cpick__opt cpick__opt--' + t.tone}>
                  <input type="radio" name="tipo-juego" className="sr-only" checked={draft.tipo === t.nombre}
                    onChange={() => setDraft((d) => (d.tipo === t.nombre ? d : { ...d, tipo: t.nombre, sel: [], err: false }))} />
                  <span className="tile"><Icon name={t.icon} size={20} /></span>
                  <span className="cpick__txt"><strong className="t-title-sm">{t.nombre}</strong><small>{n} {n === 1 ? 'disponible' : 'disponibles'}</small></span>
                </label>
              )
            })}
          </div>
        </fieldset>

        <fieldset className="cont__fs" aria-describedby="juegos-ayuda">
          <legend className="t-title-md">Juegos <span className="req" aria-hidden="true">*</span><span className="sr-only">(obligatorio)</span></legend>
          <p id="juegos-ayuda" className="t-body-sm cont__help">Selecciona uno o varios. Solo se muestran juegos Completados de este tipo.</p>
          {disp.length === 0 ? (
            <div className="cont__none t-body-md">No hay juegos Completados de este tipo. Créalos o complétalos en el módulo Juegos.</div>
          ) : (
            // Misma tabla del listado de Juegos: encabezado enmarcado y filas con cebra
            <div className={'table-wrap jsel' + (draft.err ? ' jsel--err' : '')}>
              <table className="ds-table">
                <thead>
                  <tr><th scope="col">Juego</th><th scope="col">Estado</th><th scope="col">Publicado en</th><th scope="col"><span className="sr-only">Ver</span></th></tr>
                </thead>
                <tbody>
                  {disp.map((g) => {
                    const lug = publicadoEn(g)
                    const on = draft.sel.includes(g.id!)
                    return (
                      <tr key={g.id} className={on ? 'jsel__row--on' : undefined}>
                        <td>
                          <div className="jsel__main">
                            <Checkbox label={g.nombre} checked={on} onChange={() => toggle(g.id!)} />
                            <small className="jsel__meta">Modificado el {g.editada}</small>
                          </div>
                        </td>
                        <td><EstadoTag game={g} /></td>
                        <td>{lug.length > 0 ? lug.join(' · ') : <span className="jsel__none">Sin publicar</span>}</td>
                        <td style={{ textAlign: 'right' }}><IconButton icon="visibility" label={`Ver ${g.nombre}`} onClick={() => onVer(g)} /></td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
          {draft.err && <p className="field-err t-body-sm" role="alert"><Icon name="error" size={16} /> Debes seleccionar al menos un juego.</p>}
          {draft.sel.length > 1 && (
            <p className="cont__rota t-body-sm" role="status"><Icon name="shuffle" size={18} /> Seleccionaste {draft.sel.length} juegos. En el portal se mostrará uno de ellos al azar en cada visita a la sección.</p>
          )}
        </fieldset>
      </div>

      <aside className="cont__aside">
        <Message title="Así funciona">
          <ul className="cont__list">
            <li>Al GUARDAR, el contenido queda <OTag tone="success">Publicado</OTag> en la sección.</li>
            <li>Un mismo juego se puede usar en varias secciones y micrositios.</li>
            <li>Con varios juegos, en cada visita se muestra uno de ellos al azar.</li>
            <li>Al terminar el juego, el visitante ve el mensaje de cierre y los botones VOLVER A JUGAR e IR AL INICIO.</li>
          </ul>
        </Message>
      </aside>
    </section>
  )
}
