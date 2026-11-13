import { useState } from 'react'
import tokensCss from '../../kanoa-tokens.css?raw'
import { Button, Icon } from '../../ui'
import { Demo, Note, PageHead, PropsTable, Section } from '../kit'

/* ───── Tokens leídos del CSS real (única fuente de verdad) ───── */
function parseBlock(name: 'light' | 'dark'): Record<string, string> {
  const m = tokensCss.match(new RegExp(`\\.${name}\\s*\\{([^}]*)\\}`))
  const out: Record<string, string> = {}
  if (m) for (const l of m[1]!.matchAll(/(--[\w-]+)\s*:\s*([^;]+);/g)) out[l[1]!] = l[2]!.trim()
  return out
}
const light = parseBlock('light')
const dark = parseBlock('dark')
const names = Object.keys(light)

const groups: { id: string; title: string; lead: string; test: (n: string) => boolean }[] = [
  { id: 'marca', title: 'Marca', lead: 'Primario (azul petróleo), secundario (ámbar) y terciario (turquesa). Cada color tiene su par on-* de contraste y su contenedor.',
    test: (n) => /^--(on-)?(primary|secondary|tertiary)(-container)?$/.test(n) || n === '--surface-tint' },
  { id: 'error', title: 'Error', lead: 'Estados de fallo y acciones destructivas.', test: (n) => /^--(on-)?error(-container)?$/.test(n) },
  { id: 'superficies', title: 'Superficies', lead: 'Fondos de página y contenedores, de más bajo a más alto en elevación tonal.',
    test: (n) => /^--(background|on-background|surface|on-surface|surface-variant|on-surface-variant|surface-dim|surface-bright|surface-container(-lowest|-low|-high|-highest)?)$/.test(n) },
  { id: 'contorno', title: 'Contorno e inversos', lead: 'Bordes, sombras, scrim y la familia inversa (snackbars, tooltips).',
    test: (n) => /^--(outline|outline-variant|shadow|scrim|inverse-surface|inverse-on-surface|inverse-primary)$/.test(n) },
  { id: 'texto', title: 'Texto', lead: 'Colores semánticos de contenido para títulos, párrafos y texto atenuado.', test: (n) => /^--(title|paragraph|muted)$/.test(n) },
  { id: 'estado', title: 'Estados', lead: 'Prevención (ámbar), éxito (verde) y borrador (gris). Alimentan etiquetas, mensajes y snackbars.',
    test: (n) => /^--(on-)?(prevent|success|draft)/.test(n) || /^--(on-)?(draft|success)-surface/.test(n) || n === '--onsurface-snackbar' },
  { id: 'categoricos', title: 'Categóricos', lead: 'Seis tonos para identificar módulos o autores. No son estados: el color lo decide la pantalla, no el componente.',
    test: (n) => /^--(on-)?(green|indigo|blue|orange|teal|red)(-soft)?$/.test(n) },
  { id: 'capas', title: 'Capas de estado', lead: 'Transparencias para hover (8 %), focus/pressed (12 %) y divisores. Se usan encima de cualquier superficie.',
    test: (n) => /^--(surface-tint-\d+-|surface-0|transparent-.*|on-surface---\d+|shadow-on-.*)$/.test(n) },
  { id: 'fijos', title: 'Fijos', lead: 'Colores fixed de M3: no cambian entre modo claro y oscuro.', test: (n) => /fixed/.test(n) },
]

function Swatch({ name }: { name: string }) {
  const [copied, setCopied] = useState(false)
  const l = light[name]!; const d = dark[name]
  return (
    <button type="button" className="pal" title="Copiar var()" onClick={() => { navigator.clipboard?.writeText(`var(${name})`); setCopied(true); setTimeout(() => setCopied(false), 1000) }}>
      <span className="pal__chips" aria-hidden="true">
        <span style={{ background: l }} />
        <span style={{ background: d ?? l }} />
      </span>
      <span className="pal__meta">
        <span className="t-label-md" style={{ display: 'block' }} aria-live="polite">{copied ? 'Copiado ✓' : name.replace(/^--/, '')}</span>
        <code>{d && d !== l ? `claro ${l} · oscuro ${d}` : l}</code>
      </span>
    </button>
  )
}

