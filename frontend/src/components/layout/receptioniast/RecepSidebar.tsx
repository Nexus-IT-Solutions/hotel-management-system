
import { recepNavLinks } from "./RecepNavLinks";
import { NavLink } from "react-router-dom";
import { Bed } from "lucide-react";

interface RecepSidebarProps {
  showLabels: boolean;
}

const RecepSidebar = (probs: RecepSidebarProps) => {
  return (
    <div
      className={`bg-white shadow-lg h-screen flex-col duration-700 hidden md:flex ${
        probs.showLabels && "w-56 duration-500"
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
          <div className="flex items-center gap-2">
            {probs.showLabels && (
              <span className="font-semibold">Hotel Logo</span>
            )}
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex-1 p-4">
        {/* Main Section */}
        {recepNavLinks.map((item, index) => (
          <div className="mb-6">
            <div key={index}>
              {probs.showLabels && (
                <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">
                  {item.title}
                </h3>
              )}
              <nav className="space-y-1">
                {item.menuItems.map((item, index) => (
                  <NavLink to={item.path}
                    key={index}
                    className={({ isActive }) =>
                      `w-full flex items-center gap-3 text-slate-800 px-3 py-2 rounded-lg text-left transition-colors ${
                        isActive
                          ? 'bg-blue-100 text-blue-800 border-l-2 border-indigo-700'
                          : 'hover:bg-blue-100 hover:text-blue-700'
                      }`}
                  >
                    <item.icon size={18} />
                    {probs.showLabels && (
                      <span className="text-sm">{item.label}</span>
                    )}
                  </NavLink>
                ))}
              </nav>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecepSidebar;
