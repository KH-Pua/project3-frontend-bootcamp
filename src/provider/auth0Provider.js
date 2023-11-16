import React from "react";
import { Auth0Provider } from "@auth0/auth0-react";

export default function OAuthProvider({ children }) {
  return (
    <Auth0Provider
      domain="dev-2jf01eugzd36x5ye.us.auth0.com"
      clientId="FwWeA5Y07sVMwlDX7Q97oClY8KTrFTLa"
      authorizationParams={{
        redirect_uri: "http://powderful.netlify.app/listingAll",
        scope:
          "read:current_user update:current_user_metadata openid profile email",
        audience: "https://api.powderful.xyz", // FE audience's URL must tally with BE audience's URL
      }}
    >
      {children}
    </Auth0Provider>
  );
}
