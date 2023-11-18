import { useState, useEffect, useContext, Fragment } from "react";
import { useNavigate } from "react-router-dom";
import { GlobalContext } from "../../provider/globalProvider.js";
import { useAuthGate } from "../../components/useAuthGate.js";
import { useApi } from "../../components/api.js";
import BACKEND_URL from "../../constants.js";

export default function GuestDashboardProfile() {
    return (
      <div>
        <div>
          <div className="mx-auto max-w-7xl sm:px-2 lg:px-8">
            <div className="mx-auto max-w-2xl px-4 lg:max-w-4xl lg:px-0">
              <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">Profile</h1>
              <p className="mt-2 text-sm text-gray-500">Your personal information and details.</p>
            </div>
          </div>
          
        </div>
      </div>
    );
};