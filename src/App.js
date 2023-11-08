import { useState, useEffect, createContext } from "react";
import { Routes, Route } from "react-router-dom";
import axios from "axios";
import "./App.css";

import BACKEND_URL from "./constants.js";
import GlobalProvider from "./provider/globalProvider.js"
import OAuthProvider from "./provider/auth0Provider.js"
import ErrorPage from "./pages/errorPage.js";

//Guest Pages import
import BaseTemplate from "./components/baseTemplate.js"
import Messenger from "./pages/messenger.js"
import BookingDetails from "./pages/guest/bookingDetails.js"
import BookingRequest from "./pages/guest/bookingRequest.js"
import GuestDashboard from "./pages/guest/guestDashboard.js"
import GuestLogin from "./pages/guest/guestLogin.js"
import GuestRegistration from "./pages/guest/guestRegistration.js"
import ListingAll from "./pages/guest/listingAll.js"

//Manager Pages import
import CreateListing from "./pages/propertyManager/createListing.js"
import ListingDetails from "./pages/propertyManager/listingDetails.js"
import ManagerLogin from "./pages/propertyManager/listingDetails.js"
import ManagerRegistration from "./pages/propertyManager/managerRegistration.js"
import PropertyListing from "./pages/propertyManager/managerDashboard.js"

const App = () => {
  
  return (
    <OAuthProvider>
      <GlobalProvider>
        <Routes>
          {/* User Pages */}
          <Route 
            path="/"
            element={<BaseTemplate/>}
          >
            <Route
              path=""
              element={<GuestLogin/>}
              errorElement={<ErrorPage/>}
            />
          </Route>
          <Route 
            path="/guestRegistration"
            element={<BaseTemplate/>}
          >
            <Route
              path=""
              element={<GuestRegistration/>}
              errorElement={<ErrorPage/>}
            />
          </Route>
          <Route 
            path="/listingAll"
            element={<BaseTemplate/>}
          >
            <Route
              path=""
              element={<ListingAll/>}
              errorElement={<ErrorPage/>}
            />
          </Route>
          <Route 
            path="/bookingRequest"
            element={<BaseTemplate/>}
          >
            <Route
              path=""
              element={<BookingRequest/>}
              errorElement={<ErrorPage/>}
            />
          </Route>
          <Route 
            path="/guestDashboard"
            element={<BaseTemplate/>}
          >
            <Route
              path=""
              element={<GuestDashboard/>}
              errorElement={<ErrorPage/>}
            />
          </Route>
          <Route 
            path="/bookingDetails"
            element={<BaseTemplate/>}
          >
            <Route
              path=""
              element={<BookingDetails/>}
              errorElement={<ErrorPage/>}
            />
          </Route>
          {/* Manager Pages */}
          <Route
            path="/managerLogin"
            element={<ManagerLogin/>}
            errorElement={<ErrorPage/>}
          />
          <Route 
            path="/managerRegistration"
            element={<BaseTemplate/>}
          >
            <Route
              path=""
              element={<ManagerRegistration/>}
              errorElement={<ErrorPage/>}
            />
          </Route>
          <Route 
            path="/propertyListing"
            element={<BaseTemplate/>}
          >
            <Route
              path=""
              element={<PropertyListing/>}
              errorElement={<ErrorPage/>}
            />
          </Route>
          <Route 
            path="/listingDetails"
            element={<BaseTemplate/>}
          >
            <Route
              path=""
              element={<ListingDetails/>}
              errorElement={<ErrorPage/>}
            />
          </Route>
          <Route 
            path="/createListing"
            element={<BaseTemplate/>}
          >
            <Route
              path=""
              element={<CreateListing/>}
              errorElement={<ErrorPage/>}
            />
          </Route>
          {/* Messenger for both */}
          <Route 
            path="/messenger"
            element={<BaseTemplate/>}
          >
            <Route
              path=""
              element={<Messenger/>}
              errorElement={<ErrorPage/>}
            />
          </Route>
        </Routes>
      </GlobalProvider>
    </OAuthProvider>
  )
}

export default App;