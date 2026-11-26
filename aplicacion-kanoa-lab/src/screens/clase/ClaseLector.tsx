import { useState } from 'react'
import { Button, Icon, IconButton, ProgressBar, Radio, StatusTag } from '../../ui'
import { Caption, Circle, Notice, PagerBar, Screen, Scroll, Segments, Sheet, Tile, cx } from '../../mobile'
import { go } from '../../app/router'
import { useApp } from '../../app/store'
import { claseDe, type Clase } from '../../app/data'
import { ARCHIVO, paginasDe, type Bloque, type TipoArchivo } from './data'
import { ClaseBar, ClaseNoDescargada, EtiquetasSinInternet, TagIcono } from './comun'

type Hoja = { modo: 'abrir-con' | 'sin-app'; nombre: string; tipo: TipoArchivo } | null

/**
 * Lector de la clase (D01–D05, D07, D08, D10).
 * Query: `?ver=imagen` abre la primera imagen ampliada (D03); `?hoja=abrir-con|sin-app` abre la hoja del primer archivo de Office (D04, D05);
 * `?respuesta=n` deja elegida la opción n del interactivo (D08).
 */
export function ClaseLector({ claseId, pagina, query }: { claseId: string; pagina: string; query: URLSearchParams }) {
  const { s, descargaDe } = useApp()
  const clase = claseDe(claseId)
  const paginas = paginasDe(clase.id)
  const total = paginas.length + 1 // la última página es la de actividades
  const n = Math.min(Math.max(1, Number.parseInt(pagina, 10) || 1), paginas.length)
  const bloques = paginas[n - 1]!.bloques
  const d = descargaDe(clase.id)

  const primeraImagen = bloques.find((b) => b.t === 'imagen')
  const primerOffice = bloques.find((b): b is Extract<Bloque, { t: 'archivo' }> => b.t === 'archivo' && !ARCHIVO[b.tipo].enApp)
  const [imagen, setImagen] = useState<string | null>(query.get('ver') === 'imagen' && primeraImagen?.t === 'imagen' ? primeraImagen.titulo : null)
  const hojaInicial = query.get('hoja')
  const [hoja, setHoja] = useState<Hoja>(
    primerOffice && (hojaInicial === 'abrir-con' || hojaInicial === 'sin-app') ? { modo: hojaInicial, nombre: primerOffice.nombre, tipo: primerOffice.tipo } : null)

  // D10: sin internet y sin descargar, la clase no se puede ver.
  if (!s.online && d.estado !== 'descargada') return <Screen white label={clase.titulo}><ClaseNoDescargada clase={clase} /></Screen>

  const irA = (p: number) => go(p > paginas.length ? `clase/${clase.id}/actividades` : `clase/${clase.id}/${p}`)

  return (
    <Screen white label={clase.titulo}>
      <ClaseBar clase={clase} subtitulo={`Página ${n} de ${total}`} />
      <Segments total={total} current={n} />
      <Scroll pager>
        <AvisoDescarga clase={clase} />
        {bloques.map((b, i) => (
          <BloqueVista key={i} b={b} claseId={clase.id} respuestaInicial={query.get('respuesta')}
            onImagen={setImagen} onOffice={(nombre, tipo) => setHoja({ modo: 'abrir-con', nombre, tipo })} />
        ))}
      </Scroll>
      <PagerBar>
        {n > 1 && <IconButton icon="arrow_back" label="Página anterior" className="cl-line" onClick={() => irA(n - 1)} />}
        <p className="t-label-md m-grow" style={{ margin: 0, color: 'var(--on-surface-variant)' }}>Página {n} de {total}</p>
        <Button iconEnd="arrow_forward" onClick={() => irA(n + 1)}>Siguiente</Button>
      </PagerBar>

      {imagen && <ImagenAmpliada titulo={imagen} onClose={() => setImagen(null)} />}
      <HojaOffice hoja={hoja} onClose={() => setHoja(null)} onSinApp={() => setHoja((h) => (h ? { ...h, modo: 'sin-app' } : h))} />
    </Screen>
  )
}

