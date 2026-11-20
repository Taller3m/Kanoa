import { Button, TextArea, TextField } from '../ui'
import { MICROSITIOS, type Activos } from '../portal/data'
import { MicroCard } from './MicroCard'

/** Figma: Micrositios › desktop (1:4446). Información general del módulo y tarjetas de los micrositios. */
export function Micrositios({ activos, onAbrir, onToggle, onFueraDeAlcance }: {
  activos: Activos; onAbrir: (slug: string) => void; onToggle: (slug: string) => void; onFueraDeAlcance: () => void
}) {
  return (
    <section className="screen" aria-label="Micrositios">
      <section className="mblock" aria-labelledby="t-info-micros">
        <h2 className="mblock__title" id="t-info-micros">Información general</h2>
        <div className="mpanel">
          <TextField label="Título" required readOnly value="Micrositios del portal" help="Mínimo 3, máximo 50 caracteres. Sin espacios al inicio o final." />
          <TextArea label="Descripción" required readOnly rows={2} value="Recursos, guías y acompañamiento para la comunidad académica, organizados por micrositio."
            help="Mínimo 3, máximo 150 caracteres. Sin espacios al inicio o final." />
          <div className="mpanel__actions"><Button onClick={onFueraDeAlcance}>Editar información</Button></div>
        </div>
      </section>

      <div className="mgrid">
        {MICROSITIOS.map((m) => (
          <MicroCard key={m.slug} titulo={m.nombre} desc={m.desc} activa={!!activos[m.slug]} accion="Administrar contenido"
            onAccion={() => onAbrir(m.slug)} onToggle={() => onToggle(m.slug)} />
        ))}
      </div>
    </section>
  )
}
