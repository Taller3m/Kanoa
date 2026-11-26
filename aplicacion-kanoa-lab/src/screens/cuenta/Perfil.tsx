import { useState, type ReactNode } from 'react'
import { Button, Icon } from '../../ui'
import { AppBar, BottomNav, Dialog, Hero, Notice, Screen, Scroll, StatusChip, Tile, UserAvatar } from '../../mobile'
import { go } from '../../app/router'
import { useApp } from '../../app/store'
import { CLASES, ESTUDIANTE, PORTADA_MB } from '../../app/data'
import { APPS_DOCUMENTOS } from './data'
import './cuenta.css'

const plural = (n: number, uno: string, varios: string) => `${n} ${n === 1 ? uno : varios}`

/** Fila de la lista del perfil: ícono, título y detalle; con `onClick` lleva a otra pantalla. */
function Fila({ icon, titulo, detalle, onClick }: { icon: string; titulo: string; detalle: ReactNode; onClick?: () => void }) {
  const contenido = (
    <>
      <Icon name={icon} className="cu-li-icon" />
      <span className="m-col m-grow" style={{ gap: 0 }}>
        <span className="t-title-sm m-title">{titulo}</span>
        <span className="t-body-sm m-muted">{detalle}</span>
      </span>
      {onClick && <Icon name="chevron_right" className="cu-li-icon" />}
    </>
  )
  return onClick
    ? <button type="button" className="m-li cu-li-link" onClick={onClick}>{contenido}</button>
    : <div className="m-li">{contenido}</div>
}

/** H01 · Perfil (solo lectura, sin avatar: pasó al Kit) con lo que hay «En este teléfono». H03/H04 · diálogo de cerrar sesión. */
export function Perfil({ cerrar }: { cerrar: boolean }) {
  const { s, set } = useApp()
  const [dialogo, setDialogo] = useState(cerrar)
  const nombre = `${ESTUDIANTE.nombre} ${ESTUDIANTE.apellido}`

  // Descargas: clases y portadas ya descargadas, y lo que ocupan.
  const descargadas = Object.entries(s.descargas).filter(([, d]) => d.estado === 'descargada').map(([id]) => id)
  const portadas = descargadas.filter((id) => id.startsWith('portada:')).length
  const clases = descargadas.length - portadas
  const mb = descargadas.reduce((t, id) => t + (id.startsWith('portada:') ? PORTADA_MB : (CLASES.find((c) => c.id === id)?.tamanoMB ?? 0)), 0)
  const descargasTexto = descargadas.length === 0
    ? 'Nada descargado'
    : `${[clases && plural(clases, 'clase', 'clases'), portadas && plural(portadas, 'portada', 'portadas')].filter(Boolean).join(' y ')} · ${mb} MB`

  const cerrarSesion = () => {
    // Cerrar sesión obliga a sincronizar todo al volver a entrar (decisión de H03); el avance sin enviar se pierde (H04).
    set({ sesion: false, primeraSincronizacion: true, descargas: {}, porEnviar: 0 })
    setDialogo(false)
    go('ingreso')
  }

  return (
    <Screen label="Perfil">
      <Hero compact>
        <div className="m-row" style={{ gap: 14 }}>
          <span aria-hidden="true"><UserAvatar name={nombre} size={56} /></span>
          <div className="m-col m-grow" style={{ gap: 2 }}>
            <h1 className="t-title-lg">{nombre}</h1>
            <p className="t-body-md">{ESTUDIANTE.institucion} · {ESTUDIANTE.grado}</p>
          </div>
          <StatusChip />
        </div>
      </Hero>
      <Scroll style={{ paddingTop: 16, gap: 14 }}>
        <section className="m-card" aria-label="Tus datos y este teléfono" style={{ padding: '4px 8px 4px 16px', gap: 0 }}>
          <div className="m-list">
            <Fila icon="mail" titulo="Correo" detalle={ESTUDIANTE.correo} />
            <Fila icon="cloud_done" titulo="Tu información" onClick={() => go('estado')}
              detalle={s.sincronizando ? 'Actualizando…' : `Actualizada ${s.ultimaActualizacion}`} />
            <Fila icon="cloud_upload" titulo="Avance por enviar"
              detalle={s.porEnviar > 0 ? `${plural(s.porEnviar, 'cambio', 'cambios')} por enviar` : 'Todo enviado'} />
            <Fila icon="download" titulo="Descargas" detalle={descargasTexto} onClick={() => go('descargas')} />
            <Fila icon="apps" titulo="Apps para abrir documentos" detalle="Word, Excel y PowerPoint" onClick={() => go('perfil/apps')} />
          </div>
        </section>
        <Button variant="outline" tone="error" block icon="logout" onClick={() => setDialogo(true)}>Cerrar sesión</Button>
        <p className="t-body-sm m-muted" style={{ textAlign: 'center' }}>Tus datos los administra tu colegio. Si algo está mal, avísale a tu docente.</p>
      </Scroll>
      <BottomNav active="perfil" />

      {s.porEnviar > 0 ? (
        <Dialog open={dialogo} onClose={() => setDialogo(false)} title="¿Quieres cerrar sesión?"
          actions={<>
            <Button block onClick={() => setDialogo(false)}>Esperar</Button>
            <Button variant="text" tone="error" block onClick={cerrarSesion}>Cerrar sesión de todos modos</Button>
          </>}>
          <Notice type="prevent" icon="warning" title={`Tienes ${plural(s.porEnviar, 'cambio', 'cambios')} sin enviar`}>
            Si cierras sesión ahora, ese avance se pierde. Espera a tener internet para que se envíe.
          </Notice>
        </Dialog>
      ) : (
        <Dialog open={dialogo} onClose={() => setDialogo(false)} title="¿Quieres cerrar sesión?"
          actions={<>
            <Button variant="outline" tone="error" block onClick={cerrarSesion}>Cerrar sesión</Button>
            <Button variant="text" block onClick={() => setDialogo(false)}>Cancelar</Button>
          </>}>
          Para volver a entrar necesitarás internet. Al ingresar, la app vuelve a preparar tus clases.
        </Dialog>
      )}
    </Screen>
  )
}

