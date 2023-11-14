import React, { useState, createContext, useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import axios from "axios";
import BACKEND_URL from "../constants";

export const GlobalContext = createContext();

export default function GlobalProvider({ children }) {
  const [selectedDate, setSelectedDate] = useState("");
  const [adultNumber, setAdultNumber] = useState(1);
  const [childrenNumber, setChildrenNumber] = useState(0);

  const infoToPass = {
    // Add other state or functions that you need to pass here
    selectedDate, setSelectedDate, adultNumber, setAdultNumber, childrenNumber, setChildrenNumber
  };

  return (
    <GlobalContext.Provider value={infoToPass}>
      {children}
    </GlobalContext.Provider>
  );
}
