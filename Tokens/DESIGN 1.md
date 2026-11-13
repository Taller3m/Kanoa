# DESIGN.md — Kanoa Lab · Sistema de Diseño StudIA 2.0

> Documento generado a partir de `Kanoa_Lab_Main.fig` (Figma, exportado el 2026-08-31).
> Los valores de color, tipografía, forma y espaciado se leyeron directamente del archivo binario,
> no de una inspección visual. Cualquier discrepancia con Figma indica que el `.fig` está desactualizado.

---

## 1. Panorama del archivo

`Kanoa Lab Main` no es un sistema único: es el **archivo maestro** donde conviven el sistema propio
(StudIA 2.0) y las librerías de las demás marcas/productos que consume el equipo.

| Página | Rol |
|---|---|
| **Design System** | Fuente de verdad. 108 componentes y sets locales. |
| Internal Only Canvas | Variantes sueltas y trabajo previo a consolidar. |
| Cover / Recursos / --- | Portada, recursos internos, separadores. |
| Coleccion de logos | Marca Kanoa Lab (4 formatos). |
| Ambiente | Pantallas de contexto (Login compartido). |

**Inventario bruto**

| Activo | Local | Total en archivo |
|---|---|---|
| Componentes (`SYMBOL`) | 341 | 1.998 |
| Variables | 109 | 394 |
| Colecciones de variables | 1 | 31 |
| Estilos de color | 513 | 513 |
| Estilos de texto | 58 | 58 |
| Estilos de efecto | 14 | 15 |

> [!important] Hallazgo estructural
> **Ningún estilo de color del archivo está aplicado a un nodo.** El sistema funciona 100 % con
> *variables* (2.637 nodos las consumen). Los 513 estilos de color son un residuo del import de
> Material Theme Builder y de las marcas históricas. Al reconstruir el sistema en código,
> **ignorar los estilos y partir de las variables**.

---

## 2. Arquitectura de tokens

Tres capas, en el orden en que se resuelven:

```
Referencia  →  StudIA 2.0/ref/*        paletas tonales (estilos, sin uso activo)
Sistema     →  Schemes/*               roles semánticos M3 · 2 modos: Light / Dark
Componente  →  border-radius, icons/icons, regularPadding, button, input …
```

| Colección | Origen | Modos | Vars | Qué define |
|---|---|---|---|---|
| **StudIA 2.0** | **local** | Light, Dark | 109 | Color: roles M3, tints, status, acentos Portalweb |
| EfectStyles | librería | basic, rounded, semiRounded, almostRounded | 1 | `border-radius` |
| TokensSizes | librería | small, medium, big, superBig, Header | 6 | Tamaño de icono, botón, input |
| Theme Sizes | librería | small, medium, big | 3 | Alturas de botón, icono, text-field |
| BasicConfig | librería | Mobile, Tablet, Desktop | 8 | Ancho/alto de canvas y paddings |
| Breakpoints | librería | Desktop, Mobile | 2 | Ancho real y padding |
| Interactive | librería | Shrunken, Expanded, Mobile | 3 | Estado de layout del prototipo |

Las colecciones restantes (`Theme`, `BasicStyles`, `edu-min`, `OPI-THEME`, `ColorStyles`,
`SISGEAT-Colors`, `material-theme`, `Habitat-theme`, `PICAD - *`) pertenecen a otros productos y
entran por instancias importadas. **No forman parte de StudIA 2.0.**

---

## 3. Color

Colección local `StudIA 2.0`, dos modos: **Light** y **Dark**. Primario teal (`#1A5F6B`),
secundario ámbar (`#9A7000`), terciario cian (`#3DAABC`).

### 3.1 Roles de sistema (`Schemes/*`)

| Token | Light | Dark |
|---|---|---|
| `Schemes/Background` | `#E8F5F8` | `#082830` |
| `Schemes/Error` | `#B3261E` | `#F2B8B5` |
| `Schemes/Error Container` | `#F9DEDC` | `#8C1D18` |
| `Schemes/Inverse On Surface` | `#E8F5F8` | `#1A5F6B` |
| `Schemes/Inverse Primary` | `#7FCFDA` | `#1A5F6B` |
| `Schemes/Inverse Surface` | `#082830` | `#D0EBF0` |
| `Schemes/On Background` | `#031418` | `#D0EBF0` |
| `Schemes/On Error` | `#FFF5F5` | `#601410` |
| `Schemes/On Error Container` | `#410E0B` | `#F9DEDC` |
| `Schemes/On Primary` | `#FFFFFF` | `#0F3D47` |
| `Schemes/On Primary Container` | `#031418` | `#D0EBF0` |
| `Schemes/On Primary Fixed` | `#031418` | `#031418` |
| `Schemes/On Primary Fixed Variant` | `#1A5F6B` | `#1A5F6B` |
| `Schemes/On Secondary` | `#FFFFFF` | `#5C4200` |
| `Schemes/On Secondary Container` | `#331F00` | `#FFE8B0` |
| `Schemes/On Secondary Fixed` | `#331F00` | `#331F00` |
| `Schemes/On Secondary Fixed Variant` | `#9A7000` | `#9A7000` |
| `Schemes/On Surface` | `#031418` | `#D0EBF0` |
| `Schemes/On Surface Variant` | `#236D7A` | `#7FCFDA` |
| `Schemes/On Tertiary` | `#FFFFFF` | `#031418` |
| `Schemes/On Tertiary Container` | `#031418` | `#E8F5F8` |
| `Schemes/On Tertiary Fixed` | `#031418` | `#031418` |
| `Schemes/On Tertiary Fixed Variant` | `#236D7A` | `#236D7A` |
| `Schemes/Outline` | `#8A8A8A` | `#C2C2C2` |
| `Schemes/Outline Variant` | `#D0EBF0` | `#0F3D47` |
| `Schemes/Primary` | `#1A5F6B` | `#7FCFDA` |
| `Schemes/Primary Container` | `#D0EBF0` | `#1A5F6B` |
| `Schemes/Primary Fixed` | `#D0EBF0` | `#D0EBF0` |
| `Schemes/Primary Fixed Dim` | `#7FCFDA` | `#7FCFDA` |
| `Schemes/Scrim` | `#000000` | `#000000` |
| `Schemes/Secondary` | `#9A7000` | `#F5C842` |
| `Schemes/Secondary Container` | `#FFE8B0` | `#5C4200` |
| `Schemes/Secondary Fixed` | `#FFE8B0` | `#FFE8B0` |
| `Schemes/Secondary Fixed Dim` | `#F5C842` | `#F5C842` |
| `Schemes/Shadow` | `#000000` | `#000000` |
| `Schemes/Surface` | `#F0FAFA` | `#082830` |
| `Schemes/Surface Bright` | `#F0FAFA` | `#236D7A` |
| `Schemes/Surface Container` | `#DCF0F4` | `#1A5F6B` |
| `Schemes/Surface Container High` | `#D0EBF0` | `#236D7A` |
| `Schemes/Surface Container Highest` | `#C4E4EA` | `#2E8B9A` |
| `Schemes/Surface Container Low` | `#E8F5F8` | `#0F3D47` |
| `Schemes/Surface Container Lowest` | `#FFFFFF` | `#031418` |
| `Schemes/Surface Dim` | `#D0EBF0` | `#082830` |
| `Schemes/Surface Tint` | `#2E8B9A` | `#7FCFDA` |
| `Schemes/Surface Variant` | `#D0EBF0` | `#0F3D47` |
| `Schemes/Tertiary` | `#3DAABC` | `#2E8B9A` |
| `Schemes/Tertiary Container` | `#E8F5F8` | `#236D7A` |
| `Schemes/Tertiary Fixed` | `#E8F5F8` | `#E8F5F8` |
| `Schemes/Tertiary Fixed Dim` | `#3DAABC` | `#3DAABC` |

