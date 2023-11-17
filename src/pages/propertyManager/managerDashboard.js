import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { GlobalContext } from "../../provider/globalProvider.js";
import { useAuthGate } from "../../components/useAuthGate.js";
import axios from "axios";
import BACKEND_URL from "../../constants.js";

export default function ManagerDashboard() {
  const [propertyBookings, setPropertyBookings] = useState([]);
  const [editableBookingId, setEditableBookingId] = useState(null);
  const [editFormData, setEditFormData] = useState({});

  const navigate = useNavigate();
  const { getAccessTokenSilently, user } = useAuthGate();
  const infoToPass = useContext(GlobalContext);

  useEffect(() => {
    fetchPropertyBookings();
  }, []);

  const fetchPropertyBookings = async () => {
    try {
      const token = await getAccessTokenSilently({
        authorizationParams: {
          audience: "https://api.powderful.xyz",
          scope: "read:current_user",
        },
      });
      const response = await axios.get(`${BACKEND_URL}/bookings/mine`, {
        params: { user_sub: user.sub },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setPropertyBookings(response.data);
    } catch (error) {
      console.error("Error fetching property bookings:", error);
    }
  };

  const handleEditClick = (booking) => {
    setEditableBookingId(booking.id);
    setEditFormData({
      start_date: booking.start_date,
      end_date: booking.end_date,
      booking_status: booking.booking_status,
      payment_status: booking.payment_status,
      // Add other fields as needed
    });
  };

  const handleCancelClick = () => {
    setEditableBookingId(null);
  };

  const handleEditFormChange = (event) => {
    setEditFormData({
      ...editFormData,
      [event.target.name]: event.target.value,
    });
  };

  const handleSaveClick = async () => {
    try {
      const token = await getAccessTokenSilently({
        authorizationParams: {
          audience: "https://api.powderful.xyz",
          scope: "read:current_user",
        },
      });
      await axios.put(
        `${BACKEND_URL}/bookings/${editableBookingId}`,
        editFormData,
        {
          params: { user_sub: user.sub },

          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      fetchPropertyBookings();
      setEditableBookingId(null);
    } catch (error) {
      console.error("Error updating booking:", error);
    }
  };

  return (
    <div className="bg-white">
      <div className="mx-auto max-w-7xl sm:px-2 lg:px-8">
        <div className="mx-auto max-w-2xl px-4 lg:max-w-4xl lg:px-0">
          <h2 className="text-3xl font-bold mt-4 text-gray-900 sm:text-3xl">
            Your Property Bookings
          </h2>
          <p className="mt-2 text-sm text-gray-500">
            Manage and check the status of all your bookings
          </p>
        </div>
      </div>

      <div className="mt-16">
        <div className="mx-auto max-w-7xl sm:px-2 lg:px-8">
          <div className="mx-auto max-w-2xl space-y-8 sm:px-4 lg:max-w-4xl lg:px-0">
            {/* Table for displaying bookings */}
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Guest ID
                  </th>
                  <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Property ID
                  </th>
                  <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Start Date
                  </th>
                  <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    End Date
                  </th>
                  <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Booking Status
                  </th>
                  <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Payment Status
                  </th>
                  <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Review of Guest
                  </th>
                  <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Comment of Guest
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {propertyBookings.map((booking) => (
                  <tr key={booking.id}>
                    {/* Editable row */}
                    {editableBookingId === booking.id ? (
                      <>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {booking.guest_id}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {booking.property_id}
                        </td>
                        {/* Editable fields */}
                        <td>
                          <input
                            type="date"
                            name="start_date"
                            value={editFormData.start_date}
                            onChange={handleEditFormChange}
                          />
                        </td>
                        <td>
                          <input
                            type="date"
                            name="end_date"
                            value={editFormData.end_date}
                            onChange={handleEditFormChange}
                          />
                        </td>
                        <td>
                          <input
                            type="text"
                            name="booking_status"
                            value={editFormData.booking_status}
                            onChange={handleEditFormChange}
                          />
                        </td>
                        <td>
                          <input
                            type="text"
                            name="payment_status"
                            value={editFormData.payment_status}
                            onChange={handleEditFormChange}
                          />
                        </td>
                        {/* More editable fields as necessary */}
                        <td>
                          <button onClick={handleSaveClick}>Save</button>
                          <button onClick={handleCancelClick}>Cancel</button>
                        </td>
                      </>
                    ) : (
                      <>
                        {/* Non-editable fields */}
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {booking.guest_id}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {booking.property_id}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {booking.start_date}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {booking.end_date}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {booking.booking_status}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {booking.payment_status}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {booking.review_of_guest}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {booking.comment_of_guest}
                        </td>

                        {/* More non-editable fields as necessary */}
                        <td>
                          <button onClick={() => handleEditClick(booking)}>
                            Edit
                          </button>
                        </td>
                      </>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
