import type { ScreenGroup } from '../types'
import { portadaKey, type Descarga } from '../../app/store'
import { Estado, Inicio } from './Inicio'
import { AreaPeriodo } from './Area'
import { MaterialDocente, PortadaPeriodo } from './Portada'

/* Descargas por defecto (las mismas de `inicial()` del store): un `descargas` en `state` reemplaza el objeto completo. */
const BASE: Record<string, Descarga> = {
  'partes-celula': { estado: 'ninguna', progreso: 0 },
  'sumas-fracciones': { estado: 'descargada', progreso: 100 },
  [portadaKey('naturales')]: { estado: 'descargada', progreso: 100 },
}
const LISTA: Descarga = { estado: 'descargada', progreso: 100 }

export const inicio: ScreenGroup = {
  id: 'inicio',
  name: 'Inicio y áreas',
  routes: [
    { pattern: 'inicio', render: (_, q) => <Inicio key={q.toString()} volvio={q.get('volvio') === '1'} /> },
    { pattern: 'estado', render: () => <Estado /> },
    { pattern: 'area/:areaId', render: (p, q) => <AreaPeriodo key={`${p.areaId}?${q.toString()}`} areaId={p.areaId!} query={q} /> },
    { pattern: 'area/:areaId/portada', render: (p) => <PortadaPeriodo areaId={p.areaId!} /> },
    { pattern: 'area/:areaId/material', render: (p) => <MaterialDocente areaId={p.areaId!} /> },
  ],
  scenarios: [
    { id: 'B01', title: 'Inicio con internet', route: 'inicio' },
    // En B02 la clase en curso aparece «Disponible sin internet»: se marca como descargada.
    { id: 'B02', title: 'Inicio sin internet', route: 'inicio', state: { online: false, descargas: { ...BASE, 'partes-celula': LISTA } } },
    { id: 'B03', title: 'Deslizar para actualizar', route: 'inicio', state: { sincronizando: true } },
    { id: 'B04', title: 'Volvió el internet', route: 'inicio?volvio=1' },
    { id: 'B05', title: 'Estado de tu información', route: 'estado',
      state: { online: false, porEnviar: 3, descargas: { ...BASE, 'partes-celula': LISTA } } },
    { id: 'C01', title: 'Área y periodo con internet', route: 'area/naturales' },
    { id: 'C02', title: 'Portada del periodo', route: 'area/naturales/portada',
      state: { descargas: { ...BASE, [portadaKey('naturales')]: { estado: 'ninguna', progreso: 0 } } } },
    { id: 'C03', title: 'Descargando una clase', route: 'area/naturales?aviso=descarga',
      state: { descargas: { ...BASE, 'partes-celula': { estado: 'descargando', progreso: 40 } } } },
    // En C04 la clase en curso está descargada y la portada (con su video) no.
    { id: 'C04', title: 'Área sin internet', route: 'area/naturales',
      state: { online: false, descargas: { 'sumas-fracciones': LISTA, 'partes-celula': LISTA } } },
    // 95 MB libres: la clase de 85 MB necesita 135 MB (con el margen de 50 MB), faltan 40 MB como en el diseño.
    { id: 'C05', title: 'Sin espacio para descargar', route: 'area/naturales?hoja=sin-espacio&clase=que-es-celula', state: { libreMB: 95 } },
    { id: 'C06', title: 'Material de tu docente', route: 'area/naturales/material' },
  ],
}
