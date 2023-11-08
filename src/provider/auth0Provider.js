import React from "react";
import { Auth0Provider } from "@auth0/auth0-react";

export default function OAuthProvider ({ children }) {
    return (
        <Auth0Provider
            domain="YOUR_AUTH0_DOMAIN"
            clientId="YOUR_AUTH0_CLIENT_ID"
            authorizationParams={{
                redirect_uri: 'window.location.origin',
                scope: "",
                audience: ``,
            }}
        >
            {children}
        </Auth0Provider>
    );
};