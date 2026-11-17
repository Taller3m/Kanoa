import { useEffect, useId, useState, type ReactNode } from 'react'
import type { EditorProps } from '../types'
import { Button, ConfirmDialog, Icon, Select, Switch, Tabs, TextField } from '../../ui'
import { EMO_CAT, EMOCIONES, EMOJI, repVisible } from './catalog'
import {
  MEMO_GRID, MEMO_MAX_NIVELES, MEMO_MODOS, MEMO_PAREJAS,
  blankItem, blankItemTipo, defA, defB, lvLoad, lvSync, memoNiveles, syncRep,
} from './defaults'
import { parOk } from './rules'
import type { MemoItem } from './types'
import './memo.css'

const cx = (...a: (string | false | null | undefined)[]) => a.filter(Boolean).join(' ')

/** Opción de grupo de radios nativos con aspecto de tarjeta o de píldora. */
function Opt({ name, checked, onChange, variant, children }: {
  name: string; checked: boolean; onChange: () => void; variant: 'card' | 'pill'; children: ReactNode
}) {
  return (
    <label className={cx('me-opt', `me-opt--${variant}`)}>
      <input type="radio" className="me-sr" name={name} checked={checked} onChange={onChange} />
      {children}
    </label>
  )
}

const Req = () => <span className="me-req" aria-hidden="true">*</span>

interface Confirmacion { title: string; msg: string; yes: () => void }

