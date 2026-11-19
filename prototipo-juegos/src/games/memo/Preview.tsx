import { useEffect, useMemo, useRef, useState } from 'react'
import { Button, Icon, Message } from '../../ui'
import { CIERRE_DEFECTO, PvDone, PvHeader, PvHelp, PvStart, useHelp, type PreviewProps } from '../preview/Shell'
import { EMO_CAT, EMOJI } from './catalog'
import { MEMO_GRID, fixMemo, lvSync } from './defaults'
import { parOk } from './rules'
import type { MemoData, MemoItem } from './types'
import personaje from '../../assets/personaje-logro.svg?raw'
import './pv.css'

const cx = (...a: (string | false | null | undefined)[]) => a.filter(Boolean).join(' ')

interface Card { pid: number; side: 'a' | 'b' }
interface S {
  lv: number; deck: Card[]; started: boolean; openC: number[]; matched: number[]; errors: number; lock: boolean
  pairMsg: string; pairPause: boolean; allDone: boolean; done: boolean; lost: boolean; lostWhy: '' | 'tiempo' | 'errores'
  tLeft: number | null; say: string
}

const MEDAL = { Bronce: 'mep-medal--bronce', Plata: 'mep-medal--plata', Oro: 'mep-medal--oro' } as const
const MEDAL_N = { Bronce: 3, Plata: 2, Oro: 1 } as const

/** Mezcla Fisher-Yates de las cartas de las parejas completas del nivel (equivale a `deck`). */
function mkDeck(items: MemoItem[]): Card[] {
  const d: Card[] = []
  items.forEach((x, i) => { if (parOk(x)) { d.push({ pid: i, side: 'a' }); d.push({ pid: i, side: 'b' }) } })
  for (let i = d.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [d[i], d[j]] = [d[j]!, d[i]!] }
  return d
}

