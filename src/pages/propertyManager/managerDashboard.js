import React, { useState, useContext, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import Datepicker from "react-tailwindcss-datepicker";
import { GlobalContext } from "../../provider/globalProvider.js";
import { useAuthGate } from "../../components/useAuthGate.js";
import axios from "axios";
import BACKEND_URL from "../../constants.js";

export default function ManagerDashboard() {
  const [propertyBookings, setPropertyBookings] = useState("");
  const [propertyListing, setPropertyListings] = useState("");
  const [editableBookingId, setEditableBookingId] = useState(null);
  const [editFormData, setEditFormData] = useState({});
  const [selectedDateObj, setSelectedDateObj] = useState("");
  const [propertyManager, setpropertyManager] = useState("");
  const [propertyManagerValidationMessage, setPropertyManagerValidationMessage] = useState("");

  const navigate = useNavigate();
  const { getAccessTokenSilently, user } = useAuthGate();
  const infoToPass = useContext(GlobalContext);

  useEffect(() => {
    fetchPropertyBookings();
    fetchPropertyListings();
    validatePropertyManager();
  }, []);

  useEffect(() => {
    setEditFormData({
      ...editFormData,
      start_date: selectedDateObj.startDate,
      end_date: selectedDateObj.endDate,
    });
  },[selectedDateObj])

  useEffect(() => {
    if (propertyManager) {
      setPropertyManagerValidationMessage("")
    } else {
      setPropertyManagerValidationMessage(
        <p>Please register as a property manager to proceed.</p>
      )
    }
  },[propertyManager])

  const validatePropertyManager = async () => {
    try {
      const token = await getAccessTokenSilently({
        authorizationParams: {
          audience: "https://api.powderful.xyz",
          scope: "read:current_user",
        },
      });
      const response = await axios.get(`${BACKEND_URL}/propertymanagers/mine`, {
        params: { user_sub: user.sub },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setpropertyManager(response.data);
    } catch (error) {
      console.error("Error fetching property manager:", error);
    }
  } 

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

  const fetchPropertyListings = async () => {
    try {
      const token = await getAccessTokenSilently({
        authorizationParams: {
          audience: "https://api.powderful.xyz",
          scope: "read:current_user",
        },
      });
      const response = await axios.get(`${BACKEND_URL}/properties/mine`, {
        params: { user_sub: user.sub }, 
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setPropertyListings(response.data);
    } catch (error) {
      console.error("Error fetching property listings:", error);
    }
  };

  const handleEditClick = (booking) => {
    setEditableBookingId(booking.id);
    setEditFormData({
      start_date: booking.start_date,
      end_date: booking.end_date,
      booking_status: booking.booking_status,
      payment_status: booking.payment_status,
    });
    setSelectedDateObj({
      startDate: booking.start_date,
      endDate: booking.end_date,
    })
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

  const handleDateChange = (dateObj) => {
    setSelectedDateObj(dateObj);
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

  const nonEditableRow = (booking) => {
    return (
      <tr key={booking.id}>
      <td className="w-full max-w-0 py-4 pl-4 pr-3 text-base font-medium text-gray-900 sm:w-auto sm:max-w-none sm:pl-0">
        {booking.id}
        <dl className="font-normal lg:hidden">
          <dt className="sr-only">Property Title</dt>
          <dd className="mt-1 truncate text-gray-900 sm: text-sm font-bold">
            {booking.property.title}
          </dd>
          <dt className="sr-only">Booking Dates</dt>
          <dd className="mt-1 truncate text-gray-700 sm: text-sm">
            {new Date(booking.start_date).toDateString()} -{" "}<span className="sm:hidden"><br /></span>{" "}{new Date(booking.end_date).toDateString()}
          </dd>
          <br />
          <dt className="sr-only sm:hidden">Guest Name</dt>
          <dd className="mt-1 truncate text-gray-500 sm:hidden text-sm">
            {booking.guest.name}
          </dd>
        </dl>
      </td>
      <td className="hidden px-3 py-4 text-sm text-gray-900 sm:table-cell">
        {booking.guest.name}
      </td>
      <td className="hidden px-3 py-4 text-sm text-gray-900 lg:table-cell font-bold">
        {booking.property.title}
      </td>
      <td className="hidden px-3 py-4 text-sm text-gray-900 lg:table-cell">
        {new Date(booking.start_date).toDateString()} -{" "}<span className="sm:hidden"><br /></span>{" "}{new Date(booking.end_date).toDateString()}
      </td>
      <td className="hidden px-3 py-4 text-sm font-bold text-gray-900 sm:table-cell">
        {(booking.payment_status).toUpperCase()}
      </td>
      <td className="px-3 py-4 text-sm font-bold text-gray-900">
        {(booking.booking_status).toUpperCase()}
      </td>
      <td className="py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-0">
        <button
          onClick={() => handleEditClick(booking)}
          className="hidden text-indigo-600 hover:text-indigo-900 sm:block"
        >
          Edit
          <span className="sr-only">
            , {booking.property.title}
          </span>
        </button>
      </td>
      </tr>
    )
  };

  const editableRow = (booking) => {
    return (
      <tr key={booking.id}>
        <td className="w-full max-w-0 py-4 pl-4 pr-3 text-base font-medium text-gray-900 sm:w-auto sm:max-w-none sm:pl-0">
          {booking.id}
          <dl className="font-normal lg:hidden">
            <dt className="sr-only">Property Title</dt>
            <dd className="mt-1 truncate text-gray-900 sm: text-sm font-bold">
              {booking.property.title}
            </dd>
            <dt className="sr-only">Booking Dates</dt>
            <dd className="mt-1 truncate text-gray-700 sm: text-sm">
              {new Date(booking.start_date).toDateString()} -{" "}
              <span className="sm:hidden">
                <br />
              </span>{" "}
              {new Date(booking.end_date).toDateString()}
            </dd>
            <br />
            <dt className="sr-only sm:hidden">Guest Name</dt>
            <dd className="mt-1 truncate text-gray-500 sm:hidden text-sm">
              {booking.guest.name}
            </dd>
          </dl>
        </td>
        <td className="hidden px-3 py-4 text-sm text-gray-900 sm:table-cell">
          {booking.guest.name}
        </td>
        <td className="hidden px-3 py-4 text-sm text-gray-900 lg:table-cell font-bold">
          {booking.property.title}
        </td>
        <td className="hidden px-3 py-4 text-sm lg:table-cell">
          <Datepicker
            id="datePicker"
            value={selectedDateObj}
            onChange={(dateObj) => handleDateChange(dateObj)}
          />
        </td>
        <td className="hidden px-3 py-4 text-sm font-bold text-gray-900 sm:table-cell ">
          <input 
            type="text"
            name="payment_status"
            value={editFormData.payment_status}
            onChange={handleEditFormChange}
            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
          />                       
        </td>
        <td className="px-3 py-4 text-sm font-bold text-gray-900">
          <input 
            type="text"
            name="booking_status"
            value={editFormData.booking_status}
            onChange={handleEditFormChange}
            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
          /> 
        </td>
        <td className="py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-0">
          <button
            onClick={handleSaveClick}
            className="hidden text-indigo-600 hover:text-indigo-900 sm:block"
          >
            Save
            <span className="sr-only">, {booking.property.title}</span>
          </button>
          <button
            onClick={handleCancelClick}
            className="hidden text-indigo-600 hover:text-indigo-900 sm:block"
          >
            Cancel
            <span className="sr-only">, {booking.property.title}</span>
          </button>
        </td>
      </tr>
    );
  }

  const renderUpcomingBookingTable = () => {
    if (propertyBookings) {
      return (
        <div >
          <div className="sm:flex sm:items-center">
            <div className="sm:flex-auto">
              <h1 className="text-xl font-semibold leading-6 text-gray-900">Upcoming Bookings</h1>
            </div>
          </div>
          <div className="-mx-4 mt-6 sm:-mx-0">
            <table className="min-w-full divide-y divide-gray-300">
              <thead>
                <tr>
                  <th
                    scope="col"
                    className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-500 sm:pl-0"
                  >
                    Booking ID
                  </th>
                  <th
                    scope="col"
                    className="hidden px-3 py-3.5 text-left text-sm font-semibold text-gray-500 lg:table-cell"
                  >
                    Guest Name 
                  </th>
                  <th
                    scope="col"
                    className="hidden px-3 py-3.5 text-left text-sm font-semibold text-gray-500 lg:table-cell"
                  >
                    Property Title
                  </th>
                  <th
                    scope="col"
                    className="hidden px-3 py-3.5 text-left text-sm font-semibold text-gray-500 sm:table-cell"
                  >
                    Booking Dates
                  </th>
                  <th
                    scope="col"
                    className="hidden px-3 py-3.5 text-left text-sm font-semibold text-gray-500 sm:table-cell"
                  >
                    Payment Status
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-3.5 text-left text-sm font-semibold text-gray-500"
                  >
                    Booking Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {propertyBookings.map((booking) => {
                  return (
                    editableBookingId === booking.id ? editableRow(booking) : nonEditableRow(booking)
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      );
    } else {
      return (
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="-mx-4 mt-8 sm:-mx-0">
            <table className="min-w-full divide-y divide-gray-300">
              <thead>
                <tr>
                  <th
                    scope="col"
                    className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-500 sm:pl-0"
                  >
                    Booking ID
                  </th>
                  <th
                    scope="col"
                    className="hidden px-3 py-3.5 text-left text-sm font-semibold text-gray-500 lg:table-cell"
                  >
                    Guest Name 
                  </th>
                  <th
                    scope="col"
                    className="hidden px-3 py-3.5 text-left text-sm font-semibold text-gray-500 lg:table-cell"
                  >
                    Property Title
                  </th>
                  <th
                    scope="col"
                    className="hidden px-3 py-3.5 text-left text-sm font-semibold text-gray-500 sm:table-cell"
                  >
                    Booking Dates
                  </th>
                  <th
                    scope="col"
                    className="hidden px-3 py-3.5 text-left text-sm font-semibold text-gray-500 sm:table-cell"
                  >
                    Payment Status
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-3.5 text-left text-sm font-semibold text-gray-500"
                  >
                    Booking Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                <tr>
                  <td className="w-full max-w-0 py-4 pl-4 pr-3 text-base font-medium text-gray-900 sm:w-auto sm:max-w-none sm:pl-0">
                    No bookings at the moment
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )
    }
  }

  const renderManagerListing = () => {
    if (propertyListing) {
      return (
        <div className=" py-14">
          <div className="sm:flex sm:items-center">
            <div className="sm:flex-auto">
              <h1 className="text-xl font-semibold leading-6 text-center text-gray-900">Listed Property</h1>
            </div>
          </div>
          <div>
            <div className="mt-6">
              <h2 className="sr-only">All Listing</h2>
              <div className="mx-auto max-w-7xl sm:px-2 lg:px-8">
                <div className="mx-auto max-w-2xl space-y-8 sm:px-4 lg:max-w-4xl lg:px-0">
                  {propertyListing.map((listing) => {
                    return (
                      <div
                        key={listing.id}
                        className="border-b border-t border-gray-200 bg-white shadow-sm sm:rounded-lg sm:border"
                      >
                        {/* Bookings */}
                        <h4 className="sr-only">Booking</h4>
                        <ul className="divide-y divide-gray-200">
  
                          <li key={listing.id} className="p-4 sm:p-6">
                            <div className="flex items-center sm:items-start">
                              <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg bg-gray-200 sm:h-40 sm:w-40">
                                <img
                                  src={listing.property_assets[0].file_link}
                                  alt="property_img"
                                  className="h-full w-full object-cover object-center"
                                />
                              </div>
                              <div className="ml-6 flex-1 text-sm">
                                <div className="font-medium text-gray-900 sm:flex sm:justify-between">
                                  <h5 className=" font-bold text-base">{listing.title}</h5>
                                </div>
                                <p className=" text-gray-500 sm:mt-2 sm:block text-sm">{listing.address}</p>
                                <p className="hidden text-gray-500 sm:mt-2 sm:block text-sm">
                                  <span className="font-bold">Property Type:</span>{" "}
                                  {listing.propertytype}
                                </p>
                                <p className="hidden text-gray-500 sm:mt-2 sm:block text-sm">
                                  <span className="font-bold">Configuration:</span>{" "}
                                  {listing.configuration}
                                </p>
                                <p className="hidden text-gray-500 sm:mt-2 sm:block text-sm">
                                  <span className="font-bold">Amenities:</span>{" "}
                                  {listing.amenities}
                                </p>
                              </div>
                            </div>
                          </li>
                        </ul>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    } else {
      return (
        <div className="bg-white">
          <div>
            <div className="mt-16">
              <h2 className="sr-only">All Listing</h2>
              <div className="mx-auto max-w-7xl sm:px-2 lg:px-8">
                <div className="mx-auto max-w-2xl space-y-8 sm:px-4 lg:max-w-4xl lg:px-0">
                  <div className="border-b border-t border-gray-200 bg-white shadow-sm sm:rounded-lg sm:border font-medium text-gray-900 p-10">
                    <p>No Listing at the moment.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    };
  };

  return (
    <>
      <header>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold leading-tight tracking-tight text-gray-900">
            Manager Dashboard
          </h1>
        </div>
      </header>
      <main className="mx-auto max-w-2xl px-4 sm:px-6 sm:py-12 lg:max-w-7xl lg:px-8 py-8">
        {propertyManager ? (
          <>
            {renderUpcomingBookingTable()}
            {renderManagerListing()}
          </>
        ) : (
          propertyManagerValidationMessage
        )}
      </main>
    </>
  );
}
