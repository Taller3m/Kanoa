import { useEffect, useState } from 'react'
import { Button, Chip, Icon, IconButton, ProgressBar } from '../../ui'
import { AreaHeader, BottomNav, Caption, Circle, ClassBadge, DownloadButton, Notice, Screen, Scroll, Sheet, Tile } from '../../mobile'
import { go } from '../../app/router'
import { MARGEN_MB, portadaKey, useApp } from '../../app/store'
import { CLASES, areaDe, type Area, type Clase } from '../../app/data'
import { PERIODOS, materialDe, portadaDe } from './data'
import './inicio.css'

/** Encabezado del área en su color (C01–C05): volver, «Sin internet», material, nombre, docente y avance del periodo. */
export function AreaHead({ area, periodo, onBack }: { area: Area; periodo: number; onBack: () => void }) {
  const { s } = useApp()
  const delPeriodo = CLASES.filter((c) => c.areaId === area.id && c.periodo === periodo && c.estado !== 'cerrada')
  const hechas = delPeriodo.filter((c) => c.estado === 'completada').length
  const pct = delPeriodo.length ? Math.round((hechas / delPeriodo.length) * 100) : 0
  return (
    <AreaHeader area={area} onBack={onBack} actions={<>
      {!s.online && <span className="ina-offtag"><Icon name="cloud_off" size={16} />Sin internet</span>}
      <IconButton icon="folder_open" label="Material de tu docente" onClick={() => go(`area/${area.id}/material`)} />
    </>}>
      <div className="m-col ina-areahead-info" style={{ gap: 0 }}>
        <h1 className="t-headline-sm">{area.nombre}</h1>
        <p className="t-body-md">{area.docente}</p>
      </div>
      <div className="m-col ina-areahead-info" style={{ gap: 6 }}>
        <div className="m-row">
          <p className="t-label-md m-grow">Periodo {periodo} · Llevas {hechas} de {delPeriodo.length} clases</p>
          <p className="t-label-md">{pct} %</p>
        </div>
        <div className="m-progress-on-color"><ProgressBar value={pct} label="Avance del periodo" /></div>
      </div>
    </AreaHeader>
  )
}

/**
 * C01, C03, C04 y C05 · Área y periodo: chips de periodo, accesos a Portada y Material y la lista de clases con su descarga.
 * C03: una clase se descarga con su avance en vivo. C04: sin internet solo abren las descargadas.
 * C05: `descargar()` devolvió 'sin-espacio' y se abre la hoja (también con `?hoja=sin-espacio&clase=…`).
 */
