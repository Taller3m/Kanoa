import { useEffect, useRef, useState, type FormEvent } from 'react'
import { Button, Chip, Icon, TextField } from '../../ui'
import { AppBar, BottomNav, Circle, HeroTitle, Notice, PagerBar, Screen, Scroll, cx, tone } from '../../mobile'
import { go } from '../../app/router'
import { useApp } from '../../app/store'
import { AVATARES, CONVERSACION_EJEMPLO, EMOCIONES, RESPUESTAS_KIT, avatarDe, emocionDe, type Burbuja } from './data'
import './cuenta.css'

/** F01 · Kit de Emociones (con internet) y F03 · Kit sin internet: el Kit exige conexión porque responde un asistente en línea. */
export function Kit({ emocion: emocionInicial }: { emocion: string | null }) {
  const { s } = useApp()
  const [emocion, setEmocion] = useState<string | null>(emocionDe(emocionInicial)?.id ?? null)
  const avatar = avatarDe(s.kit.avatar)
  const tieneNickname = s.kit.nickname.trim() !== ''
  return (
    <Screen label="Kit de Emociones">
      <HeroTitle title="Kit de Emociones" subtitle="Un espacio para contar cómo te sientes" />
      {!s.online ? (
        <Scroll>
          <div className="m-empty">
            <span className="m-circle m-tone-prevent" style={{ ['--s' as string]: '88px' }}><Icon name="cloud_off" size={44} /></span>
            <h2 className="t-headline-sm m-title">El Kit necesita internet</h2>
            <p className="t-body-md m-text">Las respuestas del Kit vienen de un asistente en línea. Cuando tengas conexión, vuelve aquí.</p>
            <Button variant="outline" block onClick={() => go('inicio')}>Ir al inicio</Button>
          </div>
        </Scroll>
      ) : (
        <Scroll style={{ paddingTop: 16, gap: 14 }}>
          <section className="m-card" aria-label="Tu avatar en el Kit" style={{ padding: '14px 8px 14px 16px' }}>
            <div className="m-row" style={{ gap: 12 }}>
              <Circle t={avatar} icon="face" iconSize={32} />
              <div className="m-col m-grow" style={{ gap: 0 }}>
                <p className="t-title-md m-title">{tieneNickname ? s.kit.nickname : 'Sin nickname'}</p>
                <p className="t-body-sm m-muted">Tu avatar y tu nombre en el Kit</p>
              </div>
              <Button variant="text" size="small" icon="edit" onClick={() => go('kit/avatar')}>{tieneNickname ? 'Editar' : 'Elegir'}</Button>
            </div>
          </section>
          <section className="m-card" aria-labelledby="cu-checkin" style={{ gap: 14 }}>
            <div className="m-col" style={{ gap: 4 }}>
              <h2 id="cu-checkin" className="t-title-lg m-title">¿Cómo llegas hoy?</h2>
              <p className="t-body-md m-text">Cuéntale al Kit cómo te sientes. Solo lo ve el equipo de bienestar de tu colegio.</p>
            </div>
            <div className="m-row" style={{ gap: 8, flexWrap: 'wrap' }}>
              {EMOCIONES.map((e) => (
                <Chip key={e.id} active={emocion === e.id} onClick={() => setEmocion(emocion === e.id ? null : e.id)}>{e.label}</Chip>
              ))}
            </div>
            <Button block icon="chat" onClick={() => go(`kit/conversacion${emocion ? `?emocion=${emocion}` : ''}`)}>Hablar con el Kit</Button>
          </section>
        </Scroll>
      )}
      <BottomNav active="kit" />
    </Screen>
  )
}

