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
      <h1 className="text-4xl font-bold">Messenger</h1>
      <br />
      <p>Messenger Page</p>
    </>
  );
}