/** Vista previa jugable del juego «Memoria». */
export function MemoPreview({ game }: PreviewProps) {
  const base = useMemo<MemoData>(() => {
    const g = fixMemo(JSON.parse(JSON.stringify(game)))
    return lvSync(g.memo)
  }, [game])
  const lvs = base.lvs!
  const lvN = lvs.length
  const mkState = (lv: number): S => {
    const L = lvs[lv]!
    return {
      lv, deck: mkDeck(L.items), started: !L.tiempo.on, openC: [], matched: [], errors: 0, lock: false, pairMsg: '', pairPause: false,
      allDone: false, done: false, lost: false, lostWhy: '', tLeft: L.tiempo.on ? L.tiempo.min * 60 : null, say: '',
    }
  }
  const [s, setS] = useState<S>(() => mkState(0))
  const [homeMsg, setHomeMsg] = useState(false)
  const help = useHelp()
  const lvAt = s.lv
  const L = lvs[lvAt]!
  const items = L.items
  const lvMid = s.done && !s.lost && lvAt < lvN - 1
  const total = new Set(s.deck.map((x) => x.pid)).size
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)
  useEffect(() => () => { if (timer.current) clearTimeout(timer.current) }, [])

  /* Cuenta regresiva: en pausa con la ayuda abierta, el mensaje de pareja, el tablero resuelto o la pestaña oculta */
  const running = s.started && !s.done && !s.allDone && !s.pairPause && !help.open && s.tLeft != null
  useEffect(() => {
    if (!running) return
    const id = setInterval(() => {
      if (document.hidden) return
      setS((p) => {
        if (p.done || p.tLeft == null) return p
        const t = p.tLeft - 1
        return t <= 0
          ? { ...p, tLeft: 0, lost: true, lostWhy: 'tiempo', done: true, lock: false, openC: [], say: 'Se acabó el tiempo' }
          : { ...p, tLeft: t }
      })
    }, 1000)
    return () => clearInterval(id)
  }, [running])

  /* El foco pasa a CONTINUAR cuando aparece el mensaje de pareja */
  const goRef = useRef<HTMLDivElement>(null)
  useEffect(() => { if (s.pairPause) goRef.current?.querySelector("button")?.focus() }, [s.pairPause])

  const flip = (i: number) => {
    const p = s
    if (!p.started || help.open || p.pairPause || p.allDone || p.lock || p.done || p.openC.includes(i) || p.matched.includes(p.deck[i]!.pid)) return
    const o = [...p.openC, i]
    if (o.length < 2) { setS({ ...p, openC: o, pairMsg: '' }); return }
    const [a, b] = o as [number, number]
    if (p.deck[a]!.pid === p.deck[b]!.pid) {
      const pid = p.deck[a]!.pid
      const m = [...p.matched, pid]
      const fin = m.length === total
      const msg = ((base.msgModo === 'uno' ? base.msgGlobal : items[pid]!.msg) || '').trim()
      setS({ ...p, openC: [], matched: m, pairMsg: msg, pairPause: !fin && !!msg, allDone: fin, say: fin ? 'Encontraste todas las parejas' : 'Pareja encontrada' })
    } else {
      const e = p.errors + 1
      setS({ ...p, openC: o, errors: e, lock: true, say: 'No es una pareja' })
      timer.current = setTimeout(() => {
        const lost = base.intentos.on && e >= base.intentos.n
        setS((q) => q.done ? q : { ...q, openC: [], lock: false, lost, lostWhy: lost ? 'errores' : '', done: lost, say: lost ? 'Se acabaron los intentos' : '' })
      }, 1000)
    }
  }

  const nextLv = () => setS(mkState(lvAt + 1))
  const replay = () => { if (timer.current) clearTimeout(timer.current); setHomeMsg(false); setS(mkState(0)) }

  /* Medalla: Bronce/Plata en niveles intermedios, Oro al terminar */
  const medalName = lvMid ? (lvN === 3 ? (['Bronce', 'Plata'] as const)[lvAt]! : 'Plata') : 'Oro'
  /* El nombre de la medalla va en la cinta del personaje; con nivel el texto es más largo y baja de tamaño */
  const cinta = `MEDALLA DE ${medalName.toUpperCase()}${lvN > 1 ? ` · NIVEL ${lvAt + 1}` : ''}`
  const figura = personaje.replaceAll('{{N}}', String(MEDAL_N[medalName])).replace('{{T}}', cinta)
    .replace('{{FS}}', lvN > 1 ? '10' : '13').replace('{{DY}}', lvN > 1 ? '-0.9' : '0')
  const instr = (game.desc || '').trim() || 'Voltea dos cartas a la vez y encuentra todas las parejas.'
  const mmin = L.tiempo.on ? L.tiempo.min : 0

  const lvLine = (lvN > 1 ? `Nivel ${lvAt + 1} de ${lvN} · ` : '') + `Parejas: ${s.matched.length} de ${total} · Errores: ${s.errors}${base.intentos.on ? ` de ${base.intentos.n}` : ''}`
  const cols = MEMO_GRID[L.parejas]?.[1] ?? 4
  const tl = s.tLeft
  const warn = tl != null && tl <= 15
  const tot = L.tiempo.min * 60

  const faceOf = (c: Card) => {
    const it = items[c.pid]!
    const f = (c.side === 'a' || it.b.tipo === 'Igual') ? it.a : it.b
    const isNom = f.tipo === 'Nombre'
    const emo = f.tipo === 'Emoción'
    const useImg = emo && base.rep === 'Imagen'
    const txt = isNom ? it.a.v : emo ? (useImg ? `Imagen · ${f.img || ''}` : f.v) : f.tipo === 'Imagen' ? `Imagen · ${f.v}` : f.tipo === 'Audio' ? 'Audio' : f.v
    const big = emo && !useImg ? (EMOJI[f.v] || '') : ''
    const tone = emo ? (useImg ? 'img' : (EMO_CAT[f.v] ?? 'none')) : f.tipo === 'Imagen' ? 'img' : 'txt'
    return { txt, big, tone, audio: f.tipo === 'Audio' }
  }

  const gameBody = () => {
    if (!s.deck.length) return <Message type="prevent">Completa al menos una pareja para ver la vista previa.</Message>
    return (
      <div className="mep-play">
        <div className="mep-stats">
          <span className="t-body-md">{lvLine}</span>
          {tl != null && (
            <span role="timer" aria-label="Tiempo restante" className={cx('mep-timer', warn && 'mep-timer--warn')}>
              <Icon name={warn ? 'warning' : 'timer'} size={20} />{Math.floor(tl / 60)}:{String(tl % 60).padStart(2, '0')}
            </span>
          )}
        </div>
        {tl != null && <div className={cx('mep-bar', warn && 'mep-bar--warn')} aria-hidden="true"><div style={{ width: `${tot ? Math.round(tl / tot * 100) : 0}%` }} /></div>}
        <div className="mep-wrap" style={{ ['--cols' as string]: cols }}>
          <div className="mep-grid" role="group" aria-label="Tablero de cartas" inert={s.pairPause}>
            {s.deck.map((c, i) => {
              const mt = s.matched.includes(c.pid)
              const up = s.openC.includes(i) || mt
              const f = faceOf(c)
              const label = f.audio ? 'Audio' : f.big ? `${f.txt} ${f.big}`.trim() : f.txt
              const name = mt ? `Carta ${i + 1}, emparejada: ${label}` : up ? `Carta ${i + 1}, mostrando ${label}` : `Carta ${i + 1}, boca abajo`
              return (
                <button key={i} type="button" className={cx('mep-card', up && 'mep-card--up', mt && 'mep-card--ok')} aria-label={name}
                  aria-disabled={mt || up || s.lock || undefined} onClick={() => flip(i)}>
                  <span className="mep-card__in" aria-hidden="true">
                    <span className="mep-face mep-face--back" data-mark={base.dorso ? undefined : 'KL'}>{base.dorso ? <Icon name="image" size={28} /> : null}</span>
                    <span className={cx('mep-face mep-face--front', `mep-hue--${c.pid % 7}`)}>
                      {f.big && <span className="mep-face__big">{f.big}</span>}
                      {f.audio && <Icon name="music_note" size={28} />}
                      <span>{f.txt}</span>
                      {mt && <Icon name="check_circle" size={20} className="mep-face__ok" />}
                    </span>
                  </span>
                </button>
              )
            })}
          </div>
          {s.pairPause && (
            <div className="mep-pause">
              <div className="mep-pause__box" role="status" ref={goRef}>
                <h3 className="t-title-lg mep-h">¡Lo lograste!</h3>
                {s.pairMsg && <p className="t-body-md mep-p">{s.pairMsg}</p>}
                {tl != null && <p className="t-body-sm mep-muted">El tiempo está en pausa mientras lees.</p>}
                <Button onClick={() => setS({ ...s, pairPause: false, pairMsg: '' })}>CONTINUAR</Button>
              </div>
            </div>
          )}
        </div>
        {s.allDone && (
          <div className="mep-banner" role="status">
            <div className="mep-banner__txt">
              <Icon name="check_circle" size={28} />
              <div>
                <div className="t-title-md">{lvN > 1 && lvAt < lvN - 1 ? `¡Superaste el nivel ${lvAt + 1}!` : '¡Encontraste todas las parejas!'}</div>
                {s.pairMsg && <div className="t-body-md mep-p">{s.pairMsg}</div>}
              </div>
            </div>
            <Button onClick={() => setS({ ...s, allDone: false, done: true })}>VER RESULTADO</Button>
          </div>
        )}
      </div>
    )
  }

  const doneTitle = s.lost ? (s.lostWhy === 'tiempo' ? 'Se acabó el tiempo' : 'Se acabaron los intentos') : lvMid ? `¡Superaste el nivel ${lvAt + 1}!` : '¡Terminaste el juego!'
  const doneCierre = s.lost ? 'Puedes volver a intentarlo cuando quieras.'
    : lvMid ? `En el nivel ${lvAt + 2} tendrás ${lvs[lvAt + 1]!.parejas} parejas por encontrar.` : ((game.cierre || '').trim() || CIERRE_DEFECTO)

  return (
    <div className="pv-stage">
      <PvHeader game={game} onHelp={help.show} />
      <div className="mep-sr" role="status" aria-live="polite">{s.say}</div>

      {!s.done && !s.started && (
        <PvStart instr={instr} info={`${lvN > 1 ? `Nivel ${lvAt + 1} · ` : ''}${L.parejas} parejas · ${mmin} ${mmin > 1 ? 'minutos' : 'minuto'}`}
          onStart={() => setS({ ...s, started: true })} />
      )}
      {!s.done && s.started && gameBody()}
      {s.done && (
        <PvDone title={doneTitle} cierre={doneCierre}
          medal={!s.lost ? (
            <div className="mep-medalbox">
              <div className={cx('mep-medal', MEDAL[medalName])}>
                <div className="mep-medal__fig" role="img"
                  aria-label={`Personaje celebrando con ${medalName === 'Oro' ? 'la copa y ' : ''}la medalla de ${medalName.toLowerCase()}${lvN > 1 ? `, nivel ${lvAt + 1}` : ''}`}
                  dangerouslySetInnerHTML={{ __html: figura }} />
              </div>
            </div>
          ) : undefined}
          onNext={lvMid ? nextLv : undefined} nextLabel={`IR AL NIVEL ${lvAt + 2}`}
          onReplay={lvMid ? undefined : replay} onHome={lvMid ? undefined : () => setHomeMsg(true)} />
      )}
      {homeMsg && s.done && <div className="mep-home"><Message type="primary">Lleva al visitante al inicio de la página donde está el juego.</Message></div>}

      <PvHelp open={help.open} onClose={help.hide}><p className="t-body-md mep-p">{instr}</p></PvHelp>
    </div>
  )
}

