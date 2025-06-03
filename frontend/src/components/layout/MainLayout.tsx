import Sidebar from "./Sidebar";
import MobileNavbar from "./MobileNavbar";
import { useState } from "react";
import { Outlet } from "react-router-dom";
import Header from "./Header";

const MainLayout = () => {
  const [showLabels, setShowLabels] = useState(true);

  return (
    <div className="flex h-screen bg-[#faf8f8de]">
      <Sidebar showLabels={showLabels} />

      <div className="flex flex-col flex-grow">
        {/* Mobile Navigation */}
        <div className="md:hidden">
          <MobileNavbar />
        </div>

        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Header */}
          <Header setShowLabels={setShowLabels} showLabels={showLabels} />

          <main className="flex-1 overflow-y-auto p-5">
            {/* Main content */}
            <Outlet />
          </main>
          {/* Footer */}
          <footer className="bg-white text-slate-500 py-1">
            <div className="container mx-auto px-4 text-center text-[10px]">
              <p>&copy; {new Date().getFullYear()} Hotel Management System</p>
              <p>Developed by: Nolex Prime</p>
            </div>
          </footer>
        </div>
      </div>
    </div>
  );
};

export default MainLayout;
