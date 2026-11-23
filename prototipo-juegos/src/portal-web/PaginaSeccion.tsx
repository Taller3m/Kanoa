import { useEffect, useRef } from 'react'
import { Icon } from '../ui'
import type { SeccionPublica } from './contrato'
import { BloqueJuego } from './BloqueJuego'
import logoNav from './assets/logo-navbar.svg'
import logoFooter from './assets/logo-footer.svg'
import icoFacebook from './assets/facebook.svg'
import icoLinkedin from './assets/linkedin.svg'
import icoInstagram from './assets/instagram.svg'
import icoX from './assets/x.svg'
import './portal-web.css'

/**
 * Página de una sección del Portal WEB (Figma «Página Web Kanoa lab» › Bienestar emocional ›
 * «Device=Desktop, Type=Seccion» 1129:34433 y «Type=Seccionerror» 1233:16633).
 * La barra, las migas y el pie son una réplica de referencia; lo que desarrollo debe llevar al portal real es
 * el bloque Juego (BloqueJuego.tsx) y las reglas de contrato.ts.
 */
const SITIO = 'https://kanoalab.com.co/kanoa'
// Solo se enlazan las páginas que existen en producción; el resto queda como texto (no se conoce su URL).
const MENU: { label: string; href?: string; sub?: boolean }[] = [
  { label: 'Ser+Stem', href: `${SITIO}/serstem`, sub: true },
  { label: 'Bienestar emocional', href: `${SITIO}/bienestar-emocional`, sub: true },
  { label: 'Observatorio', href: `${SITIO}/observatorio-serstem`, sub: true },
  { label: 'Escuelas', sub: true },
  { label: '¿Quiénes somos?' },
]
const PIE: { label: string; href?: string }[] = [
  { label: 'SER + STEM', href: `${SITIO}/serstem` }, { label: 'Observatorio', href: `${SITIO}/observatorio-serstem` }, { label: 'Portafolio' },
  { label: 'Bienestar Emocional', href: `${SITIO}/bienestar-emocional` }, { label: 'Escuelas' }, { label: 'Quiénes somos' },
]
const NUEVA = { target: '_blank', rel: 'noopener noreferrer' } as const
const REDES = [{ n: 'Facebook', i: icoFacebook }, { n: 'LinkedIn', i: icoLinkedin }, { n: 'Instagram', i: icoInstagram }, { n: 'X', i: icoX }]

// Ilustración «Designer» de la página de error, compuesta por sus piezas en la misma posición que en Figma (inset: arriba, derecha, abajo, izquierda).
const PIEZAS = import.meta.glob('./assets/ilustracion/*.svg', { eager: true, query: '?url', import: 'default' }) as Record<string, string>
const ILUSTRACION: [string, string][] = [
  ['1fce6', '0 7.85% 3.91% 0'], ['cd5b0', '0 7.85% 3.91% 0'], ['26ccf', '11.75% 23.92% 13.77% 14.53%'], ['ac376', '33.92% 45.37% 27.3% 34.01%'],
  ['34182', '52.05% 13% 32.18% 77.34%'], ['e2cda', '35.95% 12.75% 42.62% 76.56%'], ['fc1e1', '61.33% 6.25% 0.16% 71.57%'], ['029f1', '85.29% 21.62% 5.47% 70.43%'],
  ['bee61', '62.95% 2.32% 0.24% 75.33%'], ['7ee0c', '87.89% 8.08% 11.4% 89.54%'], ['a1485', '77.23% 6.84% 0.16% 75.33%'], ['d0b68', '43.17% 40.96% 44.48% 47.1%'],
  ['d6ba1', '49.02% 24.01% 20.23% 51.14%'], ['5a256', '71.27% 28.12% 24.56% 71.49%'], ['41b05', '24.02% 72.38% 18.96% 17.28%'], ['9cad1', '73.24% 78.46% 0.27% 2.25%'],
  ['452d6', '99.69% 0 0 0'], ['f52a1', '26.8% 73.79% 22.93% 18.63%'], ['b5fc4', '76.18% 26.03% 0.4% 43.1%'],
]

