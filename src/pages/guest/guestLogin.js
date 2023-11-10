import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { GlobalContext } from "../../provider/globalProvider.js";
import { useAuth0 } from "@auth0/auth0-react";

export default function GuestLogin() {
  const infoToPass = useContext(GlobalContext);
  const navigate = useNavigate();
  const { loginWithRedirect, logout, isAuthenticated } = useAuth0(); // Add isAuthenticated to the destructuring

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
