import { useState, useEffect, createContext } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import axios from "axios";
import "./App.css";

import BACKEND_URL from "./constants.js";
import GlobalProvider from "./provider/globalProvider.js";
import OAuthProvider from "./provider/auth0Provider.js";
import ErrorPage from "./pages/errorPage.js";

// Guest Pages import
import BaseTemplate from "./components/baseTemplate.js";
import GuestDashboardTemplate from "./components/guestDashboardTemplate.js";
import ManagerDashboardTemplate from "./components/managerDashboardTemplate.js";
import Messenger from "./pages/messenger.js";
import BookingDetails from "./pages/guest/bookingDetails.js";
import BookingRequest from "./pages/guest/bookingRequest.js";
import GuestDashboard from "./pages/guest/guestDashboard.js";
import GuestDashboardProfile from "./pages/guest/guestDashboard-profile.js";
import GuestDashboardSaved from "./pages/guest/guestDashboard-saved.js";
import GuestLogin from "./pages/guest/guestLogin.js";
import GuestRegistration from "./pages/guest/guestRegistration.js";
import ListingAll from "./pages/guest/listingAll.js";

// Payment Success or Cancel import
import PaymentSuccess from "./pages/payment/paymentSuccess.js";
import PaymentCancel from "./pages/payment/paymentCancel.js";

// Manager Pages import
import CreateListing from "./pages/propertyManager/createListing.js";
import ListingDetails from "./pages/propertyManager/listingDetails.js";
import ManagerRegistration from "./pages/propertyManager/managerRegistration.js";
import PropertyListing from "./pages/propertyManager/managerDashboard.js";

const App = () => {
  const { isAuthenticated } = useAuth0();

  return (
    <OAuthProvider>
      <GlobalProvider>
        <Routes>
          <Route path="/" element={<GuestLogin />} />

          <Route path="/" element={<BaseTemplate />}>
            <Route path="guestRegistration" element={<GuestRegistration />} />
            <Route path="listingAll" element={<ListingAll />} />
            <Route path="bookingRequest" element={<BookingRequest />} />
            <Route
              path="bookingRequest/:propertyId"
              element={<BookingRequest />}
            />
            <Route path="bookingDetails" element={<BookingDetails />} />

            {/* Payment success or cancel */}
            <Route path="/success" element={<PaymentSuccess />} />
            <Route path="/cancel" element={<PaymentCancel />} />

            {/* Messenger for both */}
            <Route path="messenger" element={<Messenger />} />
          </Route>

          {/* Guest Dashboard Pages */}
          <Route path="/guestDashboard" element={<GuestDashboardTemplate />}>
            <Route index element={<GuestDashboard />} />
            <Route path="saved" element={<GuestDashboardSaved />} />
            <Route path="messenger" element={<Messenger />} />
            <Route path="profile" element={<GuestDashboardProfile />} />
          </Route>

          {/* Manager Dashboard Pages */}
          <Route path="/managerDashboard" element={<ManagerDashboardTemplate />}>
            <Route index element={<PropertyListing />} />
            <Route path="createListing" element={<CreateListing />} />
            <Route path="listingDetails" element={<ListingDetails />} />
            <Route path="messenger" element={<Messenger />} />
            <Route path="managerRegistration" element={<ManagerRegistration />} />
            <Route path="profile" element={<GuestDashboardProfile />} />
          </Route>

          {/* Fallback for any unmatched route */}
          <Route path="*" element={<ErrorPage />} />
        </Routes>
      </GlobalProvider>
    </OAuthProvider>
  );
};

export default App;
