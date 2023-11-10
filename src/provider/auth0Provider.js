import React from "react";
import { Auth0Provider } from "@auth0/auth0-react";

export default function OAuthProvider({ children }) {
  return (
    <Auth0Provider
      domain="dev-2jf01eugzd36x5ye.us.auth0.com"
      clientId="FwWeA5Y07sVMwlDX7Q97oClY8KTrFTLa"
      redirectUri={window.location.origin}
      scope="openid profile email"
      audience="YOUR_AUDIENCE"
    >
      {children}
    </Auth0Provider>
  );
}
