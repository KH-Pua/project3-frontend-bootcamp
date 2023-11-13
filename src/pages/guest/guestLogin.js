import React, { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { GlobalContext } from "../../provider/globalProvider.js";
import { useAuth0 } from "@auth0/auth0-react";
import BACKEND_URL from "../../constants.js";
import axios from "axios";

export default function GuestLogin() {
  const infoToPass = useContext(GlobalContext);
  const navigate = useNavigate();
  const {
    loginWithRedirect,
    logout,
    isAuthenticated,
    getAccessTokenSilently,
    user,
  } = useAuth0();

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

  useEffect(() => {
    if (isAuthenticated) {
      console.log("Authenticated");
      handleUserData();
    }
  }, [isAuthenticated, getAccessTokenSilently, user]);

  const handleLogin = () => {
    loginWithRedirect();
  };

  const handleLogout = () => {
    logout({ returnTo: window.location.origin });
  };

  return (
    <>
      <br />
      <h1 className="text-4xl font-bold">Guest Login</h1>
      <br />
      <h1>Let us breeze through your stay in Niseko</h1>
      <br />
      {/* Conditional rendering for login and logout buttons */}
      {!isAuthenticated && (
        <button onClick={handleLogin} className="btn btn-primary">
          Log In
        </button>
      )}
      {isAuthenticated && (
        <button onClick={handleLogout} className="btn btn-primary">
          Log Out
        </button>
      )}
      <br />
      <p>OAuth Panel here</p>
      <br />
      <p>Owned a property? Become a property manager now.</p>
    </>
  );
}
