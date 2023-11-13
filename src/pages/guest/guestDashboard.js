import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { GlobalContext } from "../../provider/globalProvider.js";
import { useAuthGate } from "../../components/useAuthGate.js";
import { useApi } from "../../components/api.js";
import BACKEND_URL from "../../constants.js";

export default function GuestDashboard() {
  const infoToPass = useContext(GlobalContext);
  const navigate = useNavigate();
  const { isAuthenticated, isLoading, getAccessTokenSilently, user } =
    useAuthGate();
  const { get } = useApi();

  // Declare state here.
  const [bookings, setBookings] = useState([]); // Corrected this line

  // Your code here.

  useEffect(() => {
    const fetchBookings = async () => {
      if (!isAuthenticated) return;

      try {
        const token = await getAccessTokenSilently();
        // Retrieve the internal user ID stored in local storage
        const internalUserId = localStorage.getItem("internalUserId");

        const response = await get(
          `${BACKEND_URL}/bookings/user?guest_id=${encodeURIComponent(
            internalUserId
          )}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        setBookings(response.data);
      } catch (error) {
        console.error("Error fetching bookings", error);
      }
    };

    fetchBookings();
  }, [isAuthenticated, getAccessTokenSilently, get]);

  if (isLoading) {
    return <div>Loading...</div>; // Show loading indicator while loading
  }

  const bookingsList = bookings.map((booking) => (
    <div key={booking.id}>
      <p>Booking ID: {booking.id}</p>
      <p>Property ID: {booking.property_id}</p>
      <p>Start Date: {booking.start_date}</p>
      <p>End Date: {booking.end_date}</p>
    </div>
  ));

  return (
    <>
      <h1 className="text-4xl font-bold">Guest Dashboard</h1>
      <br />
      <h2>User Email: {user.email}</h2>
      <h1>Trips</h1>
      <div>{bookingsList}</div>
    </>
  );
}
