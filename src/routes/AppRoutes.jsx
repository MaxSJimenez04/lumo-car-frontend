import {Routes, Route} from "react-router-dom"
import LoginView from "../pages/LoginView"
import ResetPasswordView from "../pages/ResetPasswordView"
import DashboardView from "../pages/DashboardView"
import CrearCuentaClienteView from "../pages/CrearCuentaClienteView"

function AppRoutes() {
    return (
        <Routes>
            <Route path="/login" element={<LoginView/>}/>
            <Route path="/reset-password" element={<ResetPasswordView/>}/>
            <Route path="/dashboard" element={<DashboardView/>}/>
            <Route path="/registro" element={<CrearCuentaClienteView/>}/>
        </Routes>
    )
}

export default AppRoutes