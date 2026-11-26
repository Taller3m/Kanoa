import { useCallback, useEffect, useRef, useState } from 'react'
import { Button, ConfirmDialog, ContextBar, IconButton, Modal, Navbar, Snackbar, StatusTag } from './ui'
import { estadoDe, fixGame, reqsOf, seedGames } from './games/registry'
import { HOY, newGame, porModificacion } from './games/base'
import type { Game, TipoJuego } from './games/types'
import { Lista } from './screens/Lista'
import { Tipo } from './screens/Tipo'
import { Asistente } from './screens/Asistente'
import { Micrositios } from './screens/Micrositios'
import { Micrositio } from './screens/Micrositio'
import { Seccion, tituloDe } from './screens/Seccion'
import { TipoContenido } from './screens/TipoContenido'
import { ContenidoJuego, type ContDraft } from './screens/ContenidoJuego'
import { useRoute, type Route } from './router'
import { PreviewHost, previewBlocker } from './games/PreviewHost'
import { activosIniciales, lugarDe, lugaresDe, microDe, seccionDe, seedContenidos, sinJuegos, type Activos, type Contenido, type EstadoCont, type TipoContenido as TC } from './portal/data'
import { PaginaSeccion } from './portal-web/PaginaSeccion'
import { seccionPublica } from './portal-web/contrato'
import './app.css'

type ToastKind = 'ok' | 'err' | 'info'
interface Confirm { title: string; msg: string; label: string; danger?: boolean; yes: () => void }
interface Crumb { label: string; go?: () => void }

// Módulos del portal (Figma: StudIA2.0 - Navbar). «Juegos» y una simulación de «Micrositios» están dentro del alcance del prototipo.
const ACTIVOS = ['juegos', 'micrositios']
const MODULOS = [
  { id: 'portada', label: 'Portada', icon: 'web_asset' }, { id: 'cifras', label: 'Cifras destacadas', icon: 'finance_mode' }, { id: 'bloques', label: 'Bloques de inicio', icon: 'home' },
  { id: 'noticias', label: 'Noticias', icon: 'article' }, { id: 'micrositios', label: 'Micrositios', icon: 'category' }, { id: 'paginas', label: 'Páginas informativas', icon: 'info' },
  { id: 'menus', label: 'Menús', icon: 'menu' }, { id: 'juegos', label: 'Juegos', icon: 'sports_esports' },
].map((m) => ACTIVOS.includes(m.id) ? m : { ...m, disabled: true, title: `${m.label} (fuera del alcance de este prototipo)` })

const RAIZ = 'Administración de contenido'
const AUTOR = 'Laura Gómez'
const contVacio = (): ContDraft => ({ titulo: '', tipo: 'Crucigrama', sel: [], err: false })
const readNav = () => { try { return localStorage.getItem('nav-compress') === '1' } catch { return false } }

