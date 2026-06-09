import {Routes, Route} from "react-router-dom"
import LoginView from "../pages/LoginView"
import ResetPasswordView from "../pages/ResetPasswordView"
import DashboardView from "../pages/DashboardView"
import CrearCuentaClienteView from "../pages/CrearCuentaClienteView"
import PerfilView from "../pages/PerfilView"

function AppRoutes() {
    return (
        <Routes>
            <Route path="/login" element={<LoginView/>}/>
            <Route path="/reset-password" element={<ResetPasswordView/>}/>
            <Route path="/dashboard" element={<DashboardView/>}/>
            <Route path="/registro" element={<CrearCuentaClienteView/>}/>
            <Route path="/perfil" element={<PerfilView/>}/>
        </Routes>
    )
}

export default AppRoutes