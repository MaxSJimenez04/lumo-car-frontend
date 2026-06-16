import { useEffect, useRef, useState } from 'react'
import { registrarVehiculo, registrarColor, consultarColores, asociarFotoPrincipal, asociarFotoSecundaria } from '../../services/vehiculos.service'
import { subirFotoVehiculo } from '../../services/archivos.service'
import {consultaGeneralSucursales} from '../../services/sucursales.service'
import {consultarMarcas} from '../../services/marcas.service'
import api from '../../api/axiosClient'

const TRANSMISION = [
    { value: true, label: 'Automático' },
    { value: false, label: 'Manual' },
]

const TAMANOS = [
    { value: 'A', label: 'A – Micro' },
    { value: 'B', label: 'B – Subcompacto' },
    { value: 'C', label: 'C – Compacto' },
    { value: 'D', label: 'D – Mediano' },
    { value: 'E', label: 'E – Grande' },
    { value: 'F', label: 'F – Premium' },
    { value: 'S', label: 'S – SUV / Especial' },
]

const COMBUSTIBLES = [
    { value: 0, label: 'Gasolina' },
    { value: 1, label: 'Eléctrico' },
    { value: 2, label: 'Híbrido' },
]

const INITIAL_FORM = {
    placa: '',
    modelo: '',
    pasajeros: '',
    transmision: '',
    tamano: '',
    tipo_combustible: '',
    aireAcondicionado: '',
    idColor: '',
    idMarca: '',
    idSucursal: '',
}

