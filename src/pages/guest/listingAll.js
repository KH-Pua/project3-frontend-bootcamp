import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
//import { Auth0Provider } from "../../provider/auth0Provider.js";
import { GlobalContext } from "../../provider/globalProvider.js";
import axios from "axios";
import BACKEND_URL from "../../constants.js";

export default function ListingAll() {
  const {
    isLoading,
    isAuthenticated,
    error,
    user,
    loginWithRedirect,
    getAccessTokenSilently,
    logout,
  } = useAuth0();
  
  const infoToPass = useContext(GlobalContext);
  const navigate = useNavigate();
  // Declare state here.

  // Your code here.
  const authOExecutionTesting = () => {
    if (isLoading) {
      return <div>Loading...</div>;
    }
    if (error) {
      return <div>Oops... {error.message}</div>;
    }

    if (isAuthenticated) {
      return (
        <div>
          Hello {user.name}{" "}
          <button
            onClick={() =>
              logout({ logoutParams: { returnTo: window.location.origin } })
            }
          >
            Log out
          </button>
        </div>
      );
    } else {
      return <button onClick={() => loginWithRedirect()}>Log in</button>;
    }
  };

  const login = () => {
    loginWithRedirect();
  };

  // useEffect(() => {
  //   if (isAuthenticated) {
  //     console.log("user: ", user);
  //   }
  // }, [isAuthenticated, user]);

  // useEffect(() => {
  //   console.log("Enter get access token function");
  //   const getToken = async () => {
  //     try {
  //       const token = await getAccessTokenSilently({
  //         authorizationParams: {
  //           audience: ``,
  //           scope: "",
  //         },
  //       });
  //       console.log("Token: ", token);
  //       localStorage.setItem("accessToken", token);
  //     } catch (err) {
  //       console.log(err);
  //     }
  //   };
  //   getToken();
  // }, [getAccessTokenSilently, user?.sub]);

  return (
    <>
      <h1 className="text-4xl font-bold">Property Listing</h1>
      <br />
      {/* {authOExecutionTesting()} */}
      <p>Search Bar here</p>
      <br />
      <p>Listing thumbnail area</p>
    </>
  );
}
