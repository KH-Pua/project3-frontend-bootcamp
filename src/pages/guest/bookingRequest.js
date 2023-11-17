import { useState, useContext, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { GlobalContext } from "../../provider/globalProvider.js";
import { useAuthGate } from "../../components/useAuthGate.js";
import { useApi } from "../../components/api.js";
import BACKEND_URL from "../../constants.js";
import axios from "axios";

export default function BookingRequest() {
  const {
    selectedDate,
    setSelectedDate,
    adultNumber,
    setAdultNumber,
    childrenNumber,
    setChildrenNumber,
  } = useContext(GlobalContext);
  const navigate = useNavigate();
  const { isAuthenticated, getAccessTokenSilently, user } = useAuthGate();
  const { post } = useApi();

  const [selectedListing, setSelectedListing] = useState("");
  // "bookingStatus" and "paymentStatus" need to determine after integrating Stripe API
  const [bookingStatus, setBookingStatus] = useState("pending");
  const [paymentStatus, setPaymentStatus] = useState("unpaid");

  // Get propertyId from route params
  const { propertyId } = useParams();

  const handleBooking = async (e) => {
    e.preventDefault();

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
        start_date: selectedDate.startDate,
        end_date: selectedDate.endDate,
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

      // Create Stripe checkout session
      const paymentAmount = handlePrice({
        outputType: "bookingTotal",
        selectedDate,
      }); // Calculate total amount
      const sessionResponse = await axios.post(
        `${BACKEND_URL}/payments/create-checkout-session`,
        {
          amount: paymentAmount,
          description: "Booking Payment",
          bookingId: response.data.id,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // Redirect to Stripe checkout
      const stripe = window.Stripe(
        "pk_test_51ODGWPAJDjTgvIdv30TbAU8agqkmQlUXvPJAhJimYkJuSW0nGrl4X46miHqYts9eGde9RYfGjNUUQnVr2XZCaijr00WNGcXIao"
      ); // Replace with Stripe publishable key
      await stripe.redirectToCheckout({
        sessionId: sessionResponse.data.sessionId,
      });
    } catch (error) {
      console.error("Error in booking or payment process", error);
      // Handle error
    }
  };

  const handlePrice = ({ outputType, selectedDate }) => {
    if (outputType === "totalNightPrice") {
      if (selectedDate) {
        let dateDifference =
          new Date(selectedDate.endDate) - new Date(selectedDate.startDate);
        let totalNights = dateDifference / 1000 / 60 / 60 / 24;
        return selectedListing.roomrate * totalNights;
      }
    } else if (outputType === "bookingFee") {
      let bookingFee =
        handlePrice({ outputType: "totalNightPrice", selectedDate }) * 0.025;
      return bookingFee;
    } else if (outputType === "vat") {
      let vat =
        handlePrice({ outputType: "totalNightPrice", selectedDate }) * 0.1;
      return vat;
    } else if (outputType === "bookingTotal") {
      let bookingTotal =
        handlePrice({ outputType: "totalNightPrice", selectedDate }) +
        handlePrice({ outputType: "bookingFee", selectedDate }) +
        handlePrice({ outputType: "vat", selectedDate });
      return bookingTotal;
    }
  };

  useEffect(() => {
    const query = new URLSearchParams(window.location.search);

    if (query.get("success")) {
      // Handle successful payment here
      console.log("Payment successful");
      // Update booking payment status
      // Redirect to a success page or display a success message
    }

    if (query.get("canceled")) {
      // Handle payment cancellation here
      console.log("Payment canceled");
      // Redirect to a failure page or display a cancellation message
    }
  }, []);

  useEffect(() => {
    const fetchListing = async () => {
      if (propertyId) {
        try {
          let listing = await axios.get(
            `${BACKEND_URL}/properties/${propertyId}`
          );
          setSelectedListing(listing.data);
        } catch (error) {
          console.error("Error fetching listing", error);
        }
      }
    };
    fetchListing();
  }, []);

  useEffect(() => {
    if (selectedDate && adultNumber && childrenNumber && selectedListing) {
      renderBookingConfirmation();
    }
  }, [selectedDate, adultNumber, childrenNumber, selectedListing]);

  const renderBookingConfirmation = () => {
    if (selectedListing) {
      let dateDifference =
        new Date(selectedDate.endDate) - new Date(selectedDate.startDate);
      let totalNights = dateDifference / 1000 / 60 / 60 / 24;
      return (
        <div className="bg-white">
          <div>
            {/* <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Booking Summary</h1> */}
            <form className="mt-12 lg:grid lg:grid-cols-12 lg:items-start lg:gap-x-12 xl:gap-x-16">
              <section aria-labelledby="cart-heading" className="lg:col-span-7">
                <h2 id="cart-heading" className="sr-only">
                  Items in your shopping cart
                </h2>

                <ul className="divide-y divide-gray-200 border-b border-t border-gray-200">
                  <li key={selectedListing.id} className="flex py-6 sm:py-10">
                    <div className="flex-shrink-0">
                      {/* <img
                        src={product.imageSrc}
                        alt={product.imageAlt}
                        className="h-24 w-24 rounded-md object-cover object-center sm:h-48 sm:w-48"
                      /> */}
                    </div>

                    <div className="ml-4 flex flex-1 flex-col justify-between sm:ml-6">
                      <div className="relative sm:grid sm:grid-cols-1 sm:gap-x-6 sm:pr-0">
                        <div className="flex flex-col gap-2">
                          <div className="flex justify-between">
                            <h3 className=" text-lg font-bold text-gray-800">
                              {selectedListing.title}
                              <p className=" text-gray-500 sm:mt-2 sm:block text-xs mt-2">
                                {selectedListing.address}
                              </p>
                            </h3>
                          </div>
                          <div className="mt-1 flex text-sm">
                            {/* <p className="text-gray-500">{product.color}</p> */}
                            {/* {product.size ? (
                              <p className="ml-4 border-l border-gray-200 pl-4 text-gray-500">{product.size}</p>
                            ) : null} */}
                          </div>
                          <p className=" text-gray-500 sm:mt-2 sm:block text-xs">
                            <span className="font-bold text-gray-800">
                              Property Type:
                            </span>{" "}
                            {selectedListing.propertytype}
                          </p>
                          <p className=" text-gray-500 sm:mt-2 sm:block text-xs">
                            <span className="font-bold text-gray-800">
                              Configuration:
                            </span>{" "}
                            {selectedListing.configuration}
                          </p>
                          <p className=" text-gray-500 sm:mt-2 sm:block text-xs">
                            <span className="font-bold text-gray-800">
                              Amenities:
                            </span>{" "}
                            {selectedListing.amenities}
                          </p>
                          <br />
                          <dl className="grid flex-1 grid-cols-2 gap-x-6 text-sm sm:col-span-2 sm:grid-cols-2 lg:col-span-2">
                            <div>
                              <dt className="font-medium text-gray-900">
                                Selected Dates:
                              </dt>
                              <dd className="mt-1 text-gray-500">
                                <time dateTime={selectedDate.startDate}>
                                  {new Date(
                                    selectedDate.startDate
                                  ).toDateString()}{" "}
                                  -{" "}
                                  <span className="sm:hidden">
                                    <br />
                                  </span>{" "}
                                  {new Date(
                                    selectedDate.endDate
                                  ).toDateString()}
                                </time>
                              </dd>
                            </div>
                            <div>
                              <dt className="font-medium text-gray-900">
                                Guests:{" "}
                              </dt>
                              <dd className="mt-1 text-gray-500">
                                {adultNumber} Adult, {childrenNumber} Children
                              </dd>
                            </div>
                          </dl>
                        </div>
                      </div>
                    </div>
                  </li>
                </ul>
              </section>

              {/* Order summary */}
              <section
                aria-labelledby="summary-heading"
                className="mt-16 rounded-lg bg-gray-50 px-4 py-6 sm:p-6 lg:col-span-5 lg:mt-0 lg:p-8"
              >
                <h2
                  id="summary-heading"
                  className="text-lg font-medium text-gray-900"
                >
                  Price Breakdown
                </h2>

                <dl className="mt-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <dt className="text-sm text-gray-600">
                      ¥ {selectedListing.roomrate} x {totalNights} nights
                    </dt>
                    <dd className="text-sm font-medium text-gray-900">
                      ¥{" "}
                      {handlePrice({
                        outputType: "totalNightPrice",
                        selectedDate,
                      })}
                    </dd>
                  </div>
                  <div className="flex items-center justify-between border-t border-gray-200 pt-4">
                    <dt className="flex items-center text-sm text-gray-600">
                      <span>Booking Fee</span>
                      {/* <a href="#" className="ml-2 flex-shrink-0 text-gray-400 hover:text-gray-500">
                      <span className="sr-only">Learn more about how shipping is calculated</span>
                      <QuestionMarkCircleIcon className="h-5 w-5" aria-hidden="true" />
                    </a> */}
                    </dt>
                    <dd className="text-sm font-medium text-gray-900">
                      ¥{" "}
                      {handlePrice({ outputType: "bookingFee", selectedDate })}
                    </dd>
                  </div>
                  <div className="flex items-center justify-between border-t border-gray-200 pt-4">
                    <dt className="flex text-sm text-gray-600">
                      <span>VAT 10%</span>
                      {/* <a href="#" className="ml-2 flex-shrink-0 text-gray-400 hover:text-gray-500">
                      <span className="sr-only">Learn more about how tax is calculated</span>
                      <QuestionMarkCircleIcon className="h-5 w-5" aria-hidden="true" />
                    </a> */}
                    </dt>
                    <dd className="text-sm font-medium text-gray-900">
                      ¥ {handlePrice({ outputType: "vat", selectedDate })}
                    </dd>
                  </div>
                  <div className="flex items-center justify-between border-t border-gray-200 pt-4">
                    <dt className="text-base font-medium text-gray-900">
                      Booking total
                    </dt>
                    <dd className="text-base font-medium text-gray-900">
                      ¥{" "}
                      {handlePrice({
                        outputType: "bookingTotal",
                        selectedDate,
                      })}
                    </dd>
                  </div>
                </dl>

                <div className="mt-6">
                  <button
                    onClick={(e) => handleBooking(e)}
                    className="w-full rounded-md border border-transparent bg-indigo-600 px-4 py-3 text-base font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-50"
                  >
                    Confirm & Pay
                  </button>
                </div>
              </section>
            </form>
          </div>
        </div>
      );
    }
  };

  return (
    <>
      <header>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold leading-tight tracking-tight text-gray-900">
            Booking Request
          </h1>
        </div>
      </header>
      <main className="mx-auto max-w-2xl px-4 sm:px-6 sm:py-6 lg:max-w-7xl lg:px-8">
        {renderBookingConfirmation()}
      </main>
    </>
  );
}
