import React, { useState, useContext, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { GlobalContext } from "../../provider/globalProvider.js";
import { useAuthGate } from "../../components/useAuthGate.js";
import axios from "axios";
import BACKEND_URL from "../../constants.js";

export default function ManagerDashboard() {
  const [propertyBookings, setPropertyBookings] = useState([]);
  const [propertyListing, setPropertyListings] = useState("");
  const [editableBookingId, setEditableBookingId] = useState(null);
  const [editFormData, setEditFormData] = useState({});

  const navigate = useNavigate();
  const { getAccessTokenSilently, user } = useAuthGate();
  const infoToPass = useContext(GlobalContext);

  useEffect(() => {
    fetchPropertyBookings();
    fetchPropertyListings();
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

  const fetchPropertyListings = async () => {
    try {
      const token = await getAccessTokenSilently({
        authorizationParams: {
          audience: "https://api.powderful.xyz",
          scope: "read:current_user",
        },
      });
      const response = await axios.get(`${BACKEND_URL}/properties/mine`, {
        params: { user_sub: user.sub }, // user_sub should be inside params
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setPropertyListings(response.data);
    } catch (error) {
      console.error("Error fetching property listings:", error);
      // Handle errors appropriately
    }
  };

  const handleViewDetailClick = () => {
    navigate('/listingDetails');
  }

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

  useEffect(() => {
    if (propertyBookings && propertyListing) {
      console.log(propertyBookings);
      console.log(propertyListing);
    }
  },[propertyBookings, propertyListing])

  const renderUpcomingBookingTable = () => {
    if (propertyBookings) {
      return (
        <div >
          <div className="sm:flex sm:items-center">
            <div className="sm:flex-auto">
              <h1 className="text-xl font-semibold leading-6 text-gray-900">Upcoming Bookings</h1>
              {/* <p className="mt-2 text-sm text-gray-700">
                A list of all the users in your account including their name, title, email and role.
              </p> */}
            </div>
            {/* <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
              <button
                type="button"
                className="block rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Add user
              </button>
            </div> */}
          </div>
          <div className="-mx-4 mt-6 sm:-mx-0">
            <table className="min-w-full divide-y divide-gray-300">
              <thead>
                <tr>
                  <th
                    scope="col"
                    className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-500 sm:pl-0"
                  >
                    Property Title
                  </th>
                  <th
                    scope="col"
                    className="hidden px-3 py-3.5 text-left text-sm font-semibold text-gray-500 lg:table-cell"
                  >
                    Booking Dates
                  </th>
                  <th
                    scope="col"
                    className="hidden px-3 py-3.5 text-left text-sm font-semibold text-gray-500 sm:table-cell"
                  >
                    Guest Name
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
                  {/* <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-0">
                    <span className="sr-only">Edit</span>
                  </th> */}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {propertyBookings.map((booking) => {
                  return (
                    <tr key={booking.id}>
                      <td className="w-full max-w-0 py-4 pl-4 pr-3 text-base font-medium text-gray-900 sm:w-auto sm:max-w-none sm:pl-0">
                        {booking.property.title}
                        <dl className="font-normal lg:hidden">
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
                      <td className="hidden px-3 py-4 text-sm text-gray-900 lg:table-cell">
                        {new Date(booking.start_date).toDateString()} -{" "}<span className="sm:hidden"><br /></span>{" "}{new Date(booking.end_date).toDateString()}
                      </td>
                      <td className="hidden px-3 py-4 text-sm text-gray-900 sm:table-cell">
                        {booking.guest.name}
                      </td>
                      <td className="hidden px-3 py-4 text-sm font-bold text-gray-900 sm:table-cell">
                        {(booking.payment_status).toUpperCase()}
                      </td>
                      <td className="px-3 py-4 text-sm font-bold text-gray-900">
                        {(booking.booking_status).toUpperCase()}
                      </td>
                      <td className="py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-0">
                        <NavLink
                          to="/listingDetails"
                          className="hidden text-indigo-600 hover:text-indigo-900 sm:block"
                        >
                          View
                          <span className="sr-only">
                            , {booking.property.title}
                          </span>
                        </NavLink>
                      </td>
                    </tr>
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
                    className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0"
                  >
                    Property Title
                  </th>
                  <th
                    scope="col"
                    className="hidden px-3 py-3.5 text-left text-sm font-semibold text-gray-900 lg:table-cell"
                  >
                    Booking Dates
                  </th>
                  <th
                    scope="col"
                    className="hidden px-3 py-3.5 text-left text-sm font-semibold text-gray-900 sm:table-cell"
                  >
                    Guest Name
                  </th>
                  <th
                    scope="col"
                    className="hidden px-3 py-3.5 text-left text-sm font-semibold text-gray-900 sm:table-cell"
                  >
                    Payment Status
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                  >
                    Booking Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {/* {propertyBookings.map((booking) => {
                  return (
                    <tr key={booking.id}>
                      <td className="w-full max-w-0 py-4 pl-4 pr-3 text-base font-bold text-gray-900 sm:w-auto sm:max-w-none sm:pl-0">
                        {booking.property.title}
                        <dl className="font-normal lg:hidden">
                          <dt className="sr-only">Booking Dates</dt>
                          <dd className="mt-1 truncate text-gray-700 sm: text-sm">
                            {new Date(booking.start_date).toDateString()} -{" "}<span className="sm:hidden"><br /></span>{" "}{new Date(booking.end_date).toDateString()}
                          </dd>
                          <dt className="sr-only sm:hidden">Guest Name</dt>
                          <dd className="mt-1 truncate text-gray-500 sm:hidden">
                            {booking.guest.name}
                          </dd>
                        </dl>
                      </td>
                      <td className="hidden px-3 py-4 text-sm text-gray-500 lg:table-cell">
                        {new Date(booking.start_date).toDateString()} -{" "}<span className="sm:hidden"><br /></span>{" "}{new Date(booking.end_date).toDateString()}
                      </td>
                      <td className="hidden px-3 py-4 text-sm text-gray-500 sm:table-cell">
                        {booking.guest.name}
                      </td>
                      <td className="hidden px-3 py-4 text-sm text-gray-500 sm:table-cell">
                        {booking.payment_status}
                      </td>
                      <td className="px-3 py-4 text-sm text-gray-500">
                        {booking.booking_status}
                      </td>
                      <td className="py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-0">
                        <a
                          href="#"
                          className="hidden text-indigo-600 hover:text-indigo-900 sm:block"
                        >
                          View
                          <span className="sr-only">
                            , {booking.property.title}
                          </span>
                        </a>
                      </td>
                    </tr>
                  );
                })} */}
                <tr>No bookings at the moment.</tr>
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
                    //console.log(listing);
                    // let dateDifference = new Date(booking.end_date) - new Date(booking.start_date);
                    // let totalNights = dateDifference / 1000 / 60 / 60 / 24;
                    return (
                      <div
                        key={listing.id}
                        className="border-b border-t border-gray-200 bg-white shadow-sm sm:rounded-lg sm:border"
                      >
                        {/* <h3 className="sr-only">
                          Booking placed on <time dateTime={order.createdDatetime}>{order.createdDate}</time>
                        </h3> */}
      
                        {/* <div className="flex items-center border-b border-gray-200 p-4 sm:grid sm:grid-cols-3 sm:gap-x-6 sm:p-6">
                          <dl className="grid flex-1 grid-cols-2 gap-x-6 text-sm sm:col-span-3 sm:grid-cols-3 lg:col-span-3">
                            <div>
                              <dt className="font-medium text-gray-900">Booking Period</dt>
                              <dd className="mt-1 text-gray-500">
                                <time dateTime={booking.start_date}>{new Date(booking.start_date).toDateString()} - <span className="sm:hidden"><br /></span> {new Date(booking.end_date).toDateString()}</time>
                              </dd>
                            </div>
                            <div className="hidden sm:block">
                              <dt className="font-medium text-gray-900">Booking ID</dt>
                              <dd className="mt-1 text-gray-500">{booking.id}</dd>
                            </div>
                            <div>
                              <dt className="font-medium text-gray-900">Total amount</dt>
                              <dd className="mt-1 font-medium text-gray-900">¥ {booking.property.roomrate * totalNights} <span className="text-gray-500 font-normal"><span className="sm:hidden"><br /></span>( {totalNights} nights )</span></dd>
                            </div>
                          </dl>
      
                          <Menu as="div" className="relative flex justify-end lg:hidden">
                            <div className="flex items-center">
                              <Menu.Button className="-m-2 flex items-center p-2 text-gray-400 hover:text-gray-500">
                                <span className="sr-only">Options for booking {booking.number}</span>
                                <EllipsisVerticalIcon className="h-6 w-6" aria-hidden="true" />
                              </Menu.Button>
                            </div>
      
                            <Transition
                              as={Fragment}
                              enter="transition ease-out duration-100"
                              enterFrom="transform opacity-0 scale-95"
                              enterTo="transform opacity-100 scale-100"
                              leave="transition ease-in duration-75"
                              leaveFrom="transform opacity-100 scale-100"
                              leaveTo="transform opacity-0 scale-95"
                            >
                              <Menu.Items className="absolute right-0 z-10 mt-2 w-40 origin-bottom-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                                <div className="py-1">
                                  <Menu.Item>
                                    {({ active }) => (
                                      <a
                                        href={order.href}
                                        className={classNames(
                                          active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                                          'block px-4 py-2 text-sm'
                                        )}
                                      >
                                        View
                                      </a>
                                    )}
                                  </Menu.Item>
                                  <Menu.Item>
                                    {({ active }) => (
                                      <a
                                        href={order.invoiceHref}
                                        className={classNames(
                                          active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                                          'block px-4 py-2 text-sm'
                                        )}
                                      >
                                        Invoice
                                      </a>
                                    )}
                                  </Menu.Item>
                                </div>
                              </Menu.Items>
                            </Transition>
                          </Menu>
      
                          <div className="hidden lg:col-span-2 lg:flex lg:items-center lg:justify-end lg:space-x-4">
                            <a
                              href={order.href}
                              className="flex items-center justify-center rounded-md border border-gray-300 bg-white px-2.5 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                            >
                              <span>View Order</span>
                              <span className="sr-only">{order.number}</span>
                            </a>
                            <a
                              href={order.invoiceHref}
                              className="flex items-center justify-center rounded-md border border-gray-300 bg-white px-2.5 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                            >
                              <span>View Invoice</span>
                              <span className="sr-only">for order {order.number}</span>
                            </a>
                          </div>
                        </div> */}
      
                        {/* Products */}
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
                                {/* <p className="mt-2 sm:mt-0">¥ {listing.roomrate} / night</p> */}
                                {/* <p className="hidden text-gray-900 sm:mt-2 sm:block text-xs">
                                  {listing.description}
                                </p> */}
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
                            {/* <div className="mt-6 sm:flex sm:justify-between">
                              <div className="flex items-center">
                                <CheckCircleIcon className="h-5 w-5 text-green-500" aria-hidden="true" />
                                <p className="ml-2 text-sm font-medium text-gray-500">
                                  Booking Status: {(booking.booking_status).toUpperCase()}
                                </p>
                              </div>
    
                              <div className="mt-6 flex items-center space-x-4 divide-x divide-gray-200 border-t border-gray-200 pt-4 text-sm font-medium sm:ml-4 sm:mt-0 sm:border-none sm:pt-0">
                                <p className="ml-2 text-sm font-medium text-gray-500">
                                  Booked On: <time dateTime={booking.createdAt}>{new Date(booking.createdAt).toDateString()}</time>
                                </p>
                                <div className="flex flex-1 justify-center">
                                  <a
                                    href={product.href}
                                    className="whitespace-nowrap text-indigo-600 hover:text-indigo-500"
                                  >
                                    View product
                                  </a>
                                </div>
                                <div className="flex flex-1 justify-center pl-4">
                                  <a href="#" className="whitespace-nowrap text-indigo-600 hover:text-indigo-500">
                                    Buy again
                                  </a>
                                </div>
                              </div>
                            </div> */}
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
                  <div className="border-b border-t border-gray-200 bg-white shadow-sm sm:rounded-lg sm:border">
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
          <h1 className="text-3xl font-bold leading-tight tracking-tight text-gray-900">Manager Dashboard</h1>
        </div>
      </header>
      <main className="mx-auto max-w-2xl px-4 sm:px-6 sm:py-12 lg:max-w-7xl lg:px-8 py-8">
        {renderUpcomingBookingTable()}
        {renderManagerListing()}
      </main>
    </>

    // <div className="bg-white">
    //   <div className="mx-auto max-w-7xl sm:px-2 lg:px-8">
    //     <div className="mx-auto max-w-2xl px-4 lg:max-w-4xl lg:px-0">
    //       <h2 className="text-3xl font-bold mt-4 text-gray-900 sm:text-3xl">
    //         Your Property Bookings
    //       </h2>
    //       <p className="mt-2 text-sm text-gray-500">
    //         Manage and check the status of all your bookings
    //       </p>
    //     </div>
    //   </div>

    //   <div className="mt-16">
    //     <div className="mx-auto max-w-7xl sm:px-2 lg:px-8">
    //       <div className="mx-auto max-w-2xl space-y-8 sm:px-4 lg:max-w-4xl lg:px-0">
    //         {/* Table for displaying bookings */}
    //         <table className="min-w-full divide-y divide-gray-200">
    //           <thead>
    //             <tr>
    //               <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
    //                 Guest ID
    //               </th>
    //               <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
    //                 Property ID
    //               </th>
    //               <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
    //                 Start Date
    //               </th>
    //               <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
    //                 End Date
    //               </th>
    //               <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
    //                 Booking Status
    //               </th>
    //               <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
    //                 Payment Status
    //               </th>
    //               <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
    //                 Review of Guest
    //               </th>
    //               <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
    //                 Comment of Guest
    //               </th>
    //             </tr>
    //           </thead>
    //           <tbody className="bg-white divide-y divide-gray-200">
    //             {propertyBookings.map((booking) => (
    //               <tr key={booking.id}>
    //                 {/* Editable row */}
    //                 {editableBookingId === booking.id ? (
    //                   <>
    //                     <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
    //                       {booking.guest_id}
    //                     </td>
    //                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
    //                       {booking.property_id}
    //                     </td>
    //                     {/* Editable fields */}
    //                     <td>
    //                       <input
    //                         type="date"
    //                         name="start_date"
    //                         value={editFormData.start_date}
    //                         onChange={handleEditFormChange}
    //                       />
    //                     </td>
    //                     <td>
    //                       <input
    //                         type="date"
    //                         name="end_date"
    //                         value={editFormData.end_date}
    //                         onChange={handleEditFormChange}
    //                       />
    //                     </td>
    //                     <td>
    //                       <input
    //                         type="text"
    //                         name="booking_status"
    //                         value={editFormData.booking_status}
    //                         onChange={handleEditFormChange}
    //                       />
    //                     </td>
    //                     <td>
    //                       <input
    //                         type="text"
    //                         name="payment_status"
    //                         value={editFormData.payment_status}
    //                         onChange={handleEditFormChange}
    //                       />
    //                     </td>
    //                     {/* More editable fields as necessary */}
    //                     <td>
    //                       <button onClick={handleSaveClick}>Save</button>
    //                       <button onClick={handleCancelClick}>Cancel</button>
    //                     </td>
    //                   </>
    //                 ) : (
    //                   <>
    //                     {/* Non-editable fields */}
    //                     <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
    //                       {booking.guest_id}
    //                     </td>
    //                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
    //                       {booking.property_id}
    //                     </td>
    //                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
    //                       {booking.start_date}
    //                     </td>
    //                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
    //                       {booking.end_date}
    //                     </td>
    //                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
    //                       {booking.booking_status}
    //                     </td>
    //                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
    //                       {booking.payment_status}
    //                     </td>
    //                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
    //                       {booking.review_of_guest}
    //                     </td>
    //                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
    //                       {booking.comment_of_guest}
    //                     </td>

    //                     {/* More non-editable fields as necessary */}
    //                     <td>
    //                       <button onClick={() => handleEditClick(booking)}>
    //                         Edit
    //                       </button>
    //                     </td>
    //                   </>
    //                 )}
    //               </tr>
    //             ))}
    //           </tbody>
    //         </table>
    //       </div>
    //     </div>
    //   </div>
    // </div>
  );
}
