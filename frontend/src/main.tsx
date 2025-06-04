import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { createRoot } from 'react-dom/client'
import './index.css'
import MainLayout from './components/layout/MainLayout.tsx'
import Dashboard from './pages/admin/Dashboard.tsx'
import NewBooking from './pages/admin/NewBooking.tsx'
import Bookings from './pages/admin/Bookings.tsx'
import Customer from './pages/admin/Customer.tsx'
import RoomAvailability from './pages/admin/RoomAvailability.tsx'
import Staff from './pages/admin/Staff.tsx'
import Reports from './pages/admin/Reports.tsx'
import AddRoom from './pages/admin/AddRoom.tsx'
import Login from './pages/Login.tsx'
import RecepMainLayout from './components/layout/receptioniast/RecepMainLayout.tsx'
import RecepDashboard from './pages/receptionist/Dashboard.tsx'

createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <Routes>
      <Route path='/' element={<Login/>}/>
      {/* managers dashboard routing */}
      <Route path="/admin" element={<MainLayout />}>
        <Route path='/admin' element={<Dashboard/>}/>
        <Route path='new-booking' element={<NewBooking/>}/>
        <Route path='bookings' element={<Bookings/>}/>
        <Route path='customers' element={<Customer/>}/>
        <Route path='room-availability' element={<RoomAvailability/>}/>
        <Route path='staff' element={<Staff/>}/>
        <Route path='reports' element={<Reports/>}/>
        <Route path='add-room' element={<AddRoom/>}/>
      </Route>
      {/* receptionist dashboard routing */}
      <Route path='/receptionist' element={<RecepMainLayout/>}>
        <Route path='/receptionist' element={<RecepDashboard/>}/>
        <Route path='new-booking' element={<NewBooking/>}/>
        <Route path='bookings' element={<Bookings/>}/>
        <Route path='room-availability' element={<RoomAvailability/>}/>
        <Route path='customers' element={<Customer/>}/>
      </Route>
    </Routes>
  </BrowserRouter>
)
