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

  const renderThumbnails = () => {
    return (
      <div className="bg-white">
        <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
          <h2 className="text-2xl font-bold tracking-tight text-gray-900">Customers also purchased</h2>
  
          <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
            {products.map((product) => (
              <div key={product.id} className="group relative">
                <div className="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-md bg-gray-200 lg:aspect-none group-hover:opacity-75 lg:h-80">
                  <img
                    src={product.imageSrc}
                    alt={product.imageAlt}
                    className="h-full w-full object-cover object-center lg:h-full lg:w-full"
                  />
                </div>
                <div className="mt-4 flex justify-between">
                  <div>
                    <h3 className="text-sm text-gray-700">
                      <a href={product.href}>
                        <span aria-hidden="true" className="absolute inset-0" />
                        {product.name}
                      </a>
                    </h3>
                    <p className="mt-1 text-sm text-gray-500">{product.color}</p>
                  </div>
                  <p className="text-sm font-medium text-gray-900">{product.price}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

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
      {renderThumbnails()}
    </>
  );
}