export function Inicio({ go }: { go: (r: string) => void }) {
  return (
    <>
      <PageHead title="Design System StudIA 2.0">
        Catálogo vivo del sistema de diseño de Kanoa Lab. Todo lo que ves usa únicamente los tokens de <code>Tokens/tokens 1.css</code>:
        cambia el tema arriba a la derecha y verás cómo responde cada componente.
      </PageHead>
      <div className="hero">
        <h2 className="t-headline-md">Diseño atómico sobre Material Design 3</h2>
        <p className="t-body-lg" style={{ margin: 0 }}>Fundamentos → átomos → moléculas → organismos. Cada pieza muestra sus variantes, estados, API y código listo para copiar.</p>
        <div className="row"><Button onClick={() => go('atomos')} iconEnd="arrow_forward">Ver átomos</Button><Button variant="outline" onClick={() => go('paleta')}>Ver paleta</Button></div>
      </div>
      <Section id="mapa" title="Mapa del catálogo">
        <ul className="map-list">
          {([
            ['paleta', 'Paleta', 'Colores en claro y oscuro, agrupados por rol.'], ['tipografia', 'Tipografía', 'Escala Roboto de 15 roles.'],
            ['forma-espacio', 'Forma y espacio', 'Radios, espaciado, tamaños de componente y elevación.'], ['iconos', 'Iconos', 'Material Symbols y su uso.'],
            ['atomos', 'Átomos', 'Botón, campos, selección, etiquetas, avatar, progreso.'], ['moleculas', 'Moléculas', 'Mensajes, tabs, paginación, tarjeta, menú, listas.'],
            ['organismos', 'Organismos', 'Modal, navbar y header.'],
          ] as const).map(([id, name, desc]) => (
            <li key={id}><a href={`#/${id}`} className="ds-link ds-link--quiet t-title-md">{name}</a><span className="t-body-md">{desc}</span></li>
          ))}
        </ul>
      </Section>
      <Section id="principios" title="Principios">
        <PropsTable rows={[
          ['Solo tokens', 'regla', '—', 'Ningún componente usa un color, radio o sombra literal: todo sale de var(--…).'],
          ['Dos temas', 'regla', '—', 'Los temas son las clases .light y .dark sobre <html>. Los componentes no saben en qué tema están.'],
          ['Accesible', 'regla', '—', 'Controles nativos, foco visible, roles ARIA y nombre accesible en cada componente; cada pieza compleja documenta su contrato de teclado.'],
          ['Contraste', 'regla', '—', 'Texto de etiquetas y mensajes ≥ 4.5:1 en ambos temas. Los estados éxito y borrador usan los tonos *-surface-snackbar como tinta.'],
          ['Estados completos', 'regla', '—', 'Regular · hover · focus · pressed · disabled · error, con capas de estado 8 % / 12 %.'],
        ]} />
      </Section>
    </>
  )
}

export function Paleta() {
  const used = new Set<string>()
  const rendered = groups.map((g) => {
    const list = names.filter((n) => !used.has(n) && g.test(n))
    list.forEach((n) => used.add(n))
    return { ...g, list }
  })
  const rest = names.filter((n) => !used.has(n))
  return (
    <>
      <PageHead title="Paleta">
        {names.length} tokens de color con su valor en modo claro y oscuro. Haz clic en cualquiera para copiar su <code>var()</code>.
      </PageHead>
      {rendered.map((g) => (
        <Section key={g.id} id={g.id} title={`${g.title} (${g.list.length})`} lead={g.lead}>
          <div className="palette">{g.list.map((n) => <Swatch key={n} name={n} />)}</div>
        </Section>
      ))}
      {rest.length > 0 && (
        <Section id="otros" title={`Otros (${rest.length})`}><div className="palette">{rest.map((n) => <Swatch key={n} name={n} />)}</div></Section>
      )}
    </>
  )
}

