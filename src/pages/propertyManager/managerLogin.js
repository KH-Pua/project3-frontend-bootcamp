import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { GlobalContext } from "../../provider/globalProvider.js";
import axios from "axios";
import BACKEND_URL from "../../constants.js";

export default function ManagerLogin() {
  const infoToPass = useContext(GlobalContext);
  const navigate = useNavigate();
  // Declare state here.

  // Your code here.

  return (
    <>
      <h1 className="text-4xl font-bold">Manager Registration</h1>
      <br />
      <p>AuthO Panel here</p>
      <br />
      <h1>Unleashed your property's value to the fullest</h1>
      <br />
      <p>Back to guest sign in</p>
    </>
  );
}
