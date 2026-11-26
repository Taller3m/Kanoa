import { Avatar, StatusTag } from '../../ui'
import { BottomNav, HeroTitle, Screen, Scroll, cx } from '../../mobile'
import { ESTUDIANTE } from '../../app/data'
import { COMPANEROS, GRUPO_INTEGRANTES } from './data'
import './cuenta.css'

/** G01 · Mi grupo: lista de solo lectura, ordenada por apellido; la estudiante aparece marcada con «Tú». */
export function Grupo() {
  const integrantes = [
    { nombre: ESTUDIANTE.nombre, apellidos: ESTUDIANTE.apellido, yo: true },
    ...COMPANEROS.map((c) => ({ ...c, yo: false })),
  ].sort((a, b) => a.apellidos.localeCompare(b.apellidos, 'es') || a.nombre.localeCompare(b.nombre, 'es'))

  return (
    <Screen label="Mi grupo">
      <HeroTitle title="Mi grupo" subtitle={`${ESTUDIANTE.grado} · ${GRUPO_INTEGRANTES} integrantes`} />
      <Scroll style={{ paddingTop: 16, gap: 10 }}>
        <p className="t-body-sm m-muted">Tus compañeros, ordenados por apellido.</p>
        <section className="m-card" aria-label="Integrantes del grupo" style={{ padding: '4px 16px' }}>
          <ul className="m-list" style={{ margin: 0, padding: 0, listStyle: 'none' }}>
            {integrantes.map((p) => (
              <li key={`${p.apellidos}-${p.nombre}`} className={cx('m-li', p.yo && 'cu-li-me')} style={{ minHeight: 56 }}>
                <span aria-hidden="true" style={{ display: 'contents' }}><Avatar name={`${p.nombre} ${p.apellidos}`} /></span>
                <span className="t-body-md m-grow" style={{ color: 'var(--title)' }}>{p.apellidos}, {p.nombre}</span>
                {p.yo && <StatusTag type="general">Tú</StatusTag>}
              </li>
            ))}
          </ul>
        </section>
      </Scroll>
      <BottomNav active="grupo" />
    </Screen>
  )
}