### 3.2 Capas de superficie y texto (`Surface Tint/*`)

Overlays con alfa para estados (hover, press, focus) y jerarquía tipográfica.

| Token | Light | Dark |
|---|---|---|
| `On Surface/On surface - 12` | `#031418 (12%)` | `#D0EBF0 (12%)` |
| `On Surface/On surface - 18` | `#031418 (18%)` | `#D0EBF0 (18%)` |
| `On Surface/On surface - 20` | `#031418 (20%)` | `#D0EBF0 (20%)` |
| `On Surface/On surface - 3` | `#031418 (3%)` | `#D0EBF0 (3%)` |
| `On Surface/On surface - 30` | `#031418 (30%)` | `#D0EBF0 (30%)` |
| `On Surface/On surface - 5` | `#031418 (5%)` | `#D0EBF0 (5%)` |
| `On Surface/On surface - 8` | `#031418 (8%)` | `#D0EBF0 (8%)` |
| `Surface 0` | `#F0FAFA (0%)` | `#082830 (0%)` |
| `Surface Tint 11%` | `#2E8B9A (11%)` | `#7FCFDA (11%)` |
| `Surface Tint 12%` | `#2E8B9A (12%)` | `#7FCFDA (12%)` |
| `Surface Tint 14%` | `#2E8B9A (14%)` | `#7FCFDA (14%)` |
| `Surface Tint 5%` | `#2E8B9A (5%)` | `#7FCFDA (5%)` |
| `Surface Tint 8%` | `#2E8B9A (8%)` | `#7FCFDA (8%)` |
| `Text/Muted` | `#6F6F6F` | `#9EB0B5` |
| `Text/Paragraph` | `#3D3D3D` | `#D5DEE0` |
| `Text/Title` | `#1A1A1A` | `#F5F7F8` |
| `Transparent/Shadow On Primary Container 12` | `#031418 (12%)` | `#D0EBF0 (12%)` |
| `Transparent/Transparent On Surface 4` | `#031418 (4%)` | `#D0EBF0 (4%)` |
| `Transparent/Transparent On Surface 8` | `#031418 (8%)` | `#D0EBF0 (8%)` |
| `Transparent/Transparent Surface 0` | `#F0FAFA (0%)` | `#082830 (0%)` |
| `Transparent/Transparent Surface 12` | `#F0FAFA (12%)` | `#082830 (12%)` |
| `Transparent/Transparent Surface 60` | `#F0FAFA (60%)` | `#082830 (60%)` |

### 3.3 Estados de contenido (`Status Tags Colors/*`)

Cubren el ciclo editorial de StudIA: borrador, prevención, éxito. Cada estado trae su par
`Surface` / `On-Surface` y una variante `-snackbar` invertida.

| Token | Light | Dark |
|---|---|---|
| `Draft/Draft` | `#5F5E5A` | `#B4B2A9` |
| `Draft/OnSurface-Snackbar` | `#F1EFE8` | `#2C2C2A` |
| `Draft/Surface` | `#D3D1C7` | `#444441` |
| `Draft/Surface-Over` | `#B4B2A9` | `#5F5E5A` |
| `Draft/Surface-Snackbar` | `#444441` | `#D3D1C7` |
| `Prevent/On-Prevent` | `#FFFBFF` | `#331F00` |
| `Prevent/On-Prevent-Container` | `#331F00` | `#FFE8B0` |
| `Prevent/Prevent` | `#854F0B` | `#F5C842` |
| `Prevent/Prevent-Container` | `#FFE8B0` | `#5C4200` |
| `Success/OnSurface-Snackbar` | `#EAF3DE` | `#173404` |
| `Success/Success` | `#3B6D11` | `#97C459` |
| `Success/Surface` | `#C0DD97` | `#27500A` |
| `Success/Surface-over` | `#97C459` | `#3B6D11` |
| `Success/Surface-snackbar` | `#27500A` | `#97C459` |

### 3.4 Acentos de Portal web (`Portalweb/Color/*`)

Paleta categórica de seis matices para tarjetas de módulo, iconos grandes y tags de portal.
Cada matiz trae par sólido + `-Soft` y su `On-` correspondiente.

| Token | Light | Dark |
|---|---|---|
| `Blue` | `#3B82F6` | `#1D4ED8` |
| `Blue-Soft` | `#BFDBFE` | `#93C5FD` |
| `Green-Soft` | `#BBF7D0` | `#86EFAC` |
| `Indigo` | `#4F46E5` | `#3730A3` |
| `Indigo-Soft` | `#C7D2FE` | `#A5B4FC` |
| `On-Blue` | `#FFFFFF` | `#FFFFFF` |
| `On-Blue-Soft` | `#1E3A8A` | `#1E3A8A` |
| `On-Indigo` | `#FFFFFF` | `#FFFFFF` |
| `On-Indigo-Soft` | `#312E81` | `#1E1B4B` |
| `On-Orange` | `#FFFFFF` | `#FFFFFF` |
| `On-Orange-Soft` | `#7C2D12` | `#7C2D12` |
| `On-Red` | `#FFFFFF` | `#FFFFFF` |
| `On-Red-Soft` | `#7F1D1D` | `#7F1D1D` |
| `On-Teal` | `#FFFFFF` | `#FFFFFF` |
| `On-Teal-Soft` | `#134E4A` | `#134E4A` |
| `On-green` | `#FFFFFF` | `#FFFFFF` |
| `On-green-Soft` | `#14532D` | `#14532D` |
| `Orange` | `#F97316` | `#C2410C` |
| `Orange-Soft` | `#FED7AA` | `#FDBA74` |
| `Red` | `#F87171` | `#DC2626` |
| `Red-Soft` | `#FECACA` | `#FCA5A5` |
| `Teal` | `#14B8A6` | `#0F766E` |
| `Teal-Soft` | `#99F6E4` | `#5EEAD4` |
| `green` | `#22C55E` | `#15803D` |

