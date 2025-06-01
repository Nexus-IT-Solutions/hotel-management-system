import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { createRoot } from 'react-dom/client'
import './index.css'
import MainLayout from './components/layout/MainLayout.tsx'
import Dashboard from './pages/admin/Dashboard.tsx'

createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<MainLayout />}>
        <Route path='/' element={<Dashboard/>}/>
      </Route>
    </Routes>
  </BrowserRouter>,
)
