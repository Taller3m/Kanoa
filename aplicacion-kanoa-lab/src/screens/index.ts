import type { ScreenGroup } from './types'
import { ingreso } from './ingreso'
import { inicio } from './inicio'
import { clase } from './clase'
import { descargas } from './descargas'
import { cuenta } from './cuenta'

/** Grupos de pantallas en el orden de las páginas del lienzo de diseño. */
export const GROUPS: ScreenGroup[] = [ingreso, inicio, clase, descargas, cuenta]
