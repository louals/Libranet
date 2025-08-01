import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Mail, Lock, BookOpen, Eye, EyeOff } from "lucide-react";
import { useEffect, useState } from "react";
import { useAuth } from "../context/useContext";
import api from "../api";

export default function Login() {
  const [darkMode] = useState(() => {
    const saved = localStorage.getItem("darkMode");
    return saved !== null ? saved === "true" : window.matchMedia("(prefers-color-scheme: dark)").matches;
  });
  const [lang] = useState(() => localStorage.getItem("lang") || "fr");
  const [email, setEmail] = useState("");
  const [mot_de_passe, setMotDePasse] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [success, setSuccess] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage("");
    setSuccess(false);

    try {
      const res = await api.post("/auth/login", { email, mot_de_passe });
      const token = res.data.access_token;
      const loggedIn = login(token);

      if (loggedIn) {
        setSuccess(true);
        setTimeout(() => navigate("/books"), 1000);
      } else {
        setErrorMessage(lang === "fr" ? "Erreur d'authentification" : "Authentication error");
      }
    } catch (err) {
      setErrorMessage(lang === "fr" ? "Identifiants incorrects" : "Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 px-4">
      {/* Decorative elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-blue-100/30 dark:bg-blue-900/20 filter blur-3xl"></div>
        <div className="absolute bottom-1/3 right-1/4 w-80 h-80 rounded-full bg-indigo-100/30 dark:bg-indigo-900/20 filter blur-3xl"></div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative bg-white dark:bg-gray-800 p-10 rounded-2xl shadow-xl w-full max-w-md border border-gray-200 dark:border-gray-700 z-10"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <BookOpen className="w-8 h-8 text-blue-600 dark:text-blue-400 mr-2" />
            <h1 className="text-2xl font-serif font-medium text-gray-900 dark:text-white">
              LibraNet
            </h1>
          </div>
          <h2 className="text-3xl font-light text-gray-800 dark:text-gray-200 mb-2">
            {lang === "fr" ? "Connexion" : "Login"}
          </h2>
          <p className="text-gray-500 dark:text-gray-400">
            {lang === "fr" ? "Accédez à votre bibliothèque personnelle" : "Access your personal library"}
          </p>
        </div>

        {/* Messages */}
        {errorMessage && (
          <div className="bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 px-4 py-3 rounded-lg mb-6">
            {errorMessage}
          </div>
        )}
        {success && (
          <div className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 px-4 py-3 rounded-lg mb-6">
            {lang === "fr" ? "Connexion réussie" : "Login successful"}
          </div>
        )}

        {/* Form */}
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={lang === "fr" ? "Adresse e-mail" : "Email address"}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type={showPassword ? "text" : "password"}
                value={mot_de_passe}
                onChange={(e) => setMotDePasse(e.target.value)}
                placeholder={lang === "fr" ? "Mot de passe" : "Password"}
                className="w-full pl-10 pr-10 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-blue-500 dark:hover:text-blue-400"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-lg shadow-md hover:shadow-lg transition-all disabled:opacity-70"
          >
            {loading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {lang === "fr" ? "Connexion..." : "Logging in..."}
              </>
            ) : (
              lang === "fr" ? "Se connecter" : "Login"
            )}
          </motion.button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
          {lang === "fr" ? "Pas encore de compte ?" : "Don't have an account?"}{" "}
          <Link 
            to="/register" 
            className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
          >
            {lang === "fr" ? "S'inscrire" : "Register"}
          </Link>
        </div>
      </motion.div>
    </div>
  );
}