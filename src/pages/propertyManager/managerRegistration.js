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
    <>
      <h1 className="text-4xl font-bold">Register as a Property Manager</h1>
      <br />
      <h1>Tell us a little more about yourself</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="text"
          placeholder="Phone"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />
        <input
          type="text"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <button type="submit">Create Manager Profile</button>
      </form>

      {/* Render property managers in a table */}
      <h2 className="text-3xl font-bold mt-4">All Property Managers</h2>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Description</th>
          </tr>
        </thead>
        <tbody>
          {propertyManagers.map((manager) => (
            <tr key={manager.id}>
              <td>{manager.name}</td>
              <td>{manager.email}</td>
              <td>{manager.phone}</td>
              <td>{manager.description}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}
