import { useState } from 'react'
import { Button, Checkbox } from '../../ui'
import { AppBar, PagerBar, Screen, Scroll } from '../../mobile'
import { go } from '../../app/router'
import { useApp } from '../../app/store'
import { DIAS_POCO_USO, DIAS_SIN_ABRIR, formatoMB, itemDe, textoUso, type ItemDescarga } from './data'
import { DlTile } from './Descargas'
import './descargas.css'

/** E05 · Liberar espacio: lo descargado, primero lo que menos se usa. El estudiante elige qué quitar. */
export function Liberar() {
  const { s, set, quitarDescarga, toast } = useApp()

  const items = Object.entries(s.descargas)
    .filter(([, d]) => d.estado === 'descargada')
    .map(([id]) => itemDe(id))
    .filter((i): i is ItemDescarga => i !== null)
    .sort((a, b) => (DIAS_SIN_ABRIR[b.id] ?? 0) - (DIAS_SIN_ABRIR[a.id] ?? 0))

  // Se preselecciona lo que no se abre hace tiempo; el estudiante decide.
  const [marcadas, setMarcadas] = useState<Set<string>>(() => new Set(items.filter((i) => (DIAS_SIN_ABRIR[i.id] ?? 0) >= DIAS_POCO_USO).map((i) => i.id)))
  const toggle = (id: string) => setMarcadas((m) => {
    const n = new Set(m)
    if (n.has(id)) n.delete(id); else n.add(id)
    return n
  })

  const elegidas = items.filter((i) => marcadas.has(i.id))
  const totalMB = elegidas.reduce((t, i) => t + i.tamanoMB, 0)

  const quitar = () => {
    if (!elegidas.length) return
    elegidas.forEach((i) => quitarDescarga(i.id))
    // quitarDescarga suma el espacio sobre el valor que conoce este render: se fija el total una sola vez al final.
    set({ libreMB: s.libreMB + totalMB })
    toast({ texto: `Liberaste ${formatoMB(totalMB)} en tu teléfono.`, tipo: 'success' })
    go('descargas')
  }

  return (
    <Screen label="Liberar espacio">
      <AppBar title="Liberar espacio" subtitle={`Quedan ${formatoMB(s.libreMB)} libres`} onBack={() => go('descargas')} style={{ background: 'var(--surface)' }} />
      <Scroll noNav style={{ paddingTop: 8, gap: 12, paddingBottom: 150 }}>
        <p className="t-body-md dl-liberar-intro">Elige qué quitar de tu teléfono. Primero te mostramos lo que menos usas. Tu avance no se pierde.</p>
        {items.length === 0 ? (
          <p className="t-body-md m-muted">No tienes clases descargadas.</p>
        ) : (
          <div className="m-card" style={{ padding: '4px 16px' }}>
            <div className="m-list">
              {items.map((i) => {
                const uso = textoUso(i.id)
                const poco = (DIAS_SIN_ABRIR[i.id] ?? 0) >= DIAS_POCO_USO
                return (
                  <div key={i.id} className="m-li dl-check" onClick={() => toggle(i.id)}>
                    <span onClick={(e) => e.stopPropagation()}>
                      <Checkbox label="" aria-label={`Quitar «${i.titulo}», ${formatoMB(i.tamanoMB)}`} checked={marcadas.has(i.id)} onChange={() => toggle(i.id)} />
                    </span>
                    <DlTile item={i} />
                    <span className="m-col m-grow" style={{ gap: 0 }}>
                      <span className="t-title-sm m-title">{i.titulo}</span>
                      <span className="t-body-sm m-muted">{i.area.nombre} · {formatoMB(i.tamanoMB)}</span>
                      {uso && <span className="t-body-sm" style={{ color: poco ? 'var(--prevent)' : 'var(--muted)' }}>{uso}</span>}
                    </span>
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </Scroll>
      <PagerBar>
        <div className="m-col m-grow dl-pager">
          <div className="m-row">
            <p className="t-body-md m-grow" style={{ margin: 0 }}>Vas a liberar</p>
            <p className="t-title-md m-title">{formatoMB(totalMB)}</p>
          </div>
          <Button block icon="delete" disabled={!elegidas.length} onClick={quitar}>Quitar del teléfono ({elegidas.length})</Button>
        </div>
      </PagerBar>
    </Screen>
  )
}
