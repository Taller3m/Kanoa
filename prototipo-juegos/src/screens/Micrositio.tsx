import { Button, Icon, IconButton, TextField } from '../ui'
import type { Activos, Micrositio as M } from '../portal/data'
import { MicroCard } from './MicroCard'

/** Figma: EdicionBienestarEmocional › Bienestar emocional (9:3902). Información del micrositio y «Gestionar secciones». */
export function Micrositio({ micro, activos, onAbrir, onToggle, onCopiar, onFueraDeAlcance }: {
  micro: M; activos: Activos; onAbrir: (sec: string) => void; onToggle: (sec: string) => void; onCopiar: (url: string) => void; onFueraDeAlcance: () => void
}) {
  const url = `https://www.kanoalab.co/${micro.slug}`
  return (
    <section className="screen" aria-label={`Micrositio ${micro.nombre}`}>
      <section className="mblock" aria-labelledby="t-info-micro">
        <h2 className="mblock__title" id="t-info-micro">Información general</h2>
        <div className="mpanel">
          <div className="mfile"><Icon name="image" size={20} /><span>Imagen.png</span></div>
          <dl className="mdl">
            <div><dt>Título</dt><dd>{micro.nombre}</dd></div>
            <div><dt>Descripción</dt><dd>{micro.desc}</dd></div>
          </dl>
          <div className="murl">
            <span className="murl__label">URL pública</span>
            <div className="murl__row">
              <span className="murl__value">{url}</span>
              <IconButton icon="content_copy" label="Copiar URL pública" onClick={() => onCopiar(url)} />
            </div>
          </div>
        </div>
        <div className="mbtns">
          {['Botón principal', 'Botón secundario'].map((b) => (
            <div key={b} className="mpanel mpanel--quiet">
              <div className="mbtns__head"><strong>{b}</strong><span className="mswitch mswitch--static" aria-hidden="true"><span className="mswitch__track" /></span></div>
              <TextField label="Nombre" required disabled placeholder="Explorar" help="Máximo 20 caracteres" />
              <TextField label="Link" required disabled placeholder="Agrega un link para direccionar al dar clic" />
            </div>
          ))}
        </div>
        <div className="mpanel__actions"><Button onClick={onFueraDeAlcance}>Editar información</Button></div>
      </section>

      <section className="mblock" aria-labelledby="t-secciones">
        <h2 className="mblock__title" id="t-secciones">Gestionar secciones</h2>
        <div className="mgrid">
          {micro.secciones.map((s) => {
            const id = `${micro.slug}/${s.slug}`
            return <MicroCard key={id} titulo={s.nombre} desc={s.desc} activa={!!activos[id]} accion="Editar" onAccion={() => onAbrir(id)} onToggle={() => onToggle(id)} />
          })}
        </div>
      </section>
    </section>
  )
}
