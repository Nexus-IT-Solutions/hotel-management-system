import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { createRoot } from 'react-dom/client'
import './index.css'
import MainLayout from './components/layout/MainLayout.tsx'
import Dashboard from './pages/admin/Dashboard.tsx'
import NewBooking from './pages/admin/NewBooking.tsx'
import Bookings from './pages/admin/Bookings.tsx'
import Customer from './pages/admin/Customer.tsx'

createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<MainLayout />}>
        <Route path='/' element={<Dashboard/>}/>
        <Route path='/new-booking' element={<NewBooking/>}/>
        <Route path='/bookings' element={<Bookings/>}/>
        <Route path='/customers' element={<Customer/>}/>
      </Route>
    </Routes>
  </BrowserRouter>
)