/** F02 · Conversación con el Kit. `ejemplo` carga la conversación del lienzo después del saludo. */
export function KitConversacion({ emocion, ejemplo }: { emocion: string | null; ejemplo: boolean }) {
  const { s } = useApp()
  const nick = s.kit.nickname.trim()
  const e = emocionDe(emocion)
  const saludo = e
    ? `Hola${nick ? `, ${nick}` : ''}. Me contaste que llegas ${e.texto}. ¿Quieres contarme qué pasó?`
    : `Hola${nick ? `, ${nick}` : ''}. ¿Cómo llegas hoy? Cuéntame lo que quieras.`
  const [burbujas, setBurbujas] = useState<Burbuja[]>(() => [{ de: 'kit', texto: saludo }, ...(ejemplo ? CONVERSACION_EJEMPLO : [])])
  const [texto, setTexto] = useState('')
  const [escribiendo, setEscribiendo] = useState(false)
  const respuesta = useRef(0)
  const timer = useRef(0)
  const fin = useRef<HTMLDivElement>(null)

  useEffect(() => () => window.clearTimeout(timer.current), [])
  useEffect(() => { fin.current?.scrollIntoView({ block: 'end' }) }, [burbujas, escribiendo])

  const enviar = (ev: FormEvent) => {
    ev.preventDefault()
    const t = texto.trim()
    if (!t || !s.online || escribiendo) return
    setBurbujas((b) => [...b, { de: 'yo', texto: t }])
    setTexto('')
    setEscribiendo(true)
    timer.current = window.setTimeout(() => {
      const r = RESPUESTAS_KIT[respuesta.current % RESPUESTAS_KIT.length]!
      respuesta.current += 1
      setBurbujas((b) => [...b, { de: 'kit', texto: r }])
      setEscribiendo(false)
    }, 1200)
  }

  return (
    <Screen label="Conversación con el Kit">
      <AppBar title="Kit de Emociones" subtitle="Conversación de hoy" onBack={() => go('kit')} />
      <Scroll pager style={{ paddingTop: 12 }}>
        <div className="cu-chat" role="log" aria-live="polite" aria-label="Conversación">
          {burbujas.map((b, i) => (
            <p key={i} className={cx('m-bubble', b.de === 'kit' ? 'm-bubble--kit' : 'm-bubble--me')}>{b.texto}</p>
          ))}
          {escribiendo && <p className="m-bubble m-bubble--kit cu-typing">El Kit está escribiendo…</p>}
        </div>
        {!s.online && (
          <Notice type="prevent" icon="cloud_off" title="El Kit necesita internet">
            Cuando tengas conexión podrás seguir la conversación.
          </Notice>
        )}
        <div ref={fin} />
      </Scroll>
      <PagerBar>
        <form className="cu-chat__form" onSubmit={enviar}>
          <TextField aria-label="Escribe tu mensaje" placeholder="Escribe tu mensaje" value={texto} onChange={(ev) => setTexto(ev.target.value)}
            disabled={!s.online} size="big" autoComplete="off" />
          <button type="submit" className="cu-chat__send" aria-label="Enviar mensaje" disabled={!s.online || !texto.trim() || escribiendo}>
            <Icon name="send" />
          </button>
        </form>
      </PagerBar>
    </Screen>
  )
}

/** F04 · Avatar y nickname del Kit (salieron de Perfil). Guarda en el store y vuelve al Kit. */
export function KitAvatar() {
  const { s, set, toast } = useApp()
  const [nickname, setNickname] = useState(s.kit.nickname)
  const [avatar, setAvatar] = useState(avatarDe(s.kit.avatar))
  const [error, setError] = useState<string | undefined>()

  const guardar = (ev: FormEvent) => {
    ev.preventDefault()
    const n = nickname.trim()
    if (!n) { setError('Escribe un nickname.'); return }
    set({ kit: { avatar, nickname: n } })
    toast({ texto: 'Guardamos tu avatar y tu nickname.', tipo: 'success' })
    go('kit')
  }

  return (
    <Screen label="Tu avatar">
      <AppBar title="Tu avatar" subtitle="Kit de Emociones" onBack={() => go('kit')} />
      <Scroll style={{ paddingTop: 8 }}>
        <form className="m-col" style={{ gap: 16 }} onSubmit={guardar} noValidate>
          <div className="m-col" style={{ alignItems: 'center', gap: 8 }}>
            <Circle t={avatar} size={88} icon="face" iconSize={48} />
            <p className="t-title-md m-title" aria-live="polite">{nickname.trim() || 'Tu nickname'}</p>
          </div>
          <TextField label="Nickname" required maxLength={20} value={nickname} error={error}
            help="Así te llamará el Kit. No uses tu nombre completo."
            onChange={(ev) => { setNickname(ev.target.value); setError(undefined) }} />
          <section className="m-card" style={{ gap: 14 }}>
            <p id="cu-avatar-label" className="t-title-sm m-title">Elige tu avatar</p>
            <div className="cu-avatars" role="radiogroup" aria-labelledby="cu-avatar-label">
              {AVATARES.map((t, i) => (
                <button key={t} type="button" role="radio" aria-checked={avatar === t} aria-label={`Avatar ${i + 1}`}
                  className={cx('m-circle', tone(t), 'cu-avatar-opt')} onClick={() => setAvatar(t)}>
                  <Icon name="face" size={28} />
                </button>
              ))}
            </div>
          </section>
          <Button type="submit" block>Guardar</Button>
        </form>
      </Scroll>
      <BottomNav active="kit" />
    </Screen>
  )
}
