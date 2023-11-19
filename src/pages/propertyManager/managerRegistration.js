// ManagerRegistration component
import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { GlobalContext } from "../../provider/globalProvider.js";
import { useAuthGate } from "../../components/useAuthGate.js";
import axios from "axios";
import BACKEND_URL from "../../constants.js";

export default function ManagerRegistration() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [description, setDescription] = useState("");
  const [phone, setPhone] = useState("");

  const [propertyManagers, setPropertyManagers] = useState([]);

  const navigate = useNavigate();
  const { getAccessTokenSilently, user } = useAuthGate();
  const infoToPass = useContext(GlobalContext);

  // Function to fetch property managers
  const fetchPropertyManagers = async () => {
    try {
      const token = await getAccessTokenSilently({
        authorizationParams: {
          audience: "https://api.powderful.xyz",
          scope: "read:current_user",
        },
      });
      const response = await axios.get(`${BACKEND_URL}/propertymanagers`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPropertyManagers(response.data);
    } catch (error) {
      console.error("Error fetching property managers:", error);
    }
  };

  // Fetch property managers on component mount
  useEffect(() => {
    fetchPropertyManagers();
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

      // Call the backend API to create the property manager
      const response = await axios.post(
        `${BACKEND_URL}/propertymanagers`,
        { name, email, phone, description, user_sub: user.sub },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      fetchPropertyManagers(); // Refresh the list of property managers

      // if (response.status === 201) {
      //   navigate("/propertylisting");
      // }
    } catch (error) {
      console.error("Error creating property manager:", error);
      // Handle errors (e.g., show an error message)
    }
  };

  return (
    <div className="bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold mt-4 text-gray-900 sm:text-3xl">
          Register as a Property Manager
        </h2>
        <br />
        <h2 className="text-xl text-gray-700">
          Tell us a little more about yourself
        </h2>
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <input
            className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            type="text"
            placeholder="Phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
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
            Create Manager Profile
          </button>
        </form>

        {/* Render property managers in a table */}
        <h2 className="text-3xl font-bold mt-8 text-gray-900">
          All Property Managers
        </h2>
        <div className="mt-4">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Phone
                </th>
                <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Description
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {propertyManagers.map((manager) => (
                <tr key={manager.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {manager.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {manager.email}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {manager.phone}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {manager.description}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