const typeScale: [string, string, string][] = [
  ['display-lg', 'Display Large', '400 · 57/64 · −0.25'], ['display-md', 'Display Medium', '400 · 45/52 · 0'], ['display-sm', 'Display Small', '400 · 36/44 · 0'],
  ['headline-lg', 'Headline Large', '400 · 32/40 · 0'], ['headline-md', 'Headline Medium', '400 · 28/36 · 0'], ['headline-sm', 'Headline Small', '400 · 24/32 · 0'],
  ['title-lg', 'Title Large', '400 · 22/28 · 0'], ['title-md', 'Title Medium', '500 · 16/24 · 0.15'], ['title-sm', 'Title Small', '500 · 14/20 · 0.1'],
  ['body-lg', 'Body Large', '400 · 16/24 · 0.5'], ['body-md', 'Body Medium', '400 · 14/20 · 0.25'], ['body-sm', 'Body Small', '400 · 12/16 · 0.4'],
  ['label-lg', 'Label Large', '500 · 14/20 · 0.1'], ['label-md', 'Label Medium', '500 · 12/16 · 0.5'], ['label-sm', 'Label Small', '500 · 11/16 · 0.5'],
]

export function Tipografia() {
  return (
    <>
      <PageHead title="Tipografía">Familia única <strong>Roboto</strong>, escala Material 3 de 15 roles. Pesos 400 y 500; el interlineado es siempre absoluto en px.</PageHead>
      <Section id="escala" title="Escala" lead="Peso · tamaño/interlineado · tracking (px). Aplica la clase utilitaria t-{rol}.">
        {typeScale.map(([k, n, spec]) => (
          <div key={k} className="type-row">
            <div><span className="t-title-sm">{n}</span><small className="t-body-sm">.t-{k}</small><small className="t-body-sm">{spec}</small></div>
            <span className={`t-${k}`} style={{ color: 'var(--title)' }}>Aprender jugando con Kanoa</span>
          </div>
        ))}
      </Section>
      <Section id="reglas" title="Reglas de uso">
        <PropsTable rows={[
          ['label/*', 'rol', '—', 'Único grupo en Medium: botones, chips, tabs y overlines.'],
          ['display/*', 'rol', '—', 'Escala disponible, no usada en componentes. Reservada a portadas.'],
          ['interlineado', 'regla', '—', 'Usar line-height: 24px, nunca 1.5.'],
          ['tracking', 'regla', '—', 'Crece al bajar de tamaño (0.5px en body/large y label/medium).'],
        ]} />
        <Note>Los estilos de otras marcas del archivo Figma (edu-min, OPI-THEME, Centus…) no forman parte de StudIA 2.0 y no deben usarse en producto nuevo.</Note>
      </Section>
    </>
  )
}

export function FormaEspacio() {
  const radii: [string, string, string, string][] = [['basic', '--radius-none', '0px', 'Bordes rectos'], ['almostRounded', '--radius-sm', '4px', 'Inputs, chips pequeños'],
    ['semiRounded', '--radius-md', '20px', 'Cards, modales, contenedores'], ['rounded', '--radius-full', '100px', 'Botones, tags, avatares']]
  const spaces: [string, number][] = [['--space-1', 4], ['--space-2', 8], ['--space-3', 12], ['--space-4', 16], ['--space-5', 24], ['--space-6', 40]]
  return (
    <>
      <PageHead title="Forma y espacio">Radios, escala de espaciado, tamaños de componente y elevación.</PageHead>
      <Section id="radios" title="Radios" lead="Un solo token multimodo (border-radius). Cualquier otro valor es deuda a migrar.">
        <Demo title="Radios" code={`border-radius: var(--radius-sm); /* 4px */\nborder-radius: var(--radius-md); /* 20px */\nborder-radius: var(--radius-full); /* 100px */`}>
          {radii.map(([n, v, px, use]) => (
            <div key={n} className="stack" style={{ width: 150, gap: 8 }}>
              <div className="shape-box" style={{ borderRadius: `var(${v})` }}>{px}</div>
              <div><span className="t-label-lg">{n}</span><br /><span className="t-body-sm" style={{ color: 'var(--muted)' }}>{use}</span></div>
            </div>
          ))}
        </Demo>
      </Section>
      <Section id="espaciado" title="Espaciado" lead="Escala 4 · 8 · 12 · 16 · 24 · 40. 8px es la base (el gap más común).">
        <Demo title="Escala" code={`gap: var(--space-2); /* 8px */\npadding: var(--space-4); /* 16px */`} layout="col">
          {spaces.map(([v, px]) => (
            <div key={v} className="row" style={{ flexWrap: 'nowrap' }}>
              <code style={{ width: 100 }}>{v}</code><span className="t-body-sm" style={{ width: 40 }}>{px}px</span>
              <div className="space-bar" style={{ width: px * 4 }} />
            </div>
          ))}
        </Demo>
      </Section>
      <Section id="tamanos" title="Tamaños de componente">
        <PropsTable rows={[
          ['--size-button-small', 'px', '40', 'Alto del botón pequeño (padding 10).'],
          ['--size-button-medium', 'px', '44', 'Botón por defecto (padding 12).'],
          ['--size-button-big', 'px', '48', 'Botón grande (padding 14).'],
          ['--size-input-small', 'px', '44', 'Campo por defecto.'],
          ['--size-input-medium', 'px', '58', 'Campo mediano.'],
          ['--size-input-big', 'px', '70', 'Campo grande.'],
          ['--size-icon-*', 'px', '12 / 18 / 24 / 36', 'Iconos small / medium / big / super. 24 es el dominante.'],
        ]} />
      </Section>
      <Section id="elevacion" title="Elevación" lead="Par recomendado para producto: sombra de card en reposo → hover. Responde al modo oscuro porque usa variables de color.">
        <Demo title="Niveles" code={`box-shadow: var(--elevation-1);\nbox-shadow: var(--elevation-2);\nbox-shadow: var(--shadow-card);\nbox-shadow: var(--shadow-card-hover);`}>
          {[['--elevation-1', 'Nivel 1 · cards, raised'], ['--elevation-2', 'Nivel 2 · menús, hover'], ['--shadow-card', 'Card en reposo'], ['--shadow-card-hover', 'Card en hover']].map(([v, l]) => (
            <div key={v} style={{ width: 170, height: 90, borderRadius: 'var(--radius-md)', background: 'var(--surface-container-lowest)', boxShadow: `var(${v})`, display: 'grid', placeItems: 'center', textAlign: 'center', padding: 8 }}>
              <span className="t-body-sm">{l}</span>
            </div>
          ))}
        </Demo>
      </Section>
    </>
  )
}

