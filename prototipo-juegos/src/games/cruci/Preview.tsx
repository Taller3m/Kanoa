import { useRef, useState, type KeyboardEvent } from 'react'
import { Button, Divider, Icon, Message } from '../../ui'
import completado from '../../assets/juego-completado.svg?raw'
import { CIERRE_DEFECTO, PvDone, PvHeader, PvHelp, useHelp, type PreviewProps } from '../preview/Shell'
import { cruciBuildMap, cruciKey, cruciNorm, cruciNumerar } from './rules'
import './pv.css'

const INSTR_DEFECTO = 'Lee cada pista y escribe la palabra en el tablero. Cuando termines, selecciona COMPROBAR.'

/**
 * Vista previa jugable: «así lo verá el visitante».
 * El crucigrama no tiene pantalla INICIAR, tiempo ni límite de intentos: el tablero se muestra de inmediato (HU-PW-174).
 */
export function CruciPreview({ game, onClose }: PreviewProps) {
  const help = useHelp()
  const [done, setDone] = useState(false)
  const [letters, setLetters] = useState<Record<string, string>>({})
  const [checked, setChecked] = useState(false)
  /** Resultado de COMPROBAR: letras incorrectas y casillas vacías (null = sin comprobar). */
  const [fallos, setFallos] = useState<{ malas: number; vacias: number } | null>(null)
  const boardRef = useRef<HTMLDivElement>(null)

  const N = game.cruci.size
  const words = game.cruci.words
  const map = cruciBuildMap(words)
  const nm = cruciNumerar(words)
  const instr = game.desc.trim() || INSTR_DEFECTO

  const reset = () => { setDone(false); setLetters({}); setChecked(false); setFallos(null) }

  const check = () => {
    const bad = Object.keys(map).filter((k) => (letters[k] || '') !== map[k].L)
    if (!bad.length) { setDone(true); return }
    const vacias = bad.filter((k) => !letters[k]).length
    setChecked(true); setFallos({ malas: bad.length - vacias, vacias })
  }

  const move = (e: KeyboardEvent<HTMLInputElement>, r: number, c: number) => {
    const d: Record<string, [number, number]> = { ArrowLeft: [0, -1], ArrowRight: [0, 1], ArrowUp: [-1, 0], ArrowDown: [1, 0] }
    const v = d[e.key]
    if (!v) return
    e.preventDefault()
    let rr = r + v[0], cc = c + v[1]
    while (rr >= 0 && cc >= 0 && rr < N && cc < N) {
      const el = boardRef.current?.querySelector<HTMLInputElement>(`[data-k="${cruciKey(rr, cc)}"]`)
      if (el) { el.focus(); el.select(); return }
      rr += v[0]; cc += v[1]
    }
  }

  const clues = (dir: 'H' | 'V') => words.filter((w) => w.dir === dir).sort((a, b) => nm.byId[a.id] - nm.byId[b.id])

  const cells = []
  for (let r = 0; r < N; r++) {
    for (let c = 0; c < N; c++) {
      const k = cruciKey(r, c)
      const m = map[k]
      if (!m) { cells.push(<div key={k} className="crp-cell crp-cell--black" aria-hidden="true" />); continue }
      const val = letters[k] || ''
      const wrong = checked && val !== m.L
      const right = checked && val === m.L
      const num = nm.byStart[k]
      const startH = words.some((w) => w.dir === 'H' && cruciKey(w.r, w.c) === k)
      const startV = words.some((w) => w.dir === 'V' && cruciKey(w.r, w.c) === k)
      cells.push(
        <div key={k} className={`crp-cell${wrong ? ' crp-cell--wrong' : ''}${right ? ' crp-cell--right' : ''}`}>
          {num && startH && <span className="crp-cell__num crp-cell__num--h" aria-hidden="true">{num}</span>}
          {num && startV && <span className="crp-cell__num crp-cell__num--v" aria-hidden="true">{num}</span>}
          <input data-k={k} value={val} maxLength={2} autoComplete="off" spellCheck={false} aria-invalid={wrong}
            aria-label={`${num ? `${num}, ` : ''}fila ${r + 1}, columna ${c + 1}${right ? ', correcta' : wrong ? ', incorrecta' : ''}`}
            onKeyDown={(e) => move(e, r, c)}
            onChange={(e) => {
              const x = cruciNorm(e.target.value).slice(-1)
              setLetters((s) => ({ ...s, [k]: x })); setChecked(false); setFallos(null)
            }} />
          {right && <Icon name="check" size={10} className="crp-cell__st" />}
          {wrong && <Icon name="close" size={10} className="crp-cell__st" />}
        </div>,
      )
    }
  }

  const list = (dir: 'H' | 'V') => (
    <section aria-labelledby={`crp-l-${dir}`}>
      <h4 id={`crp-l-${dir}`} className="t-title-sm crp-lt">{dir === 'H' ? 'Horizontales' : 'Verticales'}</h4>
      <ul className="crp-clues">
        {clues(dir).map((w) => (
          <li key={w.id} className="t-body-md"><b>{nm.byId[w.id]}.</b> {w.clue} <span className="crp-len">({w.ans.length})</span></li>
        ))}
      </ul>
    </section>
  )

  return (
    <div className="pv-stage">
      <PvHeader game={game} onHelp={help.show} />
      {done ? (
        // IR AL INICIO cierra la vista previa; VOLVER A JUGAR reinicia el tablero vacío.
        <PvDone title="¡Terminaste el juego!" cierre={game.cierre.trim() || CIERRE_DEFECTO} onReplay={reset} onHome={onClose}
          medal={<div className="crp-done__fig" role="img" aria-label="Sello con un check: crucigrama completado" dangerouslySetInnerHTML={{ __html: completado }} />} />
      ) : (
        <div className="crp-play">
          <div className="crp-left">
            <div ref={boardRef} className="crp-board" role="group" aria-label={`Crucigrama de ${N} por ${N}`} data-n={N}
              style={{ gridTemplateColumns: `repeat(${N}, var(--crp-cell))` }}>
              {cells}
            </div>
          </div>
          <div className="crp-right">
            {list('H')}
            {list('V')}
            <Divider />
            <div className="crp-check">
              <Button onClick={check}>COMPROBAR</Button>
              {fallos && <Message type="error" title={tituloFallos(fallos.malas + fallos.vacias)}>{detalleFallos(fallos)}</Message>}
            </div>
          </div>
        </div>
      )}
      <PvHelp open={help.open} onClose={help.hide}>{instr}</PvHelp>
    </div>
  )
}

const tituloFallos = (n: number) => (n === 1 ? 'Hay 1 casilla por corregir' : `Hay ${n} casillas por corregir`)

/** Explica qué está mal y cómo se ve en el tablero (letras incorrectas y casillas vacías). */
function detalleFallos({ malas, vacias }: { malas: number; vacias: number }) {
  const partes = [
    malas > 0 && (malas === 1 ? '1 letra incorrecta' : `${malas} letras incorrectas`),
    vacias > 0 && (vacias === 1 ? '1 casilla vacía' : `${vacias} casillas vacías`),
  ].filter(Boolean)
  return `Tienes ${partes.join(' y ')}. Corrígelas y vuelve a COMPROBAR.`
}
