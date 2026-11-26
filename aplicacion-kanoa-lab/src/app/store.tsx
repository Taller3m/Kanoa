import { createContext, useCallback, useContext, useEffect, useMemo, useReducer, useRef, type ReactNode } from 'react'
import { CLASES, PORTADA_MB } from './data'

/* Estado global simulado de la app del estudiante: conexión, sincronización, sesión, descargas, espacio y avisos.
   Todo vive en memoria: es un prototipo navegable, no hay servidor. */

export type EstadoDescarga = 'ninguna' | 'en-cola' | 'descargando' | 'pausada' | 'descargada'
export interface Descarga { estado: EstadoDescarga; progreso: number /* 0–100 */; actualizada?: string }

/** Avisos que se muestran sobre cualquier pantalla (A05 y A06). */
export type AvisoSesion = 'otro-dispositivo' | 'vencida' | null

export interface Toast { texto: string; tipo?: 'success' | 'error' | 'prevent'; accion?: string; onAccion?: () => void }

export interface AppState {
  online: boolean
  sincronizando: boolean
  sesion: boolean
  primeraSincronizacion: boolean
  ultimaActualizacion: string
  /** Respuestas o avance guardados sin internet que esperan enviarse. */
  porEnviar: number
  descargas: Record<string, Descarga>
  /** Espacio libre en el teléfono, en MB. */
  libreMB: number
  avisoSesion: AvisoSesion
  toast: Toast | null
  kit: { avatar: string | null; nickname: string }
}

/** Clave de descarga de la portada de un periodo de un área. */
export const portadaKey = (areaId: string, periodo = 1) => `portada:${areaId}:${periodo}`

const inicial = (): AppState => ({
  online: true,
  sincronizando: false,
  sesion: true,
  primeraSincronizacion: true,
  ultimaActualizacion: 'hoy, 7:42 a. m.',
  porEnviar: 0,
  descargas: {
    'partes-celula': { estado: 'ninguna', progreso: 0 },
    'sumas-fracciones': { estado: 'descargada', progreso: 100 },
    [portadaKey('naturales')]: { estado: 'descargada', progreso: 100 },
  },
  libreMB: 2150,
  avisoSesion: null,
  toast: null,
  kit: { avatar: null, nickname: '' },
})

type Action =
  | { t: 'set'; patch: Partial<AppState> }
  | { t: 'reset'; patch?: Partial<AppState> }
  | { t: 'descarga'; id: string; d: Descarga | null }
  | { t: 'quitar'; id: string }
  | { t: 'tick' }

const tamanoDe = (id: string) => (id.startsWith('portada:') ? PORTADA_MB : (CLASES.find((c) => c.id === id)?.tamanoMB ?? 50))

function reducer(s: AppState, a: Action): AppState {
  switch (a.t) {
    case 'set': return { ...s, ...a.patch }
    case 'reset': return { ...inicial(), ...a.patch }
    case 'descarga': {
      const descargas = { ...s.descargas }
      if (a.d) descargas[a.id] = a.d; else delete descargas[a.id]
      return { ...s, descargas }
    }
    case 'quitar': {
      // Libera el espacio dentro del reducer para que varias llamadas seguidas (E05) sumen bien.
      const libera = s.descargas[a.id]?.estado === 'descargada' ? tamanoDe(a.id) : 0
      return { ...s, descargas: { ...s.descargas, [a.id]: { estado: 'ninguna', progreso: 0 } }, libreMB: s.libreMB + libera }
    }
    case 'tick': {
      // Avanza la descarga en curso; sin internet todo queda en pausa; al terminar, arranca la siguiente de la cola.
      const descargas = { ...s.descargas }
      let libreMB = s.libreMB
      let activa = Object.keys(descargas).find((k) => descargas[k]!.estado === 'descargando' || descargas[k]!.estado === 'pausada')
      if (!activa) {
        activa = Object.keys(descargas).find((k) => descargas[k]!.estado === 'en-cola')
        if (!activa) return s
      }
      const d = descargas[activa]!
      if (!s.online) {
        if (d.estado === 'descargando') { descargas[activa] = { ...d, estado: 'pausada' }; return { ...s, descargas } }
        return s
      }
      const progreso = Math.min(100, d.progreso + 6)
      if (progreso >= 100) {
        descargas[activa] = { estado: 'descargada', progreso: 100, actualizada: 'hoy' }
        libreMB = Math.max(0, libreMB - tamanoDe(activa))
      } else descargas[activa] = { estado: 'descargando', progreso }
      return { ...s, descargas, libreMB }
    }
  }
}

/** Margen que la app deja siempre libre en el teléfono antes de descargar (decisión de C05). */
export const MARGEN_MB = 50

