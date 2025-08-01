import React, { useEffect, useState, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  BookOpen,
  Sun,
  Moon,
  User,
  ShoppingCart,
  LogIn,
  LogOut,
  UserPlus,
  LayoutDashboard,
  CalendarCheck,
  BookCopy,
  ChevronDown,
  ChevronUp,
  Search
} from "lucide-react";
import { useAuth } from "../context/useContext";

export default function Navbar() {
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem("darkMode");
    return saved !== null
      ? saved === "true"
      : window.matchMedia("(prefers-color-scheme: dark)").matches;
  });

  const [lang, setLang] = useState(() => localStorage.getItem("lang") || "fr");
  const { isAuthenticated, isAdmin, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setUserMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => setMobileMenuOpen(false), [location.pathname]);
  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
    localStorage.setItem("darkMode", darkMode);
  }, [darkMode]);
  useEffect(() => localStorage.setItem("lang", lang), [lang]);

  const t = {
    fr: {
      profile: "Profil",
      logout: "Déconnexion",
      login: "Connexion",
      register: "Inscription",
      dashboard: "Tableau de bord",
      books: "Livres",
      cart: "Panier",
      welcome: "Bienvenue",
      searchPlaceholder: "Rechercher des livres...",
      reservations: "Mes Réservations",
      loans: "Mes Emprunts"
    },
    en: {
      profile: "Profile",
      logout: "Logout",
      login: "Login",
      register: "Register",
      dashboard: "Dashboard",
      books: "Books",
      cart: "Cart",
      welcome: "Welcome",
      searchPlaceholder: "Search books...",
      reservations: "My Reservations",
      loans: "My Loans"
    },
  }[lang];

  const toggleDarkMode = () => setDarkMode((prev) => !prev);
  const toggleLanguage = () => setLang((prev) => (prev === "fr" ? "en" : "fr"));

  return (
    <nav className="w-full bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200/50 dark:border-gray-800/50 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Left side - Logo and Main Links */}
          <div className="flex items-center space-x-8">
            <Link
              to="/"
              className="flex items-center text-xl font-serif font-medium text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              <BookOpen className="w-5 h-5 mr-2 text-blue-600 dark:text-blue-400" />
              <span className="hidden sm:inline">LibraNet</span>
            </Link>
            
            <div className="hidden md:flex items-center space-x-6">
              <Link
                to="/books"
                className="text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors relative group"
              >
                {t.books}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-600 dark:bg-blue-400 transition-all duration-300 group-hover:w-full"></span>
              </Link>
            </div>
          </div>

          {/* Right side - Controls and User Menu */}
          <div className="flex items-center space-x-4">
            {/* Dark Mode Toggle */}
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              aria-label="Toggle dark mode"
            >
              {darkMode ? (
                <Sun className="w-5 h-5 text-amber-400" />
              ) : (
                <Moon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              )}
            </button>
            
            {/* Language Toggle */}
            <button
              onClick={toggleLanguage}
              className="px-3 py-1 text-xs font-medium rounded-md bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            >
              {lang === "fr" ? "EN" : "FR"}
            </button>

            

            {/* User Menu */}
            {isAuthenticated ? (
              <div
                className="hidden md:flex items-center ml-2 relative"
                ref={userMenuRef}
              >
                <button
                  onClick={() => setUserMenuOpen((prev) => !prev)}
                  className="flex items-center space-x-1 focus:outline-none group"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white">
                    <User className="w-4 h-4" />
                  </div>
                  {userMenuOpen ? (
                    <ChevronUp className="w-4 h-4 text-gray-500 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-gray-500 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400" />
                  )}
                </button>
                
                {userMenuOpen && (
                  <div className="absolute right-0 top-full mt-2 w-56 bg-white dark:bg-gray-800 rounded-md shadow-lg py-1 ring-1 ring-black ring-opacity-5 focus:outline-none z-50">
                    <div className="px-4 py-2 border-b border-gray-100 dark:border-gray-700">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {t.welcome}
                      </p>
                    </div>
                    
                    <Link
                      to="/profile"
                      className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    >
                      <User className="w-4 h-4 mr-2" />
                      {t.profile}
                    </Link>
                    
                    <Link 
                      to="/reservations" 
                      className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    >
                      <CalendarCheck className="w-4 h-4 mr-2" />
                      {t.reservations}
                    </Link>
                    
                    <Link 
                      to="/user/loans" 
                      className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    >
                      <BookCopy className="w-4 h-4 mr-2" />
                      {t.loans}
                    </Link>
                    
                    {isAdmin && (
                      <Link
                        to="/admin/dashboard"
                        className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                      >
                        <LayoutDashboard className="w-4 h-4 mr-2" />
                        {t.dashboard}
                      </Link>
                    )}
                    
                    <div className="border-t border-gray-100 dark:border-gray-700 my-1"></div>
                    
                    <button
                      onClick={() => {
                        logout();
                        navigate("/login");
                      }}
                      className="w-full text-left flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      {t.logout}
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="hidden md:flex space-x-3">
                <Link
                  to="/login"
                  className="px-4 py-1.5 text-sm bg-transparent border border-gray-300 dark:border-gray-600 rounded-md flex items-center hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  <LogIn className="w-4 h-4 mr-2" />
                  {t.login}
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-1.5 text-sm bg-gradient-to-br from-blue-600 to-blue-500 text-white hover:from-blue-700 hover:to-blue-600 rounded-md flex items-center shadow-sm hover:shadow-md transition-all"
                >
                  <UserPlus className="w-4 h-4 mr-2" />
                  {t.register}
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}