export function PaginaSeccion({ pagina, onAdmin, onRegresarMicrositio }: {
  pagina: SeccionPublica; onAdmin: () => void; onRegresarMicrositio: () => void
}) {
  const h1 = useRef<HTMLHeadingElement>(null)
  useEffect(() => { document.title = `${pagina.seccion.nombre} | ${pagina.micrositio.nombre} | KANOA LAB` }, [pagina.seccion.nombre, pagina.micrositio.nombre])
  // IR AL INICIO del juego: lleva al visitante al Home del portal (HU-PW-196, escenario 6).
  // En el prototipo se abre en otra pestaña, como el resto de enlaces al sitio, para no salir de la simulación.
  const irAlInicio = () => { window.open(`${SITIO}/inicio`, '_blank', 'noopener,noreferrer') }

  return (
    <div className="pw light">
      <div className="pw-proto" role="note">
        <span><Icon name="science" size={18} /> Simulación del Portal WEB en el prototipo · {pagina.micrositio.nombre} › {pagina.seccion.nombre}</span>
        <button type="button" className="pw-proto__btn" onClick={onAdmin}><Icon name="arrow_back" size={18} />Volver a la administración</button>
      </div>
      <a className="pw-skip" href="#pw-main" onClick={(e) => { e.preventDefault(); document.getElementById('pw-main')?.focus() }}>Saltar al contenido principal</a>

      <header className="pw-nav-wrap">
        <nav className="pw-nav" aria-label="Menú principal">
          <a className="pw-nav__logo" href={`${SITIO}/inicio`} {...NUEVA}><img src={logoNav} width={47} height={52} alt="KANOA LAB, inicio (abre el sitio en otra pestaña)" /></a>
          <ul className="pw-nav__items">
            {MENU.map((m) => (
              <li key={m.label}>{m.href
                ? <a className="pw-nav__item" href={m.href} {...NUEVA}>{m.label}{m.sub && <Icon name="keyboard_arrow_down" size={24} />}</a>
                : <span className="pw-nav__item">{m.label}{m.sub && <Icon name="keyboard_arrow_down" size={24} />}</span>}</li>
            ))}
          </ul>
          <span className="pw-nav__cta">Portafolio</span>
        </nav>
      </header>

      <main id="pw-main" tabIndex={-1} className="pw-main">
        <nav aria-label="Ruta de navegación" className="pw-crumbs">
          <ol>
            <li><a href={`${SITIO}/inicio`} {...NUEVA}>Inicio</a></li>
            <li><Icon name="chevron_right" size={24} /><a href={`${SITIO}/${pagina.micrositio.slug}`} {...NUEVA}>{pagina.micrositio.nombre}</a></li>
            <li><Icon name="chevron_right" size={24} /><span aria-current="page">{pagina.seccion.nombre}</span></li>
          </ol>
        </nav>
        <h1 ref={h1} tabIndex={-1} className="sr-only">{pagina.seccion.nombre} · {pagina.micrositio.nombre}</h1>

        {pagina.disponible ? (
          <div className="pw-bloques">
            {pagina.bloques.map((b) => b.tipo === 'juego' ? <BloqueJuego key={b.id} bloque={b} onIrAlInicio={irAlInicio} />
              : b.tipo === 'texto' ? (
                <section key={b.id} className="pw-bloque" aria-labelledby={`pw-b-${b.id}`}>
                  <h2 className="pw-bloque__titulo" id={`pw-b-${b.id}`}>{b.titulo}</h2>
                  {b.parrafos.map((p, i) => <p key={i} className="pw-bloque__texto">{p}</p>)}
                </section>
              ) : (
                <section key={b.id} className="pw-bloque" aria-labelledby={`pw-b-${b.id}`}>
                  <h2 className="pw-bloque__titulo" id={`pw-b-${b.id}`}>{b.titulo}</h2>
                  <div className="pw-otro">Contenido de tipo «{b.formato}» (no se simula en este prototipo).</div>
                </section>
              ))}
          </div>
        ) : (
          <div className="pw-nodisp">
            <div className="pw-nodisp__txt">
              <h2 className="pw-nodisp__titulo">Esta sección estará disponible próximamente.</h2>
              <p>Estamos trabajando para ofrecerte una mejor experiencia.</p>
              <p>Muy pronto podrás disfrutar de todo el contenido de esta sección.</p>
              <button type="button" className="ds-btn ds-btn--fill pw-btn" onClick={onRegresarMicrositio}>Regresar al micrositio</button>
            </div>
            <div className="pw-ilus" aria-hidden="true">
              {ILUSTRACION.map(([f, inset]) => <span key={f} style={{ inset }}><img src={PIEZAS[`./assets/ilustracion/${f}.svg`]} alt="" /></span>)}
            </div>
          </div>
        )}
      </main>

      <footer className="pw-footer">
        <div className="pw-footer__in">
          <div className="pw-footer__top">
            <div className="pw-footer__marca">
              <img src={logoFooter} width={104} height={134} alt="KANOA LAB" />
              <ul className="pw-footer__redes" aria-label="Redes sociales">
                {REDES.map((r) => <li key={r.n}><img src={r.i} width={24} height={24} alt={r.n} /></li>)}
              </ul>
            </div>
            <ul className="pw-footer__links">
              {PIE.map((l) => <li key={l.label}>{l.href ? <a href={l.href} {...NUEVA}>{l.label}</a> : <span>{l.label}</span>}</li>)}
            </ul>
          </div>
          <div className="pw-footer__legal">
            <span>Copyright 2026 OpiTech. Todos los derechos Reservados.</span>
            <span>kanoalab@opitech.com.co</span>
            <span>Bogotá, Colombia</span>
            <span className="pw-footer__politicas"><span>Política de privacidad</span><span>Términos y condiciones</span></span>
          </div>
        </div>
      </footer>
    </div>
  )
}