interface Ctx {
  s: AppState
  set: (patch: Partial<AppState>) => void
  reset: (patch?: Partial<AppState>) => void
  setOnline: (online: boolean) => void
  /** Simula una sincronización (deslizar hacia abajo, abrir la app o volver el internet). */
  sincronizar: () => void
  /** Pide descargar una clase o portada. Devuelve 'sin-espacio' si no cabe dejando 50 MB libres, o 'sin-internet'. */
  descargar: (id: string) => 'ok' | 'sin-espacio' | 'sin-internet'
  cancelarDescarga: (id: string) => void
  quitarDescarga: (id: string) => void
  descargaDe: (id: string) => Descarga
  /** Cuántos MB faltan para poder descargar `id` (0 si cabe). */
  faltaMB: (id: string) => number
  toast: (t: Toast | string) => void
}

const AppCtx = createContext<Ctx | null>(null)

export function AppProvider({ children }: { children: ReactNode }) {
  const [s, dispatch] = useReducer(reducer, undefined, inicial)
  const toastTimer = useRef(0)
  const syncTimer = useRef(0)

  const hayActividad = Object.values(s.descargas).some((d) => d.estado === 'descargando' || d.estado === 'en-cola' || (d.estado === 'pausada' && s.online))
  useEffect(() => {
    if (!hayActividad) return
    const id = window.setInterval(() => dispatch({ t: 'tick' }), 450)
    return () => window.clearInterval(id)
  }, [hayActividad])

  const set = useCallback((patch: Partial<AppState>) => dispatch({ t: 'set', patch }), [])
  const reset = useCallback((patch?: Partial<AppState>) => dispatch({ t: 'reset', patch }), [])

  const toast = useCallback((t: Toast | string) => {
    window.clearTimeout(toastTimer.current)
    dispatch({ t: 'set', patch: { toast: typeof t === 'string' ? { texto: t } : t } })
    toastTimer.current = window.setTimeout(() => dispatch({ t: 'set', patch: { toast: null } }), 4000)
  }, [])

  const sincronizar = useCallback(() => dispatch({ t: 'set', patch: { sincronizando: true } }), [])
  // Toda sincronización termina sola (también la que abre un escenario con `sincronizando: true`, como B03).
  useEffect(() => {
    if (!s.sincronizando || !s.online) return
    window.clearTimeout(syncTimer.current)
    syncTimer.current = window.setTimeout(() => dispatch({ t: 'set', patch: { sincronizando: false, porEnviar: 0, ultimaActualizacion: 'hace un momento' } }), 2500)
    return () => window.clearTimeout(syncTimer.current)
  }, [s.sincronizando, s.online])

  const setOnline = useCallback((online: boolean) => {
    dispatch({ t: 'set', patch: { online, sincronizando: false } })
    if (online) {
      toast({ texto: 'Volvió el internet. Estamos actualizando tu información.', tipo: 'success' })
      sincronizar()
    }
  }, [toast, sincronizar])

  const faltaMB = useCallback((id: string) => Math.max(0, tamanoDe(id) + MARGEN_MB - s.libreMB), [s.libreMB])

  const descargar = useCallback((id: string) => {
    if (!s.online) return 'sin-internet' as const
    if (faltaMB(id) > 0) return 'sin-espacio' as const
    const ocupada = Object.values(s.descargas).some((d) => d.estado === 'descargando' || d.estado === 'pausada')
    dispatch({ t: 'descarga', id, d: { estado: ocupada ? 'en-cola' : 'descargando', progreso: 0 } })
    return 'ok' as const
  }, [s.online, s.descargas, faltaMB])

  const cancelarDescarga = useCallback((id: string) => dispatch({ t: 'descarga', id, d: { estado: 'ninguna', progreso: 0 } }), [])
  const quitarDescarga = useCallback((id: string) => dispatch({ t: 'quitar', id }), [])
  const descargaDe = useCallback((id: string): Descarga => s.descargas[id] ?? { estado: 'ninguna', progreso: 0 }, [s.descargas])

  const value = useMemo<Ctx>(() => ({ s, set, reset, setOnline, sincronizar, descargar, cancelarDescarga, quitarDescarga, descargaDe, faltaMB, toast }),
    [s, set, reset, setOnline, sincronizar, descargar, cancelarDescarga, quitarDescarga, descargaDe, faltaMB, toast])
  return <AppCtx.Provider value={value}>{children}</AppCtx.Provider>
}

export function useApp(): Ctx {
  const c = useContext(AppCtx)
  if (!c) throw new Error('useApp fuera de AppProvider')
  return c
}

/** Estado de conexión que muestra el chip de cada pantalla principal. */
export type EstadoConexion = 'al-dia' | 'actualizando' | 'sin-internet'
export function useConexion(): EstadoConexion {
  const { s } = useApp()
  return !s.online ? 'sin-internet' : s.sincronizando ? 'actualizando' : 'al-dia'
}

