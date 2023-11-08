import { useState, createContext } from "react";
import axios from "axios";
import BACKEND_URL from "../constants";

export const GlobalContext = createContext();

export default function GlobalProvider({ children }) {
    //Declare State here.

    const infoToPass = {
        //Put State or Function need to pass here.
    };

    return (
        <GlobalContext.Provider value={infoToPass}>
            {children}
        </GlobalContext.Provider>
    )
}