import { Icon } from '../ui'
import { TIPOS_CONTENIDO, type TipoContenido as TC } from '../portal/data'

export function TipoContenido({ onPick }: { onPick: (t: TC) => void }) {
  return (
    <section className="screen" aria-labelledby="t-tipocont">
      <div>
        <h2 className="t-section" id="t-tipocont" style={{ margin: 0, color: 'var(--title)' }}>¿Qué tipo de contenido quieres crear?</h2>
        <p className="screen__lead t-body-lg" style={{ marginTop: 'var(--space-1)' }}>Elige un formato para empezar. En el siguiente paso completas su información.</p>
      </div>
      <div className="options">
        {TIPOS_CONTENIDO.map((t) => (
          <button key={t.nombre} type="button" className={'option option--' + t.tone + (t.nombre === 'Juego' ? ' option--nuevo' : '')} onClick={() => onPick(t.nombre)}>
            <span className="option__icon"><Icon name={t.icon} size={28} /></span>
            <span className="option__text">
              <strong className="t-title-md">{t.nombre}</strong>
              <span className="desc t-body-md">{t.desc}</span>
            </span>
            <Icon name="chevron_right" />
          </button>
        ))}
      </div>
    </section>
  )
}
