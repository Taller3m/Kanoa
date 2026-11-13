import type { ComponentType } from 'react'
import type { EditorProps, Estado, Game, Req, TipoJuego } from './types'
import { CruciEditor } from './cruci/Editor'
import { CuentoEditor } from './cuento/Editor'
import { MemoEditor } from './memo/Editor'
import { CreceEditor } from './crece/Editor'
import { cruciReqs } from './cruci/rules'
import { cuentoReqs } from './cuento/rules'
import { memoReqs } from './memo/rules'
import { creceReqs } from './crece/rules'
import { cruciSeed } from './cruci/seed'
import { cuentoSeed } from './cuento/seed'
import { memoSeed } from './memo/seed'
import { creceSeed } from './crece/seed'
import { fixMemo } from './memo/defaults'

export interface TipoInfo { nombre: TipoJuego; desc: string; icon: string; tone: 'blue' | 'orange' | 'indigo' | 'green' }

/** Catálogo de tipos (equivale a `J_TJ`). El tono usa las familias categóricas del sistema. */
export const TIPOS: TipoInfo[] = [
  { nombre: 'Crucigrama', desc: 'Palabras que se cruzan en una cuadrícula, con una pista para cada palabra.', icon: 'grid_on', tone: 'blue' },
  { nombre: 'Cuenta cuentos', desc: 'Historia por páginas: cada página tiene ilustración, texto y una pregunta con opciones de respuesta.', icon: 'auto_stories', tone: 'orange' },
  { nombre: 'Memoria', desc: 'Cartas boca abajo para encontrar parejas idénticas, relacionadas o de emociones.', icon: 'view_module', tone: 'indigo' },
  { nombre: 'Crece conmigo', desc: 'Cuida una planta o un animal desde que nace hasta que es adulto, manteniendo sus necesidades en equilibrio.', icon: 'potted_plant', tone: 'green' },
]
export const tipoInfo = (t: TipoJuego) => TIPOS.find((x) => x.nombre === t)!

export const EDITORES: Record<TipoJuego, ComponentType<EditorProps>> = {
  'Crucigrama': CruciEditor, 'Cuenta cuentos': CuentoEditor, 'Memoria': MemoEditor, 'Crece conmigo': CreceEditor,
}

/** Requisitos para quedar «Completado» (equivale a `J_reqs`). */
export function reqsOf(g: Game): Req[] {
  const r: Req[] = [{ t: 'Nombre del juego (3 a 80 caracteres)', ok: g.nombre.trim().length >= 3 }]
  switch (g.tipo) {
    case 'Crucigrama': return [...r, ...cruciReqs(g)]
    case 'Cuenta cuentos': return [...r, ...cuentoReqs(g)]
    case 'Memoria': return [...r, ...memoReqs(g)]
    case 'Crece conmigo': return [...r, ...creceReqs(g)]
  }
}
export const estadoDe = (g: Game): Estado => (reqsOf(g).every((x) => x.ok) ? 'Completado' : 'Borrador')

/** Normaliza un juego al abrirlo en el editor (equivale a `J_fix`). */
export const fixGame = (g: Game): Game => (g.tipo === 'Memoria' ? fixMemo(g) : g)

/** Juegos de ejemplo en el mismo orden del prototipo original. Sin contenido publicado que los use (usos = 0). */
export function seedGames(): Game[] {
  const all = [...cruciSeed, ...cuentoSeed, ...memoSeed, ...creceSeed].map((g) => ({ ...g, usos: 0 }))
  const orden = [1, 2, 3, 6, 4, 7, 5]
  return all.sort((a, b) => orden.indexOf(a.id ?? 99) - orden.indexOf(b.id ?? 99))
}
