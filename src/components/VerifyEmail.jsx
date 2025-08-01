import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";

export default function VerifyEmail() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const [status, setStatus] = useState("loading"); // "loading", "success", "error"
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      setStatus("error");
      setMessage("Verification token missing.");
      return;
    }

    const verifyEmail = async () => {
      try {
        const res = await fetch(`http://localhost:8000/auth/verify-email?token=${token}`, {
          method: "GET",
          headers: { "Accept": "application/json" },
        });

        const data = await res.json();

        if (res.ok) {
          setStatus("success");
          setMessage(data.message || "Email verified successfully!");
          // Redirect to login after 2 seconds
          setTimeout(() => navigate("/login"), 2000);
        } else {
          setStatus("error");
          setMessage(data.detail || "Verification failed.");
        }
      } catch (error) {
        setStatus("error");
        setMessage("Network error. Please try again.");
      }
    };

    verifyEmail();
  }, [token, navigate]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-100 to-indigo-200 dark:from-gray-900 dark:to-gray-800 p-6">
      <div className="bg-white dark:bg-gray-900 p-8 rounded-xl shadow-lg max-w-md w-full text-center">
        {status === "loading" && <p className="text-blue-600 font-semibold">Verifying your email...</p>}
        {status === "success" && <p className="text-green-600 font-bold">{message}</p>}
        {status === "error" && <p className="text-red-600 font-bold">{message}</p>}
        {(status === "success" || status === "error") && (
          <p className="mt-4 text-gray-600 dark:text-gray-400">
            {status === "success"
              ? "Redirecting to login page..."
              : "Please try again or contact support."}
          </p>
        )}
      </div>
    </div>
  );
}
