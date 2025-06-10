import { Bell, Menu, Search } from "lucide-react"

interface HeaderProps {
  showLabels: boolean;
  setShowLabels: (value: boolean) => void;
}

const Header = (probs: HeaderProps) => {
  return (
    <header className="bg-white shadow-sm border-b px-6 py-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Menu
                className="w-6 hidden cursor-pointer md:block h-6 text-gray-400"
                onClick={() => probs.setShowLabels(!probs.showLabels)}
              />
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-6 w-6 md:h-4 md:w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search..."
                  className="pl-10 pr-4 py-1 border hidden md:block border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-80"
                />
              </div>
            </div>

            <div className="flex items-center gap-4">
              <button className="p-2 text-gray-400 hover:text-gray-600">
                <Bell size={20} />
              </button>
              
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                <span className="text-white font-semibold text-sm">AD</span>
              </div>
            </div>
          </div>
        </header>
  )
}

export default Header