---

## 4. Tipografía

Familia única: **Roboto**. Escala Material 3 completa, 15 roles, definida como estilos de texto
`StudIA 2.0/*`. Los pesos se limitan a `Regular` (400) y `Medium` (500).

| Rol | Peso | Tamaño | Interlineado | Tracking |
|---|---|---|---|---|
| `display/large` | Regular | 57px | 64px | -0.25px |
| `display/medium` | Regular | 45px | 52px | 0px |
| `display/small` | Regular | 36px | 44px | 0px |
| `headline/large` | Regular | 32px | 40px | 0px |
| `headline/medium` | Regular | 28px | 36px | 0px |
| `headline/small` | Regular | 24px | 32px | 0px |
| `title/large` | Regular | 22px | 28px | 0px |
| `title/medium` | Medium | 16px | 24px | 0.15px |
| `title/small` | Medium | 14px | 20px | 0.1px |
| `body/large` | Regular | 16px | 24px | 0.5px |
| `body/medium` | Regular | 14px | 20px | 0.25px |
| `body/small` | Regular | 12px | 16px | 0.4px |
| `label/large` | Medium | 14px | 20px | 0.1px |
| `label/medium` | Medium | 12px | 16px | 0.5px |
| `label/small` | Medium | 11px | 16px | 0.5px |

**Reglas derivadas**

- `label/*` es el único grupo en Medium: botones, chips, tabs y overlines.
- El tracking crece al bajar de tamaño (`0.5px` en `body/large` y `label/medium`, `-0.25px` en `display/large`).
- El interlineado es siempre absoluto en px, nunca proporcional. Al portar a CSS, usar `line-height: 24px`, no `1.5`.
- `display/*` no aparece en ningún componente: es escala disponible, no escala en uso.

Fuera de StudIA 2.0 el archivo conserva 43 estilos de texto de otras marcas
(`edu-min/*`, `BasicStyles/*`, `OPI-THEME/*`, `Centus/*`, `redpat/*` en Nunito Sans, `material-theme/*`)
y sueltos sin namespace (`BigTitle`, `Parragraph`, `H3`, `H5`, `Button`, `SmallButton`).
**No usarlos en producto nuevo.**

---

## 5. Elevación y sombras

Dos escalas conviven. La canónica es la M3 de dos capas; el resto son sombras ad-hoc que se
acumularon por proyecto.

| Estilo | Composición | Uso |
|---|---|---|
| `M3/Elevation Light/1` · `sm` | `0 1px 3px 1px rgba(0,0,0,.15)` + `0 1px 2px rgba(0,0,0,.30)` | Nivel 1: cards en reposo, botón Raised |
| `M3/Elevation Light/2` · `md` | `0 2px 6px 2px rgba(0,0,0,.15)` + `0 1px 2px rgba(0,0,0,.30)` | Nivel 2: menús, botón en hover |
| `Shadow Button` | idéntico a nivel 1 | Alias redundante — consolidar en `sm` |
| `Shadow-Md` | `0 2px 4px -2px rgba(0,0,0,.10)` + `0 4px 6px -1px rgba(0,0,0,.10)` | Sombra tipo Tailwind, componentes Shadcn |
| `Regular shadow` | `0 8px 18px 1px #031418 @5%` | Card en reposo (usa variable de color) |
| `Hover Shadow` | `0 8px 18px 3px #031418 @8%` | Card en hover |
| `shadow hover` · `Shadow Hover` | `0 6px 6px rgba(0,0,0,.08)` | Duplicado exacto — consolidar |
| `shadowCards` | `0 8px 17.5px rgba(0,0,0,.12)` | Legacy |
| `Chip Shadow` | `2px 5px 8px #1B0061 @8%` | Legacy |
| `smellShadow` | `0 8px 24px #24080A @12%` | Legacy |
| `GlassCard` | efecto `GLASS` (refracción 29, aberración .24) | Experimental, sin equivalente CSS directo |
| `Regular Shadow 2` | **vacío** | Borrar |

Par recomendado para producto: `Regular shadow` en reposo → `Hover Shadow` en hover.
Es el único par que usa variables de color y por tanto responde al modo oscuro.

---

## 6. Forma (radios)

Token único multimodo `border-radius` de la colección `EfectStyles` — el más consumido del archivo
(2.942 referencias).

| Modo | Valor | Uso |
|---|---|---|
| `basic` | `0px` | Bordes rectos |
| `almostRounded` | `4px` | Inputs, chips pequeños |
| `semiRounded` | `20px` | Cards, modales, contenedores |
| `rounded` | `100px` | Píldoras: botones, tags, avatares |

Radios literales observados en la página Design System (deuda a migrar al token):
`5px` (60 nodos), `4px` (19), `12px` (9), `80px` (9), `9999px` (7), `8px`, `20px`, `40px`, `24px`.
El `5px` recurrente no corresponde a ningún modo del token.

---

## 7. Espaciado y layout

### 7.1 Breakpoints y lienzo

| Modo | Ancho | Alto | Padding |
|---|---|---|---|
| Mobile | 390px | 874px | 16px |
| Tablet | 1007px | 1080px | 16px |
| Desktop | 1560px (1920 en el set alterno) | 1080px | 24px |

`Padding/Mid-Padding`: 8px en Mobile/Tablet, 12px en Desktop.
`Layout Padding` (colección Interactive): 12px Shrunken · 24px Expanded · 16px Mobile.

### 7.2 Escala de espaciado real

Medida sobre auto-layouts de la página Design System:

| Valor  | Frecuencia (gap) | Rol                                   |
| ------ | ---------------- | ------------------------------------- |
| `4px`  | 36               | Interno de átomo (icono ↔ label)      |
| `8px`  | 108              | Base — el gap más común               |
| `12px` | 24               | Padding lateral dominante (116 nodos) |
| `16px` | 52               | Padding de contenedor                 |
| `24px` | 18               | eparación de sección                  |
| `40px` | 19               | Separación de bloque                  |

**Escala propuesta:** `4 · 8 · 12 · 16 · 24 · 40`. Los valores `10px`, `55.3px`, `1.6px`, `0.8px` y
`2.4px` son residuos de escalado y deben normalizarse.

