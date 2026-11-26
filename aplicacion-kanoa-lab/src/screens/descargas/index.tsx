import type { ScreenGroup } from '../types'
import type { Descarga } from '../../app/store'
import { Descargas } from './Descargas'
import { Liberar } from './Liberar'

/* Descargas y espacio en el teléfono (E01–E06). */

const descargadas: Record<string, Descarga> = {
  'partes-celula': { estado: 'descargada', progreso: 100, actualizada: 'hoy' },
  'portada:naturales:1': { estado: 'descargada', progreso: 100 },
  'sumas-fracciones': { estado: 'descargada', progreso: 100 },
}
const conCola = (activa: Descarga['estado']): Record<string, Descarga> => ({
  'fracciones-equivalentes': { estado: activa, progreso: 45 },
  'cuento-partes': { estado: 'en-cola', progreso: 0 },
  ...descargadas,
})

export const descargas: ScreenGroup = {
  id: 'descargas',
  name: 'Descargas',
  routes: [
    { pattern: 'descargas', render: (_, q) => <Descargas quitar={q.get('quitar')} actualizada={q.get('actualizada') === '1'} /> },
    { pattern: 'descargas/liberar', render: () => <Liberar /> },
  ],
  scenarios: [
    { id: 'E01', title: 'Descargas con internet', route: 'descargas', state: { descargas: conCola('descargando') } },
    { id: 'E02', title: 'Descargas sin internet', route: 'descargas', state: { online: false, descargas: conCola('pausada') } },
    { id: 'E03', title: 'Se actualiza una clase descargada', route: 'descargas?actualizada=1', state: { descargas: conCola('descargando') } },
    { id: 'E04', title: 'Poco espacio en el teléfono', route: 'descargas', state: { libreMB: 180, descargas: { ...descargadas } } },
    {
      id: 'E05', title: 'Liberar espacio', route: 'descargas/liberar',
      state: { libreMB: 180, descargas: { ...descargadas, 'leyendas-region': { estado: 'descargada', progreso: 100 } } },
    },
    { id: 'E06', title: 'Quitar una clase del teléfono', route: 'descargas?quitar=partes-celula', state: { descargas: conCola('descargando') } },
  ],
}
