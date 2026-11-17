import { useState } from 'react'
import {
  Accordion, Avatar, Badge, Breadcrumb, Button, Card, Checkbox, Chip, ConfirmDialog, ContextBar, Divider, Header, Icon, IconButton, ItemList, Kbd, Link,
  MenuItem, Message, Modal, Navbar, Panel, PasswordField, Pagination, ProgressBar, ProgressSteps, Radio, Select, Snackbar, Spinner, StatusTag,
  Switch, TabPanel, Tabs, TextArea, TextField, Tooltip,
} from '../../ui'
import { A11y, Demo, Note, PageHead, PropsTable, Section } from '../kit'

/* ═══════════ ÁTOMOS ═══════════ */
export function Atomos() {
  const [chip, setChip] = useState(true)
  const [pw, setPw] = useState(40)
  return (
    <>
      <PageHead title="Átomos">
        Las piezas mínimas: no se dividen sin perder sentido. Todas envuelven un control nativo de verdad (button, input, select), no un div con role.
      </PageHead>

      <Section id="boton" title="Botón" lead="Acción principal de una pantalla. Cinco estilos, tres tamaños y estados regular · hover · pressed · disabled.">
        <Demo title="Estilos" code={`<Button variant="fill">Fill</Button>\n<Button variant="flat">Flat</Button>\n<Button variant="outline">Outline</Button>\n<Button variant="text">Text</Button>\n<Button variant="raised">Raised</Button>`}>
          <Button variant="fill">Fill</Button><Button variant="flat">Flat</Button><Button variant="outline">Outline</Button><Button variant="text">Text</Button><Button variant="raised">Raised</Button>
        </Demo>
        <Demo title="Tamaños" code={`<Button size="small">Pequeño</Button>\n<Button>Mediano</Button>\n<Button size="big">Grande</Button>`}>
          <Button size="small">Pequeño · 40</Button><Button>Mediano · 44</Button><Button size="big">Grande · 48</Button>
        </Demo>
        <Demo title="Con icono, error y deshabilitado" code={`<Button icon="add">Crear juego</Button>\n<Button variant="outline" iconEnd="arrow_forward">Siguiente</Button>\n<Button tone="error" icon="delete">Eliminar</Button>\n<Button disabled>Deshabilitado</Button>`}>
          <Button icon="add">Crear juego</Button><Button variant="outline" iconEnd="arrow_forward">Siguiente</Button>
          <Button tone="error" icon="delete">Eliminar</Button><Button variant="outline" tone="error">Descartar</Button><Button disabled>Deshabilitado</Button><Button variant="outline" disabled>Deshabilitado</Button>
        </Demo>
        <Demo title="Botón de icono" desc="Siempre lleva label: es su nombre accesible y su tooltip." code={`<IconButton icon="edit" label="Editar" />\n<IconButton icon="delete" label="Eliminar" />`}>
          <IconButton icon="edit" label="Editar" /><IconButton icon="delete" label="Eliminar" /><IconButton primary icon="add" label="Agregar" /><IconButton icon="more_vert" label="Más opciones" disabled />
        </Demo>
        <PropsTable rows={[
          ['variant', "'fill' | 'flat' | 'outline' | 'text' | 'raised'", "'fill'", 'Estilo visual.'],
          ['size', "'small' | 'medium' | 'big'", "'medium'", 'Alto 40 / 44 / 48.'],
          ['tone', "'primary' | 'error'", "'primary'", 'error para acciones destructivas.'],
          ['icon / iconEnd', 'string', '—', 'Icono antes / después del texto.'],
          ['block', 'boolean', 'false', 'Ocupa todo el ancho.'],
        ]} />
      </Section>

      <Section id="campo-texto" title="Campo de texto" lead="Etiqueta arriba, ayuda o error debajo. Alturas 44 / 58 / 70. Los estados regular, hover, focus, error y disabled salen del mismo componente.">
        <Demo title="Estados" layout="grid" code={`<TextField label="Nombre del juego" placeholder="Ej. Crece Conmigo" />\n<TextField label="Con valor" defaultValue="Crece Conmigo" help="Máximo 60 caracteres." />\n<TextField label="Correo" error="Escribe un correo válido." defaultValue="correo@" />\n<TextField label="Bloqueado" disabled defaultValue="No editable" />`}>
          <TextField label="Nombre del juego" placeholder="Ej. Crece Conmigo" />
          <TextField label="Con valor y ayuda" defaultValue="Crece Conmigo" help="Máximo 60 caracteres." />
          <TextField label="Con error" required error="Escribe un correo válido." defaultValue="correo@" />
          <TextField label="Deshabilitado" disabled defaultValue="No editable" />
        </Demo>
        <Demo title="Con iconos, tamaños y contraseña" layout="grid" code={`<TextField icon="search" placeholder="Buscar…" />\n<TextField size="medium" label="Mediano" />\n<TextField size="big" label="Grande" />\n<PasswordField label="Contraseña" />`}>
          <TextField icon="search" placeholder="Buscar…" label="Búsqueda" />
          <TextField size="medium" label="Mediano · 58" placeholder="Texto" />
          <TextField size="big" label="Grande · 70" placeholder="Texto" />
          <PasswordField label="Contraseña" defaultValue="secreto123" />
        </Demo>
        <PropsTable rows={[
          ['label', 'string', '—', 'Texto visible; entra en el nombre accesible.'], ['help', 'string', '—', 'Ayuda bajo la etiqueta (aria-describedby).'],
          ['error', 'string', '—', 'Mensaje de error; marca aria-invalid y reemplaza la ayuda.'], ['counter', 'string', '—', 'Contador alineado a la derecha (p. ej. «12/80»); convive con la ayuda y con el error.'], ['icon / trailingIcon', 'string', '—', 'Iconos dentro del control.'],
          ['size', "'small' | 'medium' | 'big'", "'small'", 'Alto 44 / 58 / 70.'],
        ]} />
      </Section>

      <Section id="area-select" title="Área de texto y selector">
        <Demo title="TextArea y Select" layout="grid" code={`<TextArea label="Descripción" rows={4} />\n<Select label="Tipo de juego" placeholder="Selecciona…" options={[{ value: 'quiz', label: 'Quiz' }]} />`}>
          <TextArea label="Descripción" placeholder="Cuéntanos de qué trata…" help="Aparece en el listado." />
          <Select label="Tipo de juego" placeholder="Selecciona…" options={[{ value: 'quiz', label: 'Quiz' }, { value: 'memoria', label: 'Memoria' }, { value: 'sopa', label: 'Sopa de letras' }]} />
          <Select label="Con error" error="Selecciona una opción." placeholder="Selecciona…" options={[{ value: 'a', label: 'A' }]} />
        </Demo>
      </Section>

      <Section id="seleccion" title="Casilla, radio e interruptor" lead="Casilla con estado mixto, opciones excluyentes y un conmutador cuyo efecto se aplica en el acto.">
        <Demo title="Checkbox" code={`<Checkbox label="Acepto el tratamiento de datos" />\n<Checkbox label="Mixto" indeterminate />\n<Checkbox label="Bloqueada" disabled defaultChecked />`}>
          <Checkbox label="Acepto el tratamiento de datos" defaultChecked /><Checkbox label="Notificarme por correo" /><Checkbox label="Mixto" indeterminate /><Checkbox label="Bloqueada" disabled defaultChecked /><Checkbox label="Bloqueada" disabled />
        </Demo>
        <Demo title="Radio" code={`<Radio name="canal" label="Correo" defaultChecked />\n<Radio name="canal" label="Teléfono" />`}>
          <Radio name="canal" label="Correo" defaultChecked /><Radio name="canal" label="Teléfono" /><Radio name="canal" label="No disponible" disabled />
        </Demo>
        <Demo title="Switch" code={`<Switch label="Publicado" defaultChecked />\n<Switch label="Borrador" />`}>
          <Switch label="Publicado" defaultChecked /><Switch label="Borrador" /><Switch label="Bloqueado" disabled defaultChecked />
        </Demo>
      </Section>

      <Section id="etiquetas" title="Etiqueta de estado, badge y chip">
        <Demo title="Status tag — tipos" desc="Cinco tipos semánticos; con punto circular o cuadrado y versión en gris." code={`<StatusTag type="success" dot>Publicado</StatusTag>\n<StatusTag type="prevent" dot>Por revisar</StatusTag>\n<StatusTag type="error" dot>Rechazado</StatusTag>\n<StatusTag type="draft" dot>Borrador</StatusTag>\n<StatusTag type="general">General</StatusTag>`}>
          <StatusTag type="success" dot>Publicado</StatusTag><StatusTag type="prevent" dot>Por revisar</StatusTag><StatusTag type="error" dot>Rechazado</StatusTag>
          <StatusTag type="draft" dot>Borrador</StatusTag><StatusTag type="general">General</StatusTag>
          <span className="demo__label t-label-sm">Punto cuadrado y gris</span>
          <StatusTag type="success" dot shape="square">Publicado</StatusTag><StatusTag grey dot>Inactivo</StatusTag>
        </Demo>
        <Demo title="Status tag — categóricos" desc="Cinco tonos para módulos o autores. No son estados." code={`<StatusTag color="blue">Noticias</StatusTag>`}>
          <StatusTag color="red">Rojo</StatusTag><StatusTag color="green">Verde</StatusTag><StatusTag color="blue">Azul</StatusTag><StatusTag color="orange">Naranja</StatusTag><StatusTag color="teal">Turquesa</StatusTag><StatusTag color="indigo">Índigo</StatusTag>
        </Demo>
        <Demo title="Badge" code={`<Badge count={3} />\n<Badge count={120} />`}><Badge count={3} /><Badge count={42} /><Badge count={120} /></Demo>
        <Demo title="Chip" desc="Filtro conmutable. Básico (4px) o primitivo (píldora); regular o pequeño." code={`<Chip active={on} onClick={toggle}>Juegos</Chip>\n<Chip primitive small icon="tag">Etiqueta</Chip>`}>
          <Chip active={chip} onClick={() => setChip(!chip)}>Juegos</Chip><Chip>Noticias</Chip><Chip icon="filter_list">Filtros</Chip>
          <Chip primitive>Primitivo</Chip><Chip primitive active>Primitivo activo</Chip><Chip small>Pequeño</Chip><Chip small primitive active>Pequeño</Chip>
        </Demo>
        <PropsTable rows={[
          ['type', "'general' | 'success' | 'prevent' | 'error' | 'draft'", "'general'", 'Tipo semántico.'], ['color', "'red' | 'green' | 'blue' | 'orange' | 'teal' | 'indigo'", '—', 'Tono categórico; tiene prioridad sobre type.'],
          ['grey', 'boolean', 'false', 'Versión en gris.'], ['dot / shape', "boolean / 'circle' | 'square'", "false / 'circle'", 'Marcador antes del texto.'],
        ]} />
      </Section>

      <Section id="avatar-progreso" title="Avatar, progreso y carga">
        <Demo title="Avatar" desc="Persona o dependencia. Sin foto muestra iniciales." code={`<Avatar name="Laura Gómez" size={40} />`}>
          <Avatar name="Laura Gómez" size={32} /><Avatar name="Kanoa Lab" /><Avatar name="Equipo Diseño Web" size={56} /><Avatar name="Juan" size={72} />
        </Demo>
        <Demo title="ProgressBar" code={`<ProgressBar value={60} label="Avance" />\n<ProgressBar vertical value={40} />`} layout="col">
          <ProgressBar value={pw} label="Avance" />
          <div className="row"><Button size="small" variant="outline" onClick={() => setPw((pw + 20) % 120)}>Avanzar</Button><span className="t-body-sm">{pw}%</span></div>
          <div style={{ height: 120 }}><ProgressBar vertical value={65} label="Vertical" /></div>
        </Demo>
        <Demo title="Spinner" code={`<Spinner size={32} />`}><Spinner size={20} /><Spinner /><Spinner size={40} /></Demo>
      </Section>

      <Section id="texto" title="Enlace, tecla, separador y tooltip">
        <Demo title="Link y Kbd" code={`<Link href="#">Ver trámites</Link>\n<Link quiet href="#">Sin subrayado</Link>\nAbre el buscador con <Kbd>Ctrl</Kbd> + <Kbd>K</Kbd>`}>
          <Link href="#atomos">Ver trámites</Link><Link quiet href="#atomos">Sin subrayado hasta hover</Link>
          <span className="t-body-md">Abre el buscador con <Kbd>Ctrl</Kbd> + <Kbd>K</Kbd></span>
        </Demo>
        <Demo title="Divider" layout="col" code={`<Divider />\n<Divider label="o continúa con" />\n<Divider vertical />`}>
          <Divider /><Divider label="o continúa con" />
          <div className="row" style={{ height: 24 }}><span>Uno</span><Divider vertical /><span>Dos</span><Divider vertical /><span>Tres</span></div>
        </Demo>
        <Demo title="Tooltip" code={`<Tooltip text="Guardar cambios"><IconButton icon="save" label="Guardar" /></Tooltip>`}>
          <Tooltip text="Guardar cambios"><IconButton icon="save" label="Guardar" /></Tooltip>
          <Tooltip text="Eliminar el juego"><IconButton icon="delete" label="Eliminar" /></Tooltip>
        </Demo>
        <Note>El tooltip aparece también con foco de teclado, y nunca debe ser la única forma de conocer una acción importante.</Note>
      </Section>
    </>
  )
}

