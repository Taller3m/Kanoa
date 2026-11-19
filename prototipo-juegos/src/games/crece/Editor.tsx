import { useId } from 'react'
import type { EditorProps, Game } from '../types'
import { Button, Chip, Icon, TextField } from '../../ui'
import { DIFICULTADES, DURACIONES, GRUPOS_SERES, INDICADORES, REGLAS_CRECE, SERES } from './catalogo'
import type { IndKey } from './catalogo'
import './crece.css'

/** Paso 2 «Configuración» del juego «Crece conmigo». */
export function CreceEditor({ game, update }: EditorProps) {
  const c = game.crece
  const sv = SERES[c.ser]
  const uid = useId()
  const set = (fn: (cc: Game['crece']) => void) => update(d => { fn(d.crece) })
  const dif = DIFICULTADES[c.dif] ?? DIFICULTADES.Normal
  const dur = DURACIONES[c.dur] ?? DURACIONES[8]
  const tot = dur.reduce((a, b) => a + b, 0) * dif[0]
  const persPh = sv ? 'Ej. ' + (c.ser === 'Gato' ? 'Michi' : 'Lucas') : 'Ej. Simón'
  const difTxt = 'Cada día dura ' + dif[0] + ' segundos. ' + (c.dif === 'Fácil' ? 'Las necesidades bajan más despacio.' : c.dif === 'Retador' ? 'Las necesidades bajan más rápido.' : 'Ritmo recomendado.')
  const durTxt = 'Días bien cuidados por etapa: ' + dur.join(' · ') + '. Partida de unos ' + Math.max(1, Math.round(tot / 60)) + ' minutos.'

  return (
    <div className="cc">
      <div>
        <h2 className="cc-h t-section">Ser vivo <span className="cc-req" aria-hidden="true">*</span></h2>
        <p className="cc-help">Elige la planta o el animal que el jugador va a cuidar. Sus etapas, necesidades e ilustraciones vienen definidas.</p>
      </div>

      {GRUPOS_SERES.map(([titulo, tp]) => (
        <section key={tp} className="cc-group" aria-labelledby={`${uid}-g-${tp}`}>
          <h3 className="cc-h3" id={`${uid}-g-${tp}`}>{titulo}</h3>
          <div className="cc-grid">
            {Object.keys(SERES).filter(n => SERES[n].tipo === tp).map(n => {
              const x = SERES[n]
              const on = c.ser === n
              return (
                <button key={n} type="button" aria-pressed={on} className={'cc-ser' + (on ? ' cc-ser--on' : '')} onClick={() => set(cc => { cc.ser = n })}>
                  <span className="cc-ico" style={{ background: `var(${x.c})` }} aria-hidden="true">{x.img ? <img src={x.img} alt="" /> : x.g[2]}</span>
                  <span className="cc-ser__txt">
                    <span className="cc-ser__n">{n}</span>
                    <span className="cc-ser__et">{x.et.join(' › ')}</span>
                    <span className="cc-ser__ind">{(Object.keys(x.cons) as IndKey[]).map(k => INDICADORES[k][0] + ' ' + INDICADORES[k][1]).join(' · ')}</span>
                  </span>
                  {on && <Icon name="check_circle" size={20} className="cc-ser__ok" />}
                </button>
              )
            })}
          </div>
        </section>
      ))}

      <div className="cc-cols">
        <div>
          <TextField label="Nombre del personaje (opcional)" value={c.pers} maxLength={20} placeholder={persPh}
            onChange={e => { const v = e.target.value; set(cc => { cc.pers = v }) }} />
          <div className="cc-count"><span>Si lo dejas vacío, se usa el nombre del ser vivo.</span><span>{c.pers.length}/20</span></div>
        </div>
        <div role="group" aria-labelledby={`${uid}-dif`}>
          <div className="cc-lbl" id={`${uid}-dif`}>Dificultad</div>
          <div className="cc-chips">
            {Object.keys(DIFICULTADES).map(t => <Chip key={t} active={t === c.dif} onClick={() => set(cc => { cc.dif = t })}>{t}</Chip>)}
          </div>
          <p className="cc-note" aria-live="polite">{difTxt}</p>
        </div>
        <div role="group" aria-labelledby={`${uid}-dur`}>
          <div className="cc-lbl" id={`${uid}-dur`}>Duración</div>
          <div className="cc-chips">
            {[6, 8, 12].map(n => <Chip key={n} active={n === c.dur} onClick={() => set(cc => { cc.dur = n })}>{n + ' días'}</Chip>)}
          </div>
          <p className="cc-note" aria-live="polite">{durTxt}</p>
        </div>
      </div>

      {sv && (
        <div className="cc-group">
          <div>
            <div className="cc-lbl">Mensaje al crecer <span className="cc-opt">(opcional)</span></div>
            <p className="cc-note">Se muestra cuando el ser vivo pasa a cada etapa. Si lo dejas vacío, se usa el mensaje sugerido.</p>
          </div>
          {[1, 2].map(i => (
            <div key={i} className="cc-msg">
              <label className="cc-msg__et" htmlFor={`${uid}-m${i}`}>{'Etapa ' + (i + 1) + ' · ' + sv.et[i]}</label>
              <input id={`${uid}-m${i}`} className="cc-input" value={c.msgs[i - 1] || ''} maxLength={150} placeholder={sv.msg[i - 1]}
                onChange={e => { const v = e.target.value; set(cc => { cc.msgs[i - 1] = v }) }} />
            </div>
          ))}
        </div>
      )}

      <div>
        <div className="cc-lbl">Sonido de fondo <span className="cc-opt">(opcional)</span></div>
        <p className="cc-note cc-note--wide">Música o ambiente propio de KANOA LAB (por ejemplo, creado con IA) para no depender de derechos de autor. Se repite durante el juego y el jugador puede silenciarlo. MP3, máximo 5 MB.</p>
        {!c.sonido ? (
          <Button variant="outline" icon="add" onClick={() => set(cc => {
            cc.sonido = 'sonido-fondo-' + (cc.ser || 'juego').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '') + '.mp3'
          })}>AÑADIR AUDIO</Button>
        ) : (
          <div className="cc-audio">
            <span className="cc-audio__ico" aria-hidden="true"><Icon name="music_note" size={20} /></span>
            <span className="cc-audio__n">{c.sonido}</span>
            <button type="button" className="cc-audio__rm" aria-label="Quitar audio" title="Quitar audio" onClick={() => set(cc => { cc.sonido = '' })}>
              <Icon name="close" size={20} />
            </button>
          </div>
        )}
      </div>

      <div className="cc-rules">
        <h3 className="cc-h3">Reglas del juego (fijas)</h3>
        <ul>{REGLAS_CRECE.map(r => <li key={r}>{r}</li>)}</ul>
      </div>
    </div>
  )
}
