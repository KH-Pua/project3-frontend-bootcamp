import React, { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { GlobalContext } from "../../provider/globalProvider.js";
import { useAuth0 } from "@auth0/auth0-react";
import BACKEND_URL from "../../constants.js";

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
      const token = await getAccessTokenSilently();
      // Here, modify or add any user data you want to send to your backend
      const userData = { email: user.email, name: user.name };

      await fetch(`${BACKEND_URL}/guests/`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      // You may navigate to a different page or show a message upon success
    } catch (error) {
      console.error("Error during user data handling", error);
      // Handle errors, e.g., show a notification
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
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