export function AreaPeriodo({ areaId, query }: { areaId: string; query: URLSearchParams }) {
  const { s, descargar, cancelarDescarga, descargaDe, faltaMB, toast } = useApp()
  const area = areaDe(areaId)
  const [periodo, setPeriodo] = useState(1)
  const clases = CLASES.filter((c) => c.areaId === area.id && c.periodo === periodo)
  const primeraSinDescargar = clases.find((c) => c.estado !== 'cerrada' && descargaDe(c.id).estado === 'ninguna')
  const [sinEspacio, setSinEspacio] = useState<string | null>(
    query.get('hoja') === 'sin-espacio' ? (query.get('clase') ?? primeraSinDescargar?.id ?? null) : null)
  const portada = portadaDe(area.id, area.nombre)
  const portadaLista = descargaDe(portadaKey(area.id, periodo)).estado === 'descargada'
  const recursos = materialDe(area.id).length

  // C03: aviso de descarga en curso al abrir el escenario.
  const aviso = query.get('aviso')
  useEffect(() => {
    if (aviso !== 'descarga') return
    const enCurso = CLASES.find((c) => c.areaId === areaId && descargaDe(c.id).estado === 'descargando')
    if (enCurso) toast(`Descargando «${enCurso.titulo}». Puedes seguir usando la app.`)
    // Solo al montar el escenario.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [aviso, areaId])

  const pedirDescarga = (c: Clase) => {
    const r = descargar(c.id)
    if (r === 'ok') toast(`Descargando «${c.titulo}». Puedes seguir usando la app.`)
    else if (r === 'sin-espacio') setSinEspacio(c.id)
    else toast({ texto: 'Necesitas internet para descargar.', tipo: 'prevent' })
  }

  const claseSinEspacio = sinEspacio ? CLASES.find((c) => c.id === sinEspacio) : undefined

  return (
    <Screen label={area.nombre}>
      <AreaHead area={area} periodo={periodo} onBack={() => go('inicio')} />
      <Scroll style={{ paddingTop: 16, gap: 14 }}>
        {!s.online && <Notice type="prevent" icon="cloud_off">Estás sin internet. Solo puedes abrir las clases que descargaste.</Notice>}
        <div className="ina-chips" role="group" aria-label="Periodos">
          {PERIODOS.map((p) => <Chip key={p} active={p === periodo} onClick={() => setPeriodo(p)}>Periodo {p}</Chip>)}
        </div>
        <div className="m-grid2">
          <button type="button" className="m-card ina-access" onClick={() => go(`area/${area.id}/portada`)}>
            <Tile t="primary"><Icon name="image" /></Tile>
            <span className="m-col">
              <span className="t-title-sm m-title">Portada</span>
              <span className="t-body-sm m-muted">{!s.online && !portadaLista ? 'Con internet' : `Video · ${portada.duracion}`}</span>
            </span>
          </button>
          <button type="button" className="m-card ina-access" onClick={() => go(`area/${area.id}/material`)}>
            <Tile t="primary"><Icon name="folder_open" /></Tile>
            <span className="m-col">
              <span className="t-title-sm m-title">Material</span>
              <span className="t-body-sm m-muted">{recursos} {recursos === 1 ? 'recurso' : 'recursos'}</span>
            </span>
          </button>
        </div>
        <h2 className="t-title-md m-title">Tus clases</h2>
        {clases.length === 0 && <p className="t-body-md m-muted">Tu docente aún no abre clases en este periodo.</p>}
        {clases.map((c) => c.estado === 'cerrada' ? (
          <div key={c.id} className="m-card m-card--flat ina-clase--cerrada">
            <ClassBadge estado="cerrada" numero={c.numero} />
            <div className="m-col m-grow" style={{ gap: 2 }}>
              <p className="t-title-md m-muted">{c.titulo}</p>
              <p className="t-body-sm m-muted">Tu docente aún no abre esta clase</p>
            </div>
          </div>
        ) : (
          <TarjetaClase key={c.id} clase={c} onDescargar={() => pedirDescarga(c)} onCancelar={() => cancelarDescarga(c.id)} />
        ))}
      </Scroll>
      <BottomNav active="inicio" />

      <Sheet open={!!claseSinEspacio} onClose={() => setSinEspacio(null)}>
        {claseSinEspacio && <>
          <div className="m-row" style={{ gap: 16 }}>
            <Circle t="prevent" icon="sd_card_alert" />
            <h2 className="t-title-lg m-title m-grow">No tienes espacio para esta clase</h2>
          </div>
          <p className="t-body-md m-text">
            La clase pesa {claseSinEspacio.tamanoMB} MB y en tu teléfono quedan {s.libreMB} MB libres. Siempre dejamos {MARGEN_MB} MB libres para que tu teléfono funcione bien.
          </p>
          <Notice type="prevent" icon="storage">
            <span className="m-col" style={{ gap: 0 }}>
              <span>Te faltan</span>
              <span className="t-title-lg ina-falta">{faltaMB(claseSinEspacio.id)} MB</span>
            </span>
          </Notice>
          <div className="m-actions">
            <Button block onClick={() => go('descargas/liberar')}>Liberar espacio</Button>
            <Button block variant="text" onClick={() => setSinEspacio(null)}>Ahora no</Button>
          </div>
        </>}
      </Sheet>
    </Screen>
  )
}

/** Tarjeta de una clase abierta o completada con su estado de descarga. */
function TarjetaClase({ clase: c, onDescargar, onCancelar }: { clase: Clase; onDescargar: () => void; onCancelar: () => void }) {
  const { s, descargaDe } = useApp()
  const d = descargaDe(c.id)
  const abierta = c.estado === 'abierta'
  const descargada = d.estado === 'descargada'
  const detalle = c.estado === 'completada' ? `Completada · ${c.fecha}` : [c.fecha, c.detalle].filter(Boolean).join(' · ')

  const caption = d.estado === 'descargando' ? <Caption kind="primary">Descargando · {d.progreso} %</Caption>
    : d.estado === 'pausada' ? <Caption kind="prevent" icon="pause">En pausa · {d.progreso} %</Caption>
    : d.estado === 'en-cola' ? <Caption kind="primary" icon="schedule">En cola</Caption>
    : descargada ? <Caption kind="success" icon="download_done">Disponible sin internet</Caption>
    : !s.online ? <Caption icon="cloud_off">Necesitas internet</Caption>
    : abierta ? <Caption>Sin descargar · {c.tamanoMB} MB</Caption> : null

  const onClick = d.estado === 'descargando' || d.estado === 'en-cola' || d.estado === 'pausada' ? onCancelar
    : d.estado === 'ninguna' && s.online ? onDescargar : undefined

  return (
    <div className="m-card ina-clase">
      <div className="ina-clase__row">
        <ClassBadge estado={c.estado} numero={c.numero} />
        <button type="button" className="ina-clase__info" onClick={() => go(`clase/${c.id}/1`)}>
          <span className="t-title-md m-title">{c.titulo}</span>
          <span className="t-body-sm m-muted">{detalle}</span>
          {caption && <span className="ina-clase__cap">{caption}</span>}
        </button>
        <span className={descargada ? 'ina-dl-done' : undefined}>
          <DownloadButton d={d} sizeMB={c.tamanoMB} offline={!s.online} onClick={onClick} />
        </span>
      </div>
      {abierta ? (
        <div className="ina-clase__actions">
          <Button block size="small" onClick={() => go(`clase/${c.id}/2`)}>Continuar</Button>
        </div>
      ) : !s.online ? (
        <div className="ina-clase__actions">
          <Button block size="small" variant="outline" onClick={() => go(`clase/${c.id}/1`)}>Repasar</Button>
        </div>
      ) : null}
    </div>
  )
}
