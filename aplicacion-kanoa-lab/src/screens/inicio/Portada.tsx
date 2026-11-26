import { Button, Icon, IconButton, ProgressBar } from '../../ui'
import { AppBar, BottomNav, Caption, Notice, Screen, Scroll, Tile } from '../../mobile'
import { go } from '../../app/router'
import { portadaKey, useApp } from '../../app/store'
import { PORTADA_MB, areaDe } from '../../app/data'
import { AreaHead } from './Area'
import { ICONO_RECURSO, materialDe, portadaDe, type Recurso } from './data'
import './inicio.css'

/** C02 · Portada del periodo: imagen, presentación, video y descarga de la portada para verla sin internet. */
export function PortadaPeriodo({ areaId }: { areaId: string }) {
  const { s, descargar, cancelarDescarga, descargaDe, faltaMB, toast } = useApp()
  const area = areaDe(areaId)
  const periodo = 1
  const p = portadaDe(area.id, area.nombre)
  const key = portadaKey(area.id, periodo)
  const d = descargaDe(key)
  const disponible = s.online || d.estado === 'descargada'

  const pedir = () => {
    const r = descargar(key)
    if (r === 'ok') toast('Descargando la portada. Puedes seguir usando la app.')
    else if (r === 'sin-espacio') toast({ texto: `No tienes espacio para la portada. Te faltan ${faltaMB(key)} MB.`, tipo: 'prevent', accion: 'Liberar', onAccion: () => go('descargas/liberar') })
    else toast({ texto: 'Necesitas internet para descargar.', tipo: 'prevent' })
  }
  const verVideo = () => disponible
    ? toast(`Reproduciendo «${p.video}» · ${p.duracion}`)
    : toast({ texto: 'Necesitas internet para ver el video. Descarga la portada para verlo sin internet.', tipo: 'prevent' })

  return (
    <Screen label={`Portada · ${area.nombre}`}>
      <AreaHead area={area} periodo={periodo} onBack={() => go(`area/${area.id}`)} />
      <Scroll style={{ paddingTop: 16, gap: 14 }}>
        <article className="m-card" style={{ gap: 16 }}>
          <div className="ina-cover">
            <div className="m-media" role="img" aria-label={`Imagen de portada: ${p.imagen}`}>
              <Icon name="image" size={32} />
              <span className="t-body-md">Imagen de portada · {p.imagen}</span>
            </div>
            <span className="ina-cover__save">
              <IconButton icon="download" label="Guardar imagen en mi teléfono" onClick={() => toast({ texto: 'Guardamos la imagen en tu teléfono.', tipo: 'success' })} />
            </span>
          </div>
          <div className="m-col" style={{ gap: 6 }}>
            <p className="t-label-sm" style={{ margin: 0, color: 'var(--on-surface-variant)', textTransform: 'uppercase' }}>Portada del periodo {periodo}</p>
            <h2 className="t-title-lg m-title">{p.titulo}</h2>
            <p className="t-title-sm m-title">{p.pregunta}</p>
            <p className="t-body-md m-text">{p.texto}</p>
          </div>
          <div className="m-media m-media--dark ina-video">
            <button type="button" className="m-play" style={{ border: 0, cursor: 'pointer' }} aria-label={`Reproducir video: ${p.video}`} onClick={verVideo}>
              <Icon name="play_arrow" />
            </button>
            <span className="m-media__dur">{p.duracion}</span>
          </div>
        </article>
        <section className="m-card" style={{ padding: 12 }} aria-label="Descargar portada">
          <div className="m-row" style={{ gap: 12 }}>
            <Tile t="primary" size={44}><Icon name={d.estado === 'descargada' ? 'download_done' : 'download'} /></Tile>
            <div className="m-col m-grow" style={{ gap: 0 }}>
              <p className="t-title-sm m-title">{d.estado === 'descargada' ? 'Portada descargada' : 'Descargar portada'}</p>
              {d.estado === 'descargada' ? <Caption kind="success">Disponible sin internet</Caption>
                : d.estado === 'descargando' || d.estado === 'pausada' ? (
                  <span className="m-row" style={{ gap: 8 }}>
                    <ProgressBar value={d.progreso} label="Avance de la descarga" />
                    <span className="t-label-md m-muted" style={{ flex: 'none' }}>{d.estado === 'pausada' ? 'En pausa · ' : ''}{d.progreso} %</span>
                  </span>
                ) : d.estado === 'en-cola' ? <Caption kind="primary" icon="schedule">En cola</Caption>
                : <p className="t-body-sm m-muted">Imagen y video · {PORTADA_MB} MB. Para verlos sin internet.</p>}
            </div>
            {d.estado === 'ninguna' && <Button size="small" variant="outline" disabled={!s.online} onClick={pedir}>Descargar</Button>}
            {(d.estado === 'descargando' || d.estado === 'pausada' || d.estado === 'en-cola') && (
              <Button size="small" variant="text" onClick={() => cancelarDescarga(key)}>Cancelar</Button>
            )}
          </div>
        </section>
      </Scroll>
      <BottomNav active="inicio" />
    </Screen>
  )
}

/** C06 · Material de tu docente: recursos que comparte el docente; se abren con internet. */
export function MaterialDocente({ areaId }: { areaId: string }) {
  const { s, toast } = useApp()
  const area = areaDe(areaId)
  const recursos = materialDe(area.id)
  const abrir = (r: Recurso) => s.online
    ? toast(r.tipo === 'Enlace' ? `Abriendo «${r.titulo}» en el navegador…` : `Abriendo «${r.titulo}»…`)
    : toast({ texto: 'Necesitas internet para abrir el material de tu docente.', tipo: 'prevent' })
  return (
    <Screen label="Material de tu docente">
      <AppBar title="Material de tu docente" subtitle={`${area.nombre} · ${area.docente}`} onBack={() => go(`area/${area.id}`)} />
      <Scroll style={{ paddingTop: 8, gap: 14 }}>
        <Notice icon="info">Este material lo comparte tu docente. No hace parte del contenido de Kanoa ni cuenta en tu avance. Para abrirlo necesitas internet.</Notice>
        {recursos.length === 0 ? (
          <p className="t-body-md m-muted">Tu docente aún no comparte material en esta área.</p>
        ) : (
          <section className="m-card" style={{ padding: '4px 8px 4px 16px' }} aria-label="Recursos">
            <ul className="m-list" style={{ listStyle: 'none', margin: 0, padding: 0 }}>
              {recursos.map((r) => (
                <li key={r.id} className="m-li">
                  <Tile t={ICONO_RECURSO[r.tipo].tone} size={44}><Icon name={ICONO_RECURSO[r.tipo].icon} /></Tile>
                  <span className="m-col m-grow" style={{ gap: 0 }}>
                    <span className="t-title-sm m-title">{r.titulo}</span>
                    <span className="t-body-sm m-muted">{r.tipo} · {r.fecha}</span>
                  </span>
                  <Button size="small" variant="text" aria-label={`Ver ${r.titulo}`} onClick={() => abrir(r)}>Ver</Button>
                </li>
              ))}
            </ul>
          </section>
        )}
      </Scroll>
      <BottomNav active="inicio" />
    </Screen>
  )
}
