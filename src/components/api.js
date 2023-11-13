import axios from "axios";
import { useAuth0 } from "@auth0/auth0-react";

export const useApi = () => {
  const { getAccessTokenSilently } = useAuth0();

  const get = async (url) => {
    const token = await getAccessTokenSilently({
      audience: "https://api.powderful.xyz",
      scope: "read:current_user",
    });
    return axios.get(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  };

  const post = async (url, data) => {
    const token = await getAccessTokenSilently({
      audience: "https://api.powderful.xyz",
      scope: "read:current_user",
    });
    return axios.post(url, data, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
  };

  return {
    get,
    post,
    // put,
    // delete,
  };
};
