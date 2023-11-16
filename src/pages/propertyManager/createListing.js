// Create Listing component
import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { GlobalContext } from "../../provider/globalProvider.js";
import { useAuthGate } from "../../components/useAuthGate.js";
import axios from "axios";
import BACKEND_URL from "../../constants.js";

export default function CreateListing() {
  const [title, setTitle] = useState("");
  const [propertytype, setPropertyType] = useState("");
  const [configuration, setConfiguration] = useState("");
  const [floorsize, setFloorSize] = useState("");
  const [address, setAddress] = useState("");
  const [amenities, setAmenities] = useState("");
  const [roomrate, setRoomRate] = useState("");
  const [coordinates, setCoordinates] = useState("");
  const [description, setDescription] = useState("");

  const [propertyListings, setPropertyListings] = useState([]);

  const navigate = useNavigate();
  const { getAccessTokenSilently, user } = useAuthGate();
  const infoToPass = useContext(GlobalContext);

  // Function to fetch property listings
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

  // Fetch property listings on component mount
  useEffect(() => {
    fetchPropertyListings();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
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
      fetchPropertyListings(); // Refresh the list of property listings

      // if (response.status === 201) {
      //   navigate("/propertylisting");
      // }
    } catch (error) {
      console.error("Error creating property listings:", error);
      // Handle errors (e.g., show an error message)
    }
  };

  return (
    <div className="bg-white">
      <div className="mx-auto max-w-7xl sm:px-2 lg:px-8">
        <div className="mx-auto max-w-2xl px-4 lg:max-w-4xl lg:px-0">
          <h2 className="text-3xl font-bold mt-4 text-gray-900 sm:text-3xl">
            Create a Property Listing
          </h2>
          <br />
          <h2 className="text-xl text-gray-700">
            Tell us a little more about the property
          </h2>
          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <input
              className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              type="text"
              placeholder="Listing Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <input
              className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              type="text"
              placeholder="Type i.e. Condo"
              value={propertytype}
              onChange={(e) => setPropertyType(e.target.value)}
            />
            <input
              className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              type="text"
              placeholder="Config i.e. 1BDR, 1BA"
              value={configuration}
              onChange={(e) => setConfiguration(e.target.value)}
            />
            <input
              className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              type="text"
              placeholder="Floor Size i.e. 120m²"
              value={floorsize}
              onChange={(e) => setFloorSize(e.target.value)}
            />
            <input
              className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              type="text"
              placeholder="Address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
            <input
              className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              type="text"
              placeholder="Amenities"
              value={amenities}
              onChange={(e) => setAmenities(e.target.value)}
            />
            <input
              className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              type="number"
              placeholder="Room Rate ¥"
              value={roomrate}
              onChange={(e) => setRoomRate(e.target.value)}
            />
            <input
              className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              type="text"
              placeholder="Coordinates"
              value={coordinates}
              onChange={(e) => setCoordinates(e.target.value)}
            />
            <input
              className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              type="text"
              placeholder="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            <button
              type="submit"
              className="inline-flex justify-center px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Create Property Listing
            </button>
          </form>

          {/* Render property listings in a table */}
          <h2 className="text-3xl font-bold mt-8 text-gray-900">
            Your Property Listings
          </h2>
          <div className="mt-4">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Title
                  </th>
                  <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Configuration
                  </th>
                  <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Floor Size
                  </th>
                  <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Address
                  </th>
                  <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amenities
                  </th>
                  <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Room Rate ¥
                  </th>
                  <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Coordinates
                  </th>
                  <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Description
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {propertyListings.map((listing) => (
                  <tr key={listing.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {listing.title}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {listing.propertytype}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {listing.configuration}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {listing.floorsize}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {listing.address}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {listing.amenities}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {listing.roomrate}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {listing.coordinates}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {listing.description}
                    </td>
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
