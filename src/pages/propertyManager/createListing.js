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
      const response = await axios.get(`${BACKEND_URL}/properties`, {
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
    <>
      <h1 className="text-4xl font-bold">Create a Property Listing</h1>
      <br />
      <h1>Tell us a little more about the property</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Listing Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <input
          type="text"
          placeholder="Type i.e. Condo"
          value={propertytype}
          onChange={(e) => setPropertyType(e.target.value)}
        />
        <input
          type="text"
          placeholder="Config i.e. 1BDR, 1BA"
          value={configuration}
          onChange={(e) => setConfiguration(e.target.value)}
        />
        <input
          type="text"
          placeholder="Floor Size i.e. 120m²"
          value={floorsize}
          onChange={(e) => setFloorSize(e.target.value)}
        />
        <input
          type="text"
          placeholder="Address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
        />
        <input
          type="text"
          placeholder="Amenities"
          value={amenities}
          onChange={(e) => setAmenities(e.target.value)}
        />
        <input
          type="number"
          placeholder="Room Rate ¥"
          value={roomrate}
          onChange={(e) => setRoomRate(e.target.value)}
        />
        <input
          type="text"
          placeholder="Coordinates"
          value={coordinates}
          onChange={(e) => setCoordinates(e.target.value)}
        />
        <input
          type="text"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <button type="submit">Create Property Listing</button>
      </form>

      {/* Render property listings in a table */}
      <h2 className="text-3xl font-bold mt-4">Your Property Listings</h2>
      <table>
        <thead>
          <tr>
            <th>Title</th>
            <th>Type</th>
            <th>Configuration</th>
            <th>Floor Size</th>
            <th>Address</th>
            <th>Amenities</th>
            <th>Room Rate ¥</th>
            <th>Coordinates</th>
            <th>Description</th>
          </tr>
        </thead>
        <tbody>
          {propertyListings.map((listing) => (
            <tr key={listing.id}>
              <td>{listing.title}</td>
              <td>{listing.propertytype}</td>
              <td>{listing.configuration}</td>
              <td>{listing.floorsize}</td>
              <td>{listing.address}</td>
              <td>{listing.amenities}</td>
              <td>{listing.roomrate}</td>
              <td>{listing.coordinates}</td>
              <td>{listing.description}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}
