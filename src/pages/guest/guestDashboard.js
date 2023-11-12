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
      if (!isAuthenticated) return; // Exit if not authenticated

      try {
        const response = await get(`${BACKEND_URL}/bookings/`);
        setBookings(response.data); // Assuming the response data is the array of bookings
      } catch (error) {
        console.error("Error fetching bookings", error);
        // Handle the error, perhaps by setting an error state
      }
    };

    fetchBookings();
  }, [isAuthenticated, get]); // Dependency array includes get to silence useEffect warning

  if (isLoading) {
    return <div>Loading...</div>; // Show loading indicator while loading
  }

  // Render the fetched bookings
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
      <div>
        <h2>User Email: {user.email}</h2>
      </div>
      <h1>Trips</h1>
      <div>{bookingsList}</div>
    </>
  );
}
