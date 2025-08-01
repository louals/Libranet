import React, { useEffect, useState } from "react";
import api from "../api";
import { useAuth } from "../context/useContext";
import { useNavigate } from "react-router-dom";

export default function LoansPage() {
  const { user, token } = useAuth();
  const [loans, setLoans] = useState([]);
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) return;

    const fetchData = async () => {
      try {
        const [loansRes, booksRes] = await Promise.all([
          api.get("/loans/me", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          api.get("/livres/get-all"),
        ]);
        setLoans(loansRes.data);
        setBooks(booksRes.data);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch loans");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user, token]);

  const getBookTitle = (bookId) => {
    const book = books.find((b) => b.id === bookId);
    return book ? book.titre : "Unknown Book";
  };

  const handlePayFine = async (loanId) => {
    try {
      const res = await api.post(`/loans/loans/pay-fine/${loanId}`, null, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.data.checkout_url) {
        window.location.href = res.data.checkout_url;
      }
    } catch (err) {
      console.error("Payment error:", err);
      alert("Failed to initiate payment.");
    }
  };

  if (!user) return <div className="text-center mt-20 text-gray-500">Please log in to view your loans.</div>;
  if (loading) return <div className="text-center mt-20 text-gray-500">Loading your loans...</div>;
  if (error) return <div className="text-center mt-20 text-red-500">{error}</div>;
  if (loans.length === 0) return <div className="text-center mt-20 text-gray-500">You have no active loans.</div>;

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <h1 className="text-2xl md:text-3xl font-semibold text-gray-900 dark:text-white mb-8">My Loans</h1>

      <div className="space-y-6">
        {loans.map((loan) => (
          <div
            key={loan._id}
            className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-sm p-5 transition hover:shadow-md"
          >
            <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-3">
              <div>
                <h2 className="text-lg font-medium text-gray-900 dark:text-white">
                  {getBookTitle(loan.book_id)}
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Loaned: <span className="font-medium">{new Date(loan.loan_date).toLocaleDateString()}</span> | Due:{" "}
                  <span className="font-medium">{new Date(loan.due_date).toLocaleDateString()}</span>
                </p>
                {loan.return_date && (
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Returned: <span className="font-medium">{new Date(loan.return_date).toLocaleDateString()}</span>
                  </p>
                )}
                <p className="text-sm mt-1">
                  Status:{" "}
                  <span
                    className={`font-medium ${
                      loan.status === "returned"
                        ? "text-green-600 dark:text-green-400"
                        : "text-blue-600 dark:text-blue-400"
                    }`}
                  >
                    {loan.status}
                  </span>
                </p>
              </div>

              <div className="mt-2 md:mt-0 flex flex-col items-end gap-2">
                {loan.fine > 0 && !loan.fine_paid && (
                  <>
                    <p className="text-sm text-red-600 dark:text-red-400 font-medium">
                      Fine: ${loan.fine.toFixed(2)}
                    </p>
                    <button
                      onClick={() => handlePayFine(loan._id)}
                      className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md text-sm font-medium transition"
                    >
                      Pay Fine
                    </button>
                  </>
                )}
                {loan.fine_paid && (
                  <span className="text-sm text-green-600 dark:text-green-400 font-medium">
                    Fine Paid
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