/** Aviso para descargar (D01) o avance de la descarga sin bloquear la lectura (D02); sin internet, las etiquetas de D07. */
function AvisoDescarga({ clase }: { clase: Clase }) {
  const { s, descargar, descargaDe, toast, faltaMB } = useApp()
  const d = descargaDe(clase.id)
  if (!s.online) return <EtiquetasSinInternet />
  if (d.estado === 'ninguna') {
    const pedir = () => {
      const r = descargar(clase.id)
      if (r === 'sin-espacio') toast({ texto: `No hay espacio suficiente: faltan ${faltaMB(clase.id)} MB.`, tipo: 'error', accion: 'Liberar', onAccion: () => go('descargas/liberar') })
    }
    return (
      <Notice icon="download_for_offline" title="¿Vas a estar sin internet?"
        actions={<Button size="small" onClick={pedir}>Descargar clase</Button>}>
        Descarga esta clase ({clase.tamanoMB} MB) y podrás verla cuando quieras.
      </Notice>
    )
  }
  if (d.estado === 'descargada') return null
  const titulo = d.estado === 'en-cola' ? 'Esta clase está en cola' : 'Descargando esta clase'
  return (
    <Notice icon="downloading">
      <div className="m-col" style={{ gap: 6 }}>
        <div className="m-row">
          <span className="t-title-sm m-grow" style={{ color: 'var(--title)' }}>{titulo}</span>
          <span className="t-label-md">{d.progreso} %</span>
        </div>
        <ProgressBar value={d.progreso} label="Descarga de la clase" />
        <span className="t-body-sm">Puedes seguir aprendiendo mientras tanto.</span>
      </div>
    </Notice>
  )
}

function BloqueVista({ b, claseId, respuestaInicial, onImagen, onOffice }: {
  b: Bloque; claseId: string; respuestaInicial: string | null
  onImagen: (titulo: string) => void; onOffice: (nombre: string, tipo: TipoArchivo) => void
}) {
  const { s, toast } = useApp()
  const guardar = () => toast({ texto: 'Guardamos la imagen en la galería de tu teléfono.', tipo: 'success' })
  switch (b.t) {
    case 'titulo': return <h2 className="t-headline-sm m-title">{b.texto}</h2>
    case 'parrafo': return <p className="t-body-lg m-text">{b.texto}</p>
    case 'imagen':
      return (
        <div className="cl-figure">
          <button type="button" className="m-media cl-img" aria-label={`Ampliar imagen: ${b.titulo}`} onClick={() => onImagen(b.titulo)}>
            <Icon name="image" size={40} />
            <span className="t-body-md">{b.titulo}</span>
          </button>
          <IconButton icon="download" label="Guardar imagen en mi teléfono" className="cl-figure__save" onClick={guardar} />
        </div>
      )
    case 'archivo': {
      const a = ARCHIVO[b.tipo]
      const abrir = () => (a.enApp ? toast(`Abriendo «${b.nombre}»…`) : onOffice(b.nombre, b.tipo))
      return (
        <div className="m-resource">
          <Tile t={a.color} size={44}><Icon name={a.icono} /></Tile>
          <div className="m-col m-grow" style={{ gap: 0 }}>
            <span className="t-title-sm" style={{ color: 'var(--title)' }}>{b.nombre}</span>
            <span className="t-body-sm m-muted">{b.detalle}</span>
          </div>
          <Button variant="text" size="small" onClick={abrir}>Abrir</Button>
        </div>
      )
    }
    case 'audio': return <Audio b={b} />
    case 'video':
      if (b.youtube && !s.online) {
        return (
          <div className="m-media m-media--dark cl-video">
            <Icon name="cloud_off" size={32} />
            <span className="t-body-md">{b.titulo}</span>
            <Caption icon="smart_display">Video de YouTube · Necesitas internet</Caption>
          </div>
        )
      }
      return (
        <div className="m-col" style={{ gap: 4 }}>
          <div className="m-media m-media--dark cl-video">
            <button type="button" className="m-play cl-play" aria-label={`Reproducir video: ${b.titulo}`}
              onClick={() => toast(`Reproduciendo «${b.titulo}»`)}><Icon name="play_arrow" /></button>
            <span className="m-media__dur">{b.duracion}</span>
          </div>
          {!b.youtube && (
            <div className="m-row">
              <Button variant="text" size="small" icon="download" onClick={() => toast({ texto: 'Guardamos el video en la galería de tu teléfono.', tipo: 'success' })}>Guardar en mi teléfono</Button>
            </div>
          )}
        </div>
      )
    case 'enlace': {
      const off = !s.online
      return (
        <div className={cx('m-resource', off && 'm-resource--off')}>
          <Tile t="primary" size={44}><Icon name="link" /></Tile>
          <div className="m-col m-grow" style={{ gap: 0 }}>
            <span className="t-title-sm" style={{ color: off ? 'inherit' : 'var(--title)' }}>{b.titulo}</span>
            <span className="t-body-sm">{off ? 'Enlace · necesitas internet' : 'Enlace · se abre en el navegador'}</span>
          </div>
          <Button variant="text" size="small" disabled={off} onClick={() => toast(`Abriendo «${b.titulo}» en el navegador…`)}>Abrir</Button>
        </div>
      )
    }
    case 'interactivo': return <Interactivo b={b} claseId={claseId} respuestaInicial={respuestaInicial} />
  }
}

