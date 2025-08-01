import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/useContext";

// Pages
import Home from "./pages/Home";
import Register from "./pages/Register";
import Login from "./pages/Login";
import SplashScreen from "./pages/SplashScreen";
import AdminDashboard from "./pages/AdminDashboard";
import ListeUtilisateurs from "./pages/ListeUtilisateurs";
import AjouterLivre from "./pages/AjouterLivre";
import EditBook from "./pages/EditBook";
import ListeLivres from "./pages/ListeLivres";
import Unauthorized from "./pages/Unauthorized";
import NotFound from "./pages/NotFound";
import ReservationForm from "./pages/Reservationform";

import ClerkRoute from "./components/ClerkRoute";

// Components
import PrivateRoute from "./components/PrivateRoute";
import AdminRoute from "./components/AdminRoute";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

import Books from "./pages/Books";
import ReservationsPage from "./pages/Reservation";
import SuccessPage from "./pages/Success";

import UserLoans from "./pages/UserLoans";
import ProfilePage from "./pages/UserProfile";
import Chatbot from "./components/Chatbot";

import ClerkLoanPage from "./pages/LoanPage";
import Dashboard from "./pages/Dashboard";
import ClassifyDocuments from "./pages/Classify";
import VerifyEmail from "./components/VerifyEmail";

function App() {
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setShowSplash(false), 2500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      {showSplash ? (
        <SplashScreen />
      ) : (
        <BrowserRouter>
          <AuthProvider>
            <div className="min-h-screen flex flex-col justify-between bg-white dark:bg-gray-900">
              <Navbar />

              <main className="flex-grow">
                <Routes>
                  {/* Public Routes */}
                  <Route path="/" element={<Home />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/login" element={<Login />} />
                    <Route path="/unauthorized" element={<Unauthorized />} />
                    <Route path="/verify-email" element={<VerifyEmail />} />

                  {/* Admin Routes */}
                  <Route
                    path="/admin"
                    element={
                      <AdminRoute>
                        <AdminDashboard />
                      </AdminRoute>
                    }
                  >
                    
                    <Route path="users" element={<ListeUtilisateurs />} />
                    <Route path="add-book" element={<AjouterLivre />} />
                    <Route path="edit-book/:id" element={<EditBook />} />
                      <Route path="livres" element={<ListeLivres />} />
                      <Route path="dashboard" element={<Dashboard />}></Route>
                      <Route path="classify" element={<ClassifyDocuments />}></Route>
                  </Route>

                  <Route
                    path="/clerk/loans"
                    element={
                      <ClerkRoute>
                        <ClerkLoanPage />
                      </ClerkRoute>
                    }
                  />

                  {/* Protected User Routes */}
                  <Route path="/books" element={<Books />} />
                  <Route path="/books/:id" element={<ReservationForm />} />
                  <Route path="/reservations" element={<ReservationsPage />} />
                  <Route path="/success" element={<SuccessPage />} />
                  <Route path="/user/loans" element={<UserLoans />} />
                  <Route path="/profile" element={<ProfilePage />} />

                  {/* 404 Catch-all */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </main>

              <Chatbot />
            </div>
          </AuthProvider>
        </BrowserRouter>
      )}
    </>
  );
}

export default App;
