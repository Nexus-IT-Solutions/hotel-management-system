import Sidebar from "./Sidebar";
import MobileNavbar from "./MobileNavbar";
import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import Header from "./Header";

const MainLayout = () => {
  const [showLabels, setShowLabels] = useState(true);
 


  return (
    <div className="flex h-screen bg-[#faf8f8de]">
      <Sidebar showLabels={showLabels} />

      <div className="flex flex-col flex-grow overflow-hidden">
      {/* Mobile Navigation */}
      <div className="md:hidden">
        <MobileNavbar />
      </div>

      {/* Header */}
      <Header setShowLabels={setShowLabels} showLabels={showLabels} />

      {/* Main Content Area - Only this will scroll */}
      <main className="flex-1 overflow-y-auto px-5 py-3">
          <Outlet />
          
          <footer className="bg-white text-slate-500 py-1">
            <div className="text-center text-[11px] flex items-center justify-around">
            <p>&copy; {new Date().getFullYear()} Hotel Management System</p>
            <p>Developed by: Nolex Prime <p>Contact Us: 0550807914/0541436414</p></p>
            </div>
          </footer>
      </main>

      {/* Footer - Will stick to bottom */}
      
      </div>
    </div>
  );
};

export default MainLayout;