function Audio({ b }: { b: Extract<Bloque, { t: 'audio' }> }) {
  const [sonando, setSonando] = useState(false)
  return (
    <div className="m-resource">
      <Tile t="indigo" size={44}><Icon name="headphones" /></Tile>
      <div className="m-col m-grow" style={{ gap: 4 }}>
        <span className="t-title-sm" style={{ color: 'var(--title)' }}>{b.titulo}</span>
        <span className="m-row">
          <ProgressBar value={b.avance} label="Avance del audio" />
          <span className="t-body-sm m-muted" style={{ flex: 'none' }}>{b.actual} / {b.duracion}</span>
        </span>
      </div>
      <button type="button" className="m-play cl-play" aria-label={sonando ? 'Pausar audio' : 'Reproducir audio'} onClick={() => setSonando(!sonando)}>
        <Icon name={sonando ? 'pause' : 'play_arrow'} />
      </button>
    </div>
  )
}

/** Interactivo (D08): funciona sin internet; la respuesta queda «Por enviar» hasta reconectar. */
function Interactivo({ b, respuestaInicial }: { b: Extract<Bloque, { t: 'interactivo' }>; claseId: string; respuestaInicial: string | null }) {
  const { s, set } = useApp()
  const ini = respuestaInicial !== null ? Number(respuestaInicial) : NaN
  const [elegida, setElegida] = useState<number | null>(Number.isInteger(ini) ? ini : null)
  const [punto, setPunto] = useState<number | null>(null)
  const [contada, setContada] = useState(false)
  const ej = b.ejercicio
  const elegir = (i: number) => {
    setElegida(i)
    // La primera respuesta sin internet queda guardada en el teléfono y suma a «por enviar».
    if (!s.online && !contada) { set({ porEnviar: s.porEnviar + 1 }); setContada(true) }
  }
  const correcta = elegida === ej.correcta
  return (
    <>
      <div className="m-row">
        <StatusTag grey>Interactivo</StatusTag>
        <p className="t-title-sm m-title">{b.titulo}</p>
      </div>
      <div className="m-media cl-infografia">
        <Icon name="biotech" size={40} />
        <span className="t-body-md">{b.infografia}</span>
        {b.puntos.map((p, i) => (
          <button key={p} type="button" className={cx('cl-hotspot', `cl-hotspot--${i + 1}`)} aria-pressed={punto === i}
            aria-label={`Punto ${i + 1}: ${p}`} onClick={() => setPunto(punto === i ? null : i)}>{i + 1}</button>
        ))}
        {punto !== null && <span className="cl-hotspot__label t-label-md">{b.puntos[punto]}</span>}
      </div>
      <section className="m-card" aria-label="Ejercicio 1">
        <div className="m-row">
          <p className="t-label-sm m-grow" style={{ margin: 0, color: 'var(--on-surface-variant)', textTransform: 'uppercase' }}>Ejercicio 1</p>
          <StatusTag type="general">De práctica</StatusTag>
        </div>
        <p className="t-title-md m-title">{ej.pregunta}</p>
        <div className="m-col" role="radiogroup" aria-label={ej.pregunta}>
          {ej.opciones.map((o, i) => (
            <div key={o} className="m-option"><Radio name="ejercicio-1" label={o} checked={elegida === i} onChange={() => elegir(i)} /></div>
          ))}
        </div>
        {elegida !== null && (correcta
          ? <Notice type="success" icon="check_circle" title="¡Correcto!">{ej.explicacion}</Notice>
          : <Notice type="error" icon="cancel" title="Casi">Revisa la infografía e inténtalo otra vez.</Notice>)}
        {elegida !== null && (s.online
          ? <Caption kind="success" icon="cloud_done">Enviamos tu respuesta.</Caption>
          : (
            <div className="m-row" style={{ alignItems: 'flex-start' }}>
              <span style={{ flex: 'none' }}><TagIcono type="prevent" icon="schedule">Por enviar</TagIcono></span>
              <p className="t-body-sm m-muted m-grow">Guardamos tu respuesta en el teléfono. La enviaremos cuando tengas internet.</p>
            </div>
          ))}
      </section>
    </>
  )
}

