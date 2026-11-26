import { Button, Icon, IconButton, StatusTag } from '../../ui'
import { Notice, PagerBar, Screen, Scroll, Segments, Tile } from '../../mobile'
import { go } from '../../app/router'
import { useApp } from '../../app/store'
import { claseDe } from '../../app/data'
import { actividadesDe, faltaDe, paginasDe } from './data'
import { ClaseBar, ClaseNoDescargada, EtiquetasSinInternet } from './comun'

/** D06 y D09 · Última página de la clase: actividades evaluativas. Sin internet quedan bloqueadas. */
export function Actividades({ claseId }: { claseId: string }) {
  const { s, descargaDe, toast } = useApp()
  const clase = claseDe(claseId)
  const anterior = paginasDe(clase.id).length
  const total = anterior + 1
  const online = s.online
  if (!online && descargaDe(clase.id).estado !== 'descargada') return <Screen white label={clase.titulo}><ClaseNoDescargada clase={clase} /></Screen>

  return (
    <Screen white label={clase.titulo}>
      <ClaseBar clase={clase} subtitulo={`Página ${total} de ${total}`} />
      <Segments total={total} current={total} />
      <Scroll pager>
        {!online && <EtiquetasSinInternet />}
        <h2 className="t-headline-sm m-title">¡Muestra lo que aprendiste!</h2>
        {actividadesDe(clase.id).map((a) => {
          const verbo = a.tipo === 'cuestionario' ? 'responder' : 'entregar'
          const accion = a.tipo === 'cuestionario' ? 'Responder' : 'Entregar'
          const hacer = () => (a.tipo === 'cuestionario'
            ? go(`clase/${clase.id}/cuestionario`)
            : toast('Elige en tu teléfono el archivo que quieres entregar.'))
          return (
            <section key={a.id} className="m-card" aria-label={a.titulo}>
              <div className="m-row" style={{ gap: 12 }}>
                <Tile t="secondary" size={44}><Icon name={a.icono} /></Tile>
                <div className="m-col m-grow" style={{ gap: 0 }}>
                  <p className="t-title-md m-title">{a.titulo}</p>
                  <p className="t-body-sm m-muted">{a.detalle}</p>
                </div>
                <StatusTag type="success">Disponible</StatusTag>
              </div>
              <p className="t-body-md m-text">{a.plazo}</p>
              {!online && <Notice type="prevent" icon="cloud_off">Necesitas internet para {verbo}. Así tu docente recibe tu trabajo.</Notice>}
              <Button block disabled={!online} onClick={hacer}>{accion}</Button>
            </section>
          )
        })}
        <Notice icon="flag" title="Llegaste al final de esta clase.">
          {faltaDe(clase.id)}{!online && ' Tu avance quedó guardado y se enviará cuando tengas internet.'}
        </Notice>
      </Scroll>
      <PagerBar>
        <IconButton icon="arrow_back" label="Página anterior" className="cl-line" onClick={() => go(`clase/${clase.id}/${anterior}`)} />
        <p className="t-label-md m-grow" style={{ margin: 0, color: 'var(--on-surface-variant)' }}>Página {total} de {total}</p>
        <Button onClick={() => go(`area/${clase.areaId}`)}>Volver</Button>
      </PagerBar>
    </Screen>
  )
}
