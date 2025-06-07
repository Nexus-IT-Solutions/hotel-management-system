
import {
  LayoutDashboard, 
  CalendarDays, 
  Bed, 
  Users,
  ChartBar,  
  Book
} from "lucide-react";

export const recepNavLinks = [
  {
    title: "MAIN",
    menuItems: [
      { icon: LayoutDashboard, label: 'Dashboard', path: '/receptionist', role: 'all'  },
      { icon: Book, label: 'New Booking', path: 'new-booking', role: 'receptionist' },
      { icon: CalendarDays, label: 'Bookings', path: 'bookings', role: 'all' },
      { icon: Bed, label: 'Room Availability', path: 'room-availability', role: 'receptionist' },
      { icon: Users, label: "Customer", path: "customers" },
    ],
  },
  {
    title: "REPORTS",
    menuItems: [
      { icon: ChartBar, label: 'Make Report', path: 'reports', role: 'manager' },
      { icon: Bed, label: "Logout", path: "/" },
    ],
  },
  
];
