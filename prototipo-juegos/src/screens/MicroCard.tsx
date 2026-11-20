import { Button, Icon } from '../ui'

/**
 * Tarjeta de micrositio o de sección (Figma: MicrositioCard, Property 1 = Active / Inactive).
 * Ícono en recuadro verde, switch de estado arriba a la derecha, título, descripción y botón a lo ancho.
 * Inactiva: el contenido se atenúa y el botón queda deshabilitado; el switch sigue disponible para activarla.
 */
export function MicroCard({ titulo, desc, activa, accion, onAccion, onToggle }: {
  titulo: string; desc: string; activa: boolean; accion: string; onAccion: () => void; onToggle: () => void
}) {
  return (
    <article className={'mcard' + (activa ? '' : ' mcard--off')}>
      <div className="mcard__top">
        <span className="mcard__icon" aria-hidden="true"><Icon name="school" size={24} /></span>
        <label className="mswitch" title={activa ? 'Inactivar' : 'Activar'}>
          <input type="checkbox" role="switch" checked={activa} onChange={onToggle} aria-label={`${titulo}: ${activa ? 'activo' : 'inactivo'}`} />
          <span className="mswitch__track" aria-hidden="true" />
        </label>
      </div>
      <div className="mcard__body">
        <h3 className="mcard__title">{titulo}</h3>
        {/* El estado no depende solo de la apariencia (WCAG 1.4.1): se escribe. */}
        {!activa && <span className="mcard__estado">Inactivo</span>}
        <p className="mcard__desc">{desc}</p>
      </div>
      <Button block iconEnd="arrow_forward" className="mcard__btn" onClick={onAccion} disabled={!activa} aria-label={`${accion} de ${titulo}`}>{accion}</Button>
    </article>
  )
}
