import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import GridEmpleados from "../components/empleados/GridEmpleados";
import {consultarEmpleados, eliminar} from "../services/usuarios.service";
import {consultarEstados, consultarCiudades, consultarSucursales} from "../services/sucursales.service";
import Loading from "../components/common/Loading";

export default function EmpleadosView() {

    const navigate = useNavigate();

    const [loading, setLoading] = useState(true);
    const [estados, setEstados] = useState([]);
    const [ciudades, setCiudades] = useState([]);
    const [sucursales, setSucursales] = useState([]);
    const [estado, setEstado] = useState(null);
    const [ciudad, setCiudad] = useState(null);
    const [sucursal, setSucursal] = useState(null);

    useEffect(() => {
        cargarEstados();
    }, []);

    const cargarEstados = async () => {
        try {

            const respuesta = await consultarEstados();

            setEstados(respuesta);

        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!estado) {
            setCiudades([]);
            return;
        }

        cargarCiudades();

    }, [estado]);


    const cargarCiudades = async () => {

        try {
            let idEstado = estado
            const respuesta = await consultarCiudades(idEstado);

            setCiudades(respuesta);

            setCiudad("");
            setSucursal("");
            setSucursales([]);

        } catch (error) {
            console.error(error);
        }

    };

    useEffect(() => {
        
        if (!ciudad) {
            setSucursales([]);
            return;
        }

        cargarSucursales();

    }, [ciudad]);

    const cargarSucursales = async () => {

        try {

            const respuesta = await consultarSucursales(ciudad);

            setSucursales(respuesta.sucursales);

        } catch (error) {
            console.error(error);
        }

    };

    useEffect(() => {
        if (!sucursal) {
            setSucursal(null)
            return;
        }
    })

    const nuevoEmpleado = () => {
        navigate("/empleados/nuevo");
    };

    const eliminarEmpleado = async (idEmpleado) => {

        const confirmar = window.confirm(
            "¿Desea eliminar este empleado?"
        );

        if (!confirmar) return;

        try {

            await eliminar(idEmpleado);

        } catch (error) {
            console.error(error);
            alert("No fue posible eliminar el empleado.");
        }
    };

    if (loading) {
        return <Loading message="Cargando empleados..." fullPage={true} />;
    }

    return (
       <div className="seccion">
            <div className="seccion-filtros">
                <select
                    className="campo"
                    value={estado}
                    onChange={(e) => setEstado(e.target.value)}
                >
                    <option value="">Estado</option>

                    {estados.map(estado => (
                        <option
                            key={estado.id}
                            value={estado.id}
                        >
                            {estado.nombreEstado}
                        </option>
                    ))}
                </select>

                <select
                    className="campo"
                    value={ciudad}
                    onChange={(e) => setCiudad(e.target.value)}
                >
                    <option value="">Ciudad</option>

                    {ciudades.map(ciudad => (
                        <option
                            key={ciudad.id}
                            value={ciudad.id}
                        >
                            {ciudad.nombreCiudad}
                        </option>
                    ))}
                </select>

                <select
                    className="campo"
                    value={sucursal}
                    onChange={(e) => setSucursal(e.target.value)}
                >
                    <option value="">Todas las sucursales</option>

                    {sucursales.map(sucursal => (
                        <option
                            key={sucursal.id}
                            value={sucursal.id}
                        >
                            {sucursal.nombre}
                        </option>
                    ))}
                </select>
            </div>
            

            <GridEmpleados
                idsucursal={sucursal}
                sucursales={sucursales}
                onNuevo={nuevoEmpleado}
                onEliminar={eliminarEmpleado}
            />

        </div>
    );

}