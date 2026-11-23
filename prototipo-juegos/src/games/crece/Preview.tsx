import { useEffect, useRef, useState } from 'react'
import { Button, Checkbox, Icon } from '../../ui'
import { CIERRE_DEFECTO, PvDone, PvHeader, PvHelp, PvStart, useHelp, type PreviewProps } from '../preview/Shell'
import { DIFICULTADES, DURACIONES, INDICADORES, SERES } from './catalogo'
import type { IndKey } from './catalogo'
import './pv.css'

interface Cr {
  stage: number; day: number; good: number; t: number
  ind: Partial<Record<IndKey, number>>; zero: Partial<Record<IndKey, number>>
  slept: boolean; ov: null | 'stage' | 'help'; bubble: string; bubbleLeft: number
}
interface St { cr: Cr; started: boolean; done: boolean; fast: boolean; son: boolean }

const LOWM: Record<IndKey, string> = { agua: 'Tengo sed', luz: 'Necesito luz', comida: 'Tengo hambre', carino: 'Quiero cariño', descanso: 'Tengo sueño' }
const HIM: Record<IndKey, string> = { agua: '¡Demasiada agua!', luz: '¡Demasiada luz!', comida: '¡Estoy lleno!', carino: '¡Ya fue mucho cariño!', descanso: '¡Ya descansé!' }

function initCr(ser: string): Cr {
  const ind: Cr['ind'] = {}
  ;(Object.keys(SERES[ser].cons) as IndKey[]).forEach(k => { ind[k] = 60 })
  return { stage: 0, day: 1, good: 0, t: 0, ind, zero: {}, slept: false, ov: null, bubble: '', bubbleLeft: 0 }
}
// El acelerador ×4 es solo de la vista previa de administración: en el Portal WEB el día dura lo configurado.
const initSt = (ser: string, fast: boolean): St => ({ cr: initCr(ser), started: false, done: false, fast, son: true })

/** Un avance de 0,5 s de simulación (función pura). */
function tickCr(prev: Cr, ser: string, difName: string, dur: number, fast: boolean): Cr {
  const sv = SERES[ser], dif = DIFICULTADES[difName] ?? DIFICULTADES.Normal, need = DURACIONES[dur] ?? DURACIONES[8]
  const cr: Cr = { ...prev, ind: { ...prev.ind }, zero: { ...prev.zero } }
  if (cr.bubbleLeft > 0) { cr.bubbleLeft -= 1; if (cr.bubbleLeft === 0) cr.bubble = '' }
  cr.t += 0.5 * (fast ? 4 : 1) / dif[0]
  if (cr.t >= 1) {
    const ks = Object.keys(cr.ind) as IndKey[]
    const ok = ks.every(k => cr.ind[k]! >= 40 && cr.ind[k]! <= 90)
    ks.forEach(k => { cr.ind[k] = Math.max(0, Math.round(cr.ind[k]! - sv.cons[k]! * dif[1])) })
    let help = false
    ks.forEach(k => { cr.zero[k] = cr.ind[k] === 0 ? (cr.zero[k] || 0) + 1 : 0; if (cr.zero[k]! >= 2) help = true })
    cr.day += 1; cr.t = 0; cr.slept = false
    if (ok) { cr.good += 1; if (cr.good >= need[cr.stage]) { cr.stage += 1; cr.good = 0; cr.ov = 'stage' } }
    if (help && cr.ov !== 'stage') cr.ov = 'help'
  }
  return cr
}

function careCr(prev: Cr, k: IndKey): Cr {
  if (prev.ov) return prev
  const cr: Cr = { ...prev, ind: { ...prev.ind }, zero: { ...prev.zero } }, night = cr.t >= 0.7
  let bubble = ''
  if (k === 'luz' && night) bubble = 'De noche no hay sol. Espera a que amanezca.'
  else if (k === 'descanso') {
    if (!night) bubble = 'Solo puedo dormir de noche.'
    else if (cr.slept) bubble = 'Ya dormí esta noche.'
    else { cr.ind.descanso = Math.min(100, (cr.ind.descanso ?? 0) + 40); cr.slept = true }
  } else cr.ind[k] = Math.min(100, (cr.ind[k] ?? 0) + 15)
  cr.bubble = bubble; cr.bubbleLeft = bubble ? 5 : 0
  return cr
}

function estado(x: number): { t: string; cls: string; icon: string } {
  if (x > 90) return { t: 'Demasiado', cls: 'ccp-ind--hi', icon: 'arrow_upward' }
  if (x >= 40) return { t: 'Equilibrado', cls: 'ccp-ind--ok', icon: 'check' }
  if (x >= 20) return { t: 'Bajo', cls: 'ccp-ind--lo', icon: 'arrow_downward' }
  return { t: 'Muy bajo', cls: 'ccp-ind--vlo', icon: 'warning' }
}

