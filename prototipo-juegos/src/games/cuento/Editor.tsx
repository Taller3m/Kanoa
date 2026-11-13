import { useId, useRef, useState, type ChangeEvent, type DragEvent } from 'react'
import { Button, ConfirmDialog, Icon, IconButton, TextArea, TextField } from '../../ui'
import type { EditorProps } from '../types'
import { blankPage } from './defaults'
import { paginaCompleta } from './rules'
import type { CuentoPagina } from './types'
import './cuento.css'

const MAX_PAGINAS = 15
const MAX_IMG = 10 * 1024 * 1024
const MAX_AUDIO = 5 * 1024 * 1024
const extOf = (n: string) => (n.split('.').pop() ?? '').toLowerCase()

/** Paso 2 «Configuración» del juego «Cuenta cuentos». */
export function CuentoEditor({ game, update, toast }: EditorProps) {
  const [idx, setIdx] = useState(0)
  const [drag, setDrag] = useState(false)
  const [confirmDel, setConfirmDel] = useState(false)
  const imgRef = useRef<HTMLInputElement>(null)
  const audioRef = useRef<HTMLInputElement>(null)
  const uid = useId()

  const ps = game.cuento.paginas
  const i = Math.min(idx, ps.length - 1)
  const p: CuentoPagina | undefined = ps[i]

  const edit = (fn: (pg: CuentoPagina) => void) => update((d) => { fn(d.cuento.paginas[i]) })

  const addPage = () => {
    if (ps.length >= MAX_PAGINAS) { toast('La historia puede tener máximo 15 páginas.', 'err'); return }
    update((d) => { d.cuento.paginas.push(blankPage(d.cuento.paginas.length + 1)) })
    setIdx(ps.length)
  }
  const move = (to: number) => {
    if (to < 0 || to >= ps.length) return
    update((d) => { const a = d.cuento.paginas; [a[to], a[i]] = [a[i], a[to]] })
    setIdx(to)
  }
  const askDelete = () => {
    if (ps.length <= 1) { toast('La historia debe tener al menos una página.', 'err'); return }
    setConfirmDel(true)
  }
  const doDelete = () => {
    update((d) => { d.cuento.paginas.splice(i, 1) })
    setIdx(Math.max(0, i - 1))
    setConfirmDel(false)
  }

  const takeImage = (f: File | undefined) => {
    if (!f) return
    if (!['jpg', 'jpeg', 'png'].includes(extOf(f.name))) { toast('Formato no admitido. Usa .jpg, .jpeg o .png.', 'err'); return }
    if (f.size > MAX_IMG) { toast('La imagen supera los 10 MB.', 'err'); return }
    edit((pg) => { pg.img = f.name })
  }
  const takeAudio = (f: File | undefined) => {
    if (!f) return
    if (extOf(f.name) !== 'mp3') { toast('Formato no admitido. Usa un archivo .mp3.', 'err'); return }
    if (f.size > MAX_AUDIO) { toast('El audio supera los 5 MB.', 'err'); return }
    edit((pg) => { pg.audio = f.name })
  }
  const onImgChange = (e: ChangeEvent<HTMLInputElement>) => { takeImage(e.target.files?.[0]); e.target.value = '' }
  const onAudioChange = (e: ChangeEvent<HTMLInputElement>) => { takeAudio(e.target.files?.[0]); e.target.value = '' }
  const onDrop = (e: DragEvent<HTMLButtonElement>) => { e.preventDefault(); setDrag(false); takeImage(e.dataTransfer.files?.[0]) }

  const markCorrect = (k: number) => edit((pg) => { pg.opciones.forEach((x, j) => { x.ok = j === k }) })
  const delOpc = (k: number) => {
    if (p && p.opciones.length <= 2) { toast('Cada pregunta debe tener mínimo 2 opciones.', 'err'); return }
    edit((pg) => { const was = pg.opciones[k].ok; pg.opciones.splice(k, 1); if (was) pg.opciones[0].ok = true })
  }

  return (
    <div className="cu">
      <div className="cu__intro">
        <h2 className="t-title-lg cu__h">Páginas de la historia</h2>
        <p className="t-body-md cu__muted">Cada página tiene una ilustración, un texto, una pregunta y sus opciones de respuesta. Mínimo 2 y máximo 15 páginas.</p>
      </div>

      <div className="cu__layout">
        <nav className="cu__pages" aria-label="Páginas de la historia">
          <ul className="cu__list">
            {ps.map((pg, k) => {
              const ok = paginaCompleta(pg)
              return (
                <li key={pg.id}>
                  <button type="button" className="cu-page" aria-current={k === i ? 'page' : undefined} onClick={() => setIdx(k)}>
                    <span className={`cu-page__ico ${ok ? 'is-ok' : 'is-pend'}`}><Icon name={ok ? 'check_circle' : 'pending'} size={20} /></span>
                    <span className="cu-page__label t-label-lg">Página {k + 1}</span>
                    <span className="cu-page__st t-body-sm">{ok ? 'Completa' : 'Incompleta'}</span>
                  </button>
                </li>
              )
            })}
          </ul>
          <Button variant="outline" icon="add" block onClick={addPage} disabled={ps.length >= MAX_PAGINAS}>Agregar página</Button>
        </nav>

        {p && (
          <section className="cu__form" aria-label={`Página ${i + 1} de ${ps.length}`}>
            <div className="cu__head">
              <h3 className="t-title-md cu__h">Página {i + 1} de {ps.length}</h3>
              <div className="cu__tools">
                <IconButton icon="arrow_upward" label="Mover antes" onClick={() => move(i - 1)} disabled={i === 0} />
                <IconButton icon="arrow_downward" label="Mover después" onClick={() => move(i + 1)} disabled={i >= ps.length - 1} />
                <IconButton icon="delete" label="Eliminar página" className="cu__danger" onClick={askDelete} />
              </div>
            </div>

            <div className="cu__block">
              <div className="t-label-lg" id={`${uid}-img`}>Ilustración <span className="cu__req" aria-hidden="true">*</span></div>
              {!p.img ? (
                <>
                  <button type="button" className={`cu-drop${drag ? ' is-over' : ''}`} aria-labelledby={`${uid}-img`} aria-describedby={`${uid}-imgh`}
                    onClick={() => imgRef.current?.click()}
                    onDragOver={(e) => { e.preventDefault(); setDrag(true) }} onDragLeave={() => setDrag(false)} onDrop={onDrop}>
                    <span className="cu-drop__main t-label-lg"><Icon name="add_photo_alternate" size={20} />Añadir imagen</span>
                    <span className="t-body-sm cu__muted" id={`${uid}-imgh`}>.jpg, .jpeg o .png · hasta 10 MB · también puedes arrastrarla aquí</span>
                  </button>
                  <input ref={imgRef} type="file" className="cu__hidden" tabIndex={-1} aria-hidden="true" accept=".jpg,.jpeg,.png,image/jpeg,image/png" onChange={onImgChange} />
                </>
              ) : (
                <div className="cu-file">
                  <span className="cu-file__thumb"><Icon name="image" size={24} /></span>
                  <span className="cu-file__name t-body-md">{p.img}</span>
                  <IconButton icon="close" label="Quitar imagen" className="cu__danger" onClick={() => edit((pg) => { pg.img = '' })} />
                </div>
              )}
            </div>

            <div className="cu__block">
              <div className="t-label-lg">Audio de la página <span className="cu__muted">(opcional)</span></div>
              <p className="t-body-sm cu__muted cu__hint">Narración de esta página, como un audiolibro. MP3, máximo 5 MB.</p>
              {!p.audio ? (
                <>
                  <div><Button variant="outline" icon="audio_file" onClick={() => audioRef.current?.click()}>Añadir audio</Button></div>
                  <input ref={audioRef} type="file" className="cu__hidden" tabIndex={-1} aria-hidden="true" accept=".mp3,audio/mpeg" onChange={onAudioChange} />
                </>
              ) : (
                <div className="cu-file">
                  <span className="cu-file__thumb cu-file__thumb--round"><Icon name="music_note" size={20} /></span>
                  <span className="cu-file__name t-body-md">{p.audio}</span>
                  <IconButton icon="close" label="Quitar audio" className="cu__danger" onClick={() => edit((pg) => { pg.audio = '' })} />
                </div>
              )}
            </div>

            <div className="cu__block">
              <TextArea label="Texto de la página" required rows={3} maxLength={500} value={p.texto}
                placeholder="Ej. Había una vez un cóndor llamado Simón…" onChange={(e) => edit((pg) => { pg.texto = e.target.value })} />
              <div className="cu__count t-body-sm">{p.texto.length}/500</div>
            </div>

            <TextField label="Pregunta" required maxLength={150} value={p.pregunta}
              placeholder="Ej. ¿Cómo se siente Simón en esta parte?" onChange={(e) => edit((pg) => { pg.pregunta = e.target.value })} />

            <fieldset className="cu-opts">
              <legend className="t-label-lg">Opciones de respuesta <span className="cu__req" aria-hidden="true">*</span></legend>
              <p className="t-body-sm cu__muted cu__hint">Entre 2 y 4 opciones. Marca la respuesta correcta.</p>
              <div className="cu-opts__list" role="radiogroup" aria-label="Respuesta correcta">
                {p.opciones.map((o, k) => (
                  <div className="cu-opt" key={k}>
                    <label className="cu-mark">
                      <input type="radio" className="cu__sr" name={`${uid}-ok-${p.id}`} checked={o.ok} onChange={() => markCorrect(k)} />
                      <span className="cu-mark__box"><Icon name="check" size={18} /></span>
                      <span className="cu__sr">Marcar la opción {k + 1} como correcta</span>
                    </label>
                    <TextField className="cu-opt__field" aria-label={`Opción ${k + 1}`} maxLength={80} value={o.t}
                      placeholder={`Opción ${k + 1}`} onChange={(e) => edit((pg) => { pg.opciones[k].t = e.target.value })} />
                    <IconButton icon="close" label={`Quitar opción ${k + 1}`} className="cu__danger" onClick={() => delOpc(k)} />
                  </div>
                ))}
              </div>
              {p.opciones.length < 4 && (
                <div><Button variant="text" icon="add" onClick={() => edit((pg) => { pg.opciones.push({ t: '', ok: false }) })}>Agregar opción</Button></div>
              )}
            </fieldset>

            <div className="cu__pair">
              <TextField label="Mensaje si acierta" required maxLength={150} value={p.fbOk}
                placeholder="Ej. ¡Correcto! Simón se siente feliz." onChange={(e) => edit((pg) => { pg.fbOk = e.target.value })} />
              <TextField label="Mensaje si no acierta" required maxLength={150} value={p.fbNo}
                placeholder="Ej. Mira de nuevo la imagen." onChange={(e) => edit((pg) => { pg.fbNo = e.target.value })} />
            </div>
          </section>
        )}
      </div>

      <ConfirmDialog open={confirmDel} danger title="Eliminar página" confirmLabel="Eliminar"
        message={`¿Estás seguro de que deseas eliminar la página ${i + 1}?`} onConfirm={doDelete} onCancel={() => setConfirmDel(false)} />
    </div>
  )
}
