import { useState, useEffect, useContext, Fragment } from "react";
import { useNavigate } from "react-router-dom";
import { Menu, Transition } from '@headlessui/react'
import { GlobalContext } from "../../provider/globalProvider.js";
import { useAuthGate } from "../../components/useAuthGate.js";
import { useApi } from "../../components/api.js";
import BACKEND_URL from "../../constants.js";
import axios from "axios";

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

export default function GuestDashboard() {
  const infoToPass = useContext(GlobalContext);
  const navigate = useNavigate();
  const { isAuthenticated, isLoading, getAccessTokenSilently, user } =
    useAuthGate();
  const { get } = useApi();

  // Declare state here.
  const [bookings, setBookings] = useState([]);
  const [bookingItems, setBookingItems] = useState("");

  // Your code here.

  useEffect(() => {
    const fetchBookings = async () => {
      if (!isAuthenticated) return;

      try {
        // Retrieve the internal user ID stored in local storage
        const internalUserId = localStorage.getItem("internalUserId");

        const response = await get(
          `${BACKEND_URL}/bookings/user?guest_id=${encodeURIComponent(
            internalUserId
          )}`
        );
        setBookings(response.data);
      } catch (error) {
        console.error("Error fetching bookings", error);
      }
    };

    fetchBookings();
  }, [isAuthenticated]);

  useEffect(() => {
    allBookings();
  },[bookings])

  if (isLoading) {
    return <div>Loading...</div>; // Show loading indicator while loading
  }

  const allBookings = () => {
    if (bookings) {
      setBookingItems (
        <div className="bg-white">
          <div className="">
            <div className="mx-auto max-w-7xl sm:px-2 lg:px-8">
              <div className="mx-auto max-w-2xl px-4 lg:max-w-4xl lg:px-0">
                <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">All Bookings</h1>
                <p className="mt-2 text-sm text-gray-500">
                  Manage and check and the status of all your bookings
                </p>
              </div>
            </div>
    
            <div className="mt-16">
              <h2 className="sr-only">Recent booking</h2>
              <div className="mx-auto max-w-7xl sm:px-2 lg:px-8">
                <div className="mx-auto max-w-2xl space-y-8 sm:px-4 lg:max-w-4xl lg:px-0">
                  {bookings.map((booking) => {
                    let dateDifference = new Date(booking.end_date) - new Date(booking.start_date);
                    let totalNights = dateDifference / 1000 / 60 / 60 / 24;
                    return (
                      <div
                        key={booking.id}
                        className="border-b border-t border-gray-200 bg-white shadow-sm sm:rounded-lg sm:border"
                      >
                        {/* <h3 className="sr-only">
                          Booking placed on <time dateTime={order.createdDatetime}>{order.createdDate}</time>
                        </h3> */}
      
                        <div className="flex items-center border-b border-gray-200 p-4 sm:grid sm:grid-cols-3 sm:gap-x-6 sm:p-6">
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
      
                          {/* <Menu as="div" className="relative flex justify-end lg:hidden">
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
                          </div> */}
                        </div>
      
                        {/* Products */}
                        <h4 className="sr-only">Booking</h4>
                        <ul className="divide-y divide-gray-200">

                          <li key={booking.property.id} className="p-4 sm:p-6">
                            <div className="flex items-center sm:items-start">
                              <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg bg-gray-200 sm:h-40 sm:w-40">
                                <img
                                  src={booking.property_asset.file_link}
                                  alt="property_img"
                                  className="h-full w-full object-cover object-center"
                                />
                              </div>
                              <div className="ml-6 flex-1 text-sm">
                                <div className="font-medium text-gray-900 sm:flex sm:justify-between">
                                  <h5 className=" font-bold text-base">{booking.property.title}</h5>
                                </div>
                                {/* <p className="hidden text-gray-500 sm:mt-2 sm:block">{booking.property.description}</p> */}
                                <p className="mt-2 sm:mt-0">¥ {booking.property.roomrate} / night</p>
                                <p className="hidden text-gray-500 sm:mt-2 sm:block text-xs">
                                  <span className="font-bold">Property Type:</span>{" "}
                                  {booking.property.propertytype}
                                </p>
                                <p className="hidden text-gray-500 sm:mt-2 sm:block text-xs">
                                  <span className="font-bold">Configuration:</span>{" "}
                                  {booking.property.configuration}
                                </p>
                                <p className="hidden text-gray-500 sm:mt-2 sm:block text-xs">
                                  <span className="font-bold">Amenities:</span>{" "}
                                  {booking.property.amenities}
                                </p>
                              </div>
                            </div>
    
                            <div className="mt-6 sm:flex sm:justify-between">
                              <div className="flex items-center">
                                {/* <CheckCircleIcon className="h-5 w-5 text-green-500" aria-hidden="true" /> */}
                                <p className="ml-2 text-sm font-medium text-gray-500">
                                  Booking Status: {(booking.booking_status).toUpperCase()}
                                </p>
                              </div>
    
                              <div className="mt-6 flex items-center space-x-4 divide-x divide-gray-200 border-t border-gray-200 pt-4 text-sm font-medium sm:ml-4 sm:mt-0 sm:border-none sm:pt-0">
                                <p className="ml-2 text-sm font-medium text-gray-500">
                                  Booked On: <time dateTime={booking.createdAt}>{new Date(booking.createdAt).toDateString()}</time>
                                </p>
                                {/* <div className="flex flex-1 justify-center">
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
                                </div> */}
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
    }
  }

  return (
    <>
      {bookingItems}
    </>
  );
}
