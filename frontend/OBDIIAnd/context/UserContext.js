import React, { createContext, useState, useContext} from "react";

const UserContext = createContext();

export const UserProvider = ({children}) =>{
    const [username, setUsername] = useState(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [vin, setVin] = useState("")
    const [isconnected, setConnected] = useState(false);
    const [availablePID,setAvailablePID] = useState([]);


    const addPIDList = (pidlist) => {
        setAvailablePID(pidlist)
    }
    const login = (name) =>{ 
        setUsername(name);
        setIsLoggedIn(true);
    }

    const logout = () => {
        setUsername("");
        setIsLoggedIn(false);
    }

    const vinHandler = (vin) =>{
        setVin(vin)
    }

    const connect = () => {
        setConnected(true);
    }

    const disconnect = () =>{
        setConnected(false);
    }
    return(
        <UserContext.Provider 
        value = {{
            username,
            isLoggedIn,
            vin,
            isconnected,
            availablePID,
            login,
            logout,
            vinHandler,
            connect,
            disconnect,
            addPIDList,
            }}>
            {children}
        </UserContext.Provider>
    )
}

export const useUser = () => useContext(UserContext);