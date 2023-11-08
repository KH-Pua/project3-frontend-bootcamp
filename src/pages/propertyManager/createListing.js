import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { GlobalContext } from "../../provider/globalProvider.js";
import axios from "axios";
import BACKEND_URL from "../../constants.js";

export default function CreateListing() {
  const infoToPass = useContext(GlobalContext);
  const navigate = useNavigate();
  // Declare state here.

  // Your code here.

  return (
    <>
      <h1 className="text-4xl font-bold">Create A Listing</h1>
      <br />
      <p>Create Listing Page</p>
    </>
  );
}
