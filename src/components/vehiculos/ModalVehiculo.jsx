import React, { useEffect, useState } from "react"
import { consultarVehiculo, consultarFotosSecundarias } from "../../services/vehiculos.service"
import { calcularRenta, crearRenta } from "../../services/rentas.service"
import { obtenerTarjetas, agregarTarjeta } from "../../services/tarjetas.service"
import { obtenerDatosToken } from "../../utils/auth"

const COMBUSTIBLE_LABEL = {
    1: { label: "Gasolina", icon: "⛽" },
    2: { label: "Híbrido", icon: "🔋" },
    0: { label: "Eléctrico", icon: "⚡" },
}

const TAMANO_LABEL = {
    A: "Mini",
    B: "Compacto",
    C: "Mediano",
    D: "Grande",
    E: "Premium",
    F: "SUV",
    S: "Deportivo",
}

const formatFecha = (iso) => {
    if (!iso) return "—"
    return new Date(iso).toLocaleString("es-MX", {
        day: "2-digit", month: "short", year: "numeric",
        hour: "2-digit", minute: "2-digit",
    })
}

const formatMonto = (n) =>
    Number(n).toLocaleString("es-MX", { style: "currency", currency: "MXN" })

export default function ModalVehiculo({ vehiculo, modoCliente = false, onCerrar, onExito }) {
    const [detalle, setDetalle] = useState(null)
    const [fotosSecundarias, setFotos] = useState([])
    const [fotoActiva, setFotoActiva] = useState(null)
    const [cargando, setCargando] = useState(true)

    // flujo de renta
    const [paso, setPaso] = useState(1)
    const [fechaInicio, setFechaInicio] = useState("")
    const [fechaFin, setFechaFin] = useState("")
    const [cargandoCalculo, setCargandoCalculo] = useState(false)
    const [errorCalculo, setErrorCalculo] = useState("")

    const [resumen, setResumen] = useState(null)
    const [tarjetas, setTarjetas] = useState([])
    const [cargandoTarjetas, setCargandoTarjetas] = useState(false)
    const [tarjetaId, setTarjetaId] = useState(null)
    const [cvv, setCvv] = useState("")
    const [mostrarFormNueva, setMostrarFormNueva] = useState(false)
    const [nuevaTarjeta, setNuevaTarjeta] = useState({
        numeroTarjeta: "", cvv: "", titular: "", fechaVencimiento: "",
    })
    const [cargandoRenta, setCargandoRenta] = useState(false)
    const [errorRenta, setErrorRenta] = useState("")
    const [noDisponible, setNoDisponible] = useState(false)
    const [exito, setExito] = useState(false)

    useEffect(() => {
        if (!vehiculo) return
        setCargando(true)
        setPaso(1)
        setFechaInicio("")
        setFechaFin("")
        setResumen(null)
        setErrorCalculo("")
        setErrorRenta("")
        setNoDisponible(false)
        setExito(false)

        Promise.all([
            consultarVehiculo(vehiculo.id),
            fetchFotos(vehiculo.id),
        ]).then(([datos, fotos]) => {
            setDetalle(datos)
            setFotos(fotos)
            setFotoActiva(null)
        }).catch(console.error)
            .finally(() => setCargando(false))
    }, [vehiculo])

    useEffect(() => {
        if (paso !== 2) return
        setCargandoTarjetas(true)
        obtenerTarjetas()
            .then((data) => {
                const lista = Array.isArray(data) ? data : (data?.$values ?? [])
                setTarjetas(lista)
                if (lista.length > 0) {
                    setTarjetaId(lista[0].id)
                    setMostrarFormNueva(false)
                } else {
                    setTarjetaId(null)
                    setMostrarFormNueva(true)
                }
            })
            .catch(() => {
                setTarjetas([])
                setMostrarFormNueva(true)
            })
            .finally(() => setCargandoTarjetas(false))
    }, [paso])

    const fetchFotos = async (id) => {
        try {
            const resp = await consultarFotosSecundarias(id)
            if (Array.isArray(resp)) return resp
            return []
        } catch {
            return []
        }
    }

    const handleVerResumen = async () => {
        if (!fechaInicio || !fechaFin) return
        setCargandoCalculo(true)
        setErrorCalculo("")
        try {
            const data = await calcularRenta({ idVehiculo: vehiculo.id, fechaInicio, fechaFin })
            setResumen(data)
            setPaso(2)
        } catch (err) {
            setErrorCalculo(err.response?.data?.mensaje || "No se pudo calcular la renta.")
        } finally {
            setCargandoCalculo(false)
        }
    }

    const handleConfirmar = async () => {
        const cvvParaRenta = mostrarFormNueva ? nuevaTarjeta.cvv : cvv
        if (!cvvParaRenta) return
        setErrorRenta("")
        setNoDisponible(false)
        setCargandoRenta(true)

        try {
            const { id: idUsuario } = obtenerDatosToken()
            let idTarjetaFinal = tarjetaId

            if (mostrarFormNueva) {
                const [anio, mes] = nuevaTarjeta.fechaVencimiento.split("-")
                const payload = {
                    numeroTarjeta: nuevaTarjeta.numeroTarjeta,
                    cvv: nuevaTarjeta.cvv,
                    titular: nuevaTarjeta.titular,
                    fechaVencimiento: `${mes}/${anio.slice(2)}`,
                }
                console.log("Payload tarjeta:", payload)
                const creada = await agregarTarjeta(payload)
                idTarjetaFinal = creada.tarjeta?.id ?? creada.id
            }

            await crearRenta({
                idVehiculo: vehiculo.id,
                idUsuario,
                fechaInicio,
                fechaFin,
                idTarjeta: idTarjetaFinal,
                cvv: cvvParaRenta,
            })

            setExito(true)
            setTimeout(() => {
                onExito?.()
                onCerrar()
            }, 1800)
        } catch (err) {
            if (err.response?.status === 409) {
                setNoDisponible(true)
            } else {
                setErrorRenta(err.response?.data?.mensaje || "No se pudo completar la reserva.")
            }
        } finally {
            setCargandoRenta(false)
        }
    }

    if (!vehiculo) return null

    const combustible = COMBUSTIBLE_LABEL[detalle?.tipo_combustible] ?? { label: "—", icon: "" }
    const transmision = detalle?.transmision ? "Automático" : "Estándar"
    const tamano = TAMANO_LABEL[detalle?.tamano] ?? detalle?.tamano ?? "—"
    const fotoPrincipal = `${import.meta.env.VITE_URL_API}/vehiculos/${vehiculo.id}/main-picture`

    const puedeVerResumen = fechaInicio && fechaFin && fechaFin > fechaInicio
    const puedeConfirmar = mostrarFormNueva
        ? nuevaTarjeta.cvv.length >= 3
        : cvv.length >= 3 && !!tarjetaId

    return (
        <div style={s.overlay} onClick={(e) => e.target === e.currentTarget && onCerrar()}>
            <div style={s.modal}>
                {/* Header */}
                <div style={s.header}>
                    <div>
                        <p style={s.headerMarca}>{detalle?.nombreMarca ?? vehiculo.nombreMarca}</p>
                        <h2 style={s.headerModelo}>{detalle?.modelo ?? vehiculo.modelo}</h2>
                    </div>
                    <button style={s.btnX} onClick={onCerrar}>✕</button>
                </div>

                {cargando ? (
                    <div style={s.loading}>Cargando información…</div>
                ) : exito ? (
                    <div style={s.exitoBox}>
                        <div style={s.exitoIcon}>✓</div>
                        <p style={s.exitoTitulo}>¡Reserva confirmada!</p>
                        <p style={s.exitoSub}>Tu vehículo ha sido reservado exitosamente.</p>
                    </div>
                ) : (
                    <div style={s.content}>
                        {/* Galería */}
                        <div style={s.gallery}>
                            <img
                                src={fotoActiva ?? fotoPrincipal}
                                alt="Foto del vehículo"
                                className="mv-fotoMain"
                            />
                            {fotosSecundarias.length > 0 && (
                                <div className="mv-thumbnails">
                                    <img
                                        src={fotoPrincipal}
                                        alt="Principal"
                                        style={{ ...s.thumb, ...(fotoActiva === null ? s.thumbActiva : {}) }}
                                        onClick={() => setFotoActiva(null)}
                                    />
                                    {fotosSecundarias.map((url, i) => (
                                        <img
                                            key={i}
                                            src={url}
                                            alt={`Foto ${i + 1}`}
                                            style={{ ...s.thumb, ...(fotoActiva === url ? s.thumbActiva : {}) }}
                                            onClick={() => setFotoActiva(url)}
                                            onError={(e) => { e.target.style.display = "none" }}
                                        />
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Datos */}
                        <div style={s.info}>
                            <div style={s.infoGrid}>
                                <Dato etiqueta="Placa" valor={detalle?.placa} />
                                <Dato etiqueta="Marca" valor={detalle?.nombreMarca} />
                                <Dato etiqueta="Modelo" valor={detalle?.modelo} />
                                <Dato etiqueta="Tamaño" valor={tamano} />
                                <Dato etiqueta="Pasajeros" valor={detalle?.pasajeros} />
                                <Dato etiqueta="Transmisión" valor={transmision} />
                                <Dato etiqueta="Combustible" valor={`${combustible.icon} ${combustible.label}`} />
                                <Dato
                                    etiqueta="Aire acondicionado"
                                    valor={detalle?.aire_acondicionado ? "Sí" : "No"}
                                />
                                <Dato
                                    etiqueta="Estado"
                                    valor={
                                        <span style={{ color: detalle?.estado === 1 ? "#16a34a" : "#dc2626", fontWeight: 600 }}>
                                            {detalle?.estado === 1 ? "Disponible" : "No disponible"}
                                        </span>
                                    }
                                />
                                <Dato
                                    etiqueta="Color"
                                    valor={
                                        <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
                                            <span style={{
                                                display: "inline-block", width: 14, height: 14,
                                                borderRadius: "50%", background: detalle?.codigoHex,
                                                border: "1px solid #d1d5db",
                                            }} />
                                            {detalle?.color}
                                        </span>
                                    }
                                />
                            </div>

                            {/* Footer: sólo cuando hay flujo de reserva */}
                            {onExito ? (
                                paso === 1 ? (
                                    <PasoFechas
                                        fechaInicio={fechaInicio}
                                        fechaFin={fechaFin}
                                        onChangeFechaInicio={setFechaInicio}
                                        onChangeFechaFin={setFechaFin}
                                        onCerrar={onCerrar}
                                        onSiguiente={handleVerResumen}
                                        cargando={cargandoCalculo}
                                        error={errorCalculo}
                                        puedeAvanzar={puedeVerResumen}
                                    />
                                ) : (
                                    <PasoPago
                                        resumen={resumen}
                                        tarjetas={tarjetas}
                                        cargandoTarjetas={cargandoTarjetas}
                                        tarjetaId={tarjetaId}
                                        onSeleccionarTarjeta={(id) => { setTarjetaId(id); setMostrarFormNueva(false) }}
                                        mostrarFormNueva={mostrarFormNueva}
                                        onToggleFormNueva={() => { setMostrarFormNueva(v => !v); setTarjetaId(null) }}
                                        nuevaTarjeta={nuevaTarjeta}
                                        onChangeNuevaTarjeta={(campo, valor) =>
                                            setNuevaTarjeta(prev => ({ ...prev, [campo]: valor }))
                                        }
                                        cvv={cvv}
                                        onChangeCvv={setCvv}
                                        onRegresar={() => { setPaso(1); setErrorRenta(""); setNoDisponible(false) }}
                                        onConfirmar={handleConfirmar}
                                        cargando={cargandoRenta}
                                        error={errorRenta}
                                        noDisponible={noDisponible}
                                        puedeConfirmar={puedeConfirmar}
                                    />
                                )
                            ) : (
                                <div style={s.footer}>
                                    {modoCliente && (
                                        <button style={s.btnVerde} onClick={() => alert("Redirigir a página de renta")}>
                                            Rentar vehículo
                                        </button>
                                    )}
                                    <button style={s.btnGris} onClick={onCerrar}>Cerrar</button>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

function PasoFechas({ fechaInicio, fechaFin, onChangeFechaInicio, onChangeFechaFin,
    onCerrar, onSiguiente, cargando, error, puedeAvanzar }) {

    const ahora = new Date().toISOString().slice(0, 16)

    return (
        <div style={s.pasoBox}>
            <p style={s.pasoTitulo}>Selecciona las fechas</p>
            <div style={s.fechasGrid}>
                <div style={s.fechaGrupo}>
                    <label style={s.fechaLabel}>Inicio</label>
                    <input
                        type="datetime-local"
                        style={s.fechaInput}
                        value={fechaInicio}
                        min={ahora}
                        onChange={(e) => onChangeFechaInicio(e.target.value)}
                    />
                </div>
                <div style={s.fechaGrupo}>
                    <label style={s.fechaLabel}>Fin</label>
                    <input
                        type="datetime-local"
                        style={s.fechaInput}
                        value={fechaFin}
                        min={fechaInicio || ahora}
                        onChange={(e) => onChangeFechaFin(e.target.value)}
                    />
                </div>
            </div>
            {error && <p style={s.errorMsg}>{error}</p>}
            <div style={s.footer}>
                <button style={s.btnGris} onClick={onCerrar}>Regresar</button>
                <button
                    style={{ ...s.btnVerde, opacity: (!puedeAvanzar || cargando) ? 0.5 : 1, cursor: (!puedeAvanzar || cargando) ? "not-allowed" : "pointer" }}
                    disabled={!puedeAvanzar || cargando}
                    onClick={onSiguiente}
                >
                    {cargando ? "Calculando…" : "Ver resumen →"}
                </button>
            </div>
        </div>
    )
}

function PasoPago({ resumen, tarjetas, cargandoTarjetas, tarjetaId, onSeleccionarTarjeta,
    mostrarFormNueva, onToggleFormNueva, nuevaTarjeta, onChangeNuevaTarjeta,
    cvv, onChangeCvv, onRegresar, onConfirmar, cargando, error, noDisponible, puedeConfirmar }) {

    const [errores, setErrores] = useState({})

    const validarCampo = (campo, valor, tarjeta = nuevaTarjeta) => {
        const ahora = new Date()
        const anioNow = ahora.getFullYear()
        const mesNow = ahora.getMonth() + 1

        switch (campo) {
            case "numeroTarjeta":
                if (!valor) return "Campo requerido"
                if (valor.length < 16) return "Debe tener 16 dígitos"
                return ""
            case "titular":
                if (!valor.trim()) return "Campo requerido"
                if (valor.trim().length < 3) return "Mínimo 3 caracteres"
                return ""
            case "fechaVencimiento": {
                if (!valor) return "Campo requerido"
                const seleccionada = new Date(valor + "-01")
                const hoy = new Date()
                const primeroDeMes = new Date(hoy.getFullYear(), hoy.getMonth(), 1)
                if (seleccionada < primeroDeMes) return "Tarjeta vencida"
                return ""
            }
            case "cvv":
                if (!valor) return "Campo requerido"
                if (valor.length < 3) return "Mínimo 3 dígitos"
                return ""
            default:
                return ""
        }
    }

    const handleChange = (campo, valor) => {
        onChangeNuevaTarjeta(campo, valor)
        setErrores(prev => ({ ...prev, [campo]: validarCampo(campo, valor) }))
    }

    const handleBlur = (campo) => {
        setErrores(prev => ({ ...prev, [campo]: validarCampo(campo, nuevaTarjeta[campo]) }))
    }

    const tarjetaNuevaValida = !mostrarFormNueva || (
        nuevaTarjeta.numeroTarjeta.length === 16 &&
        nuevaTarjeta.titular.trim().length >= 3 &&
        nuevaTarjeta.fechaVencimiento.length > 0 &&
        nuevaTarjeta.cvv.length >= 3 &&
        !errores.numeroTarjeta && !errores.titular && !errores.fechaVencimiento && !errores.cvv
    )

    const puedeConfirmarFinal = puedeConfirmar && tarjetaNuevaValida

    return (
        <div style={s.pasoBox}>
            {/* Resumen de la renta */}
            {resumen && (
                <div style={s.resumenCard}>
                    <p style={s.pasoTitulo}>Resumen de la renta</p>
                    <div style={s.resumenGrid}>
                        <ResumenDato label="Vehículo" valor={`${toStr(resumen.vehiculo?.Marca)} ${resumen.vehiculo?.modelo ?? ""}`.trim()} />
                        <ResumenDato label="Placa" valor={resumen.vehiculo?.placa} />
                        {resumen.vehiculo?.Sucursal && (
                            <ResumenDato label="Sucursal" valor={resumen.vehiculo.Sucursal} />
                        )}
                        <ResumenDato label="Inicio" valor={formatFecha(resumen.fechaInicio)} />
                        <ResumenDato label="Fin" valor={formatFecha(resumen.fechaFin)} />
                        <div style={s.resumenTotal}>
                            <span>Total</span>
                            <span style={{ fontWeight: 700, color: "#16a34a", fontSize: 18 }}>
                                {formatMonto(resumen.montoTotal)}
                            </span>
                        </div>
                    </div>
                </div>
            )}

            {/* Tarjetas */}
            <p style={s.pasoTitulo}>Método de pago</p>

            {cargandoTarjetas ? (
                <p style={s.msgGris}>Cargando tarjetas…</p>
            ) : (
                <>
                    {tarjetas.map((t) => (
                        <label key={t.id} style={{ ...s.tarjetaRow, background: tarjetaId === t.id ? "#eff6ff" : "#f9fafb", border: tarjetaId === t.id ? "1.5px solid #2563eb" : "1.5px solid #e5e7eb" }}>
                            <input
                                type="radio"
                                name="tarjeta"
                                checked={tarjetaId === t.id}
                                onChange={() => onSeleccionarTarjeta(t.id)}
                                style={{ accentColor: "#2563eb" }}
                            />
                            <span style={s.tarjetaInfo}>
                                <span style={{ fontWeight: 600 }}>•••• {t.numeroTarjeta?.slice(-4) ?? "----"}</span>
                                <span style={s.tarjetaSub}>{t.titular} · {t.fechaVencimiento}</span>
                            </span>
                        </label>
                    ))}

                    <button style={s.btnAgregar} onClick={onToggleFormNueva}>
                        {mostrarFormNueva && tarjetas.length > 0 ? "— Cancelar nueva tarjeta" : "+ Agregar nueva tarjeta"}
                    </button>

                    {mostrarFormNueva && (
                        <div style={s.formNueva}>
                            <div style={s.fechasGrid}>
                                <CampoTarjeta
                                    label="Número de tarjeta"
                                    placeholder="•••• •••• •••• ••••"
                                    maxLength={16}
                                    value={nuevaTarjeta.numeroTarjeta}
                                    error={errores.numeroTarjeta}
                                    onChange={(v) => handleChange("numeroTarjeta", v.replace(/\D/g, ""))}
                                    onBlur={() => handleBlur("numeroTarjeta")}
                                />
                                <CampoTarjeta
                                    label="Titular"
                                    placeholder="Nombre en la tarjeta"
                                    value={nuevaTarjeta.titular}
                                    error={errores.titular}
                                    onChange={(v) => handleChange("titular", v)}
                                    onBlur={() => handleBlur("titular")}
                                />
                                <CampoTarjeta
                                    label="Vencimiento"
                                    type="month"
                                    min={new Date().toISOString().slice(0, 7)}
                                    value={nuevaTarjeta.fechaVencimiento}
                                    error={errores.fechaVencimiento}
                                    onChange={(v) => handleChange("fechaVencimiento", v)}
                                    onBlur={() => handleBlur("fechaVencimiento")}
                                />
                                <CampoTarjeta
                                    label="CVV"
                                    placeholder="•••"
                                    type="password"
                                    maxLength={4}
                                    value={nuevaTarjeta.cvv}
                                    error={errores.cvv}
                                    onChange={(v) => handleChange("cvv", v.replace(/\D/g, ""))}
                                    onBlur={() => handleBlur("cvv")}
                                />
                            </div>
                        </div>
                    )}
                </>
            )}

            {/* CVV sólo cuando se usa tarjeta guardada; la nueva tarjeta ya lo incluye en su form */}
            {!mostrarFormNueva && (
                <div style={{ ...s.fechaGrupo, marginTop: 12, maxWidth: 160 }}>
                    <label style={s.fechaLabel}>CVV</label>
                    <input
                        style={s.fechaInput}
                        type="password"
                        placeholder="•••"
                        maxLength={3}
                        value={cvv}
                        onChange={(e) => onChangeCvv(e.target.value.replace(/\D/g, ""))}
                    />
                </div>
            )}

            {noDisponible && (
                <div style={s.alertaRoja}>
                    El vehículo ya no está disponible para las fechas seleccionadas.
                </div>
            )}
            {error && <p style={s.errorMsg}>{error}</p>}

            <div style={s.footer}>
                <button style={s.btnGris} onClick={onRegresar} disabled={cargando}>← Regresar</button>
                <button
                    style={{ ...s.btnVerde, opacity: (!puedeConfirmarFinal || cargando) ? 0.5 : 1, cursor: (!puedeConfirmarFinal || cargando) ? "not-allowed" : "pointer" }}
                    disabled={!puedeConfirmarFinal || cargando}
                    onClick={onConfirmar}
                >
                    {cargando ? "Procesando…" : "Confirmar reserva"}
                </button>
            </div>
        </div>
    )
}

function CampoTarjeta({ label, placeholder, maxLength, type = "text", min, value, error, onChange, onBlur }) {
    return (
        <div style={s.fechaGrupo}>
            <label style={s.fechaLabel}>{label}</label>
            <input
                style={{ ...s.fechaInput, borderColor: error ? "#ef4444" : "#d1d5db" }}
                type={type}
                placeholder={placeholder}
                maxLength={maxLength}
                min={min}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                onBlur={onBlur}
            />
            {error && <span style={s.campoError}>{error}</span>}
        </div>
    )
}

function Dato({ etiqueta, valor }) {
    return (
        <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <span style={{ fontSize: 11, fontWeight: 600, color: "#6b7280", textTransform: "uppercase", letterSpacing: 0.5 }}>
                {etiqueta}
            </span>
            <span style={{ fontSize: 14, color: "#111827", fontWeight: 500 }}>
                {valor ?? "—"}
            </span>
        </div>
    )
}

function toStr(v) {
    if (v == null) return "—"
    if (typeof v === "object") return v.nombre ?? v.descripcion ?? v.id ?? "—"
    return String(v)
}

function ResumenDato({ label, valor }) {
    return (
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, color: "#374151" }}>
            <span style={{ color: "#6b7280" }}>{label}</span>
            <span style={{ fontWeight: 500 }}>{toStr(valor)}</span>
        </div>
    )
}

const s = {
    overlay: {
        position: "fixed", inset: 0,
        background: "rgba(0,0,0,0.45)",
        display: "flex", alignItems: "center", justifyContent: "center",
        zIndex: 1003,
        padding: 16,
    },
    modal: {
        background: "#fff",
        borderRadius: 16,
        width: "100%",
        maxWidth: 780,
        maxHeight: "90vh",
        overflowY: "auto",
        boxShadow: "0 20px 60px rgba(0,0,0,0.2)",
        display: "flex",
        flexDirection: "column",
    },
    header: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-start",
        padding: "20px 24px 16px",
        borderBottom: "1px solid #e5e7eb",
        position: "sticky",
        top: 0,
        background: "#fff",
        zIndex: 1,
    },
    headerMarca: {
        margin: 0, fontSize: 12, fontWeight: 600,
        color: "#6b7280", textTransform: "uppercase", letterSpacing: 1,
    },
    headerModelo: {
        margin: "4px 0 0", fontSize: 22, fontWeight: 700, color: "#111827",
    },
    btnX: {
        background: "none", border: "none",
        fontSize: 18, color: "#9ca3af", cursor: "pointer", padding: 4,
    },
    loading: {
        padding: 48, textAlign: "center", color: "#6b7280", fontSize: 14,
    },
    exitoBox: {
        display: "flex", flexDirection: "column", alignItems: "center",
        justifyContent: "center", padding: "48px 24px", gap: 12,
    },
    exitoIcon: {
        width: 64, height: 64, borderRadius: "50%",
        background: "#dcfce7", color: "#16a34a",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: 32, fontWeight: 700,
    },
    exitoTitulo: {
        margin: 0, fontSize: 20, fontWeight: 700, color: "#111827",
    },
    exitoSub: {
        margin: 0, fontSize: 14, color: "#6b7280",
    },
    content: {
        display: "flex",
        flexDirection: "column",
    },
    gallery: {
        padding: "16px 24px 0",
    },
    thumb: {
        width: 72, height: 52,
        objectFit: "cover",
        borderRadius: 6,
        cursor: "pointer",
        border: "2px solid transparent",
        flexShrink: 0,
    },
    thumbActiva: {
        border: "2px solid #2563eb",
    },
    info: {
        padding: "20px 24px 24px",
        display: "flex",
        flexDirection: "column",
        gap: 20,
    },
    infoGrid: {
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))",
        gap: "16px 24px",
    },
    pasoBox: {
        borderTop: "1px solid #e5e7eb",
        paddingTop: 16,
        display: "flex",
        flexDirection: "column",
        gap: 12,
    },
    pasoTitulo: {
        margin: 0, fontSize: 13, fontWeight: 700,
        color: "#374151", textTransform: "uppercase", letterSpacing: 0.5,
    },
    fechasGrid: {
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: 12,
    },
    fechaGrupo: {
        display: "flex",
        flexDirection: "column",
        gap: 4,
    },
    fechaLabel: {
        fontSize: 11, fontWeight: 600,
        color: "#6b7280", textTransform: "uppercase", letterSpacing: 0.5,
    },
    fechaInput: {
        padding: "8px 12px",
        border: "1px solid #d1d5db",
        borderRadius: 8,
        fontSize: 14,
        color: "#111827",
        outline: "none",
        background: "#fff",
    },
    footer: {
        display: "flex",
        gap: 10,
        justifyContent: "flex-end",
        paddingTop: 8,
    },
    btnVerde: {
        padding: "10px 24px",
        background: "#16a34a",
        color: "#fff",
        border: "none",
        borderRadius: 8,
        fontWeight: 600,
        fontSize: 14,
        cursor: "pointer",
        transition: "opacity 0.15s",
    },
    btnGris: {
        padding: "10px 20px",
        background: "#f3f4f6",
        color: "#374151",
        border: "none",
        borderRadius: 8,
        fontWeight: 600,
        fontSize: 14,
        cursor: "pointer",
    },
    resumenCard: {
        background: "#f8fafc",
        border: "1px solid #e2e8f0",
        borderRadius: 10,
        padding: "14px 16px",
        display: "flex",
        flexDirection: "column",
        gap: 8,
    },
    resumenGrid: {
        display: "flex",
        flexDirection: "column",
        gap: 6,
    },
    resumenTotal: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        borderTop: "1px solid #e2e8f0",
        paddingTop: 8,
        marginTop: 4,
    },
    tarjetaRow: {
        display: "flex",
        alignItems: "center",
        gap: 12,
        padding: "10px 14px",
        borderRadius: 8,
        cursor: "pointer",
        marginBottom: 4,
    },
    tarjetaInfo: {
        display: "flex",
        flexDirection: "column",
        gap: 2,
        fontSize: 14,
    },
    tarjetaSub: {
        fontSize: 12,
        color: "#6b7280",
    },
    btnAgregar: {
        background: "none",
        border: "1.5px dashed #d1d5db",
        borderRadius: 8,
        padding: "8px 14px",
        fontSize: 13,
        color: "#2563eb",
        cursor: "pointer",
        fontWeight: 500,
        textAlign: "left",
    },
    formNueva: {
        background: "#f8fafc",
        border: "1px solid #e2e8f0",
        borderRadius: 10,
        padding: "14px 16px",
    },
    alertaRoja: {
        background: "#fef2f2",
        border: "1px solid #fecaca",
        color: "#dc2626",
        borderRadius: 8,
        padding: "10px 14px",
        fontSize: 13,
        fontWeight: 500,
    },
    errorMsg: {
        margin: 0,
        fontSize: 13,
        color: "#dc2626",
    },
    msgGris: {
        margin: 0,
        fontSize: 13,
        color: "#6b7280",
    },
    campoError: {
        fontSize: 11,
        color: "#ef4444",
        marginTop: 2,
    },
}
