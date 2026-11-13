import { Icon } from '../ui'
import { TIPOS } from '../games/registry'
import type { TipoJuego } from '../games/types'

export function Tipo({ onPick }: { onPick: (t: TipoJuego) => void }) {
  return (
    <section className="screen" aria-labelledby="t-tipo">
      <div>
        <h2 className="t-headline-sm" id="t-tipo" style={{ margin: 0, color: 'var(--title)' }}>¿Qué tipo de juego quieres crear?</h2>
        <p className="screen__lead t-body-lg" style={{ marginTop: 'var(--space-1)' }}>Elige el tipo de juego. En el siguiente paso configuras su contenido y sus reglas.</p>
      </div>
      <div className="options">
        {TIPOS.map((t) => (
          <button key={t.nombre} type="button" className="option" onClick={() => onPick(t.nombre)}>
            <span className={`tile tile--lg tile--${t.tone}`}><Icon name={t.icon} size={28} /></span>
            <span>
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
