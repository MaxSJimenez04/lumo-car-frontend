import {Routes, Route} from "react-router-dom"
import LoginView from "../pages/LoginView"

function AppRoutes() {
    return (
        <Routes>
            <Route path="/login" element={<LoginView/>}/>
        </Routes>
    )
}

export default AppRoutes