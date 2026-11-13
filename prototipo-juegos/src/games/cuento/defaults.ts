import type { CuentoData, CuentoPagina } from './types'
/** Sin páginas por defecto; si `conPaginas` (juego nuevo de este tipo) arranca con 2 páginas en blanco. */
export const blankPage = (n: number): CuentoPagina => ({ id: Date.now() + n, img: '', texto: '', pregunta: '', opciones: [{ t: '', ok: true }, { t: '', ok: false }], fbOk: '', fbNo: '', audio: '' })
export const blankCuento = (conPaginas: boolean): CuentoData => ({ paginas: conPaginas ? [blankPage(1), blankPage(2)] : [] })
