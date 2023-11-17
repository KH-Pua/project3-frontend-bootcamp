import React from "react";
import { useNavigate } from "react-router-dom";

const PaymentCancel = () => {
  const navigate = useNavigate();

  const handleReturn = () => {
    navigate(-1); // Go back to previous page
  };

  return (
    <div>
      <h1>Booking Confirmed & Payment Cancelled</h1>
      <p>
        Your payment was not completed. You have not been charged. Your booking
        has been confirmed, please reach out to the Property Manager or contact
        support.
      </p>
      <button onClick={handleReturn}>Return to Payment via Stripe</button>
    </div>
  );
};

export default PaymentCancel;
