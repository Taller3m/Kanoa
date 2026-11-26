import { Button } from '../../ui'
import { Dialog } from '../../mobile'
import { go } from '../../app/router'
import { useApp } from '../../app/store'
import './ingreso.css'

/** A05 y A06: avisos obligatorios de sesión (sin cerrar) que se dibujan sobre cualquier pantalla. */
export function AvisoSesion() {
  const { s, set } = useApp()
  if (!s.avisoSesion) return null
  const volver = () => { set({ avisoSesion: null, sesion: false }); go('ingreso') }

  if (s.avisoSesion === 'otro-dispositivo') {
    return (
      <Dialog open icon="smartphone" iconTone="prevent" title="Abriste Kanoa en otro dispositivo"
        actions={<Button block onClick={volver}>Ingresar de nuevo</Button>}>
        Tu cuenta solo puede estar abierta en un dispositivo a la vez. Para seguir en este, vuelve a ingresar.
      </Dialog>
    )
  }
  return (
    <Dialog open icon="lock" iconTone="primary" title="Tu sesión terminó"
      actions={<Button block onClick={volver}>Ingresar</Button>}>
      Pasaron más de dos semanas desde tu última conexión. Ingresa de nuevo para seguir usando Kanoa.
    </Dialog>
  )
}