/** H02 · Apps recomendadas para abrir Word, Excel y PowerPoint (por validar). */
export function AppsDocumentos() {
  const { toast } = useApp()
  return (
    <Screen label="Apps para documentos">
      <AppBar title="Apps para documentos" subtitle="Word, Excel y PowerPoint" onBack={() => go('perfil')} />
      <Scroll style={{ paddingTop: 8, gap: 12 }}>
        <p className="t-body-md m-text">Kanoa abre PDF, imágenes, audios y videos. Para abrir archivos de Word, Excel y PowerPoint tu teléfono necesita una de estas apps.</p>
        {APPS_DOCUMENTOS.map((a) => (
          <section key={a.id} className="m-card" aria-label={a.nombre} style={{ gap: 12 }}>
            <div className="m-row" style={{ gap: 12, alignItems: 'flex-start' }}>
              <Tile t={a.tono} size={44}><Icon name="apps" /></Tile>
              <div className="m-col m-grow" style={{ gap: 2 }}>
                <p className="t-title-sm m-title">{a.nombre}</p>
                <p className="t-body-sm m-muted">{a.detalle}</p>
              </div>
            </div>
            <Button variant="outline" size="small" block icon="open_in_new" aria-label={`Buscar ${a.nombre} en la tienda`}
              onClick={() => toast(`Abrimos la tienda de apps con la búsqueda «${a.busqueda}».`)}>Buscar en la tienda</Button>
          </section>
        ))}
        <p className="t-body-sm m-muted">Si tu colegio te entregó la tableta, es posible que ya las tenga instaladas.</p>
      </Scroll>
      <BottomNav active="perfil" />
    </Screen>
  )
}
