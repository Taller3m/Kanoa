export interface MemoCarta { tipo: string; v: string; img?: string; needImg?: boolean }
export interface MemoItem { a: MemoCarta; b: MemoCarta; msg: string }
export interface MemoNivel { parejas: number; items: MemoItem[]; tiempo: { on: boolean; min: number } }
export interface MemoData {
  modo: string; rep: string; msgModo: string; msgGlobal: string; parejas: number; dorso: string
  tiempo: { on: boolean; min: number }; intentos: { on: boolean; n: number }; items: MemoItem[]
  /** Niveles de dificultad (el 1 es obligatorio, hasta 3). `lv` es el índice del nivel que se está editando. */
  lvs?: MemoNivel[]; lv?: number
}
