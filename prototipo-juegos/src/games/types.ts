import type { CruciData } from './cruci/types'
import type { CuentoData } from './cuento/types'
import type { MemoData } from './memo/types'
import type { CreceData } from './crece/types'

export type TipoJuego = 'Crucigrama' | 'Cuenta cuentos' | 'Memoria' | 'Crece conmigo'
export type Estado = 'Borrador' | 'Completado'

/** Un requisito para que el juego quede «Completado» (se lista en el editor con ✓ / •). */
export interface Req { t: string; ok: boolean }

export interface Game {
  id: number | null // null mientras es nuevo
  tipo: TipoJuego
  nombre: string
  desc: string // «Instrucciones para el jugador»
  cierre: string // «Mensaje de cierre»
  autor: string
  usos: number // contenidos publicados que lo usan (0 = sin usar)
  fecha: string // creación, p. ej. «28 oct 2026»
  editada: string // última modificación
  cruci: CruciData
  cuento: CuentoData
  memo: MemoData
  crece: CreceData
}

/** Props que recibe el editor de «Configuración» (paso 2) de cada tipo de juego. */
export interface EditorProps {
  game: Game
  /** Muta una copia del borrador (equivale al `upd` del prototipo original). */
  update: (fn: (draft: Game) => void) => void
  /** Aviso flotante: kind 'ok' | 'err' | 'info'. */
  toast: (msg: string, kind?: 'ok' | 'err' | 'info') => void
}
