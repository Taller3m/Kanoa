import { useEffect } from 'react'
import { Button, IconButton, Icon } from '../../ui'
import { BottomNav, Caption, Dialog, DownloadButton, HeroTitle, Notice, Screen, Scroll, SpaceBar, Tile } from '../../mobile'
import { go } from '../../app/router'
import { useApp } from '../../app/store'
import { ACTUALIZACION, DIAS_POCO_USO, DIAS_SIN_ABRIR, POCO_ESPACIO_MB, TELEFONO_MB, formatoMB, itemDe, type ItemDescarga } from './data'
import './descargas.css'

/** Mosaico con el número de la clase (o el ícono de portada) en el color del área. */
export function DlTile({ item }: { item: ItemDescarga }) {
  return <Tile t={item.area.color} size={44}>{item.portada ? <Icon name="image" /> : item.numero}</Tile>
}

/** Tarjeta «Espacio en tu teléfono» con la barra por segmentos y su leyenda. */
function Espacio({ kanoaMB, libreMB, poco }: { kanoaMB: number; libreMB: number; poco: boolean }) {
  const pctKanoa = Math.max(2, (kanoaMB / TELEFONO_MB) * 100)
  const pctLibre = Math.max(1, (libreMB / TELEFONO_MB) * 100)
  const pctOtras = Math.max(0, 100 - pctKanoa - pctLibre)
  return (
    <section className="m-card" aria-label="Espacio en tu teléfono" style={{ gap: 10 }}>
      <div className="m-row">
        <h2 className="t-title-md m-title m-grow">Espacio en tu teléfono</h2>
        <p className="t-title-sm" style={{ margin: 0, color: poco ? 'var(--prevent)' : 'var(--title)' }}>Libres: {formatoMB(libreMB)}</p>
      </div>
      <SpaceBar
        label={`Espacio del teléfono: Kanoa ${formatoMB(kanoaMB)}, otras apps, libre ${formatoMB(libreMB)}`}
        segments={[
          { pct: pctKanoa, color: 'var(--primary)' },
          { pct: pctOtras, color: 'var(--surface-container-highest)' },
        ]}
      />
      <div className="m-row" style={{ gap: 16 }}>
        <span className="m-legend"><i style={{ background: 'var(--primary)' }} />Kanoa · {formatoMB(kanoaMB)}</span>
        <span className="m-legend"><i style={{ background: 'var(--surface-container-highest)' }} />Otras apps</span>
        <span className="m-legend"><i style={{ background: 'var(--surface-container)' }} />Libre</span>
      </div>
    </section>
  )
}

