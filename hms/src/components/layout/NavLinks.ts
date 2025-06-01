import {
  LayoutDashboard, 
  CalendarDays, 
  Bed, 
  Users,
  ChartBar,  
  Settings, 
  Book
} from "lucide-react";

export const navLinks = [
  {
    title: "MAIN",
    menuItems: [
      { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard', role: 'all'  },
      { icon: Book, label: 'New Booking', path: '/bookings/new', role: 'receptionist' },
      { icon: CalendarDays, label: 'Bookings', path: '/bookings', role: 'all' },
      { icon: Bed, label: 'Room Availability', path: '/rooms/availability', role: 'receptionist' },
      { icon: Users, label: "Customer", path: "/" },
      { icon: Bed, label: "Add Room", path: "/add-room" },
    ],
  },
  {
    title: "REPORTS",
    menuItems: [
      { icon: ChartBar, label: 'Reports', path: '/reports', role: 'manager' },
    ],
  },
  {
    title: "ADMINISTRATION",
    menuItems: [
      { icon: Users, label: "Staff", path: "/" },
      { icon: Settings, label: "Settings", path: "/" },
    ],
  },
];
