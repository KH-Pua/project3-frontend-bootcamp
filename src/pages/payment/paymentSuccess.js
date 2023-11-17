import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import BACKEND_URL from "../../constants.js";

const PaymentSuccess = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const query = new URLSearchParams(window.location.search);
    const sessionId = query.get("session_id");
    if (sessionId) {
      // Call backend to update booking status
      axios
        .post(`${BACKEND_URL}/payments/handle-payment-success`, { sessionId })
        .then((response) => {
          console.log("Payment successful, booking updated");
          navigate("/booking-confirmation"); // Navigate to booking confirmation page
        })
        .catch((error) => {
          console.error("Error updating booking status", error);
        });
    }
  }, [navigate]);

  return (
    <div>
      <h1>Payment Successful</h1>
      <p>Your payment was successful and your booking has been confirmed.</p>
      {/* Additional content as needed */}
    </div>
  );
};

export default PaymentSuccess;
