export interface CuentoOpcion { t: string; ok: boolean }
export interface CuentoPagina { id: number; img: string; audio?: string; texto: string; pregunta: string; opciones: CuentoOpcion[]; fbOk: string; fbNo: string }
export interface CuentoData { paginas: CuentoPagina[] }
