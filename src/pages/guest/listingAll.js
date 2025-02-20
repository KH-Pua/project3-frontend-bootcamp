import { useState, useEffect, useContext, Fragment } from "react";
import { Dialog, RadioGroup, Transition } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import Datepicker from "react-tailwindcss-datepicker";
import { useNavigate } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import { GlobalContext } from "../../provider/globalProvider.js";
import axios from "axios";
import BACKEND_URL from "../../constants.js";

export default function ListingAll() {
  const {
    isLoading,
    isAuthenticated,
    error,
    user,
    loginWithRedirect,
    getAccessTokenSilently,
    logout,
  } = useAuth0();

  const {selectedDate, setSelectedDate, adultNumber, setAdultNumber, childrenNumber, setChildrenNumber} = useContext(GlobalContext);
  const navigate = useNavigate();

  const [listingAll, setListingAll] = useState("");
  const [listingId, setListingId] = useState(0);
  const [alert, setAlert] = useState("");
  const [open, setOpen] = useState(false);

  const handleUserData = async () => {
    try {
      const token = await getAccessTokenSilently({
        authorizationParams: {
          audience: "https://api.powderful.xyz",
          scope: "read:current_user",
        },
      });

      localStorage.setItem("accessToken", token);

      const userData = {
        email: user.email,
        name: user.name,
        user_sub: user.sub,
      };

      // Send a request to check if the user exists or needs to be created
      const response = await axios.post(
        `${BACKEND_URL}/guests/check-or-create`,
        userData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.internalUserId) {
        // Store the internal user ID for later use
        localStorage.setItem("internalUserId", response.data.internalUserId);
      }
    } catch (error) {
      console.error("Error during user data handling", error);
    }
  };

  const handleBookingClick = (propertyId) => {
    if (selectedDate) {
      navigate(`/bookingRequest/${propertyId}`);
    } else {
      setAlert(
        <p className="text-base font-bold text-gray-800 text-center">Please select a date before proceed!</p>
      )
    };
  };

  const renderThumbnails = () => {
    if (listingAll) {
      return (
        <div className="bg-white">
          <div className="py-4">
            <br />
            <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8 gap-2">
              {listingAll.map((listing) => (
                <button
                  key={listing.id}
                  className="group relative"
                  onClick={() => {
                    setListingId(listing.id);
                    setOpen(true);
                  }}
                >
                  <div className="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-md bg-gray-200 lg:aspect-none group-hover:opacity-75 lg:h-80">
                    <img
                      src={
                        listing.property_assets &&
                        listing.property_assets.length > 0
                          ? listing.property_assets[0].file_link
                          : "default_image_url_here"
                      }
                      alt="Property"
                      className="h-full w-full object-cover object-center lg:h-full lg:w-full"
                    />
                  </div>
                  <div className="mt-4">
                    <div className="flex justify-between">
                      <h3 className="text-sm text-gray-700 font-bold">
                        <span aria-hidden="true" className="absolute inset-0" />
                        {listing.title}
                      </h3>
                      <p className="text-sm font-medium text-gray-900">
                        ¥{listing.roomrate}/night
                      </p>
                    </div>
                    <p className="mt-1 text-sm text-gray-500 text-left line-clamp-3">
                      {listing.description}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      );
    }
  };

  const renderModal = (listingId) => {
    if (listingAll) {
      if (listingId === 0) {
        let arrayIndex = listingId;
        return modal(arrayIndex);
      } else {
        const arrayIndex = binarySearch(listingAll, listingId)
        return modal(arrayIndex);
      }
    }
  };

  const binarySearch = (arr, target) => {
    let left = 0;
    let right = arr.length - 1;
  
    while (left <= right) {
      const mid = Math.floor((left + right) / 2);
  
      // Check if the middle element is the target
      if (arr[mid].id === target) {
        return mid; // Target found, return the index
      }
  
      // If the target is greater, ignore the left half
      if (arr[mid].id < target) {
        left = mid + 1;
      } 
      // If the target is smaller, ignore the right half
      else {
        right = mid - 1;
      }
    }
  
    return -1; // Target not found
  }

  const modal = (arrayIndex) => {
    const listing = listingAll[arrayIndex];
    if (!listing) return null;

    return (
      <Transition.Root show={open} as={Fragment}>
        <Dialog as="div" className="relative z-10 rounded-lg" onClose={setOpen}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 hidden bg-gray-500 bg-opacity-75 transition-opacity md:block" />
          </Transition.Child>

          <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
            <div className="flex min-h-full items-stretch justify-center text-center md:items-center md:px-2 lg:px-4">
              {/* This element is to trick the browser into centering the modal contents. */}
              <span
                className="hidden md:inline-block md:h-screen md:align-middle"
                aria-hidden="true"
              >
                &#8203;
              </span>
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 translate-y-4 md:translate-y-0 md:scale-95"
                enterTo="opacity-100 translate-y-0 md:scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 translate-y-0 md:scale-100"
                leaveTo="opacity-0 translate-y-4 md:translate-y-0 md:scale-95"
              >
                <Dialog.Panel className="flex w-full transform text-left text-base transition md:my-8 md:max-w-2xl md:px-4 lg:max-w-4xl">
                  <div className="relative flex w-full items-center overflow-hidden bg-white px-4 pb-8 pt-14 shadow-2xl sm:px-6 sm:pt-8 md:p-6 lg:p-8 rounded-lg">
                    <button
                      type="button"
                      className="absolute right-4 top-4 text-gray-400 hover:text-gray-500 sm:right-6 sm:top-8 md:right-6 md:top-6 lg:right-8 lg:top-8"
                      onClick={() => {
                        setOpen(false);
                        setAlert('');
                      }}
                    >
                      <span className="sr-only">Close</span>
                      <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                    </button>

                    <div className="grid w-full grid-cols-1 items-start gap-x-6 gap-y-8 sm:grid-cols-12 lg:items-center lg:gap-x-8">
                      <div className="aspect-h-3 aspect-w-2 overflow-hidden rounded-lg bg-gray-100 sm:col-span-4 lg:col-span-5">
                        <img
                          src={
                            listing.property_assets &&
                            listing.property_assets.length > 0
                              ? listing.property_assets[0].file_link
                              : "default_image_url_here"
                          }
                          alt="img"
                          className="object-cover object-center"
                        />
                      </div>
                      <div className="sm:col-span-8 lg:col-span-7">
                        <h2 className="text-xl font-bold text-gray-900 sm:pr-12">
                          {listingAll[arrayIndex].title}
                        </h2>

                        <section
                          aria-labelledby="information-heading"
                          className="mt-1"
                        >
                          <h3 id="information-heading" className="sr-only">
                            Product information
                          </h3>
                          <p className="font-medium text-gray-900 text-xl">
                            ¥ {listingAll[arrayIndex].roomrate} / night
                          </p>
                          <br />
                          <p className="text-xs">
                            {listingAll[arrayIndex].description}
                          </p>
                          <br />
                          <p className="text-sm text-gray-900">
                            <span className="font-bold">Property Type:</span>{" "}
                            {listingAll[arrayIndex].propertytype}
                          </p>
                          <p className="text-sm text-gray-900">
                            <span className="font-bold">Floor Size:</span>{" "}
                            {listingAll[arrayIndex].floorsize}
                          </p>
                          <p className="text-sm text-gray-900">
                            <span className="font-bold">Configuration:</span>{" "}
                            {listingAll[arrayIndex].configuration}
                          </p>
                          <p className="text-sm text-gray-900">
                            <span className="font-bold">Amenities:</span>{" "}
                            {listingAll[arrayIndex].amenities}
                          </p>
                        </section>

                        <section
                          aria-labelledby="options-heading"
                          className="mt-8"
                        >
                          <h3 id="options-heading" className="sr-only">
                            Product options
                          </h3>

                          <button
                            type="submit"
                            className="mt-8 flex w-full items-center justify-center rounded-md border border-transparent bg-indigo-600 px-8 py-3 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                            onClick={() => handleBookingClick( listing.id )}
                          >
                            Book
                          </button>
                          <br />
                          {alert}
                        </section>
                      </div>
                    </div>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition.Root>
    );
  };

  const dropDownList = (category) => {
    let numberArray = [];
    for (let i = 0; i <= 10; i++) {
      numberArray.push(i);
    };

    if (category === "adult") {
      return (
        <div>
          <label htmlFor="adultNumber" className="block text-sm font-medium leading-6 text-gray-900">
            Adult
          </label>
          <select
            id="adultNumber"
            name="adultNumber"
            className="mt-2 block w-full rounded-md border-0 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6"
            value={adultNumber}
            onChange={(e) => handleNumberChange(e)}
          >
            {numberArray.map((number) => (
              <option key={number}>{number}</option>
            ))}
          </select>
        </div>
      )
    } else if (category === "children"){
      return (
        <div>
          <label htmlFor="childrenNumber" className="block text-sm font-medium leading-6 text-gray-900">
            Children
          </label>
          <select
            id="childrenNumber"
            name="childrenNumber"
            className="mt-2 block w-full rounded-md border-0 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6"
            value={childrenNumber}
            onChange={(e) => handleNumberChange(e)}
          >
            {numberArray.map((number) => (
              <option key={number}>{number}</option>
            ))}
          </select>
        </div>
      )
    }
  }

  const handleNumberChange = (e) => {
    if (setAdultNumber && setChildrenNumber) {
      if (e.target.id === "adultNumber") {
        setAdultNumber(e.target.value);
      } else if (e.target.id === "childrenNumber") {
        setChildrenNumber(e.target.value);
      };
    };
  }

  const handleDateChange = (input) => {
    if (setSelectedDate) {
      setSelectedDate(input);
    };
  };

  useEffect(() => {
    async function fetchListingAll() {
      try {
        let listingAll = await axios.get(`${BACKEND_URL}/properties/`);
        if (listingAll.data) {
          setListingAll(listingAll.data);
        }
      } catch (err) {
        console.log(err);
      }
    }
    if (isAuthenticated && getAccessTokenSilently && user) {
      fetchListingAll();
    };
  }, []);

  useEffect(() => {
    renderModal(listingId)
  },[alert])

  useEffect(() => {
    if (isAuthenticated) {
      handleUserData();
    }
  }, [isAuthenticated, getAccessTokenSilently, user]);

  return (
    <>
      <header>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold leading-tight tracking-tight text-gray-900">
            Property Listing
          </h1>
        </div>
      </header>
      <main className="mx-auto max-w-2xl px-4 sm:px-6 sm:py-12 lg:max-w-7xl lg:px-8 py-8">
        <div>
          <div className="grid grid-cols-1 gap-x-6 gap-y-3 sm:grid-cols-3">
            <div>
              <label
                htmlFor="datePicker"
                className="block text-sm font-medium leading-6 text-gray-900 mb-2"
              >
                Travel Date
              </label>
              <Datepicker
                id="datePicker"
                value={selectedDate}
                onChange={(date) => handleDateChange(date)}
              />
            </div>
            {dropDownList("adult")}
            {dropDownList("children")}
          </div>
          {renderThumbnails()}
          {renderModal(listingId)}
        </div>
      </main>
    </>
  );
}
