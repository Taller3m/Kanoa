import { Button, Icon, TextArea, TextField } from '../ui'
import { EDITORES, reqsOf } from '../games/registry'
import type { Game } from '../games/types'

export interface AsistenteProps {
  game: Game
  paso: 1 | 2
  setPaso: (p: 1 | 2) => void
  nombreErr: boolean
  update: (fn: (d: Game) => void) => void
  toast: (msg: string, kind?: 'ok' | 'err' | 'info') => void
  clearNombreErr: () => void
}

export function Asistente({ game, paso, setPaso, nombreErr, update, toast, clearNombreErr }: AsistenteProps) {
  const Editor = EDITORES[game.tipo]
  const reqs = reqsOf(game)
  const detallesOk = game.nombre.trim().length >= 3
  return (
    <section className="screen" aria-label={`${game.id ? 'Edición' : 'Creación'} de ${game.tipo.toLowerCase()}`}>
      <nav className="stepper" aria-label="Pasos">
        <button type="button" className={`stepper__step ${detallesOk ? 'stepper__step--done' : ''}`} aria-current={paso === 1 ? 'step' : undefined} onClick={() => setPaso(1)}>
          <span className="stepper__dot">{detallesOk ? <Icon name="check" size={16} /> : 1}</span>Detalles
        </button>
        <span className="stepper__line" aria-hidden="true" />
        <button type="button" className="stepper__step" aria-current={paso === 2 ? 'step' : undefined} onClick={() => setPaso(2)}>
          <span className="stepper__dot">2</span>Configuración
        </button>
      </nav>

      {paso === 1 && (
        <div className="form">
          <h2 className="t-headline-sm">Detalles del juego</h2>
          <TextField label="Nombre del juego" required maxLength={80} placeholder="Ej. El café colombiano" value={game.nombre}
            error={nombreErr ? 'El nombre es obligatorio (mínimo 3 caracteres).' : undefined}
            help={`${game.nombre.length}/80`}
            onChange={(e) => { const v = e.target.value; update((d) => { d.nombre = v }); clearNombreErr() }} />
          <TextArea label="Instrucciones para el jugador (opcional)" maxLength={300} rows={3} placeholder="Ej. Lee cada pista y escribe la palabra en el tablero."
            value={game.desc} help={`${game.desc.length}/300`} onChange={(e) => { const v = e.target.value; update((d) => { d.desc = v }) }} />
          <TextField label="Mensaje de cierre (opcional)" maxLength={150} placeholder="¡Gracias por jugar! Sigue explorando esta sección."
            value={game.cierre} help="Se muestra al terminar el juego, junto a los botones VOLVER A JUGAR e IR AL INICIO. Si lo dejas vacío, se usa el mensaje por defecto."
            onChange={(e) => { const v = e.target.value; update((d) => { d.cierre = v }) }} />
          <div className="form__actions"><Button iconEnd="arrow_forward" onClick={() => setPaso(2)}>Siguiente</Button></div>
        </div>
      )}

      {paso === 2 && (
        <>
          <div className="reqs t-body-md" role="status" aria-label="Requisitos para quedar Completado">
            <strong className="t-label-lg">Para quedar Completado:</strong>
            <ul>
              {reqs.map((r) => (
                <li key={r.t} className={r.ok ? 'ok' : undefined}>
                  <Icon name={r.ok ? 'check_circle' : 'radio_button_unchecked'} size={18} />
                  <span><span className="sr-only">{r.ok ? 'Cumplido: ' : 'Pendiente: '}</span>{r.t}</span>
                </li>
              ))}
            </ul>
          </div>
          <Editor game={game} update={update} toast={toast} />
        </>
      )}
    </section>
  )
}