### 7.3 Tamaños de componente

| Token | small | medium | big | superBig | Header |
|---|---|---|---|---|---|
| `icons/icons` | 12 | 18 | 24 | 36 | 72 |
| `button` (alto interno) | 10 | 12 | 14 | 16 | 16 |
| `input` (alto total) | 44 | 58 | 70 | 80 | 80 |
| `icons/size` (Theme Sizes) | 12 | 18 | 24 | — | — |
| `button/size` | 10 | 12 | 14 | — | — |
| `text-field/size` | 41.5 | 47 | 58 | — | — |

Icono cuadrado de **24px** es el tamaño dominante (88 apariciones). `StudIA2.0 - bigIcon` expone
24 / 32 / 40 / 56 / 88px. Grosor de trazo por defecto: **1px** (1.294 nodos); `0.6px` (270) proviene
de iconos escalados y debería normalizarse.

---

## 8. Inventario de componentes

108 componentes y sets en la página Design System. Marcados con `—` los que no tienen variantes.

| Componente | Variantes | Propiedades |
|---|---|---|
| `add_a_photo` | — | — |
| `addRecursesFases` | 2 | **Property 1**: blank, whitRecurses |
| `bigBreadCrumb` | 1 | **Property 1**: Default |
| `bigBreadCrumbAtom` | 3 | **State**: active, regular, hover |
| `BigIcon-IconModule Card` | 6 | **Property 1**: red, green, indigo, blue, orange, teal |
| `Body - Nueva contraseña` | — | — |
| `BodyCardInfoBase` | — | — |
| `BodyModuleCard` | 1 | **Property 1**: Default |
| `BodyNewsCard` | — | — |
| `CardInfo` | 4 | **CTA**: On, Off; **State**: hover, regular |
| `chipHelp` | 2 | **Property 1**: Hover, default |
| `ColorPicker` | 2 | **Property 1**: regular, error |
| `comillas/cita` | — | — |
| `crop` | — | — |
| `Delete Item` | — | — |
| `divText` | 2 | **State**: general, hover |
| `divUserDataInfo` | — | — |
| `expand_content` | — | — |
| `footer` | — | — |
| `formAddRecurses` | — | — |
| `formDivAcount` | — | — |
| `Games` | — | — |
| `GeneralPlan - StorageInfo` | 2 | **Property 1**: example, blank |
| `GestorContenido - Modulos` | 2 | **Type**: Shrunken, Expanded |
| `GestorContenido - Navbar` | 2 | **State**: Expandend, Compress |
| `gotero` | — | — |
| `icon.docx` | — | — |
| `icon.ppt` | — | — |
| `icon.Xslx` | — | — |
| `icon/interactive` | — | — |
| `Icon/Navigation` | — | — |
| `IconCard` | 1 | **Property 1**: Default |
| `IconNormativa` | — | — |
| `infoTabsActivities` | 3 | **Property 1**: Inicial, central, final |
| `itemActivities` | 2 | **Property 1**: Open, close |
| `itemAnswer` | 4 | **State**: hover, Focus, Regular, preLoaded; **Value**: Filled, Empty |
| `ItemHistorial` | — | — |
| `itemSkills` | 2 | **Property 1**: open, close |
| `Kanoa - ScrollBar` | 2 | **Status**: On, Off |
| `labs` | — | — |
| `Love` | — | — |
| `ModuleCard` | 2 | **Property 1**: Default, Variant2 |
| `News-Card` | — | — |
| `rotate_left` | — | — |
| `sideBarCheckList` | 1 | **Property 1**: Default |
| `StepBarScroll` | — | — |
| `StudIA2.0 - accordionBar` | 4 | **Folded**: True, False; **Hover**: True, False |
| `StudIA2.0 - atomicPaginationText` | 3 | **State**: Default, Hover, Selected |
| `StudIA2.0 - Bar` | 2 | **State**: On, Off |
| `StudIA2.0 - bigIcon` | 5 | **Size**: 24px, 88px, 56px, 40px, 32px |
| `StudIA2.0 - bodyBase` | — | — |
| `StudIA2.0 - Button` | 15 | **State**: Regular, Hover, Disable; **Style**: Flat, Fill, Outline, Text, Raised |
| `StudIA2.0 - Button Toogle` | — | — |
| `StudIA2.0 - Card` | 10 | **Nth**: Odd, Even; **State**: Regular, Hover, Active; **Version**: Vertical, Horizontal; **isDirected**: False, True |
| `StudIA2.0 - checkbox` | 3 | **State**: Disabled, Off, On |
| `StudIA2.0 - Chips` | 6 | **Size**: Small, Regular; **State**: Regular, Hover; **Type**: Basic, Primitive; **isActive**: On, Off |
| `StudIA2.0 - Chips/Checker` | 2 | **Active**: On, Off |
| `StudIA2.0 - chipsTimeLine` | 3 | **State**: Inactive, Add, Delete |
| `StudIA2.0 - Component` | — | — |
| `StudIA2.0 - confirmDialog` | — | — |
| `StudIA2.0 - Context-bar` | 2 | **Property 1**: Desktop, Mobile |
| `StudIA2.0 - Context-Bar-Instance` | — | — |
| `StudIA2.0 - FIleSave` | 3 | **Type**: Card, Input, interactive |
| `StudIA2.0 - First-Instance` | — | — |
| `StudIA2.0 - Footer` | 2 | **Device**: Mobile, Desktop |
| `StudIA2.0 - Footer Navbar` | 4 | **Device**: Desktop, Mobile, Press, Hover; **State**: Regular |
| `StudIA2.0 - Header` | — | — |
| `StudIA2.0 - HeaderComponent` | 2 | **Mode**: Expanded, Shrunken |
| `StudIA2.0 - Icon-Button` | 2 | **State**: Hover, Regular |
| `StudIA2.0 - Label Edit` | 2 | **Type**: Editor, creadorSystem |
| `StudIA2.0 - Menuitem-Link` | 18 | **Contrast**: On, Off; **Nth**: Odd, Even; **Size**: Big, Small; **State**: Regular, Disable, Hover, Active; **Type**: Link, Header |
| `StudIA2.0 - Message-snackbar` | 8 | **Component**: Snackbar, Message; **Device**: Desktop, Mobile; **Orientation**: Vertical, Horizontal; **Type**: Primary, Error, Prevent |
| `StudIA2.0 - Modal` | — | — |
| `StudIA2.0 - Modal` | — | — |
| `StudIA2.0 - Modal - Body` | — | — |
| `StudIA2.0 - Navbar` | 2 | **Mode**: Compress, Expanded |
| `StudIA2.0 - oneTimeLine` | 2 | **Device**: Mobile, Desktop |
| `StudIA2.0 - pagination` | 2 | **Device**: Desktop, Mobile |
| `StudIA2.0 - ProgressBar` | 2 | **Version**: Horizontal, Vertical |
| `StudIA2.0 - ProgressBar/steps` | — | — |
| `StudIA2.0 - RadioButton` | 3 | **State**: True, Disable, False |
| `StudIA2.0 - Resumen - CardInfoBase` | — | — |
| `StudIA2.0 - secondInstance` | — | — |
| `StudIA2.0 - select` | 2 | **Style**: Full, Basic |
| `StudIA2.0 - select/multiselectMenu` | — | — |
| `StudIA2.0 - selectBody` | 2 | **Property 1**: Default, Variant2 |
| `StudIA2.0 - simpleBody` | — | — |
| `StudIA2.0 - SimpleDiv` | 2 | **Nth**: Even, Odd |
| `StudIA2.0 - simpleForm` | — | — |
| `StudIA2.0 - Status - Tag - Extra` | 10 | **Color**: Color, Grey; **Form**: Circle, Square; **Type**: Draft, Success, Prevent, General, Error |
| `StudIA2.0 - Status - Tag - Portal` | 5 | **Type**: Red, Green, Blue, Orange, Teal |
| `StudIA2.0 - Switch` | 2 | **State**: On, Off |
| `StudIA2.0 - Tab Group` | — | — |
| `StudIA2.0 - Tabs` | 6 | **State**: Enable, Disable, Hover; **Version**: Shadcn, Material |
| `StudIA2.0 - Text field` | 17 | **State**: Empty, Filled; **Style**: Regular, Hover, Focus, Error, Disable; **Type**: Rich Editor, Text Area, Regular |
| `StudIA2.0 - timeLineActions` | 10 | **Device**: Desktop, Mobile; **Type**: Inactive, General, Success, Error, Draft |
| `StudIA2.0 - tooltip` | — | — |
| `StudIA2.0 -Sistem of Add Inputs` | 6 | **Empty**: Empty, Filled; **Focus**: Off, On; **State**: Regular, Hover |
| `StudIA2.0/Molecules/Item-List` | 6 | **Nth**: Odd, Even; **State**: Regular, Hover; **Version**: Desktop, Mobile |
| `toolbar` | — | — |
| `Trofeo` | — | — |
| `User - First Div` | — | — |
| `User - Profile Section` | 2 | **Tab**: Profile, Avatar |
| `User - ProfilePic` | 2 | **Property 1**: Default, Variant2 |
| `User - Second Div` | 3 | **Screen**: Desktop, Mobile; **Section**: Still Thinking, Edit |
| `View - TabsContainerInfoPlan` | 3 | **Property 1**: Default, structuraPlan, Variant3 |
| `View User Details` | 2 | **Screen**: Desktop, Mobile |
| `web` | — | — |

