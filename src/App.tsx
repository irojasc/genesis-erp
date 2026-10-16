import './App.css'
// import { LoginPage } from './features/auth/pages/LoginPage'
import { HashRouter } from 'react-router-dom'
import { AppRoutes } from './routes/AppRoutes'

function App() {
  return (
    <HashRouter>
      <AppRoutes />
    </HashRouter>
  )
}

export default App

// // <LoginPage />
