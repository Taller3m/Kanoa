import { useEffect, useState } from 'react'
import { Button, Icon, Message, TextArea, TextField } from '../ui'
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
  /** Al salir del campo Nombre con 1 o 2 caracteres se marca el error (HU-PW-171, escenario 5). */
  onNombreBlur: () => void
  /** Secciones donde el juego está en contenidos publicados (aviso al editar, HU-PW-183). */
  publicadoEn: string[]
}

export function Asistente({ game, paso, setPaso, nombreErr, update, toast, clearNombreErr, onNombreBlur, publicadoEn }: AsistenteProps) {
  const Editor = EDITORES[game.tipo]
  const reqs = reqsOf(game)
  const detallesOk = game.nombre.trim().length >= 3
  const configOk = reqs.length > 0 && reqs.every((r) => r.ok)
  // Un paso se marca con check al salir de él con los datos válidos, no mientras se escribe.
  // Un juego ya guardado abre con ambos pasos recorridos.
  const [recorridos, setRecorridos] = useState<{ 1: boolean; 2: boolean }>(() => ({ 1: !!game.id, 2: !!game.id }))
  useEffect(() => {
    // App solo deja entrar al paso 2 con el nombre válido, así que llegar ahí confirma Detalles.
    if (paso === 2) setRecorridos((r) => (r[1] ? r : { ...r, 1: true }))
    else setRecorridos((r) => (r[1] && !r[2] ? { ...r, 2: true } : r))
  }, [paso])
  const hecho = { 1: paso !== 1 && recorridos[1] && detallesOk, 2: paso !== 2 && recorridos[2] && configOk }
  const pasos = [{ n: 1 as const, t: 'Detalles' }, { n: 2 as const, t: 'Configuración' }]
  return (
    <section className="screen" aria-label={`${game.id ? 'Edición' : 'Creación'} de ${game.tipo.toLowerCase()}`}>
      {publicadoEn.length > 0 && (
        <div role="status">
          <Message title="Este juego está publicado">
            Está en: {publicadoEn.join(' · ')}. Los cambios se verán en el portal al guardar, y la configuración debe quedar completa.
          </Message>
        </div>
      )}
      <nav className="stepper" aria-label="Pasos">
        {pasos.map(({ n, t }, i) => (
          <span key={n} className="stepper__item">
            {i > 0 && <span className="stepper__line" aria-hidden="true" />}
            <button type="button" className={`stepper__step ${hecho[n] ? 'stepper__step--done' : ''}`} aria-current={paso === n ? 'step' : undefined} onClick={() => setPaso(n)}>
              <span className="stepper__dot">{hecho[n] ? <Icon name="check" size={18} /> : n}</span>
              {t}{hecho[n] && <span className="sr-only"> (completo)</span>}
            </button>
          </span>
        ))}
      </nav>

      {paso === 1 && (
        <div className="form">
          <h2 className="t-section">Detalles del juego</h2>
          <TextField label="Nombre del juego" required maxLength={80} placeholder="Ej. El café colombiano" value={game.nombre}
            error={nombreErr ? (game.nombre.trim() ? 'La información ingresada en este campo debe contener al menos 3 caracteres.' : 'La información de este campo es obligatoria.') : undefined}
            counter={`${game.nombre.length}/80`}
            onChange={(e) => { const v = e.target.value; update((d) => { d.nombre = v }); clearNombreErr() }} onBlur={onNombreBlur} />
          <TextArea label="Instrucciones para el jugador (opcional)" maxLength={300} rows={3} placeholder="Ej. Lee cada pista y escribe la palabra en el tablero."
            value={game.desc} counter={`${game.desc.length}/300`} onChange={(e) => { const v = e.target.value; update((d) => { d.desc = v }) }} />
          <TextField label="Mensaje de cierre (opcional)" maxLength={150} placeholder="¡Gracias por jugar! Sigue explorando esta sección."
            value={game.cierre} help="Se muestra al terminar el juego, junto a los botones VOLVER A JUGAR e IR AL INICIO. Si lo dejas vacío, se usa el mensaje por defecto."
            onChange={(e) => { const v = e.target.value; update((d) => { d.cierre = v }) }} />
          <div className="form__actions"><Button iconEnd="arrow_forward" onClick={() => setPaso(2)}>Siguiente</Button></div>
        </div>
      )}

      {/* El paso 2 queda montado (oculto en el paso 1) para conservar lo que se esté diligenciando, p. ej. una palabra a medio escribir. */}
      {(
        <div hidden={paso !== 2} className="screen">
          <div className="reqs t-body-md" role="status" aria-label="Requisitos para quedar Completado">
            <strong className="t-label-lg">Para quedar Completado:</strong>
            <ul>
              {reqs.map((r) => (
                <li key={r.t} className={r.ok ? 'ok' : undefined}>
                  <span className="reqs__mark" aria-hidden="true">{r.ok ? <Icon name="check" size={14} /> : <span className="reqs__pend" />}</span>
                  <span><span className="sr-only">{r.ok ? 'Cumplido: ' : 'Pendiente: '}</span>{r.t}</span>
                </li>
              ))}
            </ul>
          </div>
          <Editor game={game} update={update} toast={toast} />
        </div>
      )}
    </section>
  )
}
