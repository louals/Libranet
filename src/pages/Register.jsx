import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Mail, Lock, User, BookOpen } from "lucide-react";
import { useEffect, useState } from "react";
import api from '../api';

export default function Register() {
  const [darkMode] = useState(() => {
    const saved = localStorage.getItem("darkMode");
    return saved !== null ? saved === "true" : window.matchMedia("(prefers-color-scheme: dark)").matches;
  });
  const [lang] = useState(() => localStorage.getItem("lang") || "fr");
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const t = {
    fr: {
      title: "Rejoignez LibraNet",
      lastname: "Nom",
      firstname: "Prénom",
      email: "Adresse e-mail",
      password: "Mot de passe",
      confirmPassword: "Confirmer le mot de passe",
      submit: "Créer un compte",
      loginText: "Déjà inscrit ?",
      loginLink: "Se connecter",
      errorMatch: "Les mots de passe ne correspondent pas",
      errorServer: "Erreur lors de l'inscription. Veuillez réessayer.",
      successMessage: "Inscription réussie. Veuillez vérifier votre e-mail !"
    },
    en: {
      title: "Join LibraNet",
      lastname: "Last name",
      firstname: "First name",
      email: "Email address",
      password: "Password",
      confirmPassword: "Confirm password",
      submit: "Create account",
      loginText: "Already registered?",
      loginLink: "Log in",
      errorMatch: "Passwords do not match",
      errorServer: "Registration failed. Please try again.",
      successMessage: "Registration successful. Please verify your email!"
    }
  }[lang];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const form = e.target;
    const nom = form.nom.value;
    const prenom = form.prenom.value;
    const email = form.email.value;
    const mot_de_passe = form.password.value;
    const confirmPassword = form.confirmPassword.value;

    if (mot_de_passe !== confirmPassword) {
      setError(t.errorMatch);
      return;
    }

    try {
      const res = await api.post("/auth/signup", {
        nom,
        prenom,
        email,
        mot_de_passe,
      });
      setSuccess(res.data.message || t.successMessage);
      setTimeout(() => navigate("/login"), 4000);
    } catch (err) {
      setError(err.response?.data?.message || t.errorServer);
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
            {t.title}
          </h2>
          <p className="text-gray-500 dark:text-gray-400">
            {lang === "fr" ? "Créez votre compte pour commencer" : "Create your account to get started"}
          </p>
        </div>

        {/* Messages */}
        {error && (
          <div className="bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}
        {success && (
          <div className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 px-4 py-3 rounded-lg mb-6">
            {success}
          </div>
        )}

        {/* Form */}
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                name="prenom"
                placeholder={t.firstname}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                name="nom"
                placeholder={t.lastname}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
          </div>

          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="email"
              name="email"
              placeholder={t.email}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="password"
              name="password"
              placeholder={t.password}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="password"
              name="confirmPassword"
              placeholder={t.confirmPassword}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            className="w-full flex items-center justify-center px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-lg shadow-md hover:shadow-lg transition-all"
          >
            {t.submit}
          </motion.button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
          {t.loginText}{" "}
          <Link 
            to="/login" 
            className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
          >
            {t.loginLink}
          </Link>
        </div>
      </motion.div>
    </div>
  );
}