### 8.1 Lectura del inventario

**Núcleo estable** (variantes completas, nomenclatura consistente, listos para código):
`Button`, `Text field`, `Card`, `Chips`, `Menuitem-Link`, `Message-snackbar`, `Status - Tag - Extra`,
`Tabs`, `checkbox`, `RadioButton`, `Switch`, `select`, `pagination`, `accordionBar`, `timeLineActions`.

**Convenciones de variante en uso**

- `State`: `Regular` → `Hover` → `Disable` (a veces `Focus`, `Active`, `Press`).
- `Style` en botones: `Fill`, `Outline`, `Text`, `Flat`, `Raised`.
- `Device` / `Screen` / `Version`: `Desktop` ↔ `Mobile`.
- `Mode`: `Expanded` ↔ `Shrunken` (o `Compress`) para navegación.
- `Nth`: `Odd` / `Even` para zebra striping en listas y tarjetas.
- `Type`: taxonomía semántica del componente (`Draft`, `Success`, `Prevent`, `General`, `Error`).

**Deuda de nomenclatura**

- 14 sets siguen con `Property 1` sin renombrar (`ModuleCard`, `ColorPicker`, `chipHelp`,
  `selectBody`, `View - TabsContainerInfoPlan`, `User - ProfilePic`, `IconCard`, `BodyModuleCard`,
  `bigBreadCrumb`, `sideBarCheckList`, `addRecursesFases`, `itemActivities`, `itemSkills`,
  `infoTabsActivities`, `BigIcon-IconModule Card`).
- Dos prefijos conviven: `StudIA2.0 - X` (mayoría) y `StudIA2.0/Molecules/X` (solo `Item-List`).
  Unificar en uno.
- Hay dos `StudIA2.0 - Modal` distintos y componentes sin prefijo (`footer`, `toolbar`, `web`,
  `labs`, `Love`, `Games`, `Trofeo`, `crop`, `gotero`) mezclados con iconos sueltos.
- Errores tipográficos en valores de variante: `Expandend`, `Dektop`, `Ligth`, `Xslx`, `Toogle`,
  `maxWIdth`, `Recurses`. Corregir antes de generar tipos en código.

---

## 9. Handoff a código

Custom properties de la colección local, listas para pegar. Solo se incluye el modo Light bajo
`:root` y el Dark bajo `[data-theme="dark"]`.

