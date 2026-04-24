import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Dashboard      from './pages/Dashboard'
import Consommations  from './pages/Consommations'
import Statistiques   from './pages/Statistiques'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/"               element={<Dashboard />}     />
        <Route path="/consommations"  element={<Consommations />} />
        <Route path="/statistiques"   element={<Statistiques />}  />
        <Route path="*"               element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
