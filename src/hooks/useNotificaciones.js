import { useEffect, useState } from "react"
import { obtenerNotificaciones, marcarLeida, marcarTodasLeidas } from "../services/notificaciones.service"
import { obtenerToken } from "../utils/auth"

export function useNotificaciones(idUsuario) {
    const [notificaciones, setNotificaciones] = useState([])

    // Carga el historial al montar
    useEffect(() => {
        if (!idUsuario) return
        obtenerNotificaciones(idUsuario)
            .then(setNotificaciones)
            .catch(console.error)
    }, [idUsuario])

    // Conexión SSE — el token va como query param según el backend
    useEffect(() => {
        if (!idUsuario) return

        const token = obtenerToken()
        const url = `${import.meta.env.VITE_URL_API}/notificaciones/suscribir/${idUsuario}?token=${token}`
        const source = new EventSource(url)

        source.onmessage = (event) => {
            try {
                const payload = JSON.parse(event.data)
                if (payload.tipo === "NUEVA_NOTIFICACION") {
                    setNotificaciones((prev) => [payload.datos, ...prev])
                }
            } catch {
                // ignorar mensajes mal formados
            }
        }

        source.onerror = () => {
            source.close()
        }

        return () => source.close()
    }, [idUsuario])

    const noLeidas = notificaciones.filter((n) => !n.leida).length

    const leerUna = async (id) => {
        await marcarLeida(id)
        setNotificaciones((prev) =>
            prev.map((n) => (n.id === id ? { ...n, leida: true } : n))
        )
    }

    const leerTodas = async () => {
        await marcarTodasLeidas(idUsuario)
        setNotificaciones((prev) => prev.map((n) => ({ ...n, leida: true })))
    }

    return { notificaciones, noLeidas, leerUna, leerTodas }
}