/* ═══════════ MOLÉCULAS ═══════════ */
export function Moleculas() {
  const [tab, setTab] = useState('uno')
  const [tab2, setTab2] = useState('dos')
  const [page, setPage] = useState(3)
  const [nav, setNav] = useState('juegos')
  return (
    <>
      <PageHead title="Moléculas">Combinaciones pequeñas de átomos con un propósito concreto: avisar, navegar, agrupar.</PageHead>

      <Section id="mensajes" title="Mensaje y snackbar" lead="Mensaje en línea (permanece) y snackbar (aparece y desaparece). Tipos: primario, error, prevención y éxito.">
        <Demo title="Message" layout="col" code={`<Message type="primary" title="Información">Los cambios se guardan solos.</Message>\n<Message type="error" title="No se pudo guardar" />`}>
          <Message type="primary" title="Información">Los cambios se guardan automáticamente cada minuto.</Message>
          <Message type="success" title="Publicado">El juego ya está visible en el portal.</Message>
          <Message type="prevent" title="Revisa antes de continuar">Hay 2 preguntas sin respuesta correcta.</Message>
          <Message type="error" title="No se pudo guardar" onClose={() => undefined}>Verifica tu conexión e inténtalo de nuevo.</Message>
        </Demo>
        <Demo title="Snackbar" layout="col" code={`<Snackbar action="Deshacer">Juego eliminado</Snackbar>`}>
          <Snackbar action="Deshacer">Juego eliminado</Snackbar><Snackbar type="prevent" action="Reintentar">Conexión inestable</Snackbar><Snackbar type="error">No se pudo subir la imagen</Snackbar>
        </Demo>
        <A11y items={['Message usa role="alert" para error y role="status" para el resto; el anuncio ocurre al montarse, no al cambiar de color.', 'Snackbar usa role="status": no roba el foco. Si tiene acción, debe permanecer visible el tiempo suficiente para alcanzarla con teclado.', 'El tipo nunca se comunica solo con color: cada uno lleva su icono y título.']} />
        <PropsTable rows={[['type (Message)', "'primary' | 'error' | 'prevent' | 'success'", "'primary'", 'Tipo semántico.'], ['title', 'string', '—', 'Título en negrita.'], ['onClose', '() => void', '—', 'Muestra el botón de cierre.'], ['type (Snackbar)', "'error' | 'prevent' | 'success'", '—', 'Sin valor = neutro.'], ['action / onAction', 'string / () => void', '—', 'Texto y manejador de la acción.']]} />
      </Section>

      <Section id="tabs" title="Tabs" lead="Dos versiones: Material (subrayado) y pill (Shadcn).">
        <Demo title="Material y pill" layout="col" code={`<Tabs idPrefix="demo" label="Secciones del juego" value={tab} onChange={setTab} tabs={[{ id: 'uno', label: 'General' }, …]} />\n<TabPanel idPrefix="demo" id="uno" value={tab}>…</TabPanel>\n<Tabs pill … />`}>
          <Tabs idPrefix="demo" label="Secciones del juego" value={tab} onChange={setTab} tabs={[{ id: 'uno', label: 'General' }, { id: 'dos', label: 'Preguntas' }, { id: 'tres', label: 'Reglas' }, { id: 'cuatro', label: 'Bloqueada', disabled: true }]} />
          <TabPanel idPrefix="demo" id="uno" value={tab}>Datos generales del juego: nombre, descripción y portada.</TabPanel>
          <TabPanel idPrefix="demo" id="dos" value={tab}>Banco de preguntas y respuestas correctas.</TabPanel>
          <TabPanel idPrefix="demo" id="tres" value={tab}>Reglas de puntuación y de intentos.</TabPanel>
          <div><Tabs pill label="Estado" value={tab2} onChange={setTab2} tabs={[{ id: 'uno', label: 'Borrador' }, { id: 'dos', label: 'Publicado' }, { id: 'tres', label: 'Archivado' }]} /></div>
        </Demo>
        <A11y items={['Una sola pestaña entra en el orden de tabulación; ← → Inicio Fin mueven y activan la pestaña.', 'Con idPrefix, cada pestaña apunta a su panel (aria-controls) y el panel a su pestaña (aria-labelledby).', 'Las pestañas deshabilitadas se omiten al navegar con flechas. En pantallas angostas la barra se desplaza horizontalmente.']} />
        <PropsTable rows={[['tabs', '{ id, label, disabled? }[]', '—', 'Pestañas.'], ['value / onChange', 'string / (id) => void', '—', 'Pestaña activa (controlado).'], ['pill', 'boolean', 'false', 'Versión Shadcn (píldora).'], ['idPrefix', 'string', '—', 'Enlaza pestañas y TabPanel por aria-controls.'], ['label', 'string', '—', 'Nombre accesible del grupo.']]} />
      </Section>

      <Section id="paginacion" title="Paginación, ruta y pasos">
        <Demo title="Pagination" code={`<Pagination page={page} pages={12} onChange={setPage} />`}><Pagination page={page} pages={12} onChange={setPage} /></Demo>
        <Demo title="Breadcrumb" code={`<Breadcrumb items={[{ label: 'Inicio', href: '/' }, { label: 'Juegos', href: '/juegos' }, 'Crece Conmigo']} />`}>
          <Breadcrumb items={[{ label: 'Inicio', href: '#/inicio' }, { label: 'Componentes', href: '#/moleculas' }, 'Breadcrumb']} />
        </Demo>
        <A11y items={['Es una lista ordenada dentro de nav; cada ítem previo es un enlace real (href) y el último lleva aria-current="page".', 'Paginación: el botón de la página actual lleva aria-current="page"; anterior y siguiente se deshabilitan en los extremos.', 'ProgressSteps: lista ordenada; el paso actual lleva aria-current="step". Bajo 520 px solo el paso actual muestra su etiqueta.']} />
        <PropsTable rows={[['items (Breadcrumb)', '(string | { label, href })[]', '—', 'El último es la página actual.'], ['page / pages / onChange', 'number / number / (p) => void', '—', 'Paginación controlada.'], ['steps / current', 'string[] / number', '—', 'Pasos y el índice del actual (desde 0).']]} />
        <Demo title="ProgressSteps" layout="col" code={`<ProgressSteps steps={['Datos', 'Preguntas', 'Publicar']} current={1} />`}>
          <ProgressSteps steps={['Datos', 'Preguntas', 'Reglas', 'Publicar']} current={2} />
        </Demo>
      </Section>

      <Section id="tarjetas" title="Tarjeta" lead="Contenedor de 20px de radio. Vertical u horizontal; interactiva cuando toda la tarjeta es clicable.">
        <Demo title="Variantes" layout="grid" code={`<Card title="Crece Conmigo" media={<Icon name="sports_esports" size={48} />}>…</Card>\n<Card horizontal interactive … />`}>
          <Card title="Crece Conmigo" media={<Icon name="sports_esports" size={48} />} actions={<><Button variant="text" size="small">Ver</Button><Button size="small">Editar</Button></>}>Juego de preguntas para primera infancia.</Card>
          <Card interactive title="Noticia destacada" media={<Icon name="newspaper" size={48} />}>Tarjeta interactiva: sube al pasar el cursor.</Card>
          <Card horizontal title="Horizontal" media={<Icon name="quiz" size={40} />}>Media a la izquierda.</Card>
        </Demo>
        <A11y items={['El título es un h3: ajusta el nivel de encabezado al contexto de tu página.', 'Una tarjeta interactiva (role="link") se activa con Enter y no debe contener otros controles; si necesita acciones, usa la tarjeta no interactiva con botones.']} />
        <PropsTable rows={[['title', 'string', '—', 'Título (h3).'], ['media', 'ReactNode', '—', 'Zona de imagen o icono.'], ['horizontal', 'boolean', 'false', 'Media a la izquierda.'], ['interactive / onClick', 'boolean / () => void', 'false', 'Toda la tarjeta es clicable.'], ['actions', 'ReactNode', '—', 'Botones al pie (solo en tarjetas no interactivas).']]} />
      </Section>

      <Section id="menu" title="Ítem de menú y acordeón">
        <Demo title="MenuItem" desc="Activo, deshabilitado, pequeño y con contador." code={`<MenuItem icon="home" active>Inicio</MenuItem>`}>
          <div className="stack" style={{ maxWidth: 280, gap: 4 }}>
            <MenuItem icon="home" active={nav === 'inicio'} onClick={() => setNav('inicio')}>Inicio</MenuItem>
            <MenuItem icon="sports_esports" active={nav === 'juegos'} onClick={() => setNav('juegos')}>Juegos</MenuItem>
            <MenuItem icon="notifications" badge={4} active={nav === 'avisos'} onClick={() => setNav('avisos')}>Notificaciones</MenuItem>
            <MenuItem icon="lock" disabled>Bloqueado</MenuItem>
            <MenuItem small icon="settings">Pequeño</MenuItem>
          </div>
        </Demo>
        <Demo title="Accordion" layout="col" code={`<Accordion title="¿Cómo se puntúa?" defaultOpen>…</Accordion>`}>
          <Accordion title="¿Cómo se puntúa?" defaultOpen>Cada respuesta correcta suma un punto; las pistas restan medio.</Accordion>
          <Accordion title="¿Se puede repetir el juego?">Sí, sin límite de intentos.</Accordion>
        </Demo>
        <A11y items={['MenuItem es un button; el activo lleva aria-current="page". Con el navbar comprimido conserva su nombre vía title.', 'Accordion: el encabezado es un button con aria-expanded y aria-controls apuntando a su panel.']} />
        <PropsTable rows={[['icon / badge / small', 'string / number / boolean', '—', 'Icono, contador y tamaño pequeño (40 px).'], ['active / disabled', 'boolean', 'false', 'Página actual / sin acción.'], ['title / defaultOpen (Accordion)', 'string / boolean', '— / false', 'Encabezado y estado inicial.']]} />
      </Section>

      <Section id="listas" title="Lista de ítems" lead="Filas con zebra (par/impar) y hover; cada fila puede cerrar con una etiqueta de estado.">
        <Demo title="ItemList" layout="col" code={`<ItemList items={[{ title: 'Crece Conmigo', meta: 'Actualizado hoy', tag: <StatusTag type="success" dot>Publicado</StatusTag> }]} />`}>
          <ItemList items={[
            { title: 'Crece Conmigo', meta: 'Actualizado hoy · Laura G.', tag: <StatusTag type="success" dot>Publicado</StatusTag> },
            { title: 'Memoria de animales', meta: 'Actualizado ayer', tag: <StatusTag type="prevent" dot>Por revisar</StatusTag> },
            { title: 'Sopa de letras', meta: 'Hace 3 días', tag: <StatusTag type="draft" dot>Borrador</StatusTag> },
            { title: 'Rompecabezas', meta: 'Hace 1 semana', tag: <StatusTag type="error" dot>Rechazado</StatusTag> },
          ]} />
        </Demo>
      </Section>
    </>
  )
}