export function App() {
  const [games, setGames] = useState<Game[]>(seedGames)
  const [contenidos, setContenidos] = useState<Contenido[]>(seedContenidos)
  const [activos, setActivos] = useState<Activos>(activosIniciales)
  const [route, go] = useRoute()
  const screen = route.screen
  const paso: 1 | 2 = route.screen === 'editor' ? route.paso : 1
  const [draft, setDraft] = useState<Game | null>(null)
  const [orig, setOrig] = useState('')
  const [cont, setCont] = useState<ContDraft | null>(null)
  const [contOrig, setContOrig] = useState('')
  const [nombreErr, setNombreErr] = useState(false)
  const [q, setQ] = useState(''); const [fTipo, setFTipo] = useState('Todos los tipos'); const [fEstado, setFEstado] = useState('Todos los estados')
  const [toastMsg, setToastMsg] = useState<{ t: string; kind: ToastKind } | null>(null)
  const [confirm, setConfirm] = useState<Confirm | null>(null)
  const [preview, setPreview] = useState<Game | null>(null)
  const [compress, setCompress] = useState(readNav)
  const [dark, setDark] = useState(() => document.documentElement.classList.contains('dark'))
  const timer = useRef<number>(0)
  const main = useRef<HTMLElement>(null)

  useEffect(() => {
    const el = document.documentElement
    el.classList.remove('light', 'dark'); el.classList.add(dark && screen !== 'portal' ? 'dark' : 'light')
    try { localStorage.setItem('ds-theme', dark ? 'dark' : 'light') } catch { /* sin storage */ }
  }, [dark, screen])
  useEffect(() => { try { localStorage.setItem('nav-compress', compress ? '1' : '0') } catch { /* sin storage */ } }, [compress])
  useEffect(() => { main.current?.focus({ preventScroll: true }); window.scrollTo(0, 0) }, [screen])

  const toast = useCallback((t: string, kind: ToastKind = 'info') => {
    window.clearTimeout(timer.current); setToastMsg({ t, kind })
    timer.current = window.setTimeout(() => setToastMsg(null), 4200)
  }, [])

  /** Secciones donde el juego está en un contenido publicado: de aquí sale «Publicado en:» y el bloqueo de Eliminar. */
  const publicadoEn = (g: Game) => lugaresDe(g.id, contenidos)
  const nombreDe = (id: number) => games.find((g) => g.id === id)?.nombre ?? 'Juego eliminado'
  const incompletos = (ids: number[]) => ids.filter((id) => { const g = games.find((x) => x.id === id); return !g || estadoDe(g) !== 'Completado' })

  /* ───────────── Juegos ───────────── */

  const update = useCallback((fn: (d: Game) => void) => setDraft((d) => { if (!d) return d; const c = structuredClone(d); fn(c); return c }), [])

  // El borrador se (re)crea cuando cambia el juego/tipo de la URL, no cuando solo cambia el paso.
  const editorKey = route.screen === 'editor' ? route.tipo + ':' + (route.id ?? 'nuevo') : ''
  useEffect(() => {
    if (route.screen !== 'editor') { setDraft(null); return }
    let d: Game
    if (route.id) {
      const g = games.find((x) => x.id === route.id)
      if (!g) { go({ screen: 'lista' }, true); return }
      d = fixGame(structuredClone(g))
    } else {
      d = newGame(route.tipo)
      if (route.paso === 2) go({ ...route, paso: 1 }, true) // un juego nuevo no puede abrirse en Configuración sin nombre
    }
    setDraft(d); setOrig(JSON.stringify(d)); setNombreErr(false)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editorKey])

  const abrir = (g: Game) => go({ screen: 'editor', tipo: g.tipo, id: g.id, paso: 1 })
  const nuevo = (t: TipoJuego) => go({ screen: 'editor', tipo: t, id: null, paso: 1 })
  const setPaso = (p: 1 | 2) => {
    if (route.screen !== 'editor') return
    if (p === 2 && (draft?.nombre.trim().length ?? 0) < 3) { setNombreErr(true); go({ ...route, paso: 1 }, true); toast('Diligencia el nombre del juego para continuar con la configuración.', 'err'); return }
    go({ ...route, paso: p }, true)
  }
  const openPreview = (g: Game) => {
    const why = previewBlocker(g)
    if (why) { toast(why, 'err'); return }
    setPreview(fixGame(structuredClone(g)))
  }
  const aLista = () => { go({ screen: 'lista' }); setNombreErr(false) }
  const cancelar = () => {
    if (draft && JSON.stringify(draft) !== orig) setConfirm({ title: 'Descartar cambios', msg: 'Hay cambios sin guardar. ¿Deseas descartarlos?', label: 'Descartar', danger: true, yes: aLista })
    else aLista()
  }
  const guardar = () => {
    if (!draft) return
    const n = draft.nombre.trim()
    const pub = publicadoEn(draft).length > 0
    if (n.length < 3) { setNombreErr(true); setPaso(1); toast('Revisa los campos obligatorios antes de guardar.', 'err'); return }
    if (pub && !reqsOf(draft).every((r) => r.ok)) { toast('No puedes guardar: el juego está publicado y su configuración debe quedar completa.', 'err'); return }
    const g: Game = { ...draft, nombre: n, editada: HOY }
    if (!g.id) { g.id = Date.now(); g.fecha = HOY }
    // Al frente y luego orden estable por modificación: el recién guardado queda primero aunque empate en fecha.
    setGames((gs) => porModificacion([g, ...gs.filter((x) => x.id !== g.id)]))
    const est = estadoDe(g)
    aLista()
    toast(pub ? 'El juego ha sido actualizado. Los cambios ya se ven en el portal.'
      : est === 'Borrador' ? 'El juego se guardó en Borrador. Completa la configuración para poder agregarlo a una sección.'
      : 'El juego se guardó y quedó Completado. Ya puedes agregarlo a una sección.', 'ok')
  }
  const eliminar = (g: Game) => {
    const lug = publicadoEn(g)
    if (lug.length) { toast(`No es posible eliminar este juego porque está en contenidos publicados: ${lug.join(', ')}. Retíralo de esos contenidos antes de continuar.`, 'err'); return }
    const inactivos = [...new Set(contenidos.filter((c) => c.estado !== 'Publicado' && c.juego?.ids.includes(g.id!)).map((c) => { const s = seccionDe(c.sec); return s ? `${s.micro} › ${s.sec}` : '' }).filter(Boolean))]
    const aviso = inactivos.length ? ` Está en ${inactivos.length > 1 ? 'los contenidos inactivos de' : 'el contenido inactivo de'} ${inactivos.map((x) => `«${x}»`).join(', ')} y se quitará de ${inactivos.length > 1 ? 'esos contenidos' : 'ese contenido'}.` : ''
    setConfirm({ title: 'Eliminar juego', msg: `¿Estás seguro de que deseas eliminar el juego «${g.nombre}»?${aviso} Esta acción no se puede deshacer.`, label: 'Eliminar', danger: true,
      yes: () => {
        setGames((gs) => gs.filter((x) => x.id !== g.id))
        // Se quita de los contenidos inactivos que lo tenían; si alguno queda vacío, muestra «Sin juegos».
        setContenidos((cs) => cs.map((c) => c.juego?.ids.includes(g.id!) ? { ...c, juego: { ...c.juego, ids: c.juego.ids.filter((x) => x !== g.id) } } : c))
        toast('El juego ha sido eliminado correctamente.', 'ok')
      } })
  }

  /* ───────────── Micrositios › contenidos ───────────── */

  const sec = 'sec' in route ? seccionDe(route.sec) : undefined
  const micro = route.screen === 'micrositio' ? microDe(route.micro) : sec ? microDe(sec.microSlug) : undefined
  const contKey = route.screen === 'contJuego' ? route.sec + ':' + (route.id ?? 'nuevo') : ''
  useEffect(() => {
    if (route.screen !== 'contJuego') { setCont(null); return }
    let d = contVacio()
    if (route.id) {
      const c = contenidos.find((x) => x.id === route.id && x.sec === route.sec)
      if (!c?.juego) { go({ screen: 'seccion', sec: route.sec }, true); return }
      d = { titulo: c.titulo, tipo: c.juego.tipo, sel: [...c.juego.ids], err: false }
    }
    setCont(d); setContOrig(JSON.stringify(d))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [contKey])
  const setContDraft = (fn: (d: ContDraft) => ContDraft) => setCont((d) => (d ? fn(d) : d))

  const aSeccion = () => { if (sec) go({ screen: 'seccion', sec: sec.id }) }
  const cancelarCont = (destino?: Route) => {
    if (route.screen !== 'contJuego') return
    const ir = () => go(destino ?? (route.id ? { screen: 'seccion', sec: route.sec } : { screen: 'tipoCont', sec: route.sec }))
    if (cont && JSON.stringify(cont) !== contOrig) setConfirm({ title: 'Descartar cambios', msg: 'Hay cambios sin guardar. ¿Deseas descartarlos?', label: 'Descartar', danger: true, yes: ir })
    else ir()
  }
  const msgIncompleto = (id: number) => `El juego «${nombreDe(id)}» está incompleto. Complétalo o quítalo del contenido antes de publicar.`
  const guardarCont = () => {
    if (route.screen !== 'contJuego' || !cont) return
    if (!cont.sel.length) { setContDraft((d) => ({ ...d, err: true })); return }
    const malos = incompletos(cont.sel)
    if (malos.length) { toast(msgIncompleto(malos[0]!), 'err'); return }
    const juego = { tipo: cont.tipo, ids: [...cont.sel] }
    const previo = route.id ? contenidos.find((c) => c.id === route.id) : undefined
    if (previo) {
      // Al guardar, el contenido queda Publicado (también uno inactivo que se edita, escenario 12).
      setContenidos((cs) => cs.map((c) => c.id === previo.id ? { ...c, titulo: cont.titulo.trim(), juego, estado: 'Publicado', editada: HOY } : c))
      toast(previo.estado === 'Publicado' ? 'El contenido ha sido actualizado. Los cambios ya se ven en el portal.' : 'El contenido ha sido actualizado y publicado correctamente.', 'ok')
    } else {
      setContenidos((cs) => [...cs, { id: Date.now(), sec: route.sec, tipo: 'Juego', titulo: cont.titulo.trim(), estado: 'Publicado', autor: AUTOR, creado: HOY, editada: HOY, juego }])
      toast('El contenido ha sido creado y publicado correctamente.', 'ok')
    }
    go({ screen: 'seccion', sec: route.sec })
  }
  const pickTipoCont = (t: TC) => {
    if (route.screen !== 'tipoCont') return
    if (t === 'Juego') go({ screen: 'contJuego', sec: route.sec, id: null })
    else toast(`El tipo de contenido «${t}» ya existe en la administración de micrositios y está fuera del alcance de este prototipo.`, 'info')
  }
  const setEstadoCont = (c: Contenido, estado: Contenido['estado']) => setContenidos((cs) => cs.map((x) => x.id === c.id ? { ...x, estado, editada: HOY } : x))
  const editarCont = (c: Contenido) => {
    if (c.tipo === 'Juego') go({ screen: 'contJuego', sec: c.sec, id: c.id })
    else toast(`La edición de contenidos de tipo «${c.tipo}» está fuera del alcance de este prototipo.`, 'info')
  }
  const publicarCont = (c: Contenido) => {
    if (c.juego) {
      if (sinJuegos(c)) { toast('Este contenido no tiene juegos. Edítalo y selecciona al menos un juego antes de publicar.', 'err'); return }
      const malos = incompletos(c.juego.ids)
      if (malos.length) { toast(msgIncompleto(malos[0]!), 'err'); return }
    }
    const t = tituloDe(c, games)
    setConfirm({ title: 'Publicar contenido', msg: `¿Deseas publicar el contenido «${t}»? Se mostrará en el portal.`, label: 'Publicar',
      yes: () => { setEstadoCont(c, 'Publicado'); toast('El contenido ha sido publicado correctamente.', 'ok') } })
  }
  const inactivarCont = (c: Contenido) => {
    const t = tituloDe(c, games)
    setConfirm({ title: 'Inactivar contenido', msg: `¿Deseas inactivar el contenido «${t}»? Dejará de verse en el portal.${c.juego ? ' Sus juegos conservan su estado.' : ''}`, label: 'Inactivar',
      yes: () => { setEstadoCont(c, 'Inactivo'); toast('El contenido ha sido inactivado correctamente.', 'ok') } })
  }
  const eliminarCont = (c: Contenido) => {
    const t = tituloDe(c, games)
    setConfirm({ title: 'Eliminar contenido', msg: `¿Estás seguro de que deseas eliminar el contenido «${t}»? Esta acción no se puede deshacer.${c.juego ? ' Los juegos no se eliminan del módulo Juegos.' : ''}`, label: 'Eliminar', danger: true,
      yes: () => { setContenidos((cs) => cs.filter((x) => x.id !== c.id)); toast('El contenido ha sido eliminado correctamente.', 'ok') } })
  }

  const cambiarEstadoCont = (c: Contenido, e: EstadoCont) => {
    if (e === 'Publicado') return publicarCont(c)
    if (e === 'Inactivo') return inactivarCont(c)
    const t = tituloDe(c, games)
    setConfirm({ title: 'Pasar a Borrador', msg: `¿Deseas pasar a Borrador el contenido «${t}»? Dejará de verse en el portal.`, label: 'Confirmar',
      yes: () => { setEstadoCont(c, 'Borrador'); toast('El contenido ha pasado a Borrador correctamente.', 'ok') } })
  }
  const visualizarCont = (c: Contenido) => {
    if (!c.juego) { toast(`La visualización de contenidos de tipo «${c.tipo}» está fuera del alcance de este prototipo.`, 'info'); return }
    // Como en el portal: con varios juegos se muestra uno al azar en cada visita.
    const ok = c.juego.ids.map((id) => games.find((g) => g.id === id)).filter((g): g is Game => !!g && estadoDe(g) === 'Completado')
    if (!ok.length) { toast(sinJuegos(c) ? 'Este contenido no tiene juegos para visualizar.' : msgIncompleto(c.juego.ids[0]!), 'err'); return }
    openPreview(ok[Math.floor(Math.random() * ok.length)]!)
  }

  /** Reordena el contenido dentro de su sección (el arreglo global conserva el orden relativo de cada sección). */
  const moverCont = (id: number, destino: number, pos: 'antes' | 'despues', viaTeclado = false) => {
    if (id === destino) return
    setContenidos((cs) => {
      const item = cs.find((c) => c.id === id)
      if (!item) return cs
      const resto = cs.filter((c) => c.id !== id)
      const i = resto.findIndex((c) => c.id === destino)
      if (i < 0) return cs
      resto.splice(pos === 'antes' ? i : i + 1, 0, item)
      return resto
    })
    // Con teclado el aviso lo da la región en vivo de la tabla (posición); al soltar con el ratón se confirma con el mensaje del v8.
    if (!viaTeclado) toast('El orden de los contenidos ha sido actualizado correctamente.', 'ok')
  }

  /* ───────────── Micrositios y secciones: activar / inactivar (Figma: confirmDialog y snackbar) ───────────── */

  const fueraDeAlcance = () => toast('Esta acción ya existe en la administración de micrositios y está fuera del alcance de este prototipo.', 'info')
  const toggleActivo = (id: string, tipo: 'micrositio' | 'sección') => {
    const activo = !!activos[id]
    const esM = tipo === 'micrositio'
    const El = esM ? 'El' : 'La', este = esM ? 'este' : 'esta', o = esM ? 'o' : 'a'
    setConfirm(activo
      ? { title: `¿Estás seguro de que deseas inactivar ${este} ${tipo}?`, label: 'Confirmar',
          msg: esM
            ? 'Este dejará de mostrarse en el portal público y no permitirá la gestión de sus secciones y contenidos hasta que sea activado nuevamente.'
            : 'Esta dejará de mostrarse en el portal público y no permitirá la gestión de sus contenidos hasta que sea activada nuevamente. Sus contenidos y juegos conservan su estado.',
          yes: () => { setActivos((a) => ({ ...a, [id]: false })); toast(`${El} ${tipo} ha sido inactivad${o} correctamente.`, 'ok') } }
      : { title: `¿Estás seguro de que deseas activar ${este} ${tipo}?`, label: 'Confirmar',
          msg: esM
            ? 'Todas las secciones activas y los contenidos publicados asociados volverán a ser visibles en el Portal WEB.'
            : 'Los contenidos publicados de la sección volverán a ser visibles en el Portal WEB.',
          yes: () => { setActivos((a) => ({ ...a, [id]: true })); toast(`${El} ${tipo} ha sido activad${o} correctamente.`, 'ok') } })
  }
  const copiarUrl = (url: string) => {
    const p = navigator.clipboard?.writeText(url)
    if (p) p.then(() => toast('La URL pública se copió al portapapeles.', 'ok'), () => toast(url, 'info')); else toast(url, 'info')
  }

  /* ───────────── Encabezado ───────────── */

  const enJuegos = screen === 'lista' || screen === 'tipo' || screen === 'editor'
  const accion = draft ? (draft.id ? 'Editar ' : 'Crear ') + draft.tipo.toLowerCase() : ''
  const editandoCont = route.screen === 'contJuego' && route.id != null
  const title = screen === 'lista' ? 'Juegos' : screen === 'tipo' ? 'Crear juego' : screen === 'editor' ? accion
    : screen === 'secciones' ? 'Administración de micrositios portal web' : screen === 'micrositio' ? (micro?.nombre ?? '') : screen === 'seccion' ? (sec?.sec ?? '') : screen === 'tipoCont' ? 'Crear contenido'
    : (editandoCont ? 'Editar contenido' : 'Crear contenido') + ' · Juego'
  useEffect(() => { if (screen !== 'portal') document.title = title + ' · Kanoa Lab' }, [title, screen])

  const crumbs: Crumb[] = (() => {
    if (screen === 'lista') return [{ label: RAIZ }, { label: 'Juegos' }]
    if (screen === 'tipo') return [{ label: RAIZ }, { label: 'Juegos', go: aLista }, { label: 'Crear juego' }]
    if (screen === 'editor') return [{ label: RAIZ }, { label: 'Juegos', go: cancelar }, { label: accion }]
    if (screen === 'micrositio' && micro) return [{ label: RAIZ }, { label: 'Micrositios', go: () => go({ screen: 'secciones' }) }, { label: micro.nombre }]
    if (screen === 'secciones' || !sec) return [{ label: RAIZ }, { label: 'Micrositios' }]
    const enForm = screen === 'contJuego'
    const ir = (r: Route) => enForm ? () => cancelarCont(r) : () => go(r)
    const base: Crumb[] = [{ label: RAIZ }, { label: 'Micrositios', go: ir({ screen: 'secciones' }) }, { label: sec.micro, go: ir({ screen: 'micrositio', micro: sec.microSlug }) }]
    if (screen === 'seccion') return [...base, { label: sec.sec }]
    const secCrumb: Crumb = { label: sec.sec, go: enForm ? () => cancelarCont({ screen: 'seccion', sec: sec.id }) : aSeccion }
    if (screen === 'tipoCont') return [...base, secCrumb, { label: 'Crear contenido' }]
    if (editandoCont) return [...base, secCrumb, { label: 'Editar contenido' }]
    return [...base, secCrumb, { label: 'Crear contenido', go: () => cancelarCont({ screen: 'tipoCont', sec: sec.id }) }, { label: 'Juego' }]
  })()

  const back = screen === 'editor' ? cancelar : screen === 'tipo' ? aLista
    : screen === 'micrositio' ? () => go({ screen: 'secciones' }) : screen === 'seccion' && sec ? () => go({ screen: 'micrositio', micro: sec.microSlug }) : screen === 'tipoCont' ? aSeccion : screen === 'contJuego' ? () => cancelarCont() : undefined
  const description = screen === 'lista' ? 'Crea y parametriza los juegos del portal. Cuando un juego está completo, queda disponible para agregarlo como contenido en cualquier sección de un micrositio.'
    : screen === 'contJuego' && sec ? `Sección ${sec.micro} › ${sec.sec}.` : undefined

  // Página pública de la sección: sin la estructura de la administración (simulación del Portal WEB).
  if (route.screen === 'portal') {
    const pagina = seccionPublica(route.sec, contenidos, games, activos)
    const s = seccionDe(route.sec)
    if (pagina && s) return (
      <>
        <PaginaSeccion key={route.sec} pagina={pagina} onAdmin={() => go({ screen: 'seccion', sec: route.sec })}
          onRegresarMicrositio={() => go({ screen: 'micrositio', micro: s.microSlug })} />
        <Modal open={!!preview} wide title={`Vista previa · ${preview?.nombre.trim() || 'Juego sin nombre'}`} onClose={() => setPreview(null)}>
          {preview && <PreviewHost key={JSON.stringify(preview)} game={preview} onClose={() => setPreview(null)} />}
        </Modal>
      </>
    )
  }

  return (
    <div className="app">
      <div className="sidebar">
        <Navbar items={MODULOS} active={enJuegos ? 'juegos' : 'micrositios'} compress={compress} onToggle={() => setCompress((c) => !c)}
          onSelect={(id) => { if (id === 'juegos') aLista(); else if (id === 'micrositios') go({ screen: 'secciones' }) }} user={{ name: AUTOR, email: 'laura.gomez@kanoalab.co' }}
          footer={<IconButton icon={dark ? 'light_mode' : 'dark_mode'} label={dark ? 'Cambiar a tema claro' : 'Cambiar a tema oscuro'} onClick={() => setDark(!dark)} />} />
      </div>

      {/* El listado de juegos (tabla) ocupa todo el ancho disponible; las demás pantallas mantienen el ancho máximo */}
      <main className={screen === 'lista' ? 'main main--fluid' : 'main'} ref={main} tabIndex={-1} style={{ outline: 'none' }}>
        <nav aria-label="Ruta de navegación" className="crumbs t-body-md">
          {crumbs.map((c, i) => (
            <span key={c.label + i}>
              {i > 0 && <span aria-hidden="true"> › </span>}
              {i === crumbs.length - 1 ? <span aria-current="page">{c.label}</span>
                : c.go ? <button type="button" className="ds-link ds-link--quiet" style={{ background: 'none', border: 0, padding: 0, font: 'inherit' }} onClick={c.go}>{c.label}</button>
                : <span>{c.label}</span>}
            </span>
          ))}
        </nav>

        <ContextBar title={title} onBack={back} description={description}
          actions={<>
            {screen === 'lista' && <Button icon="add" onClick={() => go({ screen: 'tipo' })}>Crear juego</Button>}
            {screen === 'tipo' && <Button variant="outline" onClick={aLista}>Cancelar</Button>}
            {screen === 'editor' && draft && (<><IconButton icon="visibility" label="Vista previa" onClick={() => openPreview(draft)} /><Button variant="outline" onClick={cancelar}>Cancelar</Button><Button onClick={guardar}>Guardar</Button></>)}
            {screen === 'tipoCont' && <Button variant="outline" onClick={aSeccion}>Cancelar</Button>}
            {screen === 'contJuego' && cont && (<><Button variant="outline" onClick={() => cancelarCont()}>Cancelar</Button><Button onClick={guardarCont}>Guardar</Button></>)}
          </>} />

        {screen === 'lista' && (
          <Lista games={games} q={q} fTipo={fTipo} fEstado={fEstado} setQ={setQ} setFTipo={setFTipo} setFEstado={setFEstado} publicadoEn={publicadoEn}
            onCrear={() => go({ screen: 'tipo' })} onEditar={abrir} onVisualizar={openPreview} onEliminar={eliminar} />
        )}
        {screen === 'tipo' && <Tipo onPick={nuevo} />}
        {screen === 'editor' && draft && (
          <div className="editor-estado t-body-md" title="El estado se calcula automáticamente">
            <strong>Estado:</strong>
            {estadoDe(draft) === 'Completado' ? <StatusTag color="blue" dot>Completado</StatusTag> : <StatusTag type="prevent" dot>Borrador</StatusTag>}
          </div>
        )}
        {screen === 'editor' && draft && (
          <Asistente key={`${draft.tipo}-${draft.id ?? 'nuevo'}`} game={draft} paso={paso} setPaso={setPaso} nombreErr={nombreErr} update={update} toast={toast} clearNombreErr={() => setNombreErr(false)}
            onNombreBlur={() => { const n = draft.nombre.trim().length; if (n > 0 && n < 3) setNombreErr(true) }} publicadoEn={publicadoEn(draft)} />
        )}
        {screen === 'secciones' && <Micrositios activos={activos} onAbrir={(m) => go({ screen: 'micrositio', micro: m })} onToggle={(m) => toggleActivo(m, 'micrositio')} onFueraDeAlcance={fueraDeAlcance} />}
        {screen === 'micrositio' && micro && (
          <Micrositio micro={micro} activos={activos} onAbrir={(s) => go({ screen: 'seccion', sec: s })} onToggle={(s) => toggleActivo(s, 'sección')}
            onCopiar={copiarUrl} onFueraDeAlcance={fueraDeAlcance} />
        )}
        {screen === 'seccion' && sec && (
          <Seccion seccion={sec} contenidos={contenidos.filter((c) => c.sec === sec.id)} games={games} onCrear={() => go({ screen: 'tipoCont', sec: sec.id })}
            onEditar={editarCont} onVisualizar={visualizarCont} onEstado={cambiarEstadoCont} onEliminar={eliminarCont} onFueraDeAlcance={fueraDeAlcance} onMover={moverCont}
            onVerPortal={() => go({ screen: 'portal', sec: sec.id })} />
        )}
        {screen === 'tipoCont' && <TipoContenido onPick={pickTipoCont} />}
        {screen === 'contJuego' && cont && <ContenidoJuego draft={cont} setDraft={setContDraft} games={games} publicadoEn={publicadoEn} onVer={openPreview}
          edicion={(() => {
            const c = route.screen === 'contJuego' && route.id != null ? contenidos.find((x) => x.id === route.id) : undefined
            return c && sec ? { estado: c.estado, lugar: lugarDe(sec) } : undefined
          })()} />}
      </main>

      {toastMsg && (
        <div className="toasts">
          <Snackbar type={toastMsg.kind === 'err' ? 'error' : toastMsg.kind === 'ok' ? 'success' : undefined}>{toastMsg.t}</Snackbar>
        </div>
      )}
      <Modal open={!!preview} wide title={`Vista previa · ${preview?.nombre.trim() || 'Juego sin nombre'}`} onClose={() => setPreview(null)}>
        {preview && <PreviewHost key={JSON.stringify(preview)} game={preview} onClose={() => setPreview(null)} />}
      </Modal>
      {confirm && (
        <ConfirmDialog open title={confirm.title} message={confirm.msg} confirmLabel={confirm.label} danger={confirm.danger}
          onCancel={() => setConfirm(null)} onConfirm={() => { const y = confirm.yes; setConfirm(null); y() }} />
      )}
    </div>
  )
}
