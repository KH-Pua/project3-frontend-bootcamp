import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuthGate } from "../../components/useAuthGate.js";
import BACKEND_URL from "../../constants.js";

export default function ManagerListing() {
  const { getAccessTokenSilently, user } = useAuthGate();
  const [propertyListings, setPropertyListings] = useState([]);

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

  // Fetch property listings on component mount
  useEffect(() => {
    fetchPropertyListings();
  }, []);

  const propertyListingTable = () => {
    return (
      <div className="bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold mt-4 text-gray-900 sm:text-3xl">
            Your Property Listings
          </h2>

          <div className="mt-8">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Property Type
                  </th>
                  <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Configuration
                  </th>
                  <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Floor Size
                  </th>
                  <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Room Rate
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {propertyListings.map((listing) => (
                  <tr key={listing.id}>
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
                      {listing.roomrate}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      <header>{/* Header content */}</header>
      <main>{propertyListingTable()}</main>
    </>
  );
}
