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
    <>
      <header>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold leading-tight tracking-tight text-gray-900">Messenger</h1>
        </div>
      </header>
      <main className="mx-auto max-w-2xl px-4 sm:px-6 sm:py-12 lg:max-w-7xl lg:px-8 py-8">
        <p>Messenger feature coming soon! Feel free to reach out directly via email / message to the host / property manager</p>
      </main>
    </>
  );
}