const iconNames = ['home', 'search', 'menu', 'close', 'add', 'remove', 'check', 'edit', 'delete', 'save', 'content_copy', 'visibility', 'visibility_off', 'lock', 'person', 'group',
  'settings', 'notifications', 'info', 'warning', 'error', 'check_circle', 'expand_more', 'chevron_left', 'chevron_right', 'arrow_forward', 'upload', 'download', 'image', 'description',
  'sports_esports', 'quiz', 'extension', 'school', 'newspaper', 'bar_chart', 'dashboard', 'filter_list', 'calendar_month', 'link', 'logout', 'more_vert', 'drag_indicator', 'star', 'emoji_events', 'language', 'help', 'refresh']

export function Iconos() {
  const [copied, setCopied] = useState('')
  return (
    <>
      <PageHead title="Iconos">Material Symbols Outlined (peso 400, relleno 0). Tamaño dominante: 24px; trazo de 1px en las ilustraciones propias.</PageHead>
      <Section id="catalogo" title="Catálogo" lead="Selección de los iconos usados por el sistema. Clic para copiar el nombre.">
        <div className="icon-grid">
          {iconNames.map((n) => (
            <button key={n} type="button" className="icon-cell" onClick={() => { navigator.clipboard?.writeText(n); setCopied(n) }}>
              <Icon name={n} /><small>{copied === n ? 'copiado ✓' : n}</small>
            </button>
          ))}
        </div>
      </Section>
      <Section id="uso" title="Uso">
        <Demo title="Componente Icon" code={`<Icon name="check_circle" size={24} />\n<IconButton icon="close" label="Cerrar" />`}>
          {[12, 18, 24, 36].map((s) => <div key={s} className="stack" style={{ alignItems: 'center', width: 64, gap: 4 }}><Icon name="extension" size={s} /><span className="t-body-sm">{s}px</span></div>)}
        </Demo>
        <PropsTable rows={[['name', 'string', '—', 'Nombre del símbolo (ligadura de Material Symbols).'], ['size', 'number', '24', 'Tamaño en px. Usa 12 / 18 / 24 / 36.']]} />
        <Note>Un icono decorativo se oculta del árbol de accesibilidad (aria-hidden). Si comunica algo solo, usa IconButton con label.</Note>
      </Section>
    </>
  )
}