```css
:root {
  --portalweb-color-blue: #3b82f6;
  --portalweb-color-blue-soft: #bfdbfe;
  --portalweb-color-green-soft: #bbf7d0;
  --portalweb-color-indigo: #4f46e5;
  --portalweb-color-indigo-soft: #c7d2fe;
  --portalweb-color-on-blue: #ffffff;
  --portalweb-color-on-blue-soft: #1e3a8a;
  --portalweb-color-on-indigo: #ffffff;
  --portalweb-color-on-indigo-soft: #312e81;
  --portalweb-color-on-orange: #ffffff;
  --portalweb-color-on-orange-soft: #7c2d12;
  --portalweb-color-on-red: #ffffff;
  --portalweb-color-on-red-soft: #7f1d1d;
  --portalweb-color-on-teal: #ffffff;
  --portalweb-color-on-teal-soft: #134e4a;
  --portalweb-color-on-green: #ffffff;
  --portalweb-color-on-green-soft: #14532d;
  --portalweb-color-orange: #f97316;
  --portalweb-color-orange-soft: #fed7aa;
  --portalweb-color-red: #f87171;
  --portalweb-color-red-soft: #fecaca;
  --portalweb-color-teal: #14b8a6;
  --portalweb-color-teal-soft: #99f6e4;
  --portalweb-color-green: #22c55e;
  --schemes-background: #e8f5f8;
  --schemes-error: #b3261e;
  --schemes-error-container: #f9dedc;
  --schemes-inverse-on-surface: #e8f5f8;
  --schemes-inverse-primary: #7fcfda;
  --schemes-inverse-surface: #082830;
  --schemes-on-background: #031418;
  --schemes-on-error: #fff5f5;
  --schemes-on-error-container: #410e0b;
  --schemes-on-primary: #ffffff;
  --schemes-on-primary-container: #031418;
  --schemes-on-primary-fixed: #031418;
  --schemes-on-primary-fixed-variant: #1a5f6b;
  --schemes-on-secondary: #ffffff;
  --schemes-on-secondary-container: #331f00;
  --schemes-on-secondary-fixed: #331f00;
  --schemes-on-secondary-fixed-variant: #9a7000;
  --schemes-on-surface: #031418;
  --schemes-on-surface-variant: #236d7a;
  --schemes-on-tertiary: #ffffff;
  --schemes-on-tertiary-container: #031418;
  --schemes-on-tertiary-fixed: #031418;
  --schemes-on-tertiary-fixed-variant: #236d7a;
  --schemes-outline: #8a8a8a;
  --schemes-outline-variant: #d0ebf0;
  --schemes-primary: #1a5f6b;
  --schemes-primary-container: #d0ebf0;
  --schemes-primary-fixed: #d0ebf0;
  --schemes-primary-fixed-dim: #7fcfda;
  --schemes-scrim: #000000;
  --schemes-secondary: #9a7000;
  --schemes-secondary-container: #ffe8b0;
  --schemes-secondary-fixed: #ffe8b0;
  --schemes-secondary-fixed-dim: #f5c842;
  --schemes-shadow: #000000;
  --schemes-surface: #f0fafa;
  --schemes-surface-bright: #f0fafa;
  --schemes-surface-container: #dcf0f4;
  --schemes-surface-container-high: #d0ebf0;
  --schemes-surface-container-highest: #c4e4ea;
  --schemes-surface-container-low: #e8f5f8;
  --schemes-surface-container-lowest: #ffffff;
  --schemes-surface-dim: #d0ebf0;
  --schemes-surface-tint: #2e8b9a;
  --schemes-surface-variant: #d0ebf0;
  --schemes-tertiary: #3daabc;
  --schemes-tertiary-container: #e8f5f8;
  --schemes-tertiary-fixed: #e8f5f8;
  --schemes-tertiary-fixed-dim: #3daabc;
  --status-tags-colors-draft-draft: #5f5e5a;
  --status-tags-colors-draft-onsurface-snackbar: #f1efe8;
  --status-tags-colors-draft-surface: #d3d1c7;
  --status-tags-colors-draft-surface-over: #b4b2a9;
  --status-tags-colors-draft-surface-snackbar: #444441;
  --status-tags-colors-prevent-on-prevent: #fffbff;
  --status-tags-colors-prevent-on-prevent-container: #331f00;
  --status-tags-colors-prevent-prevent: #854f0b;
  --status-tags-colors-prevent-prevent-container: #ffe8b0;
  --status-tags-colors-success-onsurface-snackbar: #eaf3de;
  --status-tags-colors-success-success: #3b6d11;
  --status-tags-colors-success-surface: #c0dd97;
  --status-tags-colors-success-surface-over: #97c459;
  --status-tags-colors-success-surface-snackbar: #27500a;
  --surface-tint-on-surface-on-surface-12: rgba(3, 20, 24, 0.12);
  --surface-tint-on-surface-on-surface-18: rgba(3, 20, 24, 0.18);
  --surface-tint-on-surface-on-surface-20: rgba(3, 20, 24, 0.20);
  --surface-tint-on-surface-on-surface-3: rgba(3, 20, 24, 0.03);
  --surface-tint-on-surface-on-surface-30: rgba(3, 20, 24, 0.30);
  --surface-tint-on-surface-on-surface-5: rgba(3, 20, 24, 0.05);
  --surface-tint-on-surface-on-surface-8: rgba(3, 20, 24, 0.08);
  --surface-tint-surface-0: rgba(240, 250, 250, 0.00);
  --surface-tint-surface-tint-11pct: rgba(46, 139, 154, 0.11);
  --surface-tint-surface-tint-12pct: rgba(46, 139, 154, 0.12);
  --surface-tint-surface-tint-14pct: rgba(46, 139, 154, 0.14);
  --surface-tint-surface-tint-5pct: rgba(46, 139, 154, 0.05);
  --surface-tint-surface-tint-8pct: rgba(46, 139, 154, 0.08);
  --surface-tint-text-muted: #6f6f6f;
  --surface-tint-text-paragraph: #3d3d3d;
  --surface-tint-text-title: #1a1a1a;
  --surface-tint-transparent-shadow-on-primary-container-12: rgba(3, 20, 24, 0.12);
  --surface-tint-transparent-transparent-on-surface-4: rgba(3, 20, 24, 0.04);
  --surface-tint-transparent-transparent-on-surface-8: rgba(3, 20, 24, 0.08);
  --surface-tint-transparent-transparent-surface-0: rgba(240, 250, 250, 0.00);
  --surface-tint-transparent-transparent-surface-12: rgba(240, 250, 250, 0.12);
  --surface-tint-transparent-transparent-surface-60: rgba(240, 250, 250, 0.60);
}

[data-theme="dark"] {
  --portalweb-color-blue: #1d4ed8;
  --portalweb-color-blue-soft: #93c5fd;
  --portalweb-color-green-soft: #86efac;
  --portalweb-color-indigo: #3730a3;
  --portalweb-color-indigo-soft: #a5b4fc;
  --portalweb-color-on-blue: #ffffff;
  --portalweb-color-on-blue-soft: #1e3a8a;
  --portalweb-color-on-indigo: #ffffff;
  --portalweb-color-on-indigo-soft: #1e1b4b;
  --portalweb-color-on-orange: #ffffff;
  --portalweb-color-on-orange-soft: #7c2d12;
  --portalweb-color-on-red: #ffffff;
  --portalweb-color-on-red-soft: #7f1d1d;
  --portalweb-color-on-teal: #ffffff;
  --portalweb-color-on-teal-soft: #134e4a;
  --portalweb-color-on-green: #ffffff;
  --portalweb-color-on-green-soft: #14532d;
  --portalweb-color-orange: #c2410c;
  --portalweb-color-orange-soft: #fdba74;
  --portalweb-color-red: #dc2626;
  --portalweb-color-red-soft: #fca5a5;
  --portalweb-color-teal: #0f766e;
  --portalweb-color-teal-soft: #5eead4;
  --portalweb-color-green: #15803d;
  --schemes-background: #082830;
  --schemes-error: #f2b8b5;
  --schemes-error-container: #8c1d18;
  --schemes-inverse-on-surface: #1a5f6b;
  --schemes-inverse-primary: #1a5f6b;
  --schemes-inverse-surface: #d0ebf0;
  --schemes-on-background: #d0ebf0;
  --schemes-on-error: #601410;
  --schemes-on-error-container: #f9dedc;
  --schemes-on-primary: #0f3d47;
  --schemes-on-primary-container: #d0ebf0;
  --schemes-on-primary-fixed: #031418;
  --schemes-on-primary-fixed-variant: #1a5f6b;
  --schemes-on-secondary: #5c4200;
  --schemes-on-secondary-container: #ffe8b0;
  --schemes-on-secondary-fixed: #331f00;
  --schemes-on-secondary-fixed-variant: #9a7000;
  --schemes-on-surface: #d0ebf0;
  --schemes-on-surface-variant: #7fcfda;
  --schemes-on-tertiary: #031418;
  --schemes-on-tertiary-container: #e8f5f8;
  --schemes-on-tertiary-fixed: #031418;
  --schemes-on-tertiary-fixed-variant: #236d7a;
  --schemes-outline: #c2c2c2;
  --schemes-outline-variant: #0f3d47;
  --schemes-primary: #7fcfda;
  --schemes-primary-container: #1a5f6b;
  --schemes-primary-fixed: #d0ebf0;
  --schemes-primary-fixed-dim: #7fcfda;
  --schemes-scrim: #000000;
  --schemes-secondary: #f5c842;
  --schemes-secondary-container: #5c4200;
  --schemes-secondary-fixed: #ffe8b0;
  --schemes-secondary-fixed-dim: #f5c842;
  --schemes-shadow: #000000;
  --schemes-surface: #082830;
  --schemes-surface-bright: #236d7a;
  --schemes-surface-container: #1a5f6b;
  --schemes-surface-container-high: #236d7a;
  --schemes-surface-container-highest: #2e8b9a;
  --schemes-surface-container-low: #0f3d47;
  --schemes-surface-container-lowest: #031418;
  --schemes-surface-dim: #082830;
  --schemes-surface-tint: #7fcfda;
  --schemes-surface-variant: #0f3d47;
  --schemes-tertiary: #2e8b9a;
  --schemes-tertiary-container: #236d7a;
  --schemes-tertiary-fixed: #e8f5f8;
  --schemes-tertiary-fixed-dim: #3daabc;
  --status-tags-colors-draft-draft: #b4b2a9;
  --status-tags-colors-draft-onsurface-snackbar: #2c2c2a;
  --status-tags-colors-draft-surface: #444441;
  --status-tags-colors-draft-surface-over: #5f5e5a;
  --status-tags-colors-draft-surface-snackbar: #d3d1c7;
  --status-tags-colors-prevent-on-prevent: #331f00;
  --status-tags-colors-prevent-on-prevent-container: #ffe8b0;
  --status-tags-colors-prevent-prevent: #f5c842;
  --status-tags-colors-prevent-prevent-container: #5c4200;
  --status-tags-colors-success-onsurface-snackbar: #173404;
  --status-tags-colors-success-success: #97c459;
  --status-tags-colors-success-surface: #27500a;
  --status-tags-colors-success-surface-over: #3b6d11;
  --status-tags-colors-success-surface-snackbar: #97c459;
  --surface-tint-on-surface-on-surface-12: rgba(208, 235, 240, 0.12);
  --surface-tint-on-surface-on-surface-18: rgba(208, 235, 240, 0.18);
  --surface-tint-on-surface-on-surface-20: rgba(208, 235, 240, 0.20);
  --surface-tint-on-surface-on-surface-3: rgba(208, 235, 240, 0.03);
  --surface-tint-on-surface-on-surface-30: rgba(208, 235, 240, 0.30);
  --surface-tint-on-surface-on-surface-5: rgba(208, 235, 240, 0.05);
  --surface-tint-on-surface-on-surface-8: rgba(208, 235, 240, 0.08);
  --surface-tint-surface-0: rgba(8, 40, 48, 0.00);
  --surface-tint-surface-tint-11pct: rgba(127, 207, 218, 0.11);
  --surface-tint-surface-tint-12pct: rgba(127, 207, 218, 0.12);
  --surface-tint-surface-tint-14pct: rgba(127, 207, 218, 0.14);
  --surface-tint-surface-tint-5pct: rgba(127, 207, 218, 0.05);
  --surface-tint-surface-tint-8pct: rgba(127, 207, 218, 0.08);
  --surface-tint-text-muted: #9eb0b5;
  --surface-tint-text-paragraph: #d5dee0;
  --surface-tint-text-title: #f5f7f8;
  --surface-tint-transparent-shadow-on-primary-container-12: rgba(208, 235, 240, 0.12);
  --surface-tint-transparent-transparent-on-surface-4: rgba(208, 235, 240, 0.04);
  --surface-tint-transparent-transparent-on-surface-8: rgba(208, 235, 240, 0.08);
  --surface-tint-transparent-transparent-surface-0: rgba(8, 40, 48, 0.00);
  --surface-tint-transparent-transparent-surface-12: rgba(8, 40, 48, 0.12);
  --surface-tint-transparent-transparent-surface-60: rgba(8, 40, 48, 0.60);
}

:root {
  /* Forma */
  --radius-none: 0px;
  --radius-sm: 4px;
  --radius-md: 20px;
  --radius-full: 100px;

  /* Espaciado */
  --space-1: 4px;  --space-2: 8px;  --space-3: 12px;
  --space-4: 16px; --space-6: 24px; --space-10: 40px;

  /* Elevación */
  --shadow-rest:  0 8px 18px 1px rgba(3, 20, 24, 0.05);
  --shadow-hover: 0 8px 18px 3px rgba(3, 20, 24, 0.08);
}
```

