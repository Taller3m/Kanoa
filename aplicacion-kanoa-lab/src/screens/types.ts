import type { ComponentType, ReactNode } from 'react'
import type { AppState } from '../app/store'

/** Una ruta de la app: patrón con parámetros (p. ej. 'area/:areaId') y la pantalla que dibuja. */
export interface RouteDef {
  pattern: string
  render: (params: Record<string, string>, query: URLSearchParams) => ReactNode
}

/**
 * Un estado del lienzo de diseño (A01, B03…). El panel «Prototipo» lo abre: reinicia el estado simulado,
 * aplica `state` y navega a `route` (la ruta puede llevar ?parámetros para estados locales: hoja abierta, error…).
 */
export interface Scenario { id: string; title: string; route: string; state?: Partial<AppState> }

/** Grupo de pantallas (una página del lienzo). `Overlay` se dibuja sobre cualquier pantalla (p. ej. avisos de sesión). */
export interface ScreenGroup { id: string; name: string; routes: RouteDef[]; scenarios: Scenario[]; Overlay?: ComponentType }
