import { useState, useContext, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { GlobalContext } from "../../provider/globalProvider.js";
import { useAuthGate } from "../../components/useAuthGate.js";
import { useApi } from "../../components/api.js";
import BACKEND_URL from "../../constants.js";
import axios from "axios";

export default function BookingRequest() {
  const {selectedDate, adultNumber, childrenNumber} = useContext(GlobalContext);
  const navigate = useNavigate();
  const { isAuthenticated, getAccessTokenSilently, user } = useAuthGate();
  const { post } = useApi();

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [bookingStatus, setBookingStatus] = useState("pending");
  const [paymentStatus, setPaymentStatus] = useState("unpaid");

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
        user_sub: user.sub,
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

  useEffect(() => {
  },[selectedDate])

  return (
    <>
      <header>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold leading-tight tracking-tight text-gray-900">Booking Request for Property: {propertyId}</h1>
        </div>
      </header>
      <main className="mx-auto max-w-2xl px-4 sm:px-6 sm:py-12 lg:max-w-7xl lg:px-8">
        <div>
          <br />
          <div>
          <label>Start Date: </label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
          </div>
          <br />
          <div>
            <label>End Date: </label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>
          <br />
          <button className="btn" onClick={handleBooking}>Confirm Booking</button>
        </div>
      </main>

    </>
  );
}