Escala tipográfica equivalente:

```css
--font-family: Roboto, system-ui, sans-serif;
--text-display-lg: 400 57px/64px var(--font-family); letter-spacing: -0.25px;
--text-headline-lg: 400 32px/40px var(--font-family);
--text-headline-md: 400 28px/36px var(--font-family);
--text-headline-sm: 400 24px/32px var(--font-family);
--text-title-lg:  400 22px/28px var(--font-family);
--text-title-md:  500 16px/24px var(--font-family); letter-spacing: 0.15px;
--text-title-sm:  500 14px/20px var(--font-family); letter-spacing: 0.1px;
--text-body-lg:   400 16px/24px var(--font-family); letter-spacing: 0.5px;
--text-body-md:   400 14px/20px var(--font-family); letter-spacing: 0.25px;
--text-body-sm:   400 12px/16px var(--font-family); letter-spacing: 0.4px;
--text-label-lg:  500 14px/20px var(--font-family); letter-spacing: 0.1px;
--text-label-md:  500 12px/16px var(--font-family); letter-spacing: 0.5px;
--text-label-sm:  500 11px/16px var(--font-family); letter-spacing: 0.5px;
```

---

## 10. Deuda técnica priorizada

| # | Hallazgo | Impacto | Acción |
|---|---|---|---|
| 1 | 513 estilos de color con 0 usos, incluido un tema `StudIA 2.0/sys/*` naranja que contradice el teal de las variables | Alto — confunde sobre cuál es la paleta real | Archivar los estilos; dejar solo variables |
| 2 | 23 colecciones de variables de otros productos entran por instancias importadas | Alto — el archivo pesa 3,3 MB y el tema es ambiguo | Desacoplar: separar librería StudIA 2.0 del archivo de trabajo |
| 3 | `10px` como gap más frecuente, fuera de escala | Medio | Normalizar a 8 o 12 |
| 4 | Radio `5px` en 60 nodos, sin token | Medio | Migrar a `almostRounded` (4px) |
| 5 | 14 sets con `Property 1` sin nombrar | Medio — rompe la generación de tipos | Renombrar |
| 6 | 6 estilos de sombra duplicados o vacíos | Bajo | Consolidar en `sm` / `md` / rest / hover |
| 7 | Errores tipográficos en variantes (`Expandend`, `Dektop`, `Ligth`) | Bajo, permanente si se codifica | Corregir antes del handoff |
| 8 | `Internal Only Canvas` con variantes sueltas duplicadas de la página Design System | Bajo | Depurar o mover a archivo aparte |
| 9 | Grosor de trazo `0.6px` en 270 nodos | Bajo | Normalizar a 1px |

