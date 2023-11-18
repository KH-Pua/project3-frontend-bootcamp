import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { GlobalContext } from "../provider/globalProvider.js";
import { useAuthGate } from "../components/useAuthGate.js";

import axios from "axios";
import BACKEND_URL from "../constants.js";

export default function Messenger() {
  const infoToPass = useContext(GlobalContext);
  const navigate = useNavigate();
  const { isAuthenticated, isLoading } = useAuthGate();

  // Declare state here.

  // Your code here.

  if (isLoading) {
    return <div>Loading...</div>; // Or some loading spinner
  }

  if (!isAuthenticated) {
    return null; // Render nothing or a message prompting the user to wait while being redirected
  }

  return (
    <div>
        <div>
        <div className="mx-auto max-w-7xl sm:px-2 lg:px-8">
            <div className="mx-auto max-w-2xl px-4 lg:max-w-4xl lg:px-0">
            <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">Messenger</h1>
            <p className="mt-2 text-sm text-gray-500"></p>
            </div>
        </div>
        
        </div>
    </div>
  );
}
