import { useRef, useState } from "react"
import { verificar } from "../../services/auth.service"

export default function CodeInput({ usuario, onSuccess }) {
    const [digitos, setDigitos] = useState(Array(6).fill(""))
    const [error, setError] = useState("")
    const [cargando, setCargando] = useState(false)
    const refs = useRef([])

    const handleChange = (index, value) => {
        if (!/^\d?$/.test(value)) return

        const nuevos = [...digitos]
        nuevos[index] = value
        setDigitos(nuevos)

        if (value && index < 5) {
            refs.current[index + 1]?.focus()
        }
    }

    const handleKeyDown = (index, e) => {
        if (e.key === "Backspace" && !digitos[index] && index > 0) {
            refs.current[index - 1]?.focus()
        }
    }

    const handlePaste = (e) => {
        e.preventDefault()
        const pegado = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6)
        if (!pegado) return
        const nuevos = Array(6).fill("")
        pegado.split("").forEach((c, i) => (nuevos[i] = c))
        setDigitos(nuevos)
        refs.current[Math.min(pegado.length, 5)]?.focus()
    }

    const handleSubmit = async () => {
        const codigo = digitos.join("")
        if (codigo.length < 6) {
            setError("Ingresa los 6 dígitos del código")
            return
        }
        setCargando(true)
        setError("")
        try {
            await verificar(usuario, codigo)
            onSuccess()
        } catch (err) {
            setError(err.response?.data?.mensaje || "Código incorrecto. Intenta de nuevo.")
            setDigitos(Array(6).fill(""))
            refs.current[0]?.focus()
        } finally {
            setCargando(false)
        }
    }

    return (
        <>
            <div className="info-card">
                <h3>Se envió un código de recuperación al correo asociado a tu usuario</h3>
            </div>

            <div className="code-input-wrapper">
                {digitos.map((d, i) => (
                    <input
                        key={i}
                        ref={(el) => (refs.current[i] = el)}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        value={d}
                        className="code-digit-input"
                        onChange={(e) => handleChange(i, e.target.value)}
                        onKeyDown={(e) => handleKeyDown(i, e)}
                        onPaste={handlePaste}
                        autoFocus={i === 0}
                    />
                ))}
            </div>

            {error && <p className="form-error">{error}</p>}

            <button
                className="login-btn"
                onClick={handleSubmit}
                disabled={cargando}
            >
                {cargando ? "Verificando..." : "Verificar código"}
            </button>
        </>
    )
}
