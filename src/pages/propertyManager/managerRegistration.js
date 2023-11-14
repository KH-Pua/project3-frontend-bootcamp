// ManagerRegistration component
import React, { useState, useContext } from "react";
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

  const navigate = useNavigate();
  const { getAccessTokenSilently } = useAuthGate();
  const infoToPass = useContext(GlobalContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = await getAccessTokenSilently(); // Get the token

      // Call the backend API to create the property manager
      const response = await axios.post(
        `${BACKEND_URL}/propertymanagers`,
        { name, email, phone, description },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.status === 201) {
        // Handle success (e.g., navigate to a different page or show a success message)
        navigate("/some-success-page");
      }
    } catch (error) {
      console.error("Error creating property manager:", error);
      // Handle errors (e.g., show an error message)
    }
  };

  return (
    <>
      <h1 className="text-4xl font-bold">Manager Registration Page</h1>
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
          type="phone"
          placeholder="Phone"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />
        <input
          type="description"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <button type="submit">Create Manager Profile</button>
      </form>
    </>
  );
}
