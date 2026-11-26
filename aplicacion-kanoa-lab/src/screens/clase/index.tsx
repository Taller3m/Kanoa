import type { ScreenGroup } from '../types'
import type { Descarga } from '../../app/store'
import { portadaKey } from '../../app/store'
import { ClaseLector } from './ClaseLector'
import { Actividades } from './Actividades'
import { Cuestionario } from './Cuestionario'

const lista: Descarga = { estado: 'descargada', progreso: 100 }
/** `state.descargas` reemplaza el objeto completo: se incluyen también las descargas iniciales. */
const descargas = (celula: Descarga) => ({
  'partes-celula': celula,
  'sumas-fracciones': lista,
  [portadaKey('naturales')]: lista,
})

export const clase: ScreenGroup = {
  id: 'clase',
  name: 'La clase',
  // Las rutas fijas van antes de 'clase/:claseId/:pagina', que también las cubriría.
  routes: [
    { pattern: 'clase/:claseId/actividades', render: (p) => <Actividades key={p.claseId} claseId={p.claseId!} /> },
    { pattern: 'clase/:claseId/cuestionario', render: (p, q) => <Cuestionario key={`${p.claseId}?${q.toString()}`} claseId={p.claseId!} query={q} /> },
    { pattern: 'clase/:claseId/:pagina', render: (p, q) => <ClaseLector key={`${p.claseId}/${p.pagina}?${q.toString()}`} claseId={p.claseId!} pagina={p.pagina!} query={q} /> },
  ],
  scenarios: [
    { id: 'D01', title: 'Clase con internet, sin descargar', route: 'clase/partes-celula/1' },
    { id: 'D02', title: 'Clase descargándose mientras la usas', route: 'clase/partes-celula/2', state: { descargas: descargas({ estado: 'descargando', progreso: 60 }) } },
    { id: 'D03', title: 'Imagen ampliada y guardada', route: 'clase/partes-celula/2?ver=imagen', state: { descargas: descargas({ estado: 'descargando', progreso: 60 }) } },
    { id: 'D04', title: 'Abrir un archivo de Office', route: 'clase/partes-celula/2?hoja=abrir-con', state: { descargas: descargas({ estado: 'descargando', progreso: 60 }) } },
    { id: 'D05', title: 'No hay app para abrir el archivo', route: 'clase/partes-celula/2?hoja=sin-app', state: { descargas: descargas({ estado: 'descargando', progreso: 60 }) } },
    { id: 'D06', title: 'Actividades con internet', route: 'clase/partes-celula/actividades' },
    { id: 'D07', title: 'Clase descargada sin internet', route: 'clase/partes-celula/2', state: { online: false, descargas: descargas(lista) } },
    { id: 'D08', title: 'Interactivo sin internet (por validar)', route: 'clase/partes-celula/3?respuesta=1', state: { online: false, porEnviar: 1, descargas: descargas(lista) } },
    { id: 'D09', title: 'Actividades sin internet', route: 'clase/partes-celula/actividades', state: { online: false, descargas: descargas(lista) } },
    { id: 'D10', title: 'Clase sin descargar y sin internet', route: 'clase/que-es-celula/1', state: { online: false } },
    { id: 'D11', title: 'Responder un cuestionario', route: 'clase/partes-celula/cuestionario' },
    { id: 'D12', title: 'Se cae la conexión al responder (por validar)', route: 'clase/partes-celula/cuestionario?caida=1', state: { online: false } },
  ],
}
