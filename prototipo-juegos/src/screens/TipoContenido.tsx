import { Icon } from '../ui'
import { TIPOS_CONTENIDO, type TipoContenido as TC } from '../portal/data'

/** Figma: seccion › Property 1=CreacionDeContenido (53:8207), con la tarjeta Juego agregada por la HU. */
export function TipoContenido({ onPick }: { onPick: (t: TC) => void }) {
  return (
    <section className="screen" aria-labelledby="t-tipocont">
      <div className="ctype__intro">
        <h2 className="ctype__q" id="t-tipocont">¿Qué tipo de contenido quieres crear?</h2>
        <p>Elige un formato para empezar. Podrás completar el título, la descripción y los archivos en el siguiente paso.</p>
      </div>
      <div className="ctype">
        {TIPOS_CONTENIDO.map((t) => (
          <button key={t.nombre} type="button" className={'ctype__card ctype__card--' + t.tone} onClick={() => onPick(t.nombre)}>
            <span className="ctype__icon" aria-hidden="true"><Icon name={t.icon} size={24} /></span>
            <span className="ctype__name">{t.nombre}</span>
            <span className="ctype__desc">{t.desc}</span>
          </button>
        ))}
      </div>
    </section>
  )
}
