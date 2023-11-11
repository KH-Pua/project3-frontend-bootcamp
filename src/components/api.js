import axios from "axios";
import { useAuth0 } from "@auth0/auth0-react";

export const useApi = () => {
  const { getAccessTokenSilently } = useAuth0();

  const get = async (url) => {
    const token = await getAccessTokenSilently();
    return axios.get(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  };

  return {
    get,
    // post,
    // put,
    // delete,
  };
};