/** E01–E04 · Descargas: espacio, cola de descargas y lo que está en el teléfono. E06 es el diálogo `?quitar=<id>`. */
export function Descargas({ quitar, actualizada }: { quitar: string | null; actualizada: boolean }) {
  const { s, cancelarDescarga, quitarDescarga, sincronizar, toast } = useApp()

  // E03: la clase republicada se actualiza y solo bajan los archivos que cambiaron.
  useEffect(() => {
    if (!actualizada) return
    const item = itemDe(ACTUALIZACION.id)
    sincronizar()
    if (item) toast({ texto: `Hay cambios en «${item.titulo}». Solo bajamos los archivos nuevos.` })
  }, [actualizada, sincronizar, toast])

  const entradas = Object.entries(s.descargas)
    .map(([id, d]) => ({ id, d, item: itemDe(id) }))
    .filter((e): e is typeof e & { item: ItemDescarga } => e.item !== null)
  const activas = entradas.filter((e) => e.d.estado === 'descargando' || e.d.estado === 'pausada' || e.d.estado === 'en-cola')
    .sort((a, b) => (a.d.estado === 'en-cola' ? 1 : 0) - (b.d.estado === 'en-cola' ? 1 : 0))
  const enTelefono = entradas.filter((e) => e.d.estado === 'descargada')
  const kanoaMB = enTelefono.reduce((t, e) => t + e.item.tamanoMB, 0)
  const poco = s.libreMB < POCO_ESPACIO_MB

  const aQuitar = quitar ? enTelefono.find((e) => e.id === quitar)?.item ?? itemDe(quitar) : null
  const cerrar = () => go('descargas')
  const confirmarQuitar = () => {
    if (!aQuitar) return
    quitarDescarga(aQuitar.id)
    toast({ texto: `Quitaste «${aQuitar.titulo}». Liberaste ${formatoMB(aQuitar.tamanoMB)}.`, tipo: 'success' })
    cerrar()
  }

  return (
    <Screen label="Descargas">
      <HeroTitle title="Descargas" subtitle="Lo que puedes ver sin internet" />
      <Scroll style={{ paddingTop: 16, gap: 14 }}>
        {!s.online && (
          <Notice type="prevent" icon="cloud_off">Estás sin internet. Las descargas siguen solas cuando vuelvas a conectarte.</Notice>
        )}
        {poco && (
          <Notice type="prevent" icon="sd_card_alert" title="Tu teléfono tiene poco espacio"
            actions={<Button size="small" onClick={() => go('descargas/liberar')}>Liberar espacio</Button>}>
            Quedan {formatoMB(s.libreMB)} libres. Para descargar más clases, quita las que ya no uses.
          </Notice>
        )}

        <Espacio kanoaMB={kanoaMB} libreMB={s.libreMB} poco={poco} />

        {activas.length > 0 && (
          <section className="m-card dl-card" aria-label="Descargando" style={{ gap: 4, paddingTop: 14 }}>
            <h2 className="t-title-sm m-title">Descargando · {activas.length}</h2>
            <div className="m-list">
              {activas.map(({ id, d, item }) => {
                const bajados = Math.round((d.progreso / 100) * item.tamanoMB)
                return (
                  <div key={id} className="m-li">
                    <DlTile item={item} />
                    <span className="m-col m-grow" style={{ gap: 2 }}>
                      <span className="t-title-sm m-title">{item.titulo}</span>
                      <span className="t-body-sm m-muted">{item.area.nombre}</span>
                      {d.estado === 'descargando' && <Caption kind="primary">Descargando · {bajados} de {item.tamanoMB} MB</Caption>}
                      {d.estado === 'pausada' && <Caption kind="prevent">En pausa · {bajados} de {item.tamanoMB} MB</Caption>}
                      {d.estado === 'en-cola' && <Caption>En cola</Caption>}
                    </span>
                    <DownloadButton d={d} sizeMB={item.tamanoMB} offline={!s.online} onClick={() => {
                      cancelarDescarga(id)
                      toast(`Cancelaste la descarga de «${item.titulo}».`)
                    }} />
                  </div>
                )
              })}
            </div>
          </section>
        )}

        <section className="m-card dl-card" aria-label="En tu teléfono" style={{ gap: 0, paddingTop: 8 }}>
          <div className="m-row">
            <h2 className="t-title-sm m-title m-grow">En tu teléfono · {enTelefono.length}</h2>
            <Button variant="text" size="small" onClick={() => go('descargas/liberar')}>Liberar espacio</Button>
          </div>
          {enTelefono.length === 0 ? (
            <p className="t-body-md m-muted" style={{ padding: '8px 0 12px' }}>Aún no tienes clases descargadas.</p>
          ) : (
            <div className="m-list">
              {enTelefono.map(({ id, d, item }) => {
                const dias = DIAS_SIN_ABRIR[id]
                const actualizando = actualizada && s.sincronizando && id === ACTUALIZACION.id
                return (
                  <div key={id} className="m-li">
                    <DlTile item={item} />
                    <span className="m-col m-grow" style={{ gap: 2 }}>
                      <span className="t-title-sm m-title">{item.titulo}</span>
                      <span className="t-body-sm m-muted">{item.area.nombre} · {formatoMB(item.tamanoMB)}</span>
                      {actualizando ? <Caption kind="primary" icon="sync">Actualizando {ACTUALIZACION.archivos} archivos</Caption>
                        : dias !== undefined && dias >= DIAS_POCO_USO ? <Caption kind="prevent">No la abres hace {dias} días</Caption>
                        : d.actualizada && !item.portada ? <Caption>Actualizada {d.actualizada}</Caption>
                        : null}
                    </span>
                    <IconButton icon="delete" label={`Quitar «${item.titulo}» del teléfono`} onClick={() => go(`descargas?quitar=${encodeURIComponent(id)}`)} />
                  </div>
                )
              })}
            </div>
          )}
        </section>
      </Scroll>
      <BottomNav active="descargas" />

      {/* E06 · Quitar una clase: el avance no se borra. */}
      <Dialog open={!!aQuitar} onClose={cerrar} title={aQuitar ? `¿Quitar «${aQuitar.titulo}» de tu teléfono?` : ''}
        actions={<>
          <Button block variant="outline" tone="error" onClick={confirmarQuitar}>Quitar del teléfono</Button>
          <Button block variant="text" onClick={cerrar}>Cancelar</Button>
        </>}>
        {aQuitar && <>Liberas {formatoMB(aQuitar.tamanoMB)}. Tu avance no se pierde y podrás descargarla otra vez cuando tengas internet.</>}
      </Dialog>
    </Screen>
  )
}