export default function VehiculoForm({ onGuardado }) {
    const [form, setForm] = useState(INITIAL_FORM)
    const [colores, setColores] = useState([])
    const [marcas, setMarcas] = useState([])
    const [sucursales,setSucursales] = useState([])
    const [fotoPrincipal, setFotoPrincipal] = useState(null)
    const [previewPrincipal, setPreviewPrincipal] = useState(null)
    const [fotosSecundarias, setFotosSecundarias] = useState([])
    const [previewsSecundarias, setPreviewsSecundarias] = useState([])
    const [cargando, setCargando] = useState(false)
    const [error, setError] = useState(null)
    const [exito, setExito] = useState(false)

    const refFotoPrincipal = useRef(null)
    const refFotosSecundarias = useRef(null)

    useEffect(() => {
        consultarColores()
            .then(setColores)
            .catch(() => setColores([]))

         consultarMarcas()
            .then(setMarcas)
            .catch(() => setMarcas([]))

        consultaGeneralSucursales()
        .then(setSucursales)
        .catch(() => setSucursales([]))
    }, [])

    const handleChange = (e) => {
        const { name, value } = e.target
        setForm(prev => ({ ...prev, [name]: value }))
    }

    const handleFotoPrincipal = (e) => {
        const file = e.target.files[0]
        if (!file) return
        setFotoPrincipal(file)
        setPreviewPrincipal(URL.createObjectURL(file))
    }

    const handleFotosSecundarias = (e) => {
        const archivos = Array.from(e.target.files)
        const disponibles = 5 - fotosSecundarias.length
        const nuevos = archivos.slice(0, disponibles)
        setFotosSecundarias(prev => [...prev, ...nuevos])
        setPreviewsSecundarias(prev => [...prev, ...nuevos.map(f => URL.createObjectURL(f))])
    }

    const eliminarSecundaria = (idx) => {
        setFotosSecundarias(prev => prev.filter((_, i) => i !== idx))
        setPreviewsSecundarias(prev => prev.filter((_, i) => i !== idx))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError(null)
        setCargando(true)

        try {
            const payload = {
                ...form,
                pasajeros: Number(form.pasajeros),
                transmision: form.transmision === 'true',
                tipo_combustible: Number(form.tipo_combustible),
                aireAcondicionado: form.aireAcondicionado === 'true',
                idColor: Number(form.idColor),
                idMarca: Number(form.idMarca),
                idSucursal: Number(form.idSucursal),
            }

            const vehiculo = await registrarVehiculo(payload)
            const idVehiculo = vehiculo.id

            if (fotoPrincipal) {
                const formData = new FormData()
                formData.append('file', fotoPrincipal)

                let archivoResp
                try {
                    archivoResp = await subirFotoVehiculo(formData)
                } catch (uploadErr) {
                    throw new Error('Error al subir la foto principal: ' + (uploadErr?.response?.data?.mensaje || uploadErr.message))
                }

                // Verificar que se obtuvo el ID antes de asociar
                const idArchivo = archivoResp?.detalles?.id
                if (!idArchivo) throw new Error('No se recibió el ID del archivo subido')

                await asociarFotoPrincipal(idVehiculo, idArchivo)  // desde vehiculos.service
            }

            for (const foto of fotosSecundarias) {
                const formData = new FormData()
                formData.append('file', foto)
                const archivoResp = await subirFotoVehiculo(formData)
                const idArchivo = archivoResp?.detalles?.id
                if (idArchivo) {
                    await asociarFotoSecundaria(idVehiculo, idArchivo)  // desde vehiculos.service
                }
            }

            setExito(true)
            setForm(INITIAL_FORM)
            setFotoPrincipal(null)
            setPreviewPrincipal(null)
            setFotosSecundarias([])
            setPreviewsSecundarias([])

            if (onGuardado) onGuardado(vehiculo)
        } catch (err) {
            setError(
                err?.response?.data?.mensaje ||
                err?.response?.data?.errores?.[0]?.msg ||
                err?.message ||
                'Ocurrió un error al registrar el vehículo.'
            )
        } finally {
            setCargando(false)
        }
    }

    return (
        <div className="form-vehiculo-wrapper">
            <h2 className="form-titulo">Registrar vehículo</h2>

            {exito && (
                <div className="alerta alerta-exito">
                    <span>✓</span> Vehículo registrado correctamente.
                </div>
            )}
            {error && (
                <div className="alerta alerta-error">
                    <span>✕</span> {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="form-vehiculo">

                {/* ── Datos básicos ── */}
                <section className="seccion">
                    <h3 className="seccion-titulo">Datos del vehículo</h3>

                    <div className="grid-2">
                        <div className="campo">
                            <label htmlFor="placa">Placa</label>
                            <input
                                id="placa"
                                name="placa"
                                type="text"
                                maxLength={9}
                                placeholder="AAA-000-0"
                                value={form.placa}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="campo">
                            <label htmlFor="modelo">Modelo / Año</label>
                            <input
                                id="modelo"
                                name="modelo"
                                type="text"
                                placeholder="Ej. Toyota Corolla 2023"
                                value={form.modelo}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>

                    <div className="grid-3">
                        <div className="campo">
                            <label htmlFor="pasajeros">Capacidad de pasajeros</label>
                            <input
                                id="pasajeros"
                                name="pasajeros"
                                type="number"
                                min={1}
                                placeholder="5"
                                value={form.pasajeros}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="campo">
                            <label htmlFor="transmision">Transmisión</label>
                            <select
                                id="transmision"
                                name="transmision"
                                value={form.transmision}
                                onChange={handleChange}
                                required
                            >
                                <option value="">Seleccionar…</option>
                                {TRANSMISION.map(t => (
                                    <option key={String(t.value)} value={String(t.value)}>
                                        {t.label}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="campo">
                            <label htmlFor="aireAcondicionado">Aire acondicionado</label>
                            <select
                                id="aireAcondicionado"
                                name="aireAcondicionado"
                                value={form.aireAcondicionado}
                                onChange={handleChange}
                                required
                            >
                                <option value="">Seleccionar…</option>
                                <option value="true">Sí</option>
                                <option value="false">No</option>
                            </select>
                        </div>
                    </div>

                    <div className="grid-2">
                        <div className="campo">
                            <label htmlFor="tamano">Tamaño</label>
                            <select
                                id="tamano"
                                name="tamano"
                                value={form.tamano}
                                onChange={handleChange}
                                required
                            >
                                <option value="">Seleccionar…</option>
                                {TAMANOS.map(t => (
                                    <option key={t.value} value={t.value}>{t.label}</option>
                                ))}
                            </select>
                        </div>

                        <div className="campo">
                            <label htmlFor="tipo_combustible">Tipo de combustible</label>
                            <select
                                id="tipo_combustible"
                                name="tipo_combustible"
                                value={form.tipo_combustible}
                                onChange={handleChange}
                                required
                            >
                                <option value="">Seleccionar…</option>
                                {COMBUSTIBLES.map(c => (
                                    <option key={c.value} value={c.value}>{c.label}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                </section>

                {/* ── Clasificación ── */}
                <section className="seccion">
                    <h3 className="seccion-titulo">Clasificación</h3>

                    <div className="grid-3">
                        <div className="campo">
                            <label htmlFor="idMarca">Marca</label>
                            <select
                                id="idMarca"
                                name="idMarca"
                                value={form.idMarca}
                                onChange={handleChange}
                                required
                            >
                                <option value="">Seleccionar…</option>
                                {marcas.map(m => (
                                    <option key={m.id} value={m.id}>{m.nombreMarca}</option>
                                ))}
                            </select>
                        </div>

                        <div className="campo">
                            <label htmlFor="idColor">Color</label>
                            <select
                                id="idColor"
                                name="idColor"
                                value={form.idColor}
                                onChange={handleChange}
                                required
                            >
                                <option value="">Seleccionar…</option>
                                {colores.map(c => (
                                    <option key={c.id} value={c.id}>
                                        {c.color}
                                    </option>
                                ))}
                            </select>
                            {form.idColor && (() => {
                                const c = colores.find(c => String(c.id) === String(form.idColor))
                                return c ? (
                                    <span
                                        className="muestra-color"
                                        style={{ background: c.codigoHex }}
                                        title={c.codigoHex}
                                    />
                                ) : null
                            })()}
                        </div>

                        <div className="campo">
                            <label htmlFor="idSucursal">Sucursal</label>
                            <select
                                id="idSucursal"
                                name="idSucursal"
                                value={form.idSucursal}
                                onChange={handleChange}
                                required
                            >
                                <option value="">Seleccionar…</option>
                                {sucursales.map(s => (
                                    <option key={s.id} value={s.id}>{s.nombre}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                </section>

                {/* ── Foto principal ── */}
                <section className="seccion">
                    <h3 className="seccion-titulo">Foto principal</h3>

                    <div className="zona-foto-principal">
                        {previewPrincipal ? (
                            <div className="preview-principal-wrapper">
                                <img
                                    src={previewPrincipal}
                                    alt="Vista previa foto principal"
                                    className="preview-principal"
                                />
                                <button
                                    type="button"
                                    className="btn-quitar-foto"
                                    onClick={() => {
                                        setFotoPrincipal(null)
                                        setPreviewPrincipal(null)
                                        refFotoPrincipal.current.value = ''
                                    }}
                                >
                                    ✕ Quitar foto
                                </button>
                            </div>
                        ) : (
                            <button
                                type="button"
                                className="zona-subir"
                                onClick={() => refFotoPrincipal.current.click()}
                            >
                                <span className="icono-subir">↑</span>
                                <span>Seleccionar foto principal</span>
                                <span className="hint">JPG, PNG o WEBP</span>
                            </button>
                        )}
                        <input
                            ref={refFotoPrincipal}
                            type="file"
                            accept="image/jpeg,image/png,image/webp"
                            style={{ display: 'none' }}
                            onChange={handleFotoPrincipal}
                        />
                    </div>
                </section>

                {/* ── Fotos secundarias ── */}
                <section className="seccion">
                    <h3 className="seccion-titulo">
                        Fotos secundarias
                        <span className="contador-fotos">{fotosSecundarias.length} / 5</span>
                    </h3>

                    <div className="grid-fotos-secundarias">
                        {previewsSecundarias.map((src, idx) => (
                            <div key={idx} className="thumb-secundaria">
                                <img src={src} alt={`Foto secundaria ${idx + 1}`} />
                                <button
                                    type="button"
                                    className="btn-quitar-thumb"
                                    onClick={() => eliminarSecundaria(idx)}
                                    aria-label={`Eliminar foto ${idx + 1}`}
                                >
                                    ✕
                                </button>
                            </div>
                        ))}

                        {fotosSecundarias.length < 5 && (
                            <button
                                type="button"
                                className="thumb-agregar"
                                onClick={() => refFotosSecundarias.current.click()}
                            >
                                <span style={{ fontSize: 24 }}>+</span>
                                <span style={{ fontSize: 12 }}>Agregar</span>
                            </button>
                        )}
                    </div>

                    <input
                        ref={refFotosSecundarias}
                        type="file"
                        accept="image/jpeg,image/png,image/webp"
                        multiple
                        style={{ display: 'none' }}
                        onChange={handleFotosSecundarias}
                    />
                </section>

                {/* ── Acciones ── */}
                <div className="acciones">
                    <button
                        type="button"
                        className="btn btn-secundario"
                        onClick={() => {
                            setForm(INITIAL_FORM)
                            setFotoPrincipal(null)
                            setPreviewPrincipal(null)
                            setFotosSecundarias([])
                            setPreviewsSecundarias([])
                            setError(null)
                            setExito(false)
                        }}
                    >
                        Limpiar
                    </button>
                    <button
                        type="submit"
                        className="btn btn-primario"
                        disabled={cargando}
                    >
                        {cargando ? 'Registrando…' : 'Registrar vehículo'}
                    </button>
                </div>
            </form>

            <style>{`
                .form-vehiculo-wrapper {
                    max-width: 780px;
                    margin: 0 auto;
                    padding: 2rem 1.5rem;
                    font-family: sans-serif;
                    color: #1a1a1a;
                }
                .form-titulo {
                    font-size: 1.4rem;
                    font-weight: 600;
                    margin: 0 0 1.5rem;
                    padding-bottom: 0.75rem;
                    border-bottom: 1px solid #e5e7eb;
                }
                .alerta {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    padding: 0.75rem 1rem;
                    border-radius: 8px;
                    font-size: 0.9rem;
                    margin-bottom: 1.25rem;
                }
                .alerta-exito { background: #ecfdf5; color: #065f46; border: 1px solid #a7f3d0; }
                .alerta-error { background: #fef2f2; color: #991b1b; border: 1px solid #fecaca; }
                .seccion {
                    background: #ffffff;
                    border: 1px solid #e5e7eb;
                    border-radius: 10px;
                    padding: 1.25rem 1.5rem;
                    margin-bottom: 1.25rem;
                }
                .seccion-titulo {
                    font-size: 0.85rem;
                    font-weight: 600;
                    text-transform: uppercase;
                    letter-spacing: 0.05em;
                    color: #6b7280;
                    margin: 0 0 1rem;
                    display: flex;
                    align-items: center;
                    gap: 8px;
                }
                .contador-fotos {
                    font-size: 0.75rem;
                    background: #f3f4f6;
                    color: #374151;
                    padding: 2px 8px;
                    border-radius: 99px;
                    font-weight: 500;
                    letter-spacing: 0;
                    text-transform: none;
                }
                .grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 1rem; }
                .grid-3 { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 1rem; margin-bottom: 1rem; }
                @media (max-width: 600px) {
                    .grid-2, .grid-3 { grid-template-columns: 1fr; }
                }
                .campo {
                    display: flex;
                    flex-direction: column;
                    gap: 4px;
                    position: relative;
                }
                .campo label {
                    font-size: 0.8rem;
                    font-weight: 500;
                    color: #374151;
                }
                .campo input,
                .campo select {
                    height: 38px;
                    padding: 0 10px;
                    border: 1px solid #d1d5db;
                    border-radius: 6px;
                    font-size: 0.9rem;
                    background: #f9fafb;
                    color: #111827;
                    transition: border-color 0.15s;
                }
                .campo input:focus,
                .campo select:focus {
                    outline: none;
                    border-color: #6366f1;
                    background: #fff;
                }
                .muestra-color {
                    display: inline-block;
                    width: 18px;
                    height: 18px;
                    border-radius: 50%;
                    border: 1px solid #d1d5db;
                    margin-top: 4px;
                    align-self: flex-start;
                }
                .zona-foto-principal { display: flex; flex-direction: column; align-items: center; }
                .zona-subir {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 6px;
                    width: 100%;
                    padding: 2rem;
                    border: 2px dashed #d1d5db;
                    border-radius: 10px;
                    background: #f9fafb;
                    color: #6b7280;
                    font-size: 0.9rem;
                    cursor: pointer;
                    transition: border-color 0.15s, background 0.15s;
                }
                .zona-subir:hover { border-color: #6366f1; background: #eef2ff; color: #4338ca; }
                .icono-subir { font-size: 1.5rem; }
                .hint { font-size: 0.75rem; color: #9ca3af; }
                .preview-principal-wrapper { display: flex; flex-direction: column; align-items: center; gap: 10px; width: 100%; }
                .preview-principal {
                    width: 100%;
                    max-height: 240px;
                    object-fit: cover;
                    border-radius: 8px;
                    border: 1px solid #e5e7eb;
                }
                .btn-quitar-foto {
                    font-size: 0.8rem;
                    color: #ef4444;
                    background: none;
                    border: 1px solid #fca5a5;
                    border-radius: 6px;
                    padding: 4px 12px;
                    cursor: pointer;
                }
                .btn-quitar-foto:hover { background: #fef2f2; }
                .grid-fotos-secundarias {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(110px, 1fr));
                    gap: 10px;
                }
                .thumb-secundaria {
                    position: relative;
                    aspect-ratio: 1;
                    border-radius: 8px;
                    overflow: hidden;
                    border: 1px solid #e5e7eb;
                }
                .thumb-secundaria img {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                }
                .btn-quitar-thumb {
                    position: absolute;
                    top: 4px;
                    right: 4px;
                    width: 22px;
                    height: 22px;
                    border-radius: 50%;
                    background: rgba(0,0,0,0.55);
                    color: #fff;
                    border: none;
                    font-size: 11px;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    line-height: 1;
                }
                .thumb-agregar {
                    aspect-ratio: 1;
                    border-radius: 8px;
                    border: 2px dashed #d1d5db;
                    background: #f9fafb;
                    color: #9ca3af;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    gap: 4px;
                    cursor: pointer;
                    transition: border-color 0.15s, color 0.15s;
                }
                .thumb-agregar:hover { border-color: #6366f1; color: #4338ca; }
                .acciones {
                    display: flex;
                    justify-content: flex-end;
                    gap: 10px;
                    padding-top: 0.5rem;
                }
                .btn {
                    padding: 0 1.5rem;
                    height: 40px;
                    border-radius: 8px;
                    font-size: 0.9rem;
                    font-weight: 500;
                    cursor: pointer;
                    transition: background 0.15s, opacity 0.15s;
                }
                .btn-primario {
                    background: #4f46e5;
                    color: #fff;
                    border: none;
                }
                .btn-primario:hover { background: #4338ca; }
                .btn-primario:disabled { opacity: 0.6; cursor: not-allowed; }
                .btn-secundario {
                    background: #fff;
                    color: #374151;
                    border: 1px solid #d1d5db;
                }
                .btn-secundario:hover { background: #f3f4f6; }
            `}</style>
        </div>
    )
}