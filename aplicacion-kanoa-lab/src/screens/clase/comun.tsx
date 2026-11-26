import type { ReactNode } from 'react'
import { Button, Icon, StatusTag, type TagType } from '../../ui'
import { AppBar, Circle, DownloadButton, Scroll } from '../../mobile'
import { go } from '../../app/router'
import { useApp } from '../../app/store'
import { areaDe, type Clase } from '../../app/data'
import './clase.css'

/** Etiqueta de estado del sistema con ícono delante («Sin internet», «Clase descargada», «Por enviar»). */
export function TagIcono({ type, icon, children }: { type: TagType; icon: string; children: ReactNode }) {
  return <StatusTag type={type}><Icon name={icon} size={16} />{children}</StatusTag>
}

/** Barra superior de la clase: volver al área, título, «Área · Página n de m» y control de descarga. */
export function ClaseBar({ clase, subtitulo }: { clase: Clase; subtitulo: string }) {
  const { s, descargar, cancelarDescarga, descargaDe, toast, faltaMB } = useApp()
  const d = descargaDe(clase.id)
  const area = areaDe(clase.areaId)
  const tocar = () => {
    if (d.estado === 'descargando' || d.estado === 'en-cola' || d.estado === 'pausada') {
      cancelarDescarga(clase.id)
      toast('Cancelamos la descarga de la clase.')
    } else if (d.estado === 'descargada') toast({ texto: 'Esta clase ya está en tu teléfono.', tipo: 'success' })
    else pedirDescarga()
  }
  const pedirDescarga = () => {
    const r = descargar(clase.id)
    if (r === 'sin-internet') toast({ texto: 'Necesitas internet para descargar la clase.', tipo: 'prevent' })
    else if (r === 'sin-espacio') toast({ texto: `No hay espacio suficiente: faltan ${faltaMB(clase.id)} MB.`, tipo: 'error', accion: 'Liberar', onAccion: () => go('descargas/liberar') })
  }
  return (
    <AppBar title={clase.titulo} subtitle={`${area.nombre} · ${subtitulo}`} onBack={() => go(`area/${area.id}`)}
      actions={<span className="cl-dl"><DownloadButton d={d} sizeMB={clase.tamanoMB} offline={!s.online} onClick={tocar} /></span>} />
  )
}

/** Etiquetas «Sin internet» + «Clase descargada» que encabezan la clase sin conexión (D07–D09). */
export function EtiquetasSinInternet() {
  return (
    <div className="m-row" style={{ flexWrap: 'wrap' }}>
      <TagIcono type="prevent" icon="cloud_off">Sin internet</TagIcono>
      <TagIcono type="success" icon="download_done">Clase descargada</TagIcono>
    </div>
  )
}

/** D10 · Clase sin descargar y sin internet: no se muestran las páginas. */
export function ClaseNoDescargada({ clase }: { clase: Clase }) {
  return (
    <>
      <AppBar title={clase.titulo} subtitle={`${areaDe(clase.areaId).nombre} · Clase ${clase.numero}`} onBack={() => go(`area/${clase.areaId}`)} />
      <Scroll noNav>
        <div className="m-empty">
          <Circle t="grey" size={88} icon="cloud_off" iconSize={40} />
          <h2 className="t-headline-sm m-title">Esta clase no está en tu teléfono</h2>
          <p className="t-body-md" style={{ margin: 0, color: 'var(--on-surface-variant)' }}>
            Para verla necesitas internet. Cuando tengas conexión, descárgala y podrás verla aunque no tengas internet.
          </p>
          <Button block onClick={() => go(`area/${clase.areaId}`)}>Volver a mis clases</Button>
        </div>
      </Scroll>
    </>
  )
}
