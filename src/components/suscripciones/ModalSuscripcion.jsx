import React, { useState, useEffect } from "react"
import { suscripcionesService } from "../../services/suscripciones.service"
import { obtenerTarjetas } from "../../services/tarjetas.service"

export default function ModalSuscripcion({ plan, onCerrar, onExito, esCambio }) {
    const [cargando, setCargando] = useState(false)
    const [error, setError] = useState(null)
    
    const [tipoPago, setTipoPago] = useState("guardada")
    const [tarjetaSeleccionada, setTarjetaSeleccionada] = useState("")
    
    const [tarjetasGuardadas, setTarjetasGuardadas] = useState([])
    
    const [nuevaTarjeta, setNuevaTarjeta] = useState({
        titular: "",
        numero: "",
        expiracion: "",
        cvv: ""
    })

    useEffect(() => {
        obtenerTarjetas()
            .then((data) => {
                setTarjetasGuardadas(data || [])
            })
            .catch((err) => console.error("No se pudieron cargar las tarjetas:", err))
    }, [])

    const handleInputChange = (e) => {
        let { name, value } = e.target

        if (name === "numero") {
            const soloNumeros = value.replace(/\D/g, "")
            value = soloNumeros.replace(/(\d{4})(?=\d)/g, "$1 ")
        }
        
        if (name === "expiracion") {
            const soloNumeros = value.replace(/\D/g, "")
            if (soloNumeros.length >= 3) {
                value = `${soloNumeros.slice(0, 2)}/${soloNumeros.slice(2, 4)}`
            } else {
                value = soloNumeros
            }
        }

        setNuevaTarjeta(prev => ({ ...prev, [name]: value }))
    }

    const handleSuscribirse = async () => {
    if (tipoPago === "guardada" && !tarjetaSeleccionada) {
        setError("Por favor, selecciona una tarjeta guardada.");
        return;
    }

    if (tipoPago === "nueva") {
        if (!nuevaTarjeta.titular || !nuevaTarjeta.numero || !nuevaTarjeta.expiracion || !nuevaTarjeta.cvv) {
            setError("Por favor, completa todos los campos de la nueva tarjeta.");
            return;
        }
    }

    setCargando(true);
    setError(null);
    
    try {
        const datosPago = tipoPago === "guardada" 
            ? { idTarjeta: tarjetaSeleccionada } 
            : { 
                titular: nuevaTarjeta.titular,
                numeroTarjeta: nuevaTarjeta.numero.replace(/\s/g, ""), 
                fechaVencimiento: nuevaTarjeta.expiracion,
                cvv: nuevaTarjeta.cvv
            };

        if (esCambio) {
            const payload = {
                nuevoIdSuscripcion: plan.idSuscripcion || plan.id,
                idTarjetaExistente: tipoPago === "guardada" ? tarjetaSeleccionada : null,
                cvv: tipoPago === "nueva" ? nuevaTarjeta.cvv : null,
                ...datosPago
            };
            
            await suscripcionesService.cambiarPlan(payload);
            alert("¡Cambio de plan realizado con éxito!");
        } else {
            await suscripcionesService.suscribirseAlPlan(
                plan.idSuscripcion || plan.id, 
                datosPago
            );
            alert("¡Suscripción realizada con éxito!");
        }
        
        if (onExito) onExito();
        onCerrar();
        
    } catch (err) {
        console.error("Error detallado:", err);
        setError("No se pudo procesar la solicitud. Verifica tus datos.");
    } finally {
        setCargando(false);
    }
}

    return (
        <div style={styles.overlay}>
            <div style={styles.modal}>
                <h2 style={styles.title}>{esCambio ? "Confirmar Cambio de Plan" : "Confirmar Suscripción"}</h2>
                <p style={styles.text}>Estás a punto de {esCambio ? "cambiarte" : "suscribirte"} al plan <strong>{plan.nombre}</strong></p>
                
                <div style={styles.opcionesPago}>
                    <label style={styles.radioLabel}>
                        <input 
                            type="radio" 
                            checked={tipoPago === "guardada"} 
                            onChange={() => { setTipoPago("guardada"); setError(null); }}
                        />
                        Usar tarjeta guardada
                    </label>
                    <label style={styles.radioLabel}>
                        <input 
                            type="radio" 
                            checked={tipoPago === "nueva"} 
                            onChange={() => { setTipoPago("nueva"); setError(null); }}
                        />
                        Agregar nueva tarjeta
                    </label>
                </div>

                {tipoPago === "guardada" && (
                    <div style={styles.inputGroup}>
                        <label style={styles.label}>Mis Tarjetas</label>
                        <select 
                            style={styles.select} 
                            value={tarjetaSeleccionada} 
                            onChange={(e) => setTarjetaSeleccionada(e.target.value)}
                            disabled={cargando}
                        >
                            <option value="">Selecciona una tarjeta...</option>
                            {tarjetasGuardadas.map((tarjeta) => (
                                <option 
                                    key={tarjeta.id || tarjeta.idTarjeta} 
                                    value={tarjeta.id || tarjeta.idTarjeta}
                                >
                                    {tarjeta.titular} - Terminación {tarjeta.numeroTarjeta?.slice(-4) || '****'}
                                </option>
                            ))}
                        </select>
                    </div>
                )}

                {tipoPago === "nueva" && (
                    <div style={styles.formGrid}>
                        <div style={{ ...styles.inputGroup, gridColumn: "span 2" }}>
                            <label style={styles.label}>Nombre del Titular</label>
                            <input 
                                style={styles.input} 
                                type="text" 
                                name="titular"
                                placeholder="Ej. Juan Pérez"
                                value={nuevaTarjeta.titular}
                                onChange={handleInputChange}
                                disabled={cargando}
                            />
                        </div>
                        <div style={{ ...styles.inputGroup, gridColumn: "span 2" }}>
                            <label style={styles.label}>Número de Tarjeta</label>
                            <input 
                                style={styles.input} 
                                type="text" 
                                name="numero"
                                placeholder="0000 0000 0000 0000"
                                maxLength="19"
                                value={nuevaTarjeta.numero}
                                onChange={handleInputChange}
                                disabled={cargando}
                            />
                        </div>
                        <div style={styles.inputGroup}>
                            <label style={styles.label}>Expiración</label>
                            <input 
                                style={styles.input} 
                                type="text" 
                                name="expiracion"
                                placeholder="MM/YY"
                                maxLength="5"
                                value={nuevaTarjeta.expiracion}
                                onChange={handleInputChange}
                                disabled={cargando}
                            />
                        </div>
                        <div style={styles.inputGroup}>
                            <label style={styles.label}>CVV</label>
                            <input 
                                style={styles.input} 
                                type="password" 
                                name="cvv"
                                placeholder="123"
                                maxLength="4"
                                value={nuevaTarjeta.cvv}
                                onChange={handleInputChange}
                                disabled={cargando}
                            />
                        </div>
                    </div>
                )}

                {error && <p style={styles.error}>{error}</p>}

                <div style={styles.actions}>
                    <button style={styles.btnCancelar} onClick={onCerrar} disabled={cargando}>
                        Cancelar
                    </button>
                    <button style={styles.btnConfirmar} onClick={handleSuscribirse} disabled={cargando}>
                        {cargando ? "Procesando..." : esCambio ? `Confirmar Cambio ($${plan.precio})` : `Pagar $${plan.precio}`}
                    </button>
                </div>
            </div>
        </div>
    )
}

