import { useEffect, useRef, type PointerEvent, type ReactNode, type TouchEvent, type WheelEvent } from 'react'
import { Button, Icon, ProgressBar, StatusTag } from '../../ui'
import { AreaTag, AreaTile, BottomNav, Caption, Hero, Screen, Scroll, Sheet, StatusChip, UserAvatar } from '../../mobile'
import { go } from '../../app/router'
import { useApp, useConexion } from '../../app/store'
import { AREAS, CLASES, ESTUDIANTE, areaDe, claseDe } from '../../app/data'
import './inicio.css'

/** Texto del snackbar de B04 (difiere del que emite `setOnline(true)` del store). */
const TEXTO_VOLVIO = 'Volviste a tener internet. Enviamos tu avance y actualizamos tus clases.'

/**
 * B01–B04 · Inicio: saludo, «Continúa tu clase» y bloques de área.
 * B02 se deriva de `!s.online`, B03 de `s.sincronizando` (deslizar hacia abajo en el tope llama a `sincronizar()`)
 * y B04 muestra el snackbar de «volvió el internet» con `?volvio=1`.
 * `hoja` dibuja una capa encima (B05, estado de tu información).
 */
export function Inicio({ volvio, hoja }: { volvio?: boolean; hoja?: ReactNode }) {
  const { s, sincronizar, descargaDe, toast } = useApp()
  const conexion = useConexion()
  const clase = claseDe('partes-celula')
  const area = areaDe(clase.areaId)
  const pagina = 2
  const pct = Math.round((pagina / clase.paginas) * 100)
  const descargada = descargaDe(clase.id).estado === 'descargada'

  useEffect(() => {
    if (volvio) toast({ texto: TEXTO_VOLVIO, tipo: 'success' })
  }, [volvio, toast])

  const actualizar = () => {
    if (s.sincronizando) return
    if (!s.online) { toast({ texto: 'Necesitas internet para actualizar.', tipo: 'prevent' }); return }
    sincronizar()
  }
  const pull = usePullToRefresh(actualizar)

  const subtitulo = conexion === 'sin-internet' ? 'Estás sin internet. Puedes ver lo que guardaste en tu teléfono.'
    : conexion === 'actualizando' ? 'Buscando cambios en tus clases…' : '¿Qué vas a aprender hoy?'

  return (
    <Screen label="Inicio">
      <Hero>
        <div className="m-row">
          <UserAvatar name={`${ESTUDIANTE.nombre} ${ESTUDIANTE.apellido}`} />
          <span className="m-grow" />
          <StatusChip />
        </div>
        <div className="m-col" style={{ gap: 2 }}>
          <h1 className="t-headline-md">Hola, {ESTUDIANTE.nombre}</h1>
          <p className="t-body-lg" aria-live="polite">{subtitulo}</p>
        </div>
      </Hero>
      {/* Forma accesible de actualizar: aparece al llegar con el teclado */}
      <div className="ina-skip">
        <Button size="small" variant="raised" icon="refresh" onClick={actualizar} disabled={s.sincronizando}>Actualizar ahora</Button>
      </div>
      <div ref={pull.ref} style={{ display: 'contents' }} {...pull.handlers}>
        <Scroll overlap>
          {s.sincronizando && (
            <div className="ina-ptr-wrap">
              <span className="ina-ptr" role="status" aria-label="Actualizando"><Icon name="autorenew" /></span>
            </div>
          )}
          <section className="m-card" aria-label="Continúa tu clase" style={{ padding: '18px 16px 16px' }}>
            <div className="m-row">
              <p className="t-label-sm m-grow" style={{ margin: 0, color: 'var(--on-surface-variant)', textTransform: 'uppercase' }}>Continúa tu clase</p>
              <AreaTag area={area} />
            </div>
            <div className="m-col" style={{ gap: 2 }}>
              <p className="t-title-lg m-title">{clase.titulo}</p>
              <p className="t-body-sm m-muted">Clase {clase.numero} · Vas en la página {pagina} de {clase.paginas}</p>
            </div>
            <div className="m-row" style={{ gap: 12 }}>
              <ProgressBar value={pct} label="Avance de la clase" />
              <span className="t-label-md" style={{ color: 'var(--title)', flex: 'none' }}>{pct} %</span>
            </div>
            {!s.online && descargada ? <span><Caption kind="success" icon="download_done">Disponible sin internet</Caption></span>
              : !s.online ? <span><Caption icon="cloud_off">Necesitas internet</Caption></span>
              : <span className="t-label-md m-muted">Te faltan {clase.paginas - pagina} páginas</span>}
            <Button block iconEnd="arrow_forward" onClick={() => go(`clase/${clase.id}/${pagina}`)}>Continuar la clase</Button>
          </section>
          <div className="m-col" style={{ gap: 2 }}>
            <h2 className="t-title-md m-title">Tus áreas</h2>
            <p className="t-body-sm m-muted">La barra muestra las clases que completaste. No es una nota.</p>
          </div>
          <div className="m-grid2">
            {AREAS.map((a) => <AreaTile key={a.id} area={a} onClick={() => go(`area/${a.id}`)} />)}
          </div>
        </Scroll>
      </div>
      <BottomNav active="inicio" />
      {hoja}
    </Screen>
  )
}

