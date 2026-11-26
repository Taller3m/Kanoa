import { useState, type FormEvent } from 'react'
import { Button, PasswordField, TextField } from '../../ui'
import { Notice, Screen, Scroll } from '../../mobile'
import { go } from '../../app/router'
import { useApp } from '../../app/store'
import { ESTUDIANTE } from '../../app/data'
import { CONTRASENA_EJEMPLO } from './data'
import logo from '../../assets/kanoalab-logo.svg'
import './ingreso.css'

const ERROR = 'El correo o la contraseña no son correctos. Revísalos e intenta de nuevo.'

/** A01 · Iniciar sesión, A02 · Datos incorrectos (?error=1) y A03 · Sin internet al ingresar (s.online = false). */
export function IniciarSesion({ errorInicial }: { errorInicial?: boolean }) {
  const { s, set, toast } = useApp()
  const [correo, setCorreo] = useState(ESTUDIANTE.correo)
  const [contrasena, setContrasena] = useState(CONTRASENA_EJEMPLO)
  const [error, setError] = useState(!!errorInicial)

  const ingresar = (e: FormEvent) => {
    e.preventDefault()
    // Para ingresar se necesita internet: sin conexión el botón solo reintenta.
    if (!s.online) return
    if (correo.trim().toLowerCase() !== ESTUDIANTE.correo || !contrasena) { setError(true); return }
    setError(false)
    set({ sesion: true })
    go(s.primeraSincronizacion ? 'preparando' : 'inicio')
  }

  return (
    <Screen white label="Iniciar sesión">
      <Scroll noNav center className="ing-scroll">
        <img src={logo} alt="Kanoa Lab" className="ing-logo" />
        <div className="m-col" style={{ gap: 8 }}>
          <h1 className="t-headline-sm m-title ing-center">Te damos la bienvenida</h1>
          <p className="t-body-md m-text ing-center">Ingresa con el correo y la contraseña que te dio tu colegio.</p>
        </div>
        <form id="ing-form" className="m-col" style={{ gap: 16 }} onSubmit={ingresar} noValidate>
          {/* A02 marca los dos campos en error; el mensaje va solo debajo de la contraseña. */}
          <TextField label="Correo" type="email" autoComplete="username" required value={correo}
            className={error ? 'ds-field--error' : undefined} aria-invalid={error || undefined}
            onChange={(e) => { setCorreo(e.target.value); setError(false) }} />
          <PasswordField label="Contraseña" required value={contrasena} error={error ? ERROR : undefined}
            onChange={(e) => { setContrasena(e.target.value); setError(false) }} />
        </form>
        {!s.online && (
          <Notice type="prevent" icon="cloud_off" title="No tienes internet">
            Para entrar a Kanoa necesitas conexión. Conéctate a wifi o a tus datos e intenta de nuevo.
          </Notice>
        )}
        <div className="ing-actions">
          <Button type="submit" form="ing-form" block>{s.online ? 'Ingresar' : 'Intentar de nuevo'}</Button>
          <Button variant="text" onClick={() => toast('Pide a tu colegio que te ayude a recuperar tu contraseña.')}>¿Olvidaste tu contraseña?</Button>
        </div>
        <p className="t-body-sm m-text ing-center">Después de ingresar podrás usar la app aunque no tengas internet.</p>
      </Scroll>
    </Screen>
  )
}
