import React from "react";
import { useNavigate } from "react-router-dom";

const PaymentCancel = () => {
  const navigate = useNavigate();

  const handleReturn = () => {
    navigate(-1); // Go back to previous page
  };

  return (
    <div className="bg-white">
      <div className="mx-auto max-w-7xl sm:px-2 lg:px-8">
        <div className="mx-auto max-w-2xl px-4 lg:max-w-4xl lg:px-0">
          <h1 className="text-3xl font-bold mt-4 text-gray-900 sm:text-3xl">
            Booking Confirmed & Payment Cancelled
          </h1>
          <p className="mt-2 text-sm text-gray-500">
            Your payment was not completed. You have not been charged. Your
            booking has been confirmed, please reach out to the Property Manager
            or contact support.
          </p>
          <button
            onClick={handleReturn}
            className="mt-4 rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            Return to Payment via Stripe
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentCancel;
