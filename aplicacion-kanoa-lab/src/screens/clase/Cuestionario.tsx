import { useEffect, useState } from 'react'
import { Button, Checkbox, Icon, Radio } from '../../ui'
import { AppBar, Notice, PagerBar, Screen, Scroll } from '../../mobile'
import { go } from '../../app/router'
import { useApp } from '../../app/store'
import { claseDe } from '../../app/data'
import { CUESTIONARIO, PREGUNTAS } from './data'

type Respuestas = number[][]

/** Respuestas que muestra el diseño (D11 y D12): «El núcleo» en la 1 y «Membrana» + «Núcleo» en la 2. */
const RESPUESTAS_DISENO: Respuestas = [[0], [0, 1], [], [], []]

const reloj = (seg: number) => `${Math.floor(seg / 60)}:${String(seg % 60).padStart(2, '0')}`

/**
 * D11 · Cuestionario en línea (selección única y múltiple). D12 · si se cae la conexión, las respuestas se conservan
 * y el envío espera a que vuelva el internet. `?caida=1` simula la caída al entrar con las respuestas del diseño.
 */
export function Cuestionario({ claseId, query }: { claseId: string; query: URLSearchParams }) {
  const { s, set, toast } = useApp()
  const clase = claseDe(claseId)
  const caida = query.get('caida') === '1'
  const [resp, setResp] = useState<Respuestas>(() => (caida ? RESPUESTAS_DISENO.map((r) => [...r]) : PREGUNTAS.map(() => [])))
  const [seg, setSeg] = useState(CUESTIONARIO.segundos)

  useEffect(() => { if (caida && s.online) set({ online: false }) }, []) // solo al entrar
  useEffect(() => {
    const id = window.setInterval(() => setSeg((x) => Math.max(0, x - 1)), 1000)
    return () => window.clearInterval(id)
  }, [])

  const elegir = (p: number, o: number, multiple: boolean) => setResp((r) => r.map((sel, i) => {
    if (i !== p) return sel
    if (!multiple) return [o]
    return sel.includes(o) ? sel.filter((x) => x !== o) : [...sel, o].sort()
  }))

  const enviar = () => {
    if (resp.some((r) => r.length === 0)) {
      toast({ texto: 'Responde todas las preguntas antes de enviar.', tipo: 'prevent' })
      return
    }
    const bien = PREGUNTAS.filter((p, i) => p.correctas.length === resp[i]!.length && p.correctas.every((c) => resp[i]!.includes(c))).length
    toast({ texto: `Enviamos tus respuestas. Acertaste ${bien} de ${PREGUNTAS.length}.`, tipo: 'success' })
    go(`clase/${clase.id}/actividades`)
  }

  return (
    <Screen label={CUESTIONARIO.titulo}>
      <AppBar title={CUESTIONARIO.titulo} subtitle={CUESTIONARIO.detalle} onBack={() => go(`clase/${clase.id}/actividades`)} />
      <Scroll pager>
        {!s.online && (
          <Notice type="prevent" icon="wifi_off" title="Perdiste la conexión">
            Tus respuestas siguen aquí. No cierres esta pantalla: podrás enviarlas cuando vuelva el internet.
          </Notice>
        )}
        <div className="m-col" style={{ gap: 6 }}>
          <div className="m-row cl-info"><Icon name="event" size={18} /><p className="t-body-sm">{CUESTIONARIO.plazo}</p></div>
          <div className="m-row cl-info"><Icon name="timer" size={18} /><p className="t-body-sm">{CUESTIONARIO.intentos} · Tiempo restante: {reloj(seg)}</p></div>
        </div>
        {PREGUNTAS.map((p, i) => (
          <section key={i} className="m-card" aria-label={`Pregunta ${i + 1} de ${PREGUNTAS.length}`}>
            <p className="t-label-sm" style={{ margin: 0, color: 'var(--on-surface-variant)', textTransform: 'uppercase' }}>Pregunta {i + 1} de {PREGUNTAS.length}</p>
            <div className="m-col" style={{ gap: 2 }}>
              <p className="t-title-md m-title">{p.texto}</p>
              <p className="t-body-sm m-muted">{p.multiple ? 'Puedes elegir varias respuestas.' : 'Elige una respuesta.'}</p>
            </div>
            <div className="m-col" role={p.multiple ? 'group' : 'radiogroup'} aria-label={p.texto}>
              {p.opciones.map((o, j) => (
                <div key={o} className="m-option">
                  {p.multiple
                    ? <Checkbox name={`p${i + 1}`} label={o} checked={resp[i]!.includes(j)} onChange={() => elegir(i, j, true)} />
                    : <Radio name={`p${i + 1}`} label={o} checked={resp[i]!.includes(j)} onChange={() => elegir(i, j, false)} />}
                </div>
              ))}
            </div>
          </section>
        ))}
      </Scroll>
      <PagerBar>
        <div className="m-col m-grow" style={{ alignItems: 'stretch', gap: 6 }}>
          <Button block icon="send" disabled={!s.online} onClick={enviar}>Enviar respuestas</Button>
          {!s.online && <p className="t-body-sm m-muted" style={{ textAlign: 'center' }}>Esperando conexión…</p>}
        </div>
      </PagerBar>
    </Screen>
  )
}
