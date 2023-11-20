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

  const handleLogin = () => {
    loginWithRedirect();
  };

  const handleLogout = () => {
    logout({ returnTo: window.location.origin });
  };

  const renderLogin = () => {
    return (
      <div className="flex flex-col min-h-full flex-1 sm:flex-col lg:flex-row">
        <div className="flex flex-1 flex-col justify-center px-4 py-12 sm:px-6 lg:flex-none lg:px-20 xl:px-24">
          <div className="mx-auto w-full max-w-sm lg:w-96">
            <div>
              <h1 className="text-2xl font-sans text-slate-900 cursor-pointer font-bold block">
                powderful.xyz
              </h1>
              <p className="mt-2 text-sm leading-6 text-gray-500">
                Let us breeze through your stay at Niseko, Hokkaido.
              </p>
              <h2 className="mt-8 text-2xl font-normal leading-9 tracking-tight text-gray-900">
                Sign in to your account
              </h2>
            </div>

            <div className="mt-10">
              <div>
                <form action="#" method="POST" className="space-y-6">
                  <div>
                    <button
                      className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                      onClick={handleLogin}
                    >
                      Sign in / Sign up
                    </button>
                  </div>
                </form>
              </div>

              <div className="mt-10">
                <div className="relative">
                  <div
                    className="absolute inset-0 flex items-center"
                    aria-hidden="true"
                  >
                    <div className="w-full border-t border-gray-200" />
                  </div>
                </div>
                <br />
                <p className="mt-2 text-xs leading-6 text-gray-500 text-center">
                  2023 • by powder lovers, for powder lovers
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="relative flex w-0 flex-1 lg:block lg:h-screen">
          <img
            className="inset-0 h-full w-full object-cover"
            src="https://dynamic-media-cdn.tripadvisor.com/media/photo-o/12/22/b5/46/niseko-mtresort-grand.jpg?w=1200&h=1200&s=1"
            alt="Niseko_MountYotei"
          />
        </div>
      </div>
    );
  }

  return (
    <>
      {renderLogin()}
    </>
  );
}
