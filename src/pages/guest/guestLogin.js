import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { GlobalContext } from "../../provider/globalProvider.js";
import axios from "axios";
import BACKEND_URL from "../../constants.js";

export default function GuestLogin() {
  const infoToPass = useContext(GlobalContext);
  const navigate = useNavigate();
  // Declare state here.

  // Your code here.

  return (
    <>
      <br />
      <h1 className="text-4xl font-bold">Guest Login</h1>
      <br />
      <h1>Let us breeze through your stay in Niseko</h1>
      <br />
      <p>OAuth Panel here</p>
      <br />
      <p>Owned a property? Become a property manager now.</p>
    </>
  );
}
