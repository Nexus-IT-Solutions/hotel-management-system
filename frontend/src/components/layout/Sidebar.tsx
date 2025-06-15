import { navLinks } from "./NavLinks";
import { NavLink } from "react-router-dom";
import { Bed } from "lucide-react";

interface SidebarProps {
  showLabels: boolean;
}

const Sidebar = (probs: SidebarProps) => {
  return (
    <div
      className={`bg-white shadow-lg flex-col transition-all duration-700 hidden md:flex h-screen ${
        probs.showLabels ? "w-56" : "w-20"
      }`}
    >
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-600 rounded-2xl flex items-center justify-center">
            <span className="text-white font-bold text-sm">
              <Bed className="w-7 h-7"/>
            </span>
          </div>
          <div className="flex items-center">
            <span className={`font-semibold whitespace-nowrap transition-all duration-500 ${
              probs.showLabels ? "opacity-100 max-w-full" : "opacity-0 max-w-0 overflow-hidden"
            }`}>Hotel Logo</span>
          </div>
        </div>
      </div>

      {/* Navigation - now with overflow scroll */}
      <div className="flex-1 p-4 overflow-y-auto">
        {/* Main Section */}
        {navLinks.map((item, index) => (
          <div className="mb-6" key={`section-${index}`}>
            {probs.showLabels && (
              <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3 transition-all duration-500">
                {item.title}
              </h3>
            )}
            <nav className="space-y-1">
              {item.menuItems.map((item, index) => (
                <NavLink to={item.path}
                  key={index}
                  end={true}
                  className={({ isActive }) =>
                    `w-full flex items-center gap-3 text-slate-800 px-3 py-2 rounded-lg text-left transition-colors ${
                      isActive
                        ? 'bg-blue-100 text-blue-800 border-l-2 border-indigo-700'
                        : 'hover:bg-blue-100 hover:text-blue-700'
                    }`}
                >
                  <div className="flex-shrink-0">
                    <item.icon size={18} />
                  </div>
                  <span className={`text-sm whitespace-nowrap transition-all duration-500 ${
                    probs.showLabels ? "opacity-100 max-w-full" : "opacity-0 max-w-0 overflow-hidden"
                  }`}>
                    {item.label}
                  </span>
                </NavLink>
              ))}
            </nav>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