---

## 11. Anexo — paleta heredada `StudIA 2.0/sys/*` (estilos, sin uso)

Tema Material generado por Theme Builder sobre una semilla naranja. **No corresponde al producto
actual** (teal). Se documenta solo para poder retirarlo con criterio. Existen además las variantes
`light-medium-contrast`, `light-high-contrast`, `dark-medium-contrast` y `dark-high-contrast`,
más las paletas tonales `ref/*` (6 familias × 18 tonos) y `key-colors/*`.

| Rol | light | dark |
|---|---|---|
| `background` | `#FFF8F5` | `#19120D` |
| `error` | `#BA1A1A` | `#FFB4AB` |
| `error-container` | `#FFDAD6` | `#93000A` |
| `inverse-on-surface` | `#FEEEE4` | `#382F28` |
| `inverse-primary` | `#FFB77F` | `#89511F` |
| `inverse-surface` | `#382F28` | `#EFDFD6` |
| `on-background` | `#221A14` | `#EFDFD6` |
| `on-error` | `#FFFFFF` | `#690005` |
| `on-error-container` | `#93000A` | `#FFDAD6` |
| `on-primary` | `#FFFFFF` | `#4E2600` |
| `on-primary-container` | `#6C3A08` | `#FFDCC4` |
| `on-primary-fixed` | `#2F1500` | `#2F1500` |
| `on-primary-fixed-variant` | `#6C3A08` | `#6C3A08` |
| `on-secondary` | `#FFFFFF` | `#561E19` |
| `on-secondary-container` | `#73342D` | `#FFDAD5` |
| `on-secondary-fixed` | `#3B0906` | `#3B0906` |
| `on-secondary-fixed-variant` | `#73342D` | `#73342D` |
| `on-surface` | `#221A14` | `#EFDFD6` |
| `on-surface-variant` | `#51443B` | `#D6C3B7` |
| `on-tertiary` | `#FFFFFF` | `#2E3400` |
| `on-tertiary-container` | `#434B05` | `#DFE995` |
| `on-tertiary-fixed` | `#1A1E00` | `#1A1E00` |
| `on-tertiary-fixed-variant` | `#434B05` | `#434B05` |
| `outline` | `#847469` | `#9E8D82` |
| `outline-variant` | `#D6C3B7` | `#51443B` |
| `primary` | `#89511F` | `#FFB77F` |
| `primary-container` | `#FFDCC4` | `#6C3A08` |
| `primary-fixed` | `#FFDCC4` | `#FFDCC4` |
| `primary-fixed-dim` | `#FFB77F` | `#FFB77F` |
| `scrim` | `#000000` | `#000000` |
| `secondary` | `#904A42` | `#FFB4AA` |
| `secondary-container` | `#FFDAD5` | `#73342D` |
| `secondary-fixed` | `#FFDAD5` | `#FFDAD5` |
| `secondary-fixed-dim` | `#FFB4AA` | `#FFB4AA` |
| `shadow` | `#000000` | `#000000` |
| `surface` | `#FFF8F5` | `#19120D` |
| `surface-bright` | `#FFF8F5` | `#413731` |
| `surface-container` | `#FBEBE1` | `#261E18` |
| `surface-container-high` | `#F5E5DC` | `#312822` |
| `surface-container-highest` | `#EFDFD6` | `#3C332D` |
| `surface-container-low` | `#FFF1E9` | `#221A14` |
| `surface-container-lowest` | `#FFFFFF` | `#140D08` |
| `surface-dim` | `#E7D7CE` | `#19120D` |
| `surface-tint` | `#89511F` | `#FFB77F` |
| `surface-variant` | `#F3DFD2` | `#51443B` |
| `tertiary` | `#5B631E` | `#C3CD7C` |
| `tertiary-container` | `#DFE995` | `#434B05` |
| `tertiary-fixed` | `#DFE995` | `#DFE995` |
| `tertiary-fixed-dim` | `#C3CD7C` | `#C3CD7C` |

Semilla del tema: `StudIA 2.0/source/seed` = `#F09240`.

---

## 12. Cómo se generó este documento

`Kanoa_Lab_Main.fig` es un ZIP que contiene `canvas.fig`, un binario Kiwi comprimido con zstd.
Se decodificó el esquema Kiwi embebido (638 definiciones) y se recorrieron los 11.185 `nodeChange`
del documento para leer variables, estilos, geometría y definiciones de componente.
No hubo inspección visual: todos los valores provienen del árbol de nodos.

**Para regenerarlo** tras cambios en Figma: reexportar el `.fig` y repetir el proceso.
Los conteos de la sección 1 sirven como verificación rápida de que se leyó el archivo correcto.
