import { Button, Icon, Message } from '../ui'
import { SECCIONES, type Contenido } from '../portal/data'

/** Entrada simulada a Micrositios: solo lista las secciones de ejemplo para llegar a sus contenidos. */
export function Secciones({ contenidos, onAbrir }: { contenidos: Contenido[]; onAbrir: (sec: string) => void }) {
  return (
    <section className="screen" aria-label="Secciones de los micrositios">
      <Message title="Simulación">La administración de micrositios está fuera del alcance de este prototipo. Aquí solo se simulan algunas secciones para probar cómo se agregan juegos como contenido (HU-PW-181).</Message>
      <div className="table-wrap">
        <table className="ds-table">
          <thead>
            <tr><th scope="col">Sección</th><th scope="col">Contenidos</th><th scope="col">Contenidos de tipo Juego</th><th scope="col"><span className="sr-only">Acciones</span></th></tr>
          </thead>
          <tbody>
            {SECCIONES.map((s) => {
              const cs = contenidos.filter((c) => c.sec === s.id)
              return (
                <tr key={s.id}>
                  <td>
                    <div className="gname">
                      <span className="tile tile--green"><Icon name="category" size={20} /></span>
                      <div><strong className="t-title-sm">{s.sec}</strong><small>Micrositio {s.micro}</small></div>
                    </div>
                  </td>
                  <td>{cs.length}</td>
                  <td>{cs.filter((c) => c.tipo === 'Juego').length}</td>
                  <td style={{ textAlign: 'right' }}>
                    <Button variant="outline" size="small" iconEnd="chevron_right" onClick={() => onAbrir(s.id)} aria-label={`Ver contenidos de ${s.micro} › ${s.sec}`}>Ver contenidos</Button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </section>
  )
}
