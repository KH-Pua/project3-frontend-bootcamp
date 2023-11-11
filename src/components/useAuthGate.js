// useAuthGate.js
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";

export function useAuthGate() {
  const {
    isAuthenticated,
    isLoading,
    loginWithRedirect,
    getAccessTokenSilently,
    user,
  } = useAuth0();
  const navigate = useNavigate();

  useEffect(() => {
    if (isLoading) {
      // Optionally handle loading state, e.g., show a spinner or a loading message
      return;
    }
    if (!isAuthenticated) {
      // Redirect to login if not authenticated
      loginWithRedirect();
    }
  }, [isAuthenticated, isLoading, loginWithRedirect, navigate]);

  return { isAuthenticated, isLoading, getAccessTokenSilently, user };
}