/* ═══════════ ORGANISMOS ═══════════ */
export function Organismos() {
  const [open, setOpen] = useState(false)
  const [confirm, setConfirm] = useState(false)
  const [compress, setCompress] = useState(false)
  const [active, setActive] = useState('juegos')
  const items = [
    { id: 'portada', icon: 'web_asset', label: 'Portada' }, { id: 'cifras', icon: 'finance_mode', label: 'Cifras destacadas' }, { id: 'inicio', icon: 'home', label: 'Bloques de inicio' },
    { id: 'noticias', icon: 'article', label: 'Noticias' }, { id: 'micrositios', icon: 'category', label: 'Micrositios' }, { id: 'info', icon: 'info', label: 'Páginas informativas' },
    { id: 'menus', icon: 'menu', label: 'Menús' }, { id: 'juegos', icon: 'sports_esports', label: 'Juegos' },
  ]

  return (
    <>
      <PageHead title="Organismos">Secciones completas de interfaz hechas de moléculas y átomos: diálogos, navegación y cabeceras.</PageHead>

      <Section id="modal" title="Modal" lead="Superficie de 20px de radio sobre un scrim, construida con el elemento nativo <dialog> y showModal(): el navegador atrapa el foco, vuelve inerte el fondo, cierra con Escape y devuelve el foco a quien lo abrió. El scroll de la página se bloquea mientras está abierto.">
        <Demo title="Modal y diálogo de confirmación" code={`<Modal open={open} title="Publicar juego" onClose={close} footer={…}>…</Modal>\n<ConfirmDialog open danger title="Eliminar juego" message="Esta acción no se puede deshacer." … />`}>
          <Button onClick={() => setOpen(true)}>Abrir modal</Button>
          <Button tone="error" variant="outline" onClick={() => setConfirm(true)}>Abrir confirmación</Button>
          <Modal open={open} title="Publicar juego" onClose={() => setOpen(false)}
            footer={<><Button variant="text" onClick={() => setOpen(false)}>Cancelar</Button><Button onClick={() => setOpen(false)}>Publicar</Button></>}>
            <div className="stack"><p style={{ margin: 0 }}>Los cambios serán visibles en el portal de inmediato.</p><TextField label="Nota de publicación" placeholder="Opcional" /><Switch label="Notificar a los suscriptores" defaultChecked /></div>
          </Modal>
          <ConfirmDialog open={confirm} danger title="Eliminar juego" message="Esta acción no se puede deshacer." confirmLabel="Eliminar" onCancel={() => setConfirm(false)} onConfirm={() => setConfirm(false)} />
        </Demo>
        <A11y items={['Escape, clic en el fondo o el botón «Cerrar» llaman a onClose; el componente es controlado.', 'El título del diálogo es su nombre accesible (aria-labelledby). Úsalo solo cuando la tarea necesite interrumpir; para avisos usa Message o Snackbar.']} />
        <PropsTable rows={[['open / onClose', 'boolean / () => void', '—', 'Visibilidad controlada.'], ['title', 'string', '—', 'Título (h2) y nombre accesible.'], ['footer', 'ReactNode', '—', 'Botones de acción.'], ['small', 'boolean', 'false', 'Ancho 400 px en vez de 560.'], ['wide', 'boolean', 'false', 'Ancho 960 px (vistas previas, contenido amplio).'], ['danger (ConfirmDialog)', 'boolean', 'false', 'Confirmación destructiva en tono error.']]} />
      </Section>

      <Section id="navbar" title="Navbar" lead="Navegación lateral que se abre y se cierra: expandido (310 px) con cabecera, ítems con etiqueta y usuario; comprimido en una card de 72 px solo con iconos. El botón de la cabecera alterna entre ambos modos.">
        <Demo title="Abrir ↔ cerrar" layout="col" code={`<Navbar items={items} active={active} onSelect={setActive} compress={compress} onToggle={() => setCompress(!compress)} user={{ name: 'Laura Gómez', email: 'laura@kanoalab.co' }} />`}>
          <div className="frame" style={{ height: 620, overflow: 'hidden' }}>
            <Navbar items={items} active={active} onSelect={setActive} compress={compress} onToggle={() => setCompress(!compress)} user={{ name: 'Laura Gómez', email: 'laura@kanoalab.co' }} />
          </div>
        </Demo>
        <A11y items={['Es un nav con nombre «Principal»; el ítem activo lleva aria-current="page".', 'El botón de abrir/cerrar tiene aria-expanded y cambia su nombre («Cerrar navegación» / «Abrir navegación»); al alternar conserva el foco aunque cambie de lugar.', 'Comprimido oculta las etiquetas y conserva el nombre accesible con title; los contadores se omiten en ese modo.']} />
        <PropsTable rows={[['items', '{ id, icon, label, badge?, disabled?, title? }[]', '—', 'Destinos.'], ['active / onSelect', 'string / (id) => void', '—', 'Destino activo.'], ['compress', 'boolean', 'false', 'Modo comprimido (card de 72 px dentro de 120 px).'], ['onToggle', '() => void', '—', 'Muestra el botón de abrir/cerrar; el estado lo controla quien lo usa.'], ['brand', 'string', "'StudIA 2.0'", 'Nombre junto al logotipo.'], ['user', '{ name, email?, tag? }', '—', 'Pie con avatar; comprimido muestra solo el avatar.'], ['footer', 'ReactNode', '—', 'Acciones extra sobre el usuario.']]} />
      </Section>

      <Section id="contenedores" title="Contenedores de página" lead="Piezas que estructuran un listado: Context-bar con el título (Bold 28/36), panel de filtros (radio 12) y tabla con filas tipo tarjeta y cebra. Usan solo tokens, así que siguen el tema claro y oscuro.">
        <Demo title="Context-bar, panel y tabla" layout="col" code={`<ContextBar title="Administración de menús" description="…" actions={<Button icon="add">Crear menú</Button>} />
<Panel>…filtros…</Panel>
<table className="ds-table">…</table>`}>
          <div className="stack" style={{ width: '100%', gap: 24 }}>
            <ContextBar title="Administración de juegos" titleAs="p" description="Crea y parametriza los juegos del portal." actions={<Button icon="add">Crear juego</Button>} />
            <Panel><TextField label="Buscar" icon="search" placeholder="Buscar por nombre" /></Panel>
            <table className="ds-table">
              <thead><tr><th scope="col">Nombre</th><th scope="col">Autor</th><th scope="col">Modificado</th></tr></thead>
              <tbody>
                <tr><td>Crece Conmigo</td><td>Laura Gómez</td><td>10/08/2026</td></tr>
                <tr><td>Memoria animales</td><td>Laura Gómez</td><td>12/08/2026</td></tr>
                <tr><td>Crucigrama del cuerpo</td><td>Carlos Ruiz</td><td>14/08/2026</td></tr>
              </tbody>
            </table>
          </div>
        </Demo>
        <A11y items={['El título de la Context-bar es un h1 por defecto; en una página que ya tiene h1 usa titleAs="h2" o "p".', 'El fondo translúcido (transparent-surface-60) mantiene contraste porque el texto usa el token title, que cambia con el tema.', 'La tabla conserva la semántica nativa: th con scope="col". Los títulos de sección dentro de la página usan la clase t-section (Bold 22/28).']} />
        <PropsTable rows={[['title / titleAs', 'string / h1 | h2 | p', '—', 'Título de la banda.'], ['badge', 'ReactNode', '—', 'Estado junto al título.'], ['onBack', '() => void', '—', 'Muestra el botón «Volver».'], ['description', 'ReactNode', '—', 'Texto bajo la banda.'], ['actions', 'ReactNode', '—', 'Acción principal a la derecha de la descripción.'], ['Panel', 'div', '—', 'Contenedor de filtros: surface-container-lowest, borde outline-variant, radio 12, padding 24.']]} />
      </Section>

      <Section id="header" title="Header" lead="Barra superior con título, acciones y usuario.">
        <Demo title="Header" layout="col" code={`<Header title="Gestor de contenido" user="Laura Gómez" onMenu={…} actions={…} />`}>
          <div className="frame">
            <Header titleAs="p" title="Gestor de contenido" user="Laura Gómez" onMenu={() => undefined}
              actions={<><IconButton icon="notifications" label="Notificaciones" /><Button size="small" icon="add">Nuevo</Button></>} />
          </div>
        </Demo>
        <A11y items={['El título es un h1 por defecto; en una página que ya tiene h1 (como este catálogo) usa titleAs="h2" o "p".', 'El avatar expone el nombre de la persona con role="img" y aria-label.']} />
        <PropsTable rows={[['title', 'string', '—', 'Título de la pantalla.'], ['titleAs', "'h1' | 'h2' | 'p'", "'h1'", 'Elemento del título.'], ['user', 'string', '—', 'Muestra el avatar con iniciales.'], ['onMenu', '() => void', '—', 'Muestra el botón de menú.'], ['actions', 'ReactNode', '—', 'Controles a la derecha.']]} />
      </Section>
    </>
  )
}
