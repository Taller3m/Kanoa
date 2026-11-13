import { useState } from 'react'
import { Button, Icon } from '../../ui'
import { CIERRE_DEFECTO, PvDone, PvHeader, PvHelp, PvStart, useHelp, type PreviewProps } from '../preview/Shell'
import './pv.css'

const INSTR_DEFECTO = 'Lee cada página y responde la pregunta para avanzar en la historia.'

/** Vista previa jugable: «así lo verá el visitante». */
export function CuentoPreview({ game }: PreviewProps) {
  const help = useHelp()
  const [started, setStarted] = useState(false)
  const [done, setDone] = useState(false)
  const [idx, setIdx] = useState(0)
  const [pick, setPick] = useState<number | null>(null)
  const [play, setPlay] = useState(false)
  const [nota, setNota] = useState('')

  // Como en el original, solo se juegan las páginas con al menos una opción escrita.
  const ps = game.cuento.paginas.filter((p) => p.opciones.some((o) => o.t.trim()))
  const instr = game.desc.trim() || INSTR_DEFECTO
  const header = <PvHeader game={game} onHelp={help.show} />
  const helpDlg = <PvHelp open={help.open} onClose={help.hide}><p className="cup-help">{instr}</p></PvHelp>

  const reset = () => { setStarted(true); setDone(false); setIdx(0); setPick(null); setPlay(false); setNota('') }

  if (!ps.length) {
    return <div>{header}<p className="cup-empty t-body-md" role="status">Completa al menos una página para ver la vista previa.</p>{helpDlg}</div>
  }

  if (done) {
    return (
      <div>
        {header}
        <PvDone title="¡Terminaste el juego!" cierre={game.cierre.trim() || CIERRE_DEFECTO} onReplay={reset}
          onHome={() => setNota('Lleva al visitante al inicio de la página donde está el juego.')} />
        {nota && <p className="cup-note t-body-md" role="status">{nota}</p>}
        {helpDlg}
      </div>
    )
  }

  if (!started) {
    return <div>{header}<PvStart instr={instr} onStart={() => setStarted(true)} />{helpDlg}</div>
  }

  const i = Math.min(idx, ps.length - 1)
  const p = ps[i]
  const last = i >= ps.length - 1
  const ops = p.opciones.filter((o) => o.t.trim())
  const picked = pick != null ? ops[pick] : null

  const next = () => {
    if (last) { setDone(true); setPlay(false) } else { setIdx(i + 1); setPick(null); setPlay(false) }
  }

  return (
    <div>
      {header}
      <div className="cup">
        <div className="cup-art">
          <Icon name="image" size={40} />
          <div className="t-body-md cup-art__name">{p.img || 'Sin ilustración'}</div>
          {p.audio && (
            <Button size="small" icon={play ? 'pause' : 'play_arrow'} aria-pressed={play} onClick={() => setPlay(!play)}>
              {play ? 'Pausar narración' : 'Escuchar narración'}
            </Button>
          )}
        </div>

        <div className="cup-body">
          <div className="t-label-lg cup-page">Página {i + 1} de {ps.length}</div>
          <p className="t-body-lg cup-text">{p.texto}</p>
          <h3 className="t-title-md cup-q" id="cup-q">{p.pregunta}</h3>

          <div className="cup-opts" role="group" aria-labelledby="cup-q">
            {ops.map((o, k) => {
              const me = pick === k
              const cls = me ? (o.ok ? ' is-ok' : ' is-bad') : ''
              return (
                <button key={k} type="button" className={`cup-opt${cls}`} aria-disabled={pick != null} aria-pressed={me}
                  onClick={() => { if (pick == null) setPick(k) }}>
                  <span className="cup-opt__t">{o.t}</span>
                  {me && <Icon name={o.ok ? 'check_circle' : 'cancel'} size={22} />}
                  {me && <span className="cup-sr">{o.ok ? ' (correcta)' : ' (incorrecta)'}</span>}
                </button>
              )
            })}
          </div>

          <div role="status">
            {picked && (
              <div className={`cup-fb t-label-lg ${picked.ok ? 'is-ok' : 'is-bad'}`}>
                <Icon name={picked.ok ? 'check_circle' : 'info'} size={20} />
                <span>{picked.ok ? p.fbOk : p.fbNo}</span>
              </div>
            )}
          </div>

          {picked && (
            <div className="cup-actions">
              {!picked.ok && <Button variant="outline" onClick={() => setPick(null)}>Reintentar</Button>}
              <Button onClick={next}>{last ? 'Terminar' : 'Siguiente'}</Button>
            </div>
          )}
        </div>
      </div>
      {helpDlg}
    </div>
  )
}
