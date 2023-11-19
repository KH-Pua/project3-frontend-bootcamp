import { useState, useEffect, useContext, Fragment } from "react";
import { useNavigate } from "react-router-dom";
import { GlobalContext } from "../../provider/globalProvider.js";
import { useAuthGate } from "../../components/useAuthGate.js";
import { useApi } from "../../components/api.js";
import BACKEND_URL from "../../constants.js";

export default function GuestDashboardProfile() {
    return (
      <>
        <header>
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold leading-tight tracking-tight text-gray-900">
              Profile
            </h1>
          </div>
        </header>
        <main className="mx-auto max-w-2xl px-4 sm:px-6 sm:py-12 lg:max-w-7xl lg:px-8 py-8">
          <p>
            Profile feature coming soon! You will be able to mange your info
            here.
          </p>
        </main>
      </>
    );
};