import React, { useEffect, useState } from "react";
import api from "../api";
import { toast } from "react-hot-toast";
import { FiBook, FiUser, FiCalendar, FiCheckCircle, FiAlertCircle, FiRefreshCw, FiArrowRight } from "react-icons/fi";

export default function ClerkLoanPage() {
  const [reservations, setReservations] = useState([]);
  const [loans, setLoans] = useState([]);
  const [booksMap, setBooksMap] = useState({});
  const [usersMap, setUsersMap] = useState({});
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("reservations");
  const [processingActions, setProcessingActions] = useState({});
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch all necessary data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [resReservations, resLoans] = await Promise.all([
          api.get("/reservations/all"),
          api.get("/loans/all"),
        ]);

        setReservations(resReservations.data);
        setLoans(resLoans.data);

        // Collect all unique book and user IDs
        const bookIds = new Set();
        const userIds = new Set();

        resReservations.data.forEach(res => {
          if (res.book_id || res.livre_id) bookIds.add(res.book_id || res.livre_id);
          if (res.user_id) userIds.add(res.user_id);
        });

        resLoans.data.forEach(loan => {
          if (loan.book_id) bookIds.add(loan.book_id);
          if (loan.user_id) userIds.add(loan.user_id);
        });

        // Fetch book and user details in parallel
        await Promise.all([
          ...Array.from(bookIds).map(async id => {
            if (!id) return;
            try {
              const res = await api.get(`/livres/get-by-id/${id}`);
              setBooksMap(prev => ({ ...prev, [id]: res.data }));
            } catch (err) {
              console.warn(`Failed to fetch book ${id}:`, err);
            }
          }),
          ...Array.from(userIds).map(async id => {
            if (!id) return;
            try {
              const res = await api.get(`/utilisateurs/get-user-info/${id}`);
              setUsersMap(prev => ({ ...prev, [id]: res.data }));
            } catch (err) {
              console.warn(`Failed to fetch user ${id}:`, err);
            }
          })
        ]);
      } catch (err) {
        console.error("Failed to load data:", err);
        toast.error("Failed to load data. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filter loans based on status
  const activeLoans = loans.filter(loan => !loan.return_date);
  const returnedLoans = loans.filter(loan => loan.return_date);
  const pendingReservations = reservations.filter(res => res.status === "success");

  // Handle book return
  const handleReturn = async (loanId) => {
    try {
      setProcessingActions(prev => ({ ...prev, [loanId]: "returning" }));
      
      const response = await api.post(`/loans/return/${loanId}`);
      const updatedLoan = response.data.loan;
      
      setLoans(prev => 
        prev.map(loan => loan._id === loanId ? updatedLoan : loan)
      );
      
      toast.success(
        `Book returned successfully! ${updatedLoan.fine > 0 ? 
          `Fine: $${updatedLoan.fine.toFixed(2)}` : ''}`
      );
    } catch (err) {
      console.error("Return error:", err);
      toast.error("Failed to return book. Please try again.");
    } finally {
      setProcessingActions(prev => ({ ...prev, [loanId]: false }));
    }
  };

  // Handle loan creation from reservation
  const handleCreateLoan = async (reservationId, bookId, userId) => {
    try {
      setProcessingActions(prev => ({ ...prev, [reservationId]: "creating" }));
      
      const response = await api.post("/loans/create", {
        reservation_id: reservationId,
        book_id: bookId,
        user_id: userId,
      });
      
      // Update state to remove the processed reservation
      setReservations(prev => 
        prev.filter(res => res._id !== reservationId)
      );
      
      // Add the new loan to the loans list
      setLoans(prev => [...prev, response.data]);
      
      toast.success("Loan created successfully!");
    } catch (err) {
      console.error("Loan creation error:", err);
      toast.error("Failed to create loan. Please try again.");
    } finally {
      setProcessingActions(prev => ({ ...prev, [reservationId]: false }));
    }
  };

  // Filter data based on search term
  const filteredData = () => {
    if (!searchTerm) {
      return {
        reservations: pendingReservations,
        activeLoans,
        returnedLoans
      };
    }

    const lowerSearch = searchTerm.toLowerCase();
    
    return {
      reservations: pendingReservations.filter(res => {
        const book = booksMap[res.book_id || res.livre_id];
        const user = usersMap[res.user_id];
        return (
          book?.titre?.toLowerCase().includes(lowerSearch) ||
          book?.auteur?.toLowerCase().includes(lowerSearch) ||
          user?.prenom?.toLowerCase().includes(lowerSearch) ||
          user?.nom?.toLowerCase().includes(lowerSearch) ||
          res.user_id?.toLowerCase().includes(lowerSearch)
        );
      }),
      activeLoans: activeLoans.filter(loan => {
        const book = booksMap[loan.book_id];
        const user = usersMap[loan.user_id];
        return (
          book?.titre?.toLowerCase().includes(lowerSearch) ||
          book?.auteur?.toLowerCase().includes(lowerSearch) ||
          user?.prenom?.toLowerCase().includes(lowerSearch) ||
          user?.nom?.toLowerCase().includes(lowerSearch) ||
          loan.user_id?.toLowerCase().includes(lowerSearch) ||
          loan.status?.toLowerCase().includes(lowerSearch)
        );
      }),
      returnedLoans: returnedLoans.filter(loan => {
        const book = booksMap[loan.book_id];
        const user = usersMap[loan.user_id];
        return (
          book?.titre?.toLowerCase().includes(lowerSearch) ||
          book?.auteur?.toLowerCase().includes(lowerSearch) ||
          user?.prenom?.toLowerCase().includes(lowerSearch) ||
          user?.nom?.toLowerCase().includes(lowerSearch) ||
          loan.user_id?.toLowerCase().includes(lowerSearch) ||
          loan.status?.toLowerCase().includes(lowerSearch)
        );
      })
    };
  };

  const { reservations: filteredReservations, activeLoans: filteredActiveLoans, returnedLoans: filteredReturnedLoans } = filteredData();

  // Refresh all data
  const handleRefresh = async () => {
    try {
      setLoading(true);
      const [resReservations, resLoans] = await Promise.all([
        api.get("/reservations/all"),
        api.get("/loans/all"),
      ]);
      setReservations(resReservations.data);
      setLoans(resLoans.data);
      toast.success("Data refreshed successfully");
    } catch (err) {
      console.error("Refresh error:", err);
      toast.error("Failed to refresh data");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-700">Loading Library Data...</h2>
          <p className="text-gray-500">Please wait while we load all the information</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 flex items-center">
                <FiBook className="mr-2 text-blue-600" />
                Library Loan Management
              </h1>
              <p className="mt-1 text-sm text-gray-500">
                Clerk dashboard for managing reservations and loans
              </p>
            </div>
            <div className="mt-4 md:mt-0 flex items-center space-x-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search books, users..."
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <div className="absolute left-3 top-2.5 text-gray-400">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>
              <button
                onClick={handleRefresh}
                className="flex items-center px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <FiRefreshCw className="mr-1" />
                Refresh
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="px-4 py-5 sm:p-6 border-l-4 border-blue-500">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-blue-100 rounded-md p-3">
                  <FiBook className="h-6 w-6 text-blue-600" />
                </div>
                <div className="ml-5">
                  <h3 className="text-lg font-medium text-gray-500">Pending Reservations</h3>
                  <p className="text-3xl font-bold text-gray-900">
                    {pendingReservations.length}
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="px-4 py-5 sm:p-6 border-l-4 border-green-500">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-green-100 rounded-md p-3">
                  <FiArrowRight className="h-6 w-6 text-green-600" />
                </div>
                <div className="ml-5">
                  <h3 className="text-lg font-medium text-gray-500">Active Loans</h3>
                  <p className="text-3xl font-bold text-gray-900">
                    {activeLoans.length}
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="px-4 py-5 sm:p-6 border-l-4 border-purple-500">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-purple-100 rounded-md p-3">
                  <FiCheckCircle className="h-6 w-6 text-purple-600" />
                </div>
                <div className="ml-5">
                  <h3 className="text-lg font-medium text-gray-500">Returned Today</h3>
                  <p className="text-3xl font-bold text-gray-900">
                    {returnedLoans.filter(loan => 
                      new Date(loan.return_date).toDateString() === new Date().toDateString()
                    ).length}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-6">
          <nav className="flex space-x-4" aria-label="Tabs">
            <button
              onClick={() => setActiveTab("reservations")}
              className={`px-3 py-2 font-medium rounded-md flex items-center ${
                activeTab === "reservations"
                  ? "bg-blue-100 text-blue-700"
                  : "text-gray-500 hover:text-gray-700 hover:bg-gray-100"
              }`}
            >
              <FiCalendar className="mr-2" />
              Reservations ({pendingReservations.length})
            </button>
            <button
              onClick={() => setActiveTab("active")}
              className={`px-3 py-2 font-medium rounded-md flex items-center ${
                activeTab === "active"
                  ? "bg-blue-100 text-blue-700"
                  : "text-gray-500 hover:text-gray-700 hover:bg-gray-100"
              }`}
            >
              <FiBook className="mr-2" />
              Active Loans ({activeLoans.length})
            </button>
            <button
              onClick={() => setActiveTab("returned")}
              className={`px-3 py-2 font-medium rounded-md flex items-center ${
                activeTab === "returned"
                  ? "bg-blue-100 text-blue-700"
                  : "text-gray-500 hover:text-gray-700 hover:bg-gray-100"
              }`}
            >
              <FiCheckCircle className="mr-2" />
              Returned Loans ({returnedLoans.length})
            </button>
          </nav>
        </div>

        {/* Content Sections */}
        {activeTab === "reservations" && (
          <section className="mb-12">
            <div className="bg-white shadow overflow-hidden sm:rounded-lg">
              <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  Pending Reservations
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  Approve these reservations to create loans
                </p>
              </div>
              {filteredReservations.length === 0 ? (
                <div className="px-4 py-12 text-center">
                  <div className="mx-auto h-12 w-12 text-gray-400 mb-4">
                    <FiCalendar className="w-full h-full" />
                  </div>
                  <h3 className="mt-2 text-sm font-medium text-gray-900">
                    No pending reservations
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">
                    All reservations have been processed or no matching results found.
                  </p>
                </div>
              ) : (
                <ul className="divide-y divide-gray-200">
                  {filteredReservations.map((res) => {
                    const book = booksMap[res.book_id || res.livre_id];
                    const user = usersMap[res.user_id];
                    const isProcessing = processingActions[res._id] === "creating";

                    return (
                      <li key={res._id} className="hover:bg-gray-50 transition">
                        <div className="px-4 py-4 sm:px-6">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center min-w-0">
                              <div className="flex-shrink-0 bg-blue-100 rounded-md p-2 mr-4">
                                <FiBook className="h-5 w-5 text-blue-600" />
                              </div>
                              <div className="min-w-0 flex-1">
                                <div className="flex items-center">
                                  <p className="text-sm font-medium text-blue-600 truncate">
                                    {book?.titre || "Loading title..."}
                                  </p>
                                  <p className="ml-2 flex-shrink-0 text-xs text-gray-500">
                                    by {book?.auteur || "Unknown"}
                                  </p>
                                </div>
                                <div className="mt-1 flex items-center text-sm text-gray-500">
                                  <FiUser className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                                  <span>
                                    {user ? `${user.prenom} ${user.nom}` : res.user_id}
                                  </span>
                                </div>
                              </div>
                            </div>
                            <div className="ml-2 flex-shrink-0 flex">
                              <button
                                onClick={() => handleCreateLoan(res._id, res.book_id || res.livre_id, res.user_id)}
                                disabled={isProcessing}
                                className={`inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-full shadow-sm text-white ${
                                  isProcessing ? "bg-blue-400" : "bg-blue-600 hover:bg-blue-700"
                                } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
                              >
                                {isProcessing ? (
                                  <>
                                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Processing...
                                  </>
                                ) : "Approve Loan"}
                              </button>
                            </div>
                          </div>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          </section>
        )}

        {activeTab === "active" && (
          <section className="mb-12">
            <div className="bg-white shadow overflow-hidden sm:rounded-lg">
              <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  Active Loans
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  Currently borrowed books and their status
                </p>
              </div>
              {filteredActiveLoans.length === 0 ? (
                <div className="px-4 py-12 text-center">
                  <div className="mx-auto h-12 w-12 text-gray-400 mb-4">
                    <FiBook className="w-full h-full" />
                  </div>
                  <h3 className="mt-2 text-sm font-medium text-gray-900">
                    No active loans
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">
                    All books are currently available or no matching results found.
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Book Details
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Borrower
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Dates
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Fine
                        </th>
                        <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Action
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredActiveLoans.map((loan) => {
                        const book = booksMap[loan.book_id];
                        const user = usersMap[loan.user_id];
                        const isOverdue = new Date(loan.due_date) < new Date();
                        const isProcessing = processingActions[loan._id] === "returning";

                        return (
                          <tr key={loan._id} className={isOverdue ? "bg-red-50" : ""}>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-md flex items-center justify-center">
                                  <FiBook className="h-5 w-5 text-blue-600" />
                                </div>
                                <div className="ml-4">
                                  <div className="text-sm font-medium text-gray-900">
                                    {book?.titre || "Loading title..."}
                                  </div>
                                  <div className="text-sm text-gray-500">
                                    {book?.auteur || "Unknown"}
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <div className="flex-shrink-0 h-10 w-10 bg-gray-100 rounded-full flex items-center justify-center">
                                  <FiUser className="h-5 w-5 text-gray-600" />
                                </div>
                                <div className="ml-4">
                                  <div className="text-sm font-medium text-gray-900">
                                    {user ? `${user.prenom} ${user.nom}` : loan.user_id}
                                  </div>
                                  <div className="text-sm text-gray-500">
                                    {user?.email || ""}
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">
                                <div className="flex items-center">
                                  <FiCalendar className="mr-1.5 h-4 w-4 text-gray-400" />
                                  {new Date(loan.loan_date).toLocaleDateString()}
                                </div>
                              </div>
                              <div className={`text-sm ${isOverdue ? "text-red-600 font-semibold" : "text-gray-500"}`}>
                                <div className="flex items-center">
                                  <FiArrowRight className="mr-1.5 h-4 w-4 text-gray-400" />
                                  {new Date(loan.due_date).toLocaleDateString()}
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                isOverdue ? "bg-red-100 text-red-800" : "bg-green-100 text-green-800"
                              }`}>
                                {isOverdue ? (
                                  <span className="flex items-center">
                                    <FiAlertCircle className="mr-1" />
                                    Overdue
                                  </span>
                                ) : "Active"}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                              {loan.fine > 0 ? (
                                <span className="text-red-600">${loan.fine.toFixed(2)}</span>
                              ) : (
                                <span className="text-gray-500">$0.00</span>
                              )}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                              <button
                                onClick={() => handleReturn(loan._id)}
                                disabled={isProcessing}
                                className={`inline-flex items-center px-3 py-1 border rounded-md shadow-sm text-sm font-medium ${
                                  isProcessing 
                                    ? "bg-gray-100 text-gray-700 border-gray-300" 
                                    : "bg-white text-red-600 border-red-300 hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                                }`}
                              >
                                {isProcessing ? (
                                  <>
                                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-gray-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Processing
                                  </>
                                ) : "Return Book"}
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </section>
        )}

        {activeTab === "returned" && (
          <section className="mb-12">
            <div className="bg-white shadow overflow-hidden sm:rounded-lg">
              <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  Returned Loans
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  Historical record of completed loans
                </p>
              </div>
              {filteredReturnedLoans.length === 0 ? (
                <div className="px-4 py-12 text-center">
                  <div className="mx-auto h-12 w-12 text-gray-400 mb-4">
                    <FiCheckCircle className="w-full h-full" />
                  </div>
                  <h3 className="mt-2 text-sm font-medium text-gray-900">
                    No returned loans
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">
                    No books have been returned yet or no matching results found.
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Book Details
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Borrower
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Loan Period
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Fine Paid
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredReturnedLoans.map((loan) => {
                        const book = booksMap[loan.book_id];
                        const user = usersMap[loan.user_id];
                        const wasLate = new Date(loan.return_date) > new Date(loan.due_date);

                        return (
                          <tr key={loan._id}>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-md flex items-center justify-center">
                                  <FiBook className="h-5 w-5 text-blue-600" />
                                </div>
                                <div className="ml-4">
                                  <div className="text-sm font-medium text-gray-900">
                                    {book?.titre || "Loading title..."}
                                  </div>
                                  <div className="text-sm text-gray-500">
                                    {book?.auteur || "Unknown"}
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <div className="flex-shrink-0 h-10 w-10 bg-gray-100 rounded-full flex items-center justify-center">
                                  <FiUser className="h-5 w-5 text-gray-600" />
                                </div>
                                <div className="ml-4">
                                  <div className="text-sm font-medium text-gray-900">
                                    {user ? `${user.prenom} ${user.nom}` : loan.user_id}
                                  </div>
                                  <div className="text-sm text-gray-500">
                                    {user?.email || ""}
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-500">
                                <div className="flex items-center">
                                  <FiCalendar className="mr-1.5 h-4 w-4 text-gray-400" />
                                  {new Date(loan.loan_date).toLocaleDateString()}
                                </div>
                                <div className="flex items-center">
                                  <FiArrowRight className="mr-1.5 h-4 w-4 text-gray-400" />
                                  {new Date(loan.return_date).toLocaleDateString()}
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                wasLate ? "bg-yellow-100 text-yellow-800" : "bg-green-100 text-green-800"
                              }`}>
                                <FiCheckCircle className="mr-1" />
                                {wasLate ? "Returned Late" : "Returned"}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                              {loan.fine_paid ? (
                                <span className="text-green-600">${loan.fine?.toFixed(2) || "0.00"}</span>
                              ) : (
                                <span className="text-gray-500">$0.00</span>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}