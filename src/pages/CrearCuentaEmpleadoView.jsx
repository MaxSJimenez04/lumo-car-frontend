import RegistroCard from "../components/crear-cuenta/RegistroCard"
import RegistroEmpleadoForm from "../components/crear-cuenta/RegistroEmpleadoForm"

export default function CrearCuentaEmpleadoView() {
    return (
        <>
            <RegistroCard
                title="Registrar Empleado"
                subtitle="Por favor completa este formulario"
            >
                <RegistroEmpleadoForm idRol={2}/>
            </RegistroCard>
        </>
    )
}