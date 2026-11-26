import type { ScreenGroup } from '../types'
import { Kit, KitAvatar, KitConversacion } from './Kit'
import { Grupo } from './Grupo'
import { AppsDocumentos, Perfil } from './Perfil'

/** Avatar y nickname de ejemplo del lienzo (F01–F04). */
const KIT_VALE = { kit: { avatar: 'secondary', nickname: 'Vale' } }

export const cuenta: ScreenGroup = {
  id: 'cuenta',
  name: 'Kit, grupo y perfil',
  routes: [
    // `key` con la query: al abrir otro escenario sobre la misma ruta, la pantalla toma de nuevo su estado inicial.
    { pattern: 'kit', render: (_, q) => <Kit key={q.toString()} emocion={q.get('emocion')} /> },
    { pattern: 'kit/conversacion', render: (_, q) => <KitConversacion key={q.toString()} emocion={q.get('emocion')} ejemplo={q.get('ejemplo') === '1'} /> },
    { pattern: 'kit/avatar', render: () => <KitAvatar /> },
    { pattern: 'grupo', render: () => <Grupo /> },
    { pattern: 'perfil', render: (_, q) => <Perfil key={q.toString()} cerrar={q.get('cerrar') === '1'} /> },
    { pattern: 'perfil/apps', render: () => <AppsDocumentos /> },
  ],
  scenarios: [
    { id: 'F01', title: 'Kit de Emociones', route: 'kit?emocion=cansada', state: KIT_VALE },
    { id: 'F02', title: 'Conversación con el Kit', route: 'kit/conversacion?emocion=cansada&ejemplo=1', state: KIT_VALE },
    { id: 'F03', title: 'Kit sin internet', route: 'kit', state: { ...KIT_VALE, online: false } },
    { id: 'F04', title: 'Avatar y nickname (pasa al Kit)', route: 'kit/avatar', state: KIT_VALE },
    { id: 'G01', title: 'Mi grupo', route: 'grupo' },
    { id: 'H01', title: 'Perfil', route: 'perfil' },
    { id: 'H02', title: 'Apps para abrir documentos (por validar)', route: 'perfil/apps' },
    { id: 'H03', title: 'Cerrar sesión', route: 'perfil?cerrar=1' },
    { id: 'H04', title: 'Cerrar sesión con avance sin enviar (por validar)', route: 'perfil?cerrar=1', state: { porEnviar: 2 } },
  ],
}