/** D03 · Imagen ampliada sobre la clase, con «Guardar en mi teléfono». */
function ImagenAmpliada({ titulo, onClose }: { titulo: string; onClose: () => void }) {
  const { toast } = useApp()
  return (
    <div className="cl-viewer" role="dialog" aria-modal="true" aria-label={titulo}>
      <div className="m-row" style={{ gap: 4, padding: '30px 8px 0' }}>
        <IconButton icon="close" label="Cerrar imagen" onClick={onClose} autoFocus />
        <p className="t-title-md m-grow" style={{ margin: 0 }}>{titulo}</p>
      </div>
      <div className="m-media cl-viewer__img">
        <Icon name="image" size={64} />
        <span className="t-body-md">Imagen ampliada</span>
      </div>
      <div style={{ padding: '0 16px 24px' }}>
        <Button variant="outline" block icon="download" onClick={() => toast({ texto: 'Guardamos la imagen en la galería de tu teléfono.', tipo: 'success' })}>
          Guardar en mi teléfono
        </Button>
      </div>
    </div>
  )
}

/** D04 y D05 · Hoja inferior para abrir un archivo de Office con otra app, o explicar que no hay app. */
function HojaOffice({ hoja, onClose, onSinApp }: { hoja: Hoja; onClose: () => void; onSinApp: () => void }) {
  if (!hoja) return null
  const a = ARCHIVO[hoja.tipo]
  if (hoja.modo === 'sin-app') {
    return (
      <Sheet open onClose={onClose}>
        <div className="m-row" style={{ gap: 12 }}>
          <Circle t="prevent" icon="block" />
          <h2 className="t-title-lg m-title m-grow">No tienes una app para abrir este archivo</h2>
        </div>
        <p className="t-body-md m-text">Para abrir archivos de {a.app} instala una app de documentos. Búscala en la tienda de tu teléfono.</p>
        <div className="m-actions">
          <Button block icon="apps" onClick={() => go('perfil/apps')}>Ver apps recomendadas</Button>
          <Button variant="text" block onClick={onClose}>Ahora no</Button>
        </div>
      </Sheet>
    )
  }
  return (
    <Sheet open onClose={onClose}>
      <div className="m-row" style={{ gap: 12 }}>
        <Tile t={a.color} size={56}><Icon name={a.icono} size={28} /></Tile>
        <h2 className="t-title-lg m-title m-grow">Este archivo se abre con otra app</h2>
      </div>
      <p className="t-body-md m-text">«{hoja.nombre}» es un archivo de {a.app}. Tu teléfono lo abrirá con una app de documentos que tengas instalada.</p>
      <div className="m-actions">
        <Button block icon="open_in_new" onClick={onSinApp}>Abrir</Button>
        <Button variant="text" block onClick={onClose}>Cancelar</Button>
      </div>
    </Sheet>
  )
}
