import { useEffect, useState } from 'react'
import { KanoaMark, ProgressBar } from '../../ui'
import { Screen, Scroll } from '../../mobile'
import { go } from '../../app/router'
import { useApp } from '../../app/store'
import { PASOS_PREPARACION } from './data'
import './ingreso.css'

const DURACION_MS = 4000
const PASO_MS = 100

/** A04 · Preparando tus clases: primera sincronización. Avanza sola y al terminar abre el Inicio. */
export function Preparando() {
  const { s, set } = useApp()
  const [pct, setPct] = useState(0)

  useEffect(() => {
    // Sin internet la preparación queda en pausa, igual que las descargas.
    if (!s.online || pct >= 100) return
    const t = window.setTimeout(() => setPct((p) => Math.min(100, p + (100 * PASO_MS) / DURACION_MS)), PASO_MS)
    return () => window.clearTimeout(t)
  }, [pct, s.online])

  useEffect(() => {
    if (pct < 100) return
    const t = window.setTimeout(() => { set({ primeraSincronizacion: false }); go('inicio') }, 400)
    return () => window.clearTimeout(t)
  }, [pct, set])

  const n = PASOS_PREPARACION.length
  const estado = (i: number) => (pct >= ((i + 1) * 100) / n ? 'Listo' : pct >= (i * 100) / n ? 'En curso' : 'Pendiente')
  const valor = Math.round(pct)

  return (
    <Screen label="Preparando tus clases">
      <Scroll noNav center style={{ padding: 24, gap: 24 }}>
        <span className="ing-mark"><KanoaMark width={72} /></span>
        <div className="m-col" style={{ gap: 8 }}>
          <h1 className="t-headline-sm m-title ing-center">Estamos preparando tus clases</h1>
          <p className="t-body-md m-text ing-center">Esto pasa solo la primera vez. Después podrás ver esta información aunque no tengas internet.</p>
        </div>
        <section className="m-card" style={{ gap: 8 }} aria-label="Avance de la preparación">
          <div className="m-row" style={{ gap: 12 }}>
            <ProgressBar value={valor} label="Preparando tus clases" />
            <span className="t-label-md" style={{ color: 'var(--title)', flex: 'none' }}>{valor} %</span>
          </div>
          <ul className="m-list ing-pasos">
            {PASOS_PREPARACION.map((paso, i) => (
              <li key={paso} className="m-li">
                <span className="t-body-md m-grow">{paso}</span>
                <span className="t-body-sm">{estado(i)}</span>
              </li>
            ))}
          </ul>
        </section>
        <p className="t-body-sm m-text ing-center">No cierres la app mientras termina.</p>
      </Scroll>
    </Screen>
  )
}
