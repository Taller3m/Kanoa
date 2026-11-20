import { useId, useState } from 'react'
import { Icon } from '../ui'
import { PreviewHost } from '../games/PreviewHost'
import type { BloquePublico } from './contrato'

/**
 * Bloque «Juego» de una sección del Portal WEB (HU-PW-185 y HU-PW-186).
 * Diseño: Figma «Página Web Kanoa lab» › bloque de contenido (título 36/44 + recuadro con borde, radio 20),
 * mismo molde del bloque Tablero BI (nodo 2374:34970) y su variante de error (2374:35005).
 *
 *  · Con varios juegos se elige uno al azar en cada visita (al montar el bloque).
 *  · El juego es el MISMO componente de la vista previa de la administración, en «modo portal»:
 *    IR AL INICIO lleva al inicio de la página (`onIrAlInicio`) en vez de cerrar una ventana.
 */
export function BloqueJuego({ bloque, onIrAlInicio }: { bloque: Extract<BloquePublico, { tipo: 'juego' }>; onIrAlInicio: () => void }) {
  const [juego] = useState(() => bloque.juegos[Math.floor(Math.random() * bloque.juegos.length)])
  const tid = useId()
  return (
    <section className="pw-bloque" aria-labelledby={bloque.titulo ? tid : undefined} aria-label={bloque.titulo ? undefined : juego?.nombre ?? 'Juego'}>
      {bloque.titulo && <h2 className="pw-bloque__titulo" id={tid}>{bloque.titulo}</h2>}
      {juego ? (
        <div className="pw-juego">
          <PreviewHost game={juego} onClose={onIrAlInicio} />
        </div>
      ) : (
        // Variante de error del bloque: no hay ningún juego que se pueda mostrar.
        <div className="pw-error" role="status">
          <Icon name="warning" size={147} className="pw-error__ico" />
          <p className="pw-error__titulo">No fue posible cargar el juego en este momento. Intenta nuevamente más tarde.</p>
        </div>
      )}
    </section>
  )
}
