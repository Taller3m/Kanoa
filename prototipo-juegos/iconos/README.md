# Iconos de «Crear juego»

Iconos de los tipos de juego de la pantalla «¿Qué tipo de juego quieres crear?». Todos son SVG de 24×24 y usan `currentColor`, así que toman el color del texto donde se insertan.

| Juego | Archivo | Origen |
|---|---|---|
| Crucigrama | `crucigrama.svg` | Propio de Kanoa |
| Cuenta cuentos | `cuenta-cuentos.svg` | Material Symbols Outlined: `auto_stories` |
| Memoria | `memoria.svg` | Propio de Kanoa |
| Crece conmigo | `crece-conmigo.svg` | Material Symbols Outlined: `potted_plant` |

Los de Material Symbols usan estilo Outlined, peso 400, sin relleno y grado 0. Si el proyecto ya carga esa fuente, se pueden usar por nombre en vez del archivo.

En el prototipo, cada icono va a 28 px dentro de un círculo con el color del tipo de juego (`.option--blue`, `--orange`, `--indigo` y `--green` en `src/app.css`). Los iconos propios también están en código en `src/ui/index.tsx`.
