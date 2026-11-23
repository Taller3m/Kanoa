import { useRef, useState, type KeyboardEvent } from 'react'
import type { EditorProps } from '../types'
import type { CruciWord } from './types'
import { Button, ConfirmDialog, Icon, IconButton, Select, TextArea, TextField } from '../../ui'
import {
  CRUCI_CX0, cruciBuildMap, cruciCellsOf, cruciKey, cruciMin, cruciNorm, cruciNumerar, cruciValidar,
  type CruciCx, type RuleState,
} from './rules'
import './cruci.css'

const SIZES = [8, 10, 12, 15]
const RULE_ICON: Record<RuleState, string> = { ok: 'check_circle', err: 'cancel', pend: 'radio_button_unchecked', info: 'info' }
const RULE_TXT: Record<RuleState, string> = { ok: 'Cumplida', err: 'Incumplida', pend: 'Pendiente', info: 'Información' }

/** Paso 2 «Configuración» del juego «Crucigrama». */
export function CruciEditor({ game, update, toast }: EditorProps) {
  const [cx, setCx] = useState<CruciCx>(CRUCI_CX0)
  const [toDelete, setToDelete] = useState<CruciWord | null>(null)
  // Navegación con flechas dentro del tablero: una sola casilla es tabulable (roving tabindex).
  const [foco, setFoco] = useState('0,0')
  const boardRef = useRef<HTMLDivElement>(null)

  const N = game.cruci.size
  const words = game.cruci.words
  const sel = cx.sel
  const val = cruciValidar(N, words, cx)
  const map = val.map
  const all = cruciNumerar(words)
  const starts: Record<string, number> = {}
  words.filter((w) => w.id !== cx.editId).forEach((w) => { starts[cruciKey(w.r, w.c)] = all.byId[w.id] })
  const mnW = cruciMin(N)
  const usedNow = Object.keys(cruciBuildMap(words)).length
  const patch = (p: Partial<CruciCx>) => setCx((s) => ({ ...s, ...p }))

  const onSize = (n: number) => {
    if (words.some((w) => cruciCellsOf(w).some(([r, c]) => r >= n || c >= n))) {
      toast('No puedes reducir el tablero: hay palabras que quedarían por fuera.', 'err')
      return
    }
    update((d) => { d.cruci.size = n })
    setCx(CRUCI_CX0)
  }

  const addWord = () => {
    if (!sel || !val.can) return
    const w: CruciWord = { id: cx.editId || Date.now(), r: sel.r, c: sel.c, dir: cx.dir, ans: cx.ans, clue: cx.clue.trim() }
    update((d) => {
      const i = d.cruci.words.findIndex((x) => x.id === w.id)
      if (i >= 0) d.cruci.words[i] = w
      else d.cruci.words.push(w)
    })
    setCx(CRUCI_CX0)
    toast(cx.editId ? 'La palabra ha sido actualizada.' : 'La palabra ha sido agregada al crucigrama.', 'ok')
  }

  const confirmDelete = () => {
    if (!toDelete) return
    const id = toDelete.id
    update((d) => { d.cruci.words = d.cruci.words.filter((x) => x.id !== id) })
    setCx(CRUCI_CX0)
    setToDelete(null)
  }

  const mover = (e: KeyboardEvent<HTMLButtonElement>, r: number, c: number) => {
    const d: Record<string, [number, number]> = { ArrowLeft: [0, -1], ArrowRight: [0, 1], ArrowUp: [-1, 0], ArrowDown: [1, 0] }
    let rr = r, cc = c
    if (d[e.key]) { rr = Math.min(N - 1, Math.max(0, r + d[e.key]![0])); cc = Math.min(N - 1, Math.max(0, c + d[e.key]![1])) }
    else if (e.key === 'Home') cc = 0
    else if (e.key === 'End') cc = N - 1
    else return
    e.preventDefault()
    const k = cruciKey(rr, cc)
    setFoco(k)
    boardRef.current?.querySelector<HTMLButtonElement>(`[data-k="${k}"]`)?.focus()
  }

  const cells = []
  for (let r = 0; r < N; r++) {
    for (let c = 0; c < N; c++) {
      const k = cruciKey(r, c)
      const m = map[k]
      const pi = val.path.indexOf(k)
      const conf = !!val.conflicts[k]
      const isSel = !!sel && sel.r === r && sel.c === c
      const letter = m ? m.L : (pi >= 0 ? cx.ans[pi] : '')
      const num = starts[k]
      const cls = ['cr-cell', m && 'cr-cell--filled', pi >= 0 && 'cr-cell--path', conf && 'cr-cell--conflict', isSel && 'cr-cell--sel'].filter(Boolean).join(' ')
      // Nombre accesible «Fila F, columna C» (HU-PW-172); incluye la letra visible para cumplir WCAG 2.5.3.
      const nombre = `Fila ${r + 1}, columna ${c + 1}` + (letter ? `, letra ${letter}` : ', vacía') + (num ? `, inicio de la palabra ${num}` : '') + (conf ? ', letra en conflicto' : '')
      cells.push(
        <button key={k} type="button" className={cls} title={`Fila ${r + 1}, columna ${c + 1}`} aria-pressed={isSel} aria-label={nombre}
          data-k={k} tabIndex={foco === k ? 0 : -1} onFocus={() => setFoco(k)} onKeyDown={(e) => mover(e, r, c)}
          onClick={() => patch({ sel: { r, c } })}>
          {(num || (isSel && !num)) && <span className="cr-cell__num" aria-hidden="true">{num || '·'}</span>}
          <span aria-hidden="true">{letter}</span>
        </button>,
      )
    }
  }

  const list = (dir: 'H' | 'V') => words.filter((w) => w.dir === dir).sort((a, b) => all.byId[a.id] - all.byId[b.id])

  const renderList = (dir: 'H' | 'V') => (
    <section className="cr-list" aria-labelledby={`cr-list-${dir}`}>
      <h3 id={`cr-list-${dir}`} className="t-title-sm cr-list__title">
        <Icon name={dir === 'H' ? 'arrow_forward' : 'arrow_downward'} size={18} />
        {dir === 'H' ? 'Horizontales' : 'Verticales'}
      </h3>
      <ul className="cr-list__items">
        {list(dir).map((w) => (
          <li key={w.id} className="cr-word">
            <span className="cr-word__num">{all.byId[w.id]}</span>
            <div className="cr-word__text">
              <div className="t-body-md cr-word__clue">{w.clue}</div>
              <div className="t-label-md cr-word__ans">{w.ans}</div>
            </div>
            <IconButton icon="edit" label="Editar palabra"
              onClick={() => setCx({ sel: { r: w.r, c: w.c }, dir: w.dir, ans: w.ans, clue: w.clue, editId: w.id })} />
            <IconButton icon="close" label="Eliminar palabra" onClick={() => setToDelete(w)} />
          </li>
        ))}
      </ul>
    </section>
  )

  const nextNum = sel ? (starts[cruciKey(sel.r, sel.c)] || (cx.editId ? all.byId[cx.editId] : Object.keys(all.byStart).length + 1)) : 0

  return (
    <div className="cr-editor">
      <div className="cr-head">
        <div>
          <h2 className="t-section cr-h2">Tablero</h2>
          <p className="t-body-md cr-muted">Haz clic en una casilla para iniciar una palabra. El número de la pregunta se asigna solo.</p>
        </div>
        <div className="cr-size">
          <Select label="Tamaño del tablero:" value={String(N)} onChange={(e) => onSize(Number(e.target.value))}
            options={SIZES.map((n) => ({ value: String(n), label: `${n} × ${n}` }))} />
        </div>
      </div>

      <div className="cr-main">
        <div className="cr-board-wrap">
          <div ref={boardRef} className="cr-board" role="group" aria-label={`Tablero de ${N} por ${N}. Usa las flechas para moverte y Enter para elegir la casilla de inicio.`} style={{ gridTemplateColumns: `repeat(${N}, var(--cr-cell))` }} data-n={N}>
            {cells}
          </div>
          <ul className="cr-legend t-body-sm">
            <li><span className="cr-swatch cr-swatch--sel" aria-hidden="true" />Casilla de inicio</li>
            <li><span className="cr-swatch cr-swatch--path" aria-hidden="true" />Palabra en creación</li>
            <li><span className="cr-swatch cr-swatch--conflict" aria-hidden="true" />Letra en conflicto</li>
          </ul>
          <p className="t-body-sm cr-muted" aria-live="polite">{usedNow} casillas con letras · {N * N - usedNow} se convertirán en casillas negras al guardar.</p>
        </div>

        <div className="cr-panel">
          {/* Hasta que se hace clic en una casilla del tablero solo se muestran las instrucciones; el formulario aparece al elegir la casilla de inicio. */}
          {!sel && (
            <div className="cr-empty">
              <div className="t-title-md">Agrega una palabra</div>
              <p className="t-body-md cr-muted">1. Haz clic en la casilla donde empieza la palabra.<br />2. Elige si va hacia la derecha o hacia abajo.<br />3. Escribe la respuesta y su pista.</p>
            </div>
          )}
          {sel && (
            <div className="cr-form">
              <div>
                <div className="t-title-md">{cx.editId ? `Editar palabra ${all.byId[cx.editId]}` : `Nueva palabra · pregunta ${nextNum}`}</div>
                <div className="t-body-md cr-muted">Inicia en fila {sel.r + 1}, columna {sel.c + 1}</div>
              </div>

              <div role="group" aria-labelledby="cr-dir-l">
                <div id="cr-dir-l" className="cr-label t-label-md">Dirección <span className="cr-req" aria-hidden="true">*</span></div>
                <div className="cr-seg">
                  <button type="button" className="cr-seg__btn" aria-pressed={cx.dir === 'H'} onClick={() => patch({ dir: 'H' })}>
                    <Icon name="arrow_forward" size={18} />Horizontal
                  </button>
                  <button type="button" className="cr-seg__btn" aria-pressed={cx.dir === 'V'} onClick={() => patch({ dir: 'V' })}>
                    <Icon name="arrow_downward" size={18} />Vertical
                  </button>
                </div>
              </div>

              <TextField label="Respuesta" required value={cx.ans} placeholder="Ej. SOL" autoComplete="off" spellCheck={false}
                onChange={(e) => patch({ ans: cruciNorm(e.target.value) })}
                help={`Solo letras, sin tildes ni espacios. Máximo ${val.maxLen} ${val.maxLen === 1 ? 'letra' : 'letras'} desde esta casilla.`} />

              <div>
                <TextArea label="Pista o pregunta" required value={cx.clue} maxLength={150} rows={2}
                  placeholder="Ej. Estrella que ilumina la Tierra durante el día."
                  onChange={(e) => patch({ clue: e.target.value })} />
                <div className="t-body-sm cr-muted cr-count">{cx.clue.length}/150</div>
              </div>

              <section aria-labelledby="cr-val-l">
                <div id="cr-val-l" className="cr-label t-label-md">VALIDACIONES</div>
                <ul className="cr-rules" aria-live="polite">
                  {val.rules.map((ru) => (
                    <li key={ru.t} className={`cr-rule cr-rule--${ru.st}`}>
                      <Icon name={RULE_ICON[ru.st]} size={20} className="cr-rule__ico" />
                      <div>
                        <div className="t-title-sm">{ru.t}<span className="sr-only">: {RULE_TXT[ru.st]}.</span></div>
                        <div className="t-body-sm cr-muted">{ru.msg}</div>
                      </div>
                    </li>
                  ))}
                </ul>
              </section>

              <div className="cr-actions">
                <Button variant="text" onClick={() => setCx(CRUCI_CX0)}>CANCELAR</Button>
                <Button onClick={addWord} disabled={!val.can}>{cx.editId ? 'ACTUALIZAR PALABRA' : 'AGREGAR PALABRA'}</Button>
              </div>
            </div>
          )}
        </div>
      </div>

      <h2 className="t-section cr-h2">Palabras y pistas</h2>
      {words.length === 0 && (
        <p className="t-body-md cr-muted cr-nowords">Aún no has agregado palabras. Necesitas mínimo {mnW} para que el crucigrama quede completo.</p>
      )}
      {words.length > 0 && (
        <div className="cr-lists">
          {renderList('H')}
          {renderList('V')}
        </div>
      )}

      <ConfirmDialog open={!!toDelete} danger title="Eliminar palabra" confirmLabel="Eliminar"
        message={toDelete ? `¿Estás seguro de que deseas eliminar la palabra «${toDelete.ans}»?` : ''}
        onConfirm={confirmDelete} onCancel={() => setToDelete(null)} />
    </div>
  )
}
