import { useState } from 'react'
import { BrowserRouter } from 'react-router-dom'
import './utils/style.css'
import LoginView from './pages/LoginView'
import AppRoutes from './routes/AppRoutes'

function App() {
  const [count, setCount] = useState(0)

  return (
    <BrowserRouter>
      <AppRoutes/>
    </BrowserRouter>
  )
}

export default App