const styles = {
    overlay: {
        position: "fixed",
        top: 0, left: 0, right: 0, bottom: 0,
        background: "rgba(0,0,0,0.5)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
    },
    modal: {
        background: "#fff",
        padding: "24px",
        borderRadius: 12,
        width: "90%",
        maxWidth: 420,
        boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)",
    },
    title: { margin: "0 0 8px 0", fontSize: 20, color: "#1f2937" },
    text: { margin: "0 0 20px 0", color: "#6b7280", fontSize: 14 },
    opcionesPago: {
        display: "flex",
        gap: "16px",
        marginBottom: "20px",
        paddingBottom: "16px",
        borderBottom: "1px solid #e5e7eb"
    },
    radioLabel: {
        display: "flex",
        alignItems: "center",
        gap: "6px",
        fontSize: "14px",
        color: "#374151",
        cursor: "pointer",
        fontWeight: 500
    },
    formGrid: {
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: "12px",
        marginBottom: "20px"
    },
    inputGroup: { 
        display: 'flex', 
        flexDirection: 'column', 
        gap: 6,
        marginBottom: 16
    },
    label: { 
        fontSize: 13, 
        fontWeight: 600, 
        color: "#374151" 
    },
    select: { 
        padding: "10px", 
        borderRadius: 6, 
        border: "1px solid #d1d5db",
        fontSize: 14,
        background: "#fff",
        color: "#111827",
        cursor: "pointer"
    },
    input: {
        padding: "10px", 
        borderRadius: 6, 
        border: "1px solid #d1d5db",
        fontSize: 14,
        background: "#fff",
        color: "#111827",
        width: "100%",
        boxSizing: "border-box"
    },
    error: { color: "#dc2626", marginBottom: 16, fontSize: 13, fontWeight: 500 },
    actions: { display: "flex", gap: 10, justifyContent: "flex-end", marginTop: 20 },
    btnCancelar: { padding: "10px 16px", border: "1px solid #d1d5db", background: "#fff", borderRadius: 6, cursor: "pointer", color: "#374151", fontWeight: 500 },
    btnConfirmar: { padding: "10px 16px", background: "#10b981", color: "#fff", border: "none", borderRadius: 6, cursor: "pointer", fontWeight: 600 }
}