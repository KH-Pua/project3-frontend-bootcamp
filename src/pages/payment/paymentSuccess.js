import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import BACKEND_URL from "../../constants.js";

const PaymentSuccess = () => {
  const navigate = useNavigate();
  const handleNavigateToDashboard = () => {
    navigate("/guestDashboard");
  };
  useEffect(() => {
    const query = new URLSearchParams(window.location.search);
    const sessionId = query.get("session_id");
    const bookingId = localStorage.getItem("bookingId");
    if (sessionId && bookingId) {
      // Call backend to update booking status
      axios
        .post(`${BACKEND_URL}/payments/handle-payment-success`, {
          sessionId,
          bookingId,
        })
        .then((response) => {
          console.log("Payment successful, booking updated");
          navigate("/guestDashboard");
        })
        .catch((error) => {
          console.error("Error updating booking status", error);
        });
    }
  }, [navigate]);

  return (
    <div className="bg-white">
      <div className="mx-auto max-w-7xl sm:px-2 lg:px-8">
        <div className="mx-auto max-w-2xl px-4 lg:max-w-4xl lg:px-0">
          <h1 className="text-3xl font-bold mt-4 text-gray-900 sm:text-3xl">
            Payment Successful
          </h1>
          <p className="mt-2 text-sm text-gray-500">
            Your payment was successful and your booking has been confirmed.
          </p>
          <button
            onClick={handleNavigateToDashboard}
            className="mt-4 rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            Go to Dashboard
          </button>{" "}
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;