/** Paso 2 «Configuración» del juego «Memoria». */
export function MemoEditor({ game, update }: EditorProps) {
  const uid = useId()
  const m = game.memo
  const lvI = m.lv || 0
  const lvs = memoNiveles(m)
  const lvLow = `nivel ${lvI + 1}`
  const rep = m.rep || 'Emoji'
  const msgModo = m.msgModo || 'cada'
  const cada = msgModo === 'cada'
  const contNow = m.modo === 'Idénticos' ? (m.items[0]?.a.tipo || 'Imagen') : null
  const [cf, setCf] = useState<Confirmacion | null>(null)
  const ask = (title: string, msg: string, yes: () => void) => setCf({ title, msg, yes })

  /* Límite de errores: texto local; se confirma al salir del campo o si es un número válido */
  const [nTxt, setNTxt] = useState(String(m.intentos.n))
  useEffect(() => { setNTxt(String(m.intentos.n)) }, [m.intentos.n])
  const setN = (n: number) => update((d) => { d.memo.intentos.n = n })
  const clampN = (v: string) => Math.max(1, Math.min(50, Number(v) || 1))

  const setModo = (t: string) => {
    if (t === m.modo) return
    update((d) => {
      const mm = d.memo
      mm.modo = t
      const mp = (it: MemoItem): MemoItem => ({
        a: { tipo: defA(t), v: it.a.tipo === defA(t) ? it.a.v : '' },
        b: { tipo: defB(t), v: it.b.tipo === defB(t) ? it.b.v : '' },
        msg: it.msg,
      })
      lvSync(mm)
      mm.lvs!.forEach((L) => { L.items = L.items.map(mp) })
      lvLoad(mm, mm.lv!)
      if (!mm.rep) mm.rep = 'Emoji'
      syncRep(mm)
    })
  }

  const setContenido = (t: string) => {
    if (t === contNow) return
    const go = () => update((d) => {
      const mm = d.memo
      lvSync(mm)
      mm.lvs!.forEach((L) => { L.items = L.items.map((it) => ({ a: { tipo: t, v: '' }, b: { tipo: 'Igual', v: '' }, msg: it.msg })) })
      lvLoad(mm, mm.lv!)
    })
    if (m.items.some((it) => (it.a.v || '').trim())) ask('Cambiar contenido', 'Se borrará el contenido de las parejas. ¿Deseas continuar?', go)
    else go()
  }

  const setRepImg = () => update((d) => { d.memo.rep = 'Imagen'; syncRep(d.memo) })
  const setRepEmoji = () => {
    if (rep === 'Emoji') return
    const go = () => update((d) => { d.memo.rep = 'Emoji'; d.memo.items.forEach((it) => { it.a.img = '' }); syncRep(d.memo) })
    if (m.items.some((it) => it.a.img)) ask('Cambiar representación', 'Se quitarán las imágenes cargadas. ¿Deseas continuar?', go)
    else go()
  }

  const setParejas = (n: number) => update((d) => {
    const mm = d.memo, it = mm.items
    const t0 = mm.modo === 'Idénticos' ? (it[0]?.a.tipo || 'Imagen') : null
    while (it.length < n) it.push(t0 ? blankItemTipo(t0) : blankItem(mm.modo))
    it.length = n
    mm.parejas = n
    syncRep(mm)
  })

  const pickLv = (i: number) => {
    if (i === lvI) return
    update((d) => { lvSync(d.memo); lvLoad(d.memo, i) })
  }
  const addLv = () => update((d) => {
    const mm = d.memo
    lvSync(mm)
    const prev = mm.lvs![mm.lvs!.length - 1]!
    const n = MEMO_PAREJAS.find((x) => x > prev.parejas) || 12
    const t0 = mm.modo === 'Idénticos' ? (prev.items[0]?.a.tipo || 'Imagen') : null
    mm.lvs!.push({
      parejas: n, items: Array.from({ length: n }, () => (t0 ? blankItemTipo(t0) : blankItem(mm.modo))),
      tiempo: JSON.parse(JSON.stringify(prev.tiempo)),
    })
    lvLoad(mm, mm.lvs!.length - 1)
    syncRep(mm)
  })
  const delLv = () => ask(`Quitar nivel ${lvI + 1}`, `¿Estás seguro de que deseas quitar el nivel ${lvI + 1}? Se borrarán sus parejas.`, () => update((d) => {
    const mm = d.memo
    lvSync(mm)
    mm.lvs!.splice(mm.lv!, 1)
    lvLoad(mm, Math.min(mm.lv!, mm.lvs!.length - 1))
  }))

  const gs = MEMO_GRID[m.parejas]
  const gridSug = gs
    ? `${m.parejas * 2} cartas · tablero sugerido de ${gs[0]} filas × ${gs[1]} columnas`
    : `${m.parejas * 2} cartas`

  const paresHelp = ({
    'Idénticos': 'Configura la carta A de cada pareja; el sistema la duplica para formarla.',
    'Concepto – definición': 'Escribe el concepto en la carta A y su definición en la carta B.',
    'Imagen – texto': 'Sube la imagen en la carta A y escribe la palabra que la nombra en la carta B.',
  } as Record<string, string>)[m.modo]

  const IP = (k: number, fn: (it: MemoItem) => void) => update((d) => { fn(d.memo.items[k]!) })
  const contOpts: [string, string][] = [['Imagen', 'image'], ['Texto', 'text_fields'], ['Emoción', 'mood']]
  const tiempoOpts = [1, 2, 3, 5].map((n) => ({ value: String(n), label: n === 1 ? '1 minuto' : `${n} minutos` }))

  return (
    <div className="me">
      <h2 className="me-h2 t-section">Configuración del tablero</h2>

      <div role="radiogroup" aria-labelledby={`${uid}-modo`} className="me-group">
        <div className="me-label t-title-sm" id={`${uid}-modo`}>Tipo de emparejamiento <Req /></div>
        <div className="me-grid me-grid--modos">
          {MEMO_MODOS.map(([t, d]) => (
            <Opt key={t} name={`${uid}-modo`} variant="card" checked={t === m.modo} onChange={() => setModo(t)}>
              <span className="t-title-sm">{t}</span>
              <span className="me-muted t-body-sm">{d}</span>
            </Opt>
          ))}
        </div>
      </div>

      {m.modo === 'Idénticos' && (
        <div role="radiogroup" aria-labelledby={`${uid}-cont`} aria-describedby={`${uid}-cont-h`} className="me-group">
          <div className="me-label t-title-sm" id={`${uid}-cont`}>Contenido de las cartas <Req /></div>
          <div className="me-help t-body-sm" id={`${uid}-cont-h`}>Todas las parejas usan el mismo tipo de contenido.</div>
          <div className="me-row-wrap">
            {contOpts.map(([t, ic]) => (
              <Opt key={t} name={`${uid}-cont`} variant="pill" checked={t === contNow} onChange={() => setContenido(t)}>
                <Icon name={ic} size={18} />{t}
              </Opt>
            ))}
          </div>
        </div>
      )}

      {repVisible(m.modo) && (
        <div role="radiogroup" aria-labelledby={`${uid}-rep`} aria-describedby={`${uid}-rep-h`} className="me-group">
          <div className="me-label t-title-sm" id={`${uid}-rep`}>Representación de las emociones <Req /></div>
          <div className="me-grid me-grid--rep">
            <Opt name={`${uid}-rep`} variant="card" checked={rep === 'Emoji'} onChange={setRepEmoji}>
              <span className="t-title-sm"><span aria-hidden="true">😄</span> Emoji</span>
              <span className="me-muted t-body-sm">Usa el emoji del catálogo para cada emoción.</span>
            </Opt>
            <Opt name={`${uid}-rep`} variant="card" checked={rep === 'Imagen'} onChange={setRepImg}>
              <span className="t-title-sm"><Icon name="image" size={20} /> Imagen propia</span>
              <span className="me-muted t-body-sm">Carga una imagen de referencia por emoción.</span>
            </Opt>
          </div>
          <div className="me-help t-body-sm" id={`${uid}-rep-h`}>Se aplica a todo el juego. La emoción siempre se elige del catálogo.</div>
        </div>
      )}

      <section className="me-panel" aria-labelledby={`${uid}-lv`}>
        <div>
          <h3 className="me-label t-title-sm" id={`${uid}-lv`}>Niveles de dificultad</h3>
          <p className="me-help t-body-sm">El nivel 1 es obligatorio y puedes agregar hasta 2 niveles más. Cada nivel tiene su número de parejas, sus parejas y su tiempo límite. El tipo de emparejamiento, el contenido de las cartas, los mensajes y el límite de errores son los mismos para todos los niveles.</p>
        </div>
        <div className="me-row-wrap">
          <Tabs pill label="Niveles de dificultad" value={String(lvI)} onChange={(id) => pickLv(Number(id))}
            tabs={lvs.map((_, i) => ({ id: String(i), label: `Nivel ${i + 1}${i === 0 ? ' *' : ''}` }))} />
          {lvs.length < MEMO_MAX_NIVELES && <Button variant="outline" icon="add" onClick={addLv}>AGREGAR NIVEL</Button>}
          {lvI > 0 && <Button variant="text" tone="error" icon="delete" onClick={delLv}>Quitar {lvLow}</Button>}
        </div>
      </section>

      <div role="radiogroup" aria-labelledby={`${uid}-par`} aria-describedby={`${uid}-par-h`} className="me-group">
        <div className="me-label t-title-sm" id={`${uid}-par`}>Número de parejas <Req /> <span className="me-muted">· {lvLow}</span></div>
        <div className="me-row-wrap">
          {MEMO_PAREJAS.map((n) => (
            <Opt key={n} name={`${uid}-par`} variant="pill" checked={n === m.parejas} onChange={() => setParejas(n)}>{n}</Opt>
          ))}
        </div>
        <div className="me-help t-body-sm" id={`${uid}-par-h`}>{gridSug}</div>
      </div>

      <div className="me-grid me-grid--cfg">
        <section className="me-panel">
          <Switch label={`Tiempo límite · ${lvLow}`} checked={m.tiempo.on} onChange={() => update((d) => { d.memo.tiempo.on = !d.memo.tiempo.on })} />
          {m.tiempo.on && (
            <div className="me-inline">
              <Select aria-label="Minutos de tiempo límite" className="me-w-select" options={tiempoOpts} value={String(m.tiempo.min)}
                onChange={(e) => { const x = Number(e.target.value); update((d) => { d.memo.tiempo.min = x }) }} />
              <span className="me-muted t-body-md">Cuenta regresiva visible para el jugador.</span>
            </div>
          )}
        </section>
        <section className="me-panel">
          <Switch label="Límite de errores" checked={m.intentos.on} onChange={() => update((d) => { d.memo.intentos.on = !d.memo.intentos.on })} />
          {m.intentos.on && (
            <div className="me-inline">
              <TextField aria-label="Errores permitidos" className="me-w-num" type="number" min={1} max={50} value={nTxt}
                onChange={(e) => {
                  setNTxt(e.target.value)
                  const n = Number(e.target.value)
                  if (Number.isInteger(n) && n >= 1 && n <= 50) setN(n)
                }}
                onBlur={() => { const n = clampN(nTxt); setNTxt(String(n)); setN(n) }} />
              <span className="me-muted t-body-md">errores permitidos antes de perder.</span>
            </div>
          )}
        </section>
      </div>

      <section className="me-panel" aria-labelledby={`${uid}-msg`}>
        <div className="me-split">
          <div>
            <h3 className="me-label t-title-sm" id={`${uid}-msg`}>Mensaje al encontrar una pareja <span className="me-muted">(opcional)</span></h3>
            <p className="me-help t-body-sm">Se muestra cada vez que el jugador encuentra una pareja.</p>
          </div>
          <div role="radiogroup" aria-labelledby={`${uid}-msg`} className="me-seg">
            <Opt name={`${uid}-msgm`} variant="pill" checked={msgModo === 'uno'} onChange={() => update((d) => { d.memo.msgModo = 'uno' })}>Mismo para todas</Opt>
            <Opt name={`${uid}-msgm`} variant="pill" checked={cada} onChange={() => update((d) => { d.memo.msgModo = 'cada' })}>Uno por pareja</Opt>
          </div>
        </div>
        {msgModo === 'uno' && (
          <div>
            <TextField aria-label="Mensaje al encontrar una pareja" aria-describedby={`${uid}-msg-h`} value={m.msgGlobal || ''} maxLength={120}
              placeholder="Ej. ¡Muy bien! Encontraste una pareja." size="medium"
              onChange={(e) => { const x = e.target.value; update((d) => { d.memo.msgGlobal = x }) }} />
            <div className="me-split me-help t-body-sm" id={`${uid}-msg-h`}>
              <span>Si lo dejas vacío, no se muestra ningún mensaje.</span><span>{(m.msgGlobal || '').length}/120</span>
            </div>
          </div>
        )}
        {cada && <p className="me-help t-body-sm">Escribe el mensaje de cada pareja en la tabla. Las parejas sin mensaje no muestran nada.</p>}
      </section>

      <div className="me-group">
        <h2 className="me-h2 t-section">Parejas del {lvLow}</h2>
        <p className="me-help t-body-md">{paresHelp}</p>
      </div>
      <div className={cx('me-table', cada && 'me-table--cada')} role="table" aria-label={`Parejas del ${lvLow}`}>
        <div className="me-tr me-tr--head" role="row">
          <div role="columnheader">Pareja</div><div role="columnheader">Carta A</div><div role="columnheader">Carta B</div>
          {cada && <div role="columnheader">Mensaje al encontrarla</div>}
        </div>
        {m.items.map((it, k) => {
          const ok = parOk(it)
          const n = k + 1
          return (
            <div className="me-tr" role="row" key={k}>
              <div className="me-td me-td--n" role="cell">
                <span className={cx('me-dot', ok ? 'me-dot--ok' : 'me-dot--no')} role="img" aria-label={ok ? 'Pareja completa' : 'Pareja incompleta'} />
                <span className="t-title-sm">{n}</span>
              </div>
              <div className="me-td" role="cell">
                <span className="me-lbl" aria-hidden="true">Carta A</span>
                <div className="me-carta">{cartaA(it, k)}</div>
              </div>
              <div className="me-td" role="cell">
                <span className="me-lbl" aria-hidden="true">Carta B</span>
                <div className="me-carta">{cartaB(it, k)}</div>
              </div>
              {cada && (
                <div className="me-td" role="cell">
                  <span className="me-lbl" aria-hidden="true">Mensaje al encontrarla</span>
                  <TextField aria-label={`Mensaje de la pareja ${n}`} value={it.msg} maxLength={120} placeholder="Ej. ¡Bien! Encontraste la alegría."
                    onChange={(e) => { const x = e.target.value; IP(k, (o) => { o.msg = x }) }} />
                </div>
              )}
            </div>
          )
        })}
      </div>
      <p className="me-help t-body-sm">Al iniciar el juego, el sistema duplica y mezcla las cartas en el tablero de forma aleatoria.</p>

      <ConfirmDialog open={!!cf} title={cf?.title ?? ''} message={cf?.msg ?? ''}
        onCancel={() => setCf(null)} onConfirm={() => { const y = cf?.yes; setCf(null); y?.() }} />
    </div>
  )

  function cartaA(it: MemoItem, k: number): ReactNode {
    const n = k + 1
    const t = it.a.tipo
    if (t === 'Texto') {
      return <TextField aria-label={`Texto de la carta A, pareja ${n}`} value={it.a.v} maxLength={60}
        placeholder={m.modo === 'Concepto – definición' ? 'Ej. Bogotá' : 'Texto de la carta'}
        onChange={(e) => { const x = e.target.value; IP(k, (o) => { o.a.v = x }) }} />
    }
    if (t === 'Imagen' || t === 'Audio') {
      const lbl = it.a.v ? it.a.v : (t === 'Audio' ? 'AÑADIR AUDIO' : 'AÑADIR IMAGEN')
      return (
        <button type="button" className={cx('me-file', it.a.v && 'me-file--set')} aria-label={it.a.v ? `Quitar ${it.a.v}, pareja ${n}` : `${lbl}, pareja ${n}`}
          onClick={() => IP(k, (o) => { o.a.v = o.a.v ? '' : (o.a.tipo === 'Audio' ? `audio-pareja-${n}.mp3` : `imagen-pareja-${n}.png`) })}>
          <Icon name={it.a.v ? 'close' : 'add'} size={18} /><span className="me-file__t">{lbl}</span>
        </button>
      )
    }
    if (t === 'Emoción') {
      return (
        <>
          <Select aria-label={`Emoción de la pareja ${n}`} className="me-grow" placeholder="Selecciona una emoción" value={it.a.v}
            options={EMOCIONES.map((e) => ({ value: e, label: e }))}
            onChange={(e) => { const x = e.target.value; IP(k, (o) => { o.a.v = x }) }} />
          {rep === 'Emoji' && !!it.a.v && (
            <span className={cx('me-emo', `me-emo--${EMO_CAT[it.a.v] ?? 'none'}`)} role="img" aria-label={it.a.v} title={it.a.v}>{EMOJI[it.a.v] || ''}</span>
          )}
          {rep === 'Imagen' && (
            <button type="button" className={cx('me-file me-file--emo', it.a.img && 'me-file--set')}
              aria-label={it.a.img ? `Quitar ${it.a.img}, pareja ${n}` : `AÑADIR IMAGEN, pareja ${n}`}
              onClick={() => IP(k, (o) => { o.a.img = o.a.img ? '' : `emocion-${n}.png` })}>
              <Icon name={it.a.img ? 'close' : 'add'} size={18} /><span className="me-file__t">{it.a.img || 'AÑADIR IMAGEN'}</span>
            </button>
          )}
        </>
      )
    }
    return null
  }

  function cartaB(it: MemoItem, k: number): ReactNode {
    const t = it.b.tipo
    if (t === 'Igual') return <span className="me-muted t-body-sm">Igual a la carta A (se duplica automáticamente)</span>
    if (t === 'Nombre') return <span><strong className="t-title-sm">{it.a.v || '—'}</strong><span className="me-muted t-body-sm"> · nombre de la emoción (automático)</span></span>
    if (t === 'Texto') {
      return <TextField aria-label={`Texto de la carta B, pareja ${k + 1}`} className="me-grow" value={it.b.v} maxLength={80}
        placeholder={m.modo === 'Concepto – definición' ? 'Ej. Capital de Colombia' : 'Ej. Café'}
        onChange={(e) => { const x = e.target.value; IP(k, (o) => { o.b.v = x }) }} />
    }
    return null
  }
}
