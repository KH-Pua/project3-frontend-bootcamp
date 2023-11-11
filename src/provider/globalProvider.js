import React, { useState, createContext, useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import axios from "axios";
import BACKEND_URL from "../constants";

export const GlobalContext = createContext();

export default function GlobalProvider({ children }) {
  const [token, setToken] = useState("");
  const { isAuthenticated, getAccessTokenSilently } = useAuth0();

  // Function to fetch and update the access token
  const updateToken = async () => {
    if (isAuthenticated) {
      try {
        const accessToken = await getAccessTokenSilently();
        setToken(accessToken);
      } catch (error) {
        console.error("Error fetching access token", error);
        // Handle error scenarios
      }
    }
  };

  useEffect(() => {
    updateToken();
  }, [isAuthenticated, getAccessTokenSilently]);

  const infoToPass = {
    token,
    // Add other state or functions that you need to pass here
  };

  return (
    <GlobalContext.Provider value={infoToPass}>
      {children}
    </GlobalContext.Provider>
  );
}
