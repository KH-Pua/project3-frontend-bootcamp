import { useState, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { GlobalContext } from "../../provider/globalProvider.js";
import { useAuthGate } from "../../components/useAuthGate.js";
import { useApi } from "../../components/api.js";
import BACKEND_URL from "../../constants.js";
import axios from "axios";

export default function BookingRequest() {
  const infoToPass = useContext(GlobalContext);
  const navigate = useNavigate();
  const { isAuthenticated, getAccessTokenSilently } = useAuthGate();
  const { post } = useApi();

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [bookingStatus, setBookingStatus] = useState("pending");
  const [paymentStatus, setPaymentStatus] = useState("unpaid");

  const internalUserId = localStorage.getItem("internalUserId");

  // Get propertyId from route params
  const { propertyId } = useParams();

  const handleBooking = async () => {
    if (!isAuthenticated) {
      console.log("User not authenticated");
      return;
    }

    try {
      const token = await getAccessTokenSilently({
        authorizationParams: {
          audience: "https://api.powderful.xyz",
          scope: "read:current_user",
        },
      });
      const bookingData = {
        property_id: propertyId,
        start_date: startDate,
        end_date: endDate,
        booking_status: bookingStatus,
        payment_status: paymentStatus,
      };

      const response = await axios.post(
        `${BACKEND_URL}/bookings/`,
        bookingData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      console.log("Booking successful:", response.data);
      // Handle successful booking
    } catch (error) {
      console.error("Error creating booking", error);
      // Handle error
    }
  };

  return (
    <>
      <h1 className="text-4xl font-bold">
        Booking Request for Property: {propertyId}
      </h1>
      <br />

      <div>
        <label>Start Date:</label>
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
        />
      </div>
      <div>
        <label>End Date:</label>
        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
        />
      </div>
      <br />
      <button onClick={handleBooking}>Confirm Booking</button>
    </>
  );
}