/** Vista previa jugable: «así lo verá el visitante». */
export function CrecePreview({ game, onClose, portal }: PreviewProps) {
  const c = game.crece
  const sv = SERES[c.ser]
  const help = useHelp()
  const [s, setS] = useState<St>(() => initSt(c.ser, !portal))
  const ovBtn = useRef<HTMLDivElement>(null)
  const sceneRef = useRef<HTMLDivElement>(null)
  /* Reacción del personaje ilustrado al cuidarlo: salto, ojos felices y el icono del cuidado flotando */
  const [fx, setFx] = useState<{ k: IndKey; id: number } | null>(null)
  const [feliz, setFeliz] = useState(false)
  const felizT = useRef<number | undefined>(undefined)
  useEffect(() => () => window.clearTimeout(felizT.current), [])

  const running = s.started && !s.done && !s.cr.ov && !help.open
  // Un único temporizador; se recrea solo cuando cambia si la simulación corre o la velocidad.
  useEffect(() => {
    if (!running || !sv) return
    const id = window.setInterval(() => {
      if (document.hidden) return
      setS(p => (p.cr.ov || p.done ? p : { ...p, cr: tickCr(p.cr, c.ser, c.dif, c.dur, p.fast) }))
    }, 500)
    return () => window.clearInterval(id)
  }, [running, s.fast, c.ser, c.dif, c.dur, sv])

  const ov = s.cr.ov
  useEffect(() => { if (ov) ovBtn.current?.querySelector("button")?.focus() }, [ov])

  if (!sv) return <p className="pv-muted">Elige el ser vivo para ver la vista previa.</p>

  const cr = s.cr
  const need = DURACIONES[c.dur] ?? DURACIONES[8]
  const dif = DIFICULTADES[c.dif] ?? DIFICULTADES.Normal
  const night = cr.t >= 0.7
  const pers = (c.pers || '').trim() || c.ser
  const ks = Object.keys(cr.ind) as IndKey[]
  const bad = ks.some(k => cr.ind[k]! < 20 || cr.ind[k]! > 90)
  const low = ks.find(k => cr.ind[k]! < 40), high = ks.find(k => cr.ind[k]! > 90)
  const bubble = cr.bubble || (high ? HIM[high] : low ? LOWM[low] : '')
  const fin = cr.stage >= 2
  const st = Math.min(cr.stage, 2)
  const instr = (game.desc || '').trim() || 'Cuida a tu ser vivo: mantén sus necesidades en equilibrio para que crezca.'
  const patch = (o: Partial<St>) => setS(p => ({ ...p, ...o }))
  // VOLVER A JUGAR vuelve a la pantalla INICIAR (HU-PW-196, escenario 5) y conserva la elección del acelerador.
  const reset = () => setS(p => ({ ...initSt(c.ser, p.fast), son: p.son }))
  const duerme = night && cr.slept
  const cuidar = (k: IndKey) => {
    const sirvio = !cr.ov && !careCr(cr, k).bubble
    setS(p => ({ ...p, cr: careCr(p.cr, k) }))
    if (!sirvio || !sv.fig) return
    setFx(f => ({ k, id: (f?.id ?? 0) + 1 }))
    setFeliz(true)
    window.clearTimeout(felizT.current)
    felizT.current = window.setTimeout(() => setFeliz(false), 900)
  }

  if (s.done) {
    return (
      <div className="pv-stage">
        <PvHeader game={game} />
        <PvDone title="¡Terminaste el juego!" cierre={game.cierre.trim() || CIERRE_DEFECTO}
          onReplay={reset} onHome={onClose} />
      </div>
    )
  }

  if (!s.started) {
    return (
      <div className="pv-stage">
        <PvHeader game={game} />
        <PvStart instr={instr} info={'Cada día dura ' + dif[0] + ' segundos'} onStart={() => patch({ started: true })} />
      </div>
    )
  }

  const top = pers + ' · Día ' + cr.day + ' · ' + (fin ? 'Etapa final' : sv.et[cr.stage] + ' · ' + cr.good + ' de ' + need[cr.stage] + ' días bien cuidados')
  const ovTitle = ov === 'help' ? '¡' + pers + ' te necesita!' : fin ? '¡' + pers + ' ya es adulto!' : '¡' + pers + ' creció! Ahora es ' + sv.et[cr.stage].toLowerCase()
  const ovTxt = ov === 'help' ? 'Intenta mantener sus necesidades en equilibrio: ni muy poco ni demasiado.' : (c.msgs[cr.stage - 1] || '').trim() || sv.msg[cr.stage - 1] || ''
  const ovBtnTxt = ov === 'help' ? 'REINTENTAR ETAPA' : fin ? 'TERMINAR' : 'CONTINUAR'
  const onOv = () => {
    if (ov === 'help') {
      const ind: Cr['ind'] = {}
      ks.forEach(k => { ind[k] = 60 })
      setS(p => ({ ...p, cr: { ...p.cr, ov: null, ind, zero: {}, good: 0 } }))
    } else if (fin) patch({ done: true })
    else setS(p => ({ ...p, cr: { ...p.cr, ov: null } }))
  }

  return (
    <div className="pv-stage ccp">
      <PvHeader game={game} onHelp={help.show} />
      <div className="ccp-top">
        <div className="ccp-top__t">{top}</div>
        {c.sonido && (
          <Button variant="outline" size="small" icon={s.son ? 'volume_up' : 'volume_off'} aria-pressed={s.son} onClick={() => patch({ son: !s.son })}>
            {s.son ? 'Sonido activado' : 'Sonido silenciado'}
          </Button>
        )}
        {!portal && <Checkbox label="Acelerar vista previa ×4 (solo administración)" checked={s.fast} onChange={e => patch({ fast: e.target.checked })} />}
      </div>

      <div className="ccp-day" role="progressbar" aria-label={night ? 'Progreso del día (noche)' : 'Progreso del día'} aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(cr.t * 100)}>
        <div className={'ccp-day__fill' + (night ? ' ccp-day__fill--night' : '')} style={{ width: Math.round(cr.t * 100) + '%' }} />
      </div>

      <div ref={sceneRef} className={'ccp-scene' + (night ? ' ccp-scene--night' : '') + (sv.fig ? ' ccp-scene--pet' : '')}>
        <div className="ccp-sky"><span aria-hidden="true">{night ? '🌙' : '☀️'}</span><span className="ccp-sr">{night ? 'Es de noche' : 'Es de día'}</span></div>
        <div className="ccp-bubble-slot" role="status">
          {bubble && !ov && <div className="ccp-bubble">{bubble}</div>}
        </div>
        {sv.fig ? (
          <div aria-hidden="true" className={'ccp-pet ccp-pet--' + st + ' ccp-pet--' + c.ser.toLowerCase() + (bad ? ' ccp-pet--bad' : '') + (duerme ? ' ccp-pet--duerme' : feliz ? ' ccp-pet--feliz' : '')}>
            <div className="ccp-pet__fig" dangerouslySetInnerHTML={{ __html: sv.fig }} />
            {duerme && <span className="ccp-pet__zz"><span>z</span><span>z</span><span>Z</span></span>}
            {fx && !duerme && <span key={fx.id} className="ccp-pet__fx">{INDICADORES[fx.k][0]}</span>}
          </div>
        ) : (
          <div className={'ccp-being ccp-being--' + st + (bad ? ' ccp-being--bad' : '')} aria-hidden="true">{sv.g[st]}</div>
        )}
        <div className="ccp-stage-name">{sv.et[st] + (bad ? ' · necesita atención' : '')}</div>
        {ov && !(fin && ov === 'stage') && (
          <div className="ccp-ov">
            <div className="ccp-ov__card" role="dialog" aria-labelledby="ccp-ov-t" aria-describedby="ccp-ov-d">
              <h3 className="ccp-ov__t" id="ccp-ov-t">{ovTitle}</h3>
              <p className="ccp-ov__d" id="ccp-ov-d">{ovTxt}</p>
              <div ref={ovBtn}><Button onClick={onOv}>{ovBtnTxt}</Button></div>
            </div>
          </div>
        )}
      </div>

      {fin && ov === 'stage' && (
        <div className="ccp-final" role="status">
          <Icon name="celebration" size={28} />
          <div className="ccp-final__txt">
            <div className="ccp-final__t">{'¡' + pers + ' ya es ' + sv.et[2].toLowerCase() + '!'}</div>
            <div className="ccp-final__d">{(c.msgs[1] || '').trim() || sv.msg[1] || ''}</div>
          </div>
          <Button onClick={() => patch({ done: true })}>VER RESULTADO</Button>
        </div>
      )}

      <div className="ccp-inds">
        {ks.map(k => {
          const x = cr.ind[k]!, e = estado(x), nom = INDICADORES[k][0] + ' ' + INDICADORES[k][1]
          return (
            <div key={k} className={'ccp-ind ' + e.cls}>
              <div className="ccp-ind__h"><span>{nom}</span><span>{x}</span></div>
              <div className="ccp-bar" role="progressbar" aria-label={INDICADORES[k][1]} aria-valuemin={0} aria-valuemax={100} aria-valuenow={x} aria-valuetext={x + ' de 100, ' + e.t.toLowerCase()}>
                <div className="ccp-bar__fill" style={{ width: x + '%' }} />
              </div>
              <div className="ccp-ind__s"><Icon name={e.icon} size={16} />{e.t}</div>
            </div>
          )
        })}
      </div>

      <div className="ccp-btns">
        {ks.map(k => {
          const dis = (k === 'luz' && night) || (k === 'descanso' && (!night || cr.slept))
          return (
            <Button key={k} variant="outline" className={dis ? 'ccp-btn--dis' : undefined} aria-disabled={dis || undefined}
              title={k === 'descanso' ? 'Solo de noche, una vez por noche' : 'Suma 15'}
              onClick={() => cuidar(k)}>
              {INDICADORES[k][0] + ' ' + INDICADORES[k][2]}
            </Button>
          )
        })}
      </div>

      <PvHelp open={help.open} onClose={help.hide}><p className="pv-text">{instr}</p></PvHelp>
    </div>
  )
}