/**
 * «Deslizar para actualizar» simple: arrastrar (dedo o ratón) o rodar la rueda hacia abajo
 * cuando el scroll está en el tope llama a `onRefresh`.
 */
function usePullToRefresh(onRefresh: () => void) {
  const ref = useRef<HTMLDivElement>(null)
  const inicio = useRef<number | null>(null)
  const rueda = useRef(0)
  const enTope = () => (ref.current?.querySelector('.m-scroll')?.scrollTop ?? 0) <= 0
  const empezar = (y: number) => { inicio.current = enTope() ? y : null }
  const mover = (y: number) => {
    if (inicio.current === null) return
    if (y - inicio.current > 70) { inicio.current = null; onRefresh() }
  }
  const terminar = () => { inicio.current = null }
  return {
    ref,
    handlers: {
      onTouchStart: (e: TouchEvent) => empezar(e.touches[0]!.clientY),
      onTouchMove: (e: TouchEvent) => mover(e.touches[0]!.clientY),
      onTouchEnd: terminar,
      onPointerDown: (e: PointerEvent) => { if (e.pointerType === 'mouse') empezar(e.clientY) },
      onPointerMove: (e: PointerEvent) => { if (e.pointerType === 'mouse') mover(e.clientY) },
      onPointerUp: terminar,
      onPointerLeave: terminar,
      onWheel: (e: WheelEvent) => {
        if (e.deltaY >= 0 || !enTope()) { rueda.current = 0; return }
        rueda.current += -e.deltaY
        if (rueda.current > 120) { rueda.current = 0; onRefresh() }
      },
    },
  }
}

/** B05 · Estado de tu información: hoja sobre el Inicio con la última actualización, lo que falta enviar y las descargas. */
export function Estado() {
  const { s, sincronizar } = useApp()
  const conexion = useConexion()
  const clasesDescargadas = CLASES.filter((c) => s.descargas[c.id]?.estado === 'descargada')
  const mb = clasesDescargadas.reduce((t, c) => t + c.tamanoMB, 0)
  const ultima = s.ultimaActualizacion.charAt(0).toUpperCase() + s.ultimaActualizacion.slice(1)
  const cerrar = () => go('inicio')
  const filas: { icon: string; titulo: string; detalle?: string; valor: string }[] = [
    { icon: 'update', titulo: 'Última actualización', valor: ultima },
    { icon: 'cloud_upload', titulo: 'Avance por enviar', detalle: 'Páginas vistas y respuestas de práctica. Se envían solos cuando tengas internet.',
      valor: s.porEnviar === 0 ? 'Nada' : `${s.porEnviar} ${s.porEnviar === 1 ? 'cambio' : 'cambios'}` },
    { icon: 'download_done', titulo: 'Clases descargadas', valor: `${clasesDescargadas.length} · ${mb} MB` },
  ]
  return (
    <Inicio hoja={
      <Sheet open onClose={cerrar} title="Tu información en este teléfono">
        <span style={{ marginTop: -8 }}>
          {conexion === 'sin-internet' ? <StatusTag type="prevent">Sin internet</StatusTag>
            : conexion === 'actualizando' ? <StatusTag type="general">Actualizando</StatusTag>
            : <StatusTag type="success">Al día</StatusTag>}
        </span>
        <div className="m-list">
          {filas.map((f) => (
            <div key={f.titulo} className="m-li ina-estado-li">
              <Icon name={f.icon} />
              <span className="m-col m-grow" style={{ gap: 2 }}>
                <span className="t-title-sm m-title">{f.titulo}</span>
                {f.detalle && <span className="t-body-sm m-muted">{f.detalle}</span>}
              </span>
              <span className="t-title-sm ina-estado-val">{f.valor}</span>
            </div>
          ))}
        </div>
        <div className="m-actions">
          <Button block icon="refresh" disabled={!s.online || s.sincronizando} onClick={sincronizar}>
            {s.sincronizando ? 'Actualizando…' : 'Actualizar ahora'}
          </Button>
          {!s.online && <p className="t-body-sm m-muted" style={{ textAlign: 'center', padding: '4px 0 8px' }}>Necesitas internet para actualizar.</p>}
          <Button block variant="outline" onClick={() => go('descargas')}>Ver descargas</Button>
          <Button block variant="text" onClick={cerrar}>Cerrar</Button>
        </div>
      </Sheet>
    } />
  )
}
