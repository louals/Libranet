// pages/Success.jsx
import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import api from "../api";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";

export default function SuccessPage() {
  const [status, setStatus] = useState("loading");
  const [message, setMessage] = useState("");
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const sessionId = searchParams.get("session_id");

  useEffect(() => {
    const confirmReservation = async () => {
      try {
        const res = await api.get(`/reservations/confirm?session_id=${sessionId}`);
        setStatus("success");
        setMessage(res.data.message || "Reservation confirmed successfully!");
        setTimeout(() => navigate("/reservations"), 3000); // Auto redirect after 3s
      } catch (err) {
        setStatus("error");
        setMessage(err.response?.data?.detail || "Something went wrong.");
      }
    };

    if (sessionId) confirmReservation();
    else {
      setStatus("error");
      setMessage("No session ID found in URL.");
    }
  }, [sessionId, navigate]);

  return (
    <div className="flex flex-col items-center justify-center h-screen px-4 text-center">
      {status === "loading" && (
        <>
          <Loader2 className="w-10 h-10 animate-spin text-blue-600" />
          <p className="mt-4 text-lg text-blue-600 font-semibold">Confirming your reservation...</p>
        </>
      )}

      {status === "success" && (
        <>
          <CheckCircle className="w-14 h-14 text-green-500" />
          <h2 className="text-2xl font-bold text-green-600 mt-4">{message}</h2>
          <p className="text-sm mt-2 text-gray-500">Redirecting to your reservations...</p>
        </>
      )}

      
    </div>
  );
}
