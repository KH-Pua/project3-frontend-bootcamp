// Create Listing component
import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { GlobalContext } from "../../provider/globalProvider.js";
import { useAuthGate } from "../../components/useAuthGate.js";
import BACKEND_URL from "../../constants.js";
import { storage } from "../../firebase.js";
import { ref as sRef, uploadBytes, getDownloadURL } from "firebase/storage";

import { PhotoIcon } from '@heroicons/react/24/solid'
import HouseIcon from '@mui/icons-material/House';
import VillaIcon from '@mui/icons-material/Villa';
import ApartmentIcon from '@mui/icons-material/Apartment';

export default function CreateListing() {
  const navigate = useNavigate();
  const { getAccessTokenSilently, user } = useAuthGate();
  const infoToPass = useContext(GlobalContext);
  const STORAGE_KEY = "listings"

  //State for user input
  const [title, setTitle] = useState("");
  const [propertytype, setPropertyType] = useState("");
  const [configuration, setConfiguration] = useState("");
  const [floorsize, setFloorSize] = useState("");
  const [address, setAddress] = useState("");
  const [amenities, setAmenities] = useState("");
  const [roomrate, setRoomRate] = useState("");
  const [coordinates, setCoordinates] = useState("");
  const [description, setDescription] = useState("");
  const [bedNumber, setBedNumber] = useState(1);
  const [bathNumber, setBathNumber] = useState(1);
  //const [propertyListings, setPropertyListings] = useState([]);

  //State for image upload
  const [file, setFile] = useState(null);
  const [fileInputInitialValue, setFileInputInitialValue] = useState("");
  const [imagePreviewURL, setImagePreviewURL] = useState("");

  // Function to fetch property listings
  // const fetchPropertyListings = async () => {
  //   try {
  //     const token = await getAccessTokenSilently({
  //       authorizationParams: {
  //         audience: "https://api.powderful.xyz",
  //         scope: "read:current_user",
  //       },
  //     });
  //     const response = await axios.get(`${BACKEND_URL}/properties/mine`, {
  //       params: { user_sub: user.sub }, // user_sub should be inside params
  //       headers: {
  //         Authorization: `Bearer ${token}`,
  //       },
  //     });
  //     setPropertyListings(response.data);
  //   } catch (error) {
  //     console.error("Error fetching property listings:", error);
  //     // Handle errors appropriately
  //   }
  // };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Get Auth0 access token
      const token = await getAccessTokenSilently({
        authorizationParams: {
          audience: "https://api.powderful.xyz",
          scope: "read:current_user",
        },
      });

      // Call the backend API to create the property listing
      const response = await axios.post(
        `${BACKEND_URL}/properties`,
        {
          title,
          propertytype,
          configuration,
          floorsize,
          address,
          amenities,
          roomrate,
          coordinates,
          description,
          user_sub: user.sub,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Verified the id of the created listing, then upload photo to Firebase
      try {
        if (response.data.id) {

          const fileRef = sRef(
            storage,
            `${STORAGE_KEY}/${response.data.id}/${file.name}`
          );

          await uploadBytes(fileRef, file);
          const imageURL = await getDownloadURL(fileRef);

          // Call the backend API to store the image URL
          const imgUploadResponse = await axios.post(
            `${BACKEND_URL}/propertyassets`,
            {
              property_id: response.data.id,
              file_link: imageURL,
            },
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          if (imgUploadResponse.status === 201) {
            navigate("/propertylisting");
          }
        }
      } catch (error) {
        console.error("Error handling photo upload:", error);
      }

      //fetchPropertyListings(); // Refresh the list of property listings
    } catch (error) {
      console.error("Error creating property listings:", error);
      // Handle errors (e.g., show an error message)
    }
  };

  const handleFileChange = (e) => {
    // "e.target.files" gets all the information of the selected file
    console.log(e.target.files[0]);
    setFile(e.target.files[0]);
    setImagePreviewURL(URL.createObjectURL(e.target.files[0]));
  };

  // Grid format UI to be use for multiple photos upload 
  // const imageGrid = () => {
  //   return (
  //     <ul className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 sm:gap-x-6 lg:grid-cols-4 xl:gap-x-8">
  //       {files.map((file) => (
  //         <li key={file.source} className="relative">
  //           <div className="group aspect-h-7 aspect-w-10 block w-full overflow-hidden rounded-lg bg-gray-100 focus-within:ring-2 focus-within:ring-indigo-500 focus-within:ring-offset-2 focus-within:ring-offset-gray-100">
  //             <img src={file.source} alt="" className="pointer-events-none object-cover group-hover:opacity-75" />
  //             <button type="button" className="absolute inset-0 focus:outline-none">
  //               <span className="sr-only">View details for {file.title}</span>
  //             </button>
  //           </div>
  //           <p className="pointer-events-none mt-2 block truncate text-sm font-medium text-gray-900">{file.title}</p>
  //           <p className="pointer-events-none block text-sm font-medium text-gray-500">{file.size}</p>
  //         </li>
  //       ))}
  //   </ul>
  //   )
  // }

  useEffect(() => {
    const configString = `${bedNumber}BDR, ${bathNumber}BA`;
    setConfiguration(configString);
  },[bedNumber, bathNumber])

  useEffect(() => {
    console.log(propertytype);
  },[propertytype])
  
  const handleSelectPropertyType = (e) => {
    e.preventDefault();
    setPropertyType(e.target.id);
  }

  const renderListingForm = () => {
    let count = [];
    for( let i = 1; i <= 10; i++) {
      count.push(i);
    };

    return (
      <form onSubmit={handleSubmit}>
        <div className="space-y-12">
          <div className="border-b border-gray-900/10 pb-12">
            <h2 className="text-base font-semibold leading-7 text-gray-900">
              Listing Details
            </h2>
            <p className="mt-1 text-sm leading-6 text-gray-600">
              Please fill in the information of your property.
            </p>

            <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
              <div className="sm:col-span-4">
                <label
                  htmlFor="username"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Listing Title
                </label>
                <div className="mt-2">
                  <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
                    <input
                      type="text"
                      name="listingTitle"
                      id="listingTitle"
                      className="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                      placeholder=" Your listing title here"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              <div className="col-span-full">
                <label
                  htmlFor="listingAddress"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Listing Address
                </label>
                <div className="mt-2">
                  <input
                    type="text"
                    name="listingAddress"
                    id="listingAddress"
                    autoComplete="listingAddress"
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    placeholder="Your listing address here"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                  />
                </div>
              </div>

              <div className="col-span-full">
                <label
                  htmlFor="propertyType"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Property Type
                </label>

                <button
                  type="cottage"
                  id="cottage"
                  className={`mt-2 relative inline-flex items-center rounded-l-md px-3 py-2 text-sm font-semibold ${propertytype === 'cottage' ? 'bg-indigo-600 text-white' : 'bg-white text-gray-900'} ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-10 focus:outline-none focus:${propertytype === 'cottage' ? 'bg-indigo-600 text-white' : 'focus:bg-indigo-600 focus:text-white'}`}
                  onClick={(e) => handleSelectPropertyType(e)}
                >
                  <HouseIcon
                    className="mx-auto h-12 w-12 text-gray-800 focus:text-white"
                    aria-hidden="true"
                  />
                  Cottage
                </button>
                <button
                  type="button"
                  id="villa"
                  className={`mt-2 relative inline-flex items-center px-3 py-2 text-sm font-semibold ${propertytype === 'villa' ? 'bg-indigo-600 text-white' : 'bg-white text-gray-900'} ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-10 focus:outline-none focus:${propertytype === 'villa' ? 'bg-indigo-600 text-white' : 'focus:bg-indigo-600 focus:text-white'}`}
                  onClick={(e) => handleSelectPropertyType(e)}
                >
                  <VillaIcon
                    className="mx-auto h-12 w-12 text-gray-800 focus:text-white"
                    aria-hidden="true"
                  />
                  Villa
                </button>
                <button
                  type="button"
                  id="apartment"
                  className={`mt-2 relative inline-flex items-center rounded-r-md px-3 py-2 text-sm font-semibold ${propertytype === 'apartment' ? 'bg-indigo-600 text-white' : 'bg-white text-gray-900'} ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-10 focus:outline-none focus:${propertytype === 'apartment' ? 'bg-indigo-600 text-white' : 'focus:bg-indigo-600 focus:text-white'}`}
                  onClick={(e) => handleSelectPropertyType(e)}
                >
                  <ApartmentIcon
                    className="mx-auto h-12 w-12 text-gray-800 focus:text-white"
                    aria-hidden="true"
                  />
                  Apartment
                </button>
              </div>

              <div className="col-span-full">
                <label
                  htmlFor="description"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Description
                </label>
                <div className="mt-2">
                  <textarea
                    id="description"
                    name="description"
                    rows={3}
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    placeholder="Write a few sentences about your listing"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </div>
              </div>
              {/* Photo Upload */}
              <div className="col-span-full">
                <label
                  htmlFor="cover-photo"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Listing photo
                </label>
                <div className="mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10">
                  {imagePreviewURL ? (
                    <div className="flex flex-col gap-1 text-center">
                      <div className="avatar">
                        <div className="w-60 rounded">
                          <img src={imagePreviewURL} alt="uploadedPhoto" />
                        </div>
                      </div>
                      <label
                        htmlFor="fileUpload"
                        className="relative cursor-pointer rounded-md bg-white font-semibold text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-600 focus-within:ring-offset-2 hover:text-indigo-500"
                      >
                        <span>Change Photo</span>
                        <input
                          id="fileUpload"
                          name="fileUpload"
                          type="file"
                          className="sr-only"
                          onChange={(e) => handleFileChange(e)}
                        />
                      </label>
                    </div>
                  ) : (
                    <div className="text-center">
                      <PhotoIcon
                        className="mx-auto h-12 w-12 text-gray-300"
                        aria-hidden="true"
                      />
                      <div className="mt-4 flex text-sm leading-6 text-gray-600">
                        <label
                          htmlFor="fileUpload"
                          className="relative cursor-pointer rounded-md bg-white font-semibold text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-600 focus-within:ring-offset-2 hover:text-indigo-500"
                        >
                          <span>Upload a file</span>
                          <input
                            id="fileUpload"
                            name="fileUpload"
                            type="file"
                            className="sr-only"
                            value={fileInputInitialValue}
                            onChange={(e) => handleFileChange(e)}
                          />
                        </label>
                        <p className="pl-1">or drag and drop</p>
                      </div>
                      <p className="text-xs leading-5 text-gray-600">
                        PNG, JPG, GIF up to 10MB
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="border-b border-gray-900/10 pb-12">
            <h2 className="text-base font-semibold leading-7 text-gray-900">
              Listing Configuration
            </h2>
            <p className="mt-1 text-sm leading-6 text-gray-600">
              Tell people more about your place.
            </p>

            <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
              {/* Bed */}
              <div className="sm:col-span-1">
                <label
                  htmlFor="bed"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Bed
                </label>
                <div className="mt-2">
                  <select
                    id="bed"
                    name="bed"
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                    value={bedNumber}
                    onChange={(e) => setBedNumber(e.target.value)}
                  >
                    {count.map((i) => {
                      return <option key={i}>{i}</option>;
                    })}
                  </select>
                </div>
              </div>
              {/* Bath */}
              <div className="sm:col-span-1">
                <label
                  htmlFor="bath"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Bath
                </label>
                <div className="mt-2">
                  <select
                    id="bath"
                    name="bath"
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                    value={bathNumber}
                    onChange={(e) => setBathNumber(e.target.value)}
                  >
                    {count.map((i) => {
                      return <option key={i}>{i}</option>;
                    })}
                  </select>
                </div>
              </div>
              <div className="sm:col-span-2">
                <label
                  htmlFor="floorSize"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Floor Size (sqm)
                </label>
                <div className="mt-2">
                  <input
                    id="floorSize"
                    name="floorSize"
                    type="text"
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    value={floorsize}
                    onChange={(e) => setFloorSize(e.target.value)}
                  />
                </div>
              </div>
              <br />
              <div className="sm:col-span-2">
                <label
                  htmlFor="Amenities"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Amenities
                </label>
                <div className="mt-2">
                  <input
                    id="Amenities"
                    name="Amenities"
                    type="text"
                    placeholder="e.g. Ski easy access & etc."
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    value={amenities}
                    onChange={(e) => setAmenities(e.target.value)}
                  />
                </div>
              </div>
              <br />
              <div className="sm:col-span-4">
                <label
                  htmlFor="roomRate"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Room Rate (¥)
                </label>
                <div className="mt-2">
                  <input
                    id="roomRate"
                    name="roomRate"
                    type="number"
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    value={roomrate}
                    onChange={(e) => setRoomRate(e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>

        </div>

        <div className="mt-6 flex items-center justify-end gap-x-6">
          <button
            type="button"
            className="text-sm font-semibold leading-6 text-gray-900"
            onClick={(e) => {
              e.preventDefault();
              navigate('/propertyListing');
            }}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            Create Property Listing
          </button>
        </div>
      </form>
    );
  }

  // Fetch property listings on component mount
  // useEffect(() => {
  //   fetchPropertyListings();
  // }, []);

  // const propertyListingTable = () => {
  //   return (
  //     <div className="bg-white">
  //       <div className="mx-auto max-w-7xl sm:px-2 lg:px-8">
  //         <div className="mx-auto max-w-2xl px-4 lg:max-w-4xl lg:px-0">
  //           <h2 className="text-3xl font-bold mt-4 text-gray-900 sm:text-3xl">
  //             Create a Property Listing
  //           </h2>
  //           <br />
  //           <h2 className="text-xl text-gray-700">
  //             Tell us a little more about the property
  //           </h2>

  //           {/* Render property listings in a table */}
  //           <h2 className="text-3xl font-bold mt-8 text-gray-900">
  //             Your Property Listings
  //           </h2>
  //           <div className="mt-4">
  //             <table className="min-w-full divide-y divide-gray-200">
  //               <thead>
  //                 <tr>
  //                   <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
  //                     Title
  //                   </th>
  //                   <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
  //                     Type
  //                   </th>
  //                   <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
  //                     Configuration
  //                   </th>
  //                   <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
  //                     Floor Size
  //                   </th>
  //                   <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
  //                     Address
  //                   </th>
  //                   <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
  //                     Amenities
  //                   </th>
  //                   <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
  //                     Room Rate ¥
  //                   </th>
  //                   <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
  //                     Coordinates
  //                   </th>
  //                   <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
  //                     Description
  //                   </th>
  //                 </tr>
  //               </thead>
  //               <tbody className="bg-white divide-y divide-gray-200">
  //                 {propertyListings.map((listing) => (
  //                   <tr key={listing.id}>
  //                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
  //                       {listing.title}
  //                     </td>
  //                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
  //                       {listing.propertytype}
  //                     </td>
  //                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
  //                       {listing.configuration}
  //                     </td>
  //                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
  //                       {listing.floorsize}
  //                     </td>
  //                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
  //                       {listing.address}
  //                     </td>
  //                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
  //                       {listing.amenities}
  //                     </td>
  //                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
  //                       {listing.roomrate}
  //                     </td>
  //                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
  //                       {listing.coordinates}
  //                     </td>
  //                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
  //                       {listing.description}
  //                     </td>
  //                   </tr>
  //                 ))}
  //               </tbody>
  //             </table>
  //           </div>
  //         </div>
  //       </div>
  //     </div>
  //   );
  // };

  return (
    <>
      <header>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold leading-tight tracking-tight text-gray-900">Property Listing</h1>
        </div>
      </header>
      <main className="mx-auto max-w-2xl px-4 sm:px-6 sm:py-12 lg:max-w-7xl lg:px-8 py-8">
        {renderListingForm()}
      </main>
    </>
  );
}
