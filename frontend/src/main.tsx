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
import Settings from './pages/admin/Settings.tsx'
import RecepMainLayout from './components/layout/receptioniast/RecepMainLayout.tsx'
import RecepDashboard from './pages/receptionist/Dashboard.tsx'
import ReportIssueForm from './pages/receptionist/ReportIssueForm.tsx'
import Issues from './pages/admin/Issues.tsx'
import MakeReport from './pages/admin/MakeReport.tsx'
import ProtectedRoute from './pages/ProtectedRoute.tsx'
import OTP from './pages/OTP.tsx'
import RoomType from './pages/admin/RoomType.tsx'
import PayBooking from './pages/admin/PayBooking.tsx'

createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <Routes>
      <Route path='/' element={<Login/>}/>
      <Route path='/otp' element={<OTP />} />

      {/* Protected Admin Routes */}
      <Route path="/admin" element={<ProtectedRoute><MainLayout /></ProtectedRoute>}>
        <Route index element={<Dashboard />} />
        <Route path="new-booking" element={<NewBooking />} />
        <Route path="bookings" element={<Bookings />} />
        <Route path="customers" element={<Customer />} />
        <Route path="room-availability" element={<RoomAvailability />} />
        <Route path="staff" element={<Staff />} />
        <Route path="reports" element={<Reports />} />
        <Route path="add-room" element={<AddRoom />} />
        <Route path="settings" element={<Settings />} />
        <Route path="issues" element={<Issues />} />
        <Route path="make-reports-admin" element={<MakeReport />} />
        <Route path="add-room-type" element={<RoomType />} />
        <Route path="pay-booking/:bookingCode" element={<PayBooking />} />
      </Route>

      {/* Protected Receptionist Routes */}
      <Route path="/receptionist" element={<ProtectedRoute><RecepMainLayout /></ProtectedRoute>}>
        <Route index element={<RecepDashboard />} />
        <Route path="new-booking" element={<NewBooking />} />
        <Route path="bookings" element={<Bookings />} />
        <Route path="room-availability" element={<RoomAvailability />} />
        <Route path="customers" element={<Customer />} />
        <Route path="make-reports" element={<ReportIssueForm />} />
      </Route>
    </Routes>
  </BrowserRouter>
);
