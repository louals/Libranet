import { Link, Outlet, useLocation } from "react-router-dom";
import {
  Users,
  BookOpen,
  LayoutDashboard,
  PlusCircle,
  Settings,
  LogOut,
  Bookmark,
  ChevronRight,
  Home
} from "lucide-react";

export default function AdminDashboard() {
  const location = useLocation();

  // Check if current route matches
  const isActive = (path) => location.pathname === `/admin/${path}` || 
                          (path === "" && location.pathname === "/admin");

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Fixed Sidebar */}
      <aside className="w-64 fixed h-screen bg-gradient-to-b from-blue-700 to-blue-800 dark:from-gray-800 dark:to-gray-900 shadow-xl flex flex-col">
        {/* Logo/Branding */}
        <div className="p-6 text-white dark:text-blue-300 font-bold text-xl flex items-center gap-3 border-b border-blue-600/30 dark:border-gray-700">
          <LayoutDashboard size={24} className="text-blue-200 dark:text-blue-400" />
          <span>LibraNet Admin</span>
        </div>

        {/* Navigation - Flex-grow to push settings to bottom */}
        <nav className="flex-grow overflow-y-auto py-4 px-2">
          <Link
            to=""
            className={`flex items-center gap-3 px-4 py-3 rounded-lg mx-2 transition-all ${
              isActive("")
                ? "bg-blue-600/90 dark:bg-gray-700 text-white shadow-inner"
                : "text-blue-100 hover:bg-blue-600/50 dark:hover:bg-gray-700/50"
            }`}
          >
            <Home size={18} className="flex-shrink-0" />
            <span>Dashboard</span>
          </Link>

          <Link
            to="users"
            className={`flex items-center gap-3 px-4 py-3 rounded-lg mx-2 transition-all ${
              isActive("users")
                ? "bg-blue-600/90 dark:bg-gray-700 text-white shadow-inner"
                : "text-blue-100 hover:bg-blue-600/50 dark:hover:bg-gray-700/50"
            }`}
          >
            <Users size={18} className="flex-shrink-0" />
            <span>User Management</span>
            <ChevronRight size={16} className="ml-auto opacity-70" />
          </Link>

          <Link
            to="add-book"
            className={`flex items-center gap-3 px-4 py-3 rounded-lg mx-2 transition-all ${
              isActive("add-book")
                ? "bg-blue-600/90 dark:bg-gray-700 text-white shadow-inner"
                : "text-blue-100 hover:bg-blue-600/50 dark:hover:bg-gray-700/50"
            }`}
          >
            <PlusCircle size={18} className="flex-shrink-0" />
            <span>Add New Book</span>
            <ChevronRight size={16} className="ml-auto opacity-70" />
          </Link>

          <Link
            to="livres"
            className={`flex items-center gap-3 px-4 py-3 rounded-lg mx-2 transition-all ${
              isActive("livres")
                ? "bg-blue-600/90 dark:bg-gray-700 text-white shadow-inner"
                : "text-blue-100 hover:bg-blue-600/50 dark:hover:bg-gray-700/50"
            }`}
          >
            <BookOpen size={18} className="flex-shrink-0" />
            <span>Book Inventory</span>
            <ChevronRight size={16} className="ml-auto opacity-70" />
          </Link>

          <Link
            to="classify"
            className={`flex items-center gap-3 px-4 py-3 rounded-lg mx-2 transition-all ${
              isActive("classify")
                ? "bg-blue-600/90 dark:bg-gray-700 text-white shadow-inner"
                : "text-blue-100 hover:bg-blue-600/50 dark:hover:bg-gray-700/50"
            }`}
          >
            <Bookmark size={18} className="flex-shrink-0" />
            <span>Classification</span>
            <ChevronRight size={16} className="ml-auto opacity-70" />
          </Link>
        </nav>

        {/* Bottom Settings - Fixed at bottom */}
        <div className="border-t border-blue-600/30 dark:border-gray-700 p-4 mt-auto">
          <Link
            to="settings"
            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
              isActive("settings")
                ? "bg-blue-600/90 dark:bg-gray-700 text-white shadow-inner"
                : "text-blue-100 hover:bg-blue-600/50 dark:hover:bg-gray-700/50"
            }`}
          >
            <Settings size={18} className="flex-shrink-0" />
            <span>Settings</span>
          </Link>
          <button className="flex items-center gap-3 w-full px-4 py-3 rounded-lg text-blue-100 hover:bg-blue-600/50 dark:hover:bg-gray-700/50 transition-all">
            <LogOut size={18} className="flex-shrink-0" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area - Offset by sidebar width */}
      <div className="flex-1 flex flex-col ml-64">
        {/* Top Navigation Bar */}
        <header className="bg-white dark:bg-gray-800 shadow-sm z-10 sticky top-0">
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold text-gray-800 dark:text-white">
                {getPageTitle(location.pathname)}
              </h1>
            </div>
            <div className="flex items-center gap-4">
              {/* Add notification bell, user dropdown etc here */}
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-6 bg-gray-50 dark:bg-gray-900">
          {/* Container with white background for content */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 min-h-[calc(100vh-140px)]">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}

// Helper function to get page title based on route
function getPageTitle(pathname) {
  const path = pathname.split('/').pop();
  switch(path) {
    case "users": return "User Management";
    case "add-book": return "Add New Book";
    case "livres": return "Book Inventory";
    case "classify": return "Classification";
    case "settings": return "Settings";
    default: return "Dashboard";
  }
}