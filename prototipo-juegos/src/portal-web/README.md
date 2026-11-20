# Juego en el Portal WEB — guía para desarrollo

Ejemplo funcional de una sección del portal con un **bloque Juego** (crucigrama), para replicarlo en el
portal real (Next.js). Página de referencia: **Bienestar emocional › Nombrar**
(producción: `https://kanoalab.com.co/kanoa/bienestar-emocional/nombrar`).

## Cómo verlo

```bash
cd prototipo-juegos
npm install
npm run dev
```

- Portal: `http://localhost:5173/#/portal/bienestar-emocional/nombrar`
- Administración de la misma sección: `#/micrositios/bienestar-emocional/nombrar` (botón **Ver en el portal**).

Lo que se cambia en la administración (publicar, inactivar, reordenar, editar el juego) se ve en el portal
al volver, porque los dos leen el mismo estado en memoria. Al recargar el navegador todo vuelve a los datos de ejemplo.

## Qué replicar y qué no

| Replicar en el portal real | Archivo de referencia |
|---|---|
| Contrato de datos y reglas de visibilidad | `contrato.ts` |
| Bloque Juego (título + recuadro + juego, variante de error) | `BloqueJuego.tsx`, `portal-web.css` (`.pw-bloque*`, `.pw-juego`, `.pw-error`) |
| Componente del crucigrama (mismo de la vista previa, en modo portal) | `../games/cruci/Preview.tsx`, `../games/cruci/pv.css` |
| Lógica del tablero: normalizar letras, mapa de casillas, numeración | `../games/cruci/rules.ts` (`cruciNorm`, `cruciBuildMap`, `cruciNumerar`) |
| Cabecera del juego, pantalla de cierre, «Cómo jugar» | `../games/preview/Shell.tsx`, `../games/preview/preview.css` |
| Página «Esta sección estará disponible próximamente» | `PaginaSeccion.tsx` (`.pw-nodisp`) |

**No replicar** (ya existen en el portal o son solo del prototipo): la barra de navegación, las migas y el pie
(son copias de referencia), y la franja amarilla «Simulación del Portal WEB».

## Contrato de datos

El portal no decide qué está publicado ni qué juegos están completos: **pinta lo que recibe**. Por cada
sección, el backend entrega:

```ts
interface SeccionPublica {
  micrositio: { slug: string; nombre: string }
  seccion: { slug: string; nombre: string }
  disponible: boolean          // false → página «disponible próximamente»
  bloques: BloquePublico[]     // solo contenidos Publicados, en el orden de la sección
}

type BloquePublico =
  | { tipo: 'texto'; id: number; titulo: string; parrafos: string[] }
  | { tipo: 'juego'; id: number; titulo?: string; juegos: JuegoPublico[] } // solo juegos Completados
  | { tipo: 'otro';  id: number; titulo: string; formato: string }         // imágenes, video, etc.
```

Ejemplo del bloque Juego de Nombrar (el juego es la misma configuración que guarda la administración):

```json
{
  "tipo": "juego",
  "id": 402,
  "titulo": "Pon nombre a lo que sientes",
  "juegos": [{
    "id": 8,
    "tipo": "Crucigrama",
    "nombre": "Las emociones básicas",
    "desc": "Lee cada pista y escribe en el tablero el nombre de la emoción. Cuando termines, selecciona COMPROBAR.",
    "cierre": "¡Muy bien! Ponerle nombre a lo que sentimos es el primer paso para gestionarlo.",
    "cruci": {
      "size": 10,
      "words": [
        { "id": 81, "r": 2, "c": 1, "dir": "H", "ans": "TRISTEZA", "clue": "Emoción que sentimos ante una pérdida y que nos invita a buscar apoyo." },
        { "id": 82, "r": 0, "c": 6, "dir": "V", "ans": "MIEDO",    "clue": "Emoción que nos alerta ante un peligro y nos ayuda a protegernos." }
      ]
    }
  }]
}
```

`r` y `c` empiezan en 0. `dir`: `H` horizontal, `V` vertical. La numeración no se guarda: se calcula en el
orden de `words` y una horizontal y una vertical que empiezan en la misma casilla comparten número.

## Reglas (HU-PW-185)

- **Visibilidad:** solo contenidos **Publicados**. Si el micrositio o la sección están **inactivos**, no se
  muestra ningún bloque (sin cambiar estados) y la sección pasa a «disponible próximamente».
- **Varios juegos en un bloque:** se elige **uno al azar en cada visita** (al cargar el bloque).
- **Orden:** el de la sección (lo define la administración arrastrando); los juegos de adentro no tienen orden.
- **Título del bloque:** opcional; si no viene, el bloque se anuncia con el nombre del juego.
- **Sin juegos que mostrar:** variante de error del bloque, «No fue posible cargar el juego en este momento.
  Intenta nuevamente más tarde.» (mismo molde del error del Tablero BI).

## Modo portal vs. vista previa (HU-PW-174)

Es **el mismo componente de juego**; cambia solo esto:

| | Vista previa (administración) | Portal |
|---|---|---|
| Dónde se muestra | Ventana modal | Recuadro del bloque en la página |
| IR AL INICIO | Cierra la vista previa | Lleva al inicio de la página y pone el foco en el título |
| VOLVER A JUGAR | Reinicia el tablero vacío | Igual |
| Datos | Lo que se está editando, aunque no esté guardado | La versión publicada |

El crucigrama no tiene pantalla INICIAR, tiempo ni límite de intentos: el tablero se muestra de inmediato.

## Accesibilidad

- Cada casilla tiene nombre «número, fila F, columna C»; se navega con las flechas.
- Se convierte a mayúscula y sin tilde al escribir.
- COMPROBAR anuncia «X casillas por corregir.» en una región en vivo; las casillas se marcan con ícono además del color.
- El bloque es una `section` con su título como nombre; la página tiene un `h1` (oculto) con la sección y el micrositio.
- Las migas usan `--muted` en vez de `--outline` (#8A8A8A da 3.5:1 sobre blanco y no cumple 4.5:1).

## Referencias de diseño

Figma «Página Web Kanoa lab» (`wDh77T2Yux9PtGWzmNyjN8`), página Diseño › Bienestar emocional:

- Sección: `1129:34433` (Device=Desktop, Type=Seccion)
- Sección no disponible: `1233:16633` (Type=Seccionerror)
- Bloque con recuadro y su error: `2374:34970` / `2374:35005`
- Barra de navegación: `8:1400` · Pie: `1129:34791`

## Pendiente

- IR AL INICIO en cuenta cuentos, memoria y Crece conmigo todavía no está conectado (solo crucigrama).
- Versiones tablet y móvil del bloque: el Figma las tiene (`1129:36071`, `1129:35278`); aquí solo se ajusta el ancho.
