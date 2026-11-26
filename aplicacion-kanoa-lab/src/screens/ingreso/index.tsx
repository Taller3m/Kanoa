import type { ScreenGroup } from '../types'
import { IniciarSesion } from './IniciarSesion'
import { Preparando } from './Preparando'
import { AvisoSesion } from './AvisoSesion'

export const ingreso: ScreenGroup = {
  id: 'ingreso',
  name: 'Ingreso y sesión',
  routes: [
    { pattern: 'ingreso', render: (_p, q) => <IniciarSesion errorInicial={q.get('error') === '1'} /> },
    { pattern: 'preparando', render: () => <Preparando /> },
  ],
  scenarios: [
    { id: 'A01', title: 'Iniciar sesión', route: 'ingreso', state: { sesion: false } },
    { id: 'A02', title: 'Correo o contraseña incorrectos', route: 'ingreso?error=1', state: { sesion: false } },
    { id: 'A03', title: 'Ingresar sin internet', route: 'ingreso', state: { sesion: false, online: false } },
    { id: 'A04', title: 'Preparando tus clases (primera vez)', route: 'preparando', state: { primeraSincronizacion: true } },
    { id: 'A05', title: 'Sesión abierta en otro dispositivo', route: 'inicio', state: { avisoSesion: 'otro-dispositivo' } },
    { id: 'A06', title: 'La sesión venció', route: 'inicio', state: { avisoSesion: 'vencida' } },
  ],
  Overlay: AvisoSesion,
}
