import {Routes, Route} from "react-router-dom"
import LoginView from "../pages/LoginView"
import ResetPasswordView from "../pages/ResetPasswordView"
import DashboardView from "../pages/DashboardView"
import CrearCuentaClienteView from "../pages/CrearCuentaClienteView"
import PerfilView from "../pages/PerfilView"
import MainLayout from "../routes/MainLayout"
import EmpleadosView from "../pages/EmpleadosView"
import CrearCuentaEmpleadoView from "../pages/CrearCuentaEmpleadoView"
import VehiculosView from "../pages/VehiculosView"
import SucursalesView from "../pages/SucursalesView"

function AppRoutes() {
    return (
        <Routes>
            {/*AQUI VAN LAS RUTAS QUE NO NECESITAN EL HEADER NI EL FOOTER EN LA VISTA*/}
            <Route path="/login" element={<LoginView/>}/>
            <Route path="/reset-password" element={<ResetPasswordView/>}/>
            <Route path="/registro" element={<CrearCuentaClienteView/>}/>

            {/*AQUI VAN TODAS LAS RUTAS QUE SI TIENEN EL HEADER Y FOOTER*/}
            <Route element={<MainLayout/>}>
                <Route path="/dashboard" element={<DashboardView/>}/>
                <Route path="/perfil" element={<PerfilView/>}/>
                <Route path="/empleados" element={<EmpleadosView/>}/>
                <Route path="/empleados/nuevo" element={<CrearCuentaEmpleadoView/>}/>
                <Route path="/vehiculos" element={<VehiculosView/>}/>
                <Route path="/sucursales" element={<SucursalesView/>}/>
            </Route>

        </Routes>
    )
}

export default AppRoutes