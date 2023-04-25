import { useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { createContext, useEffect } from "react";
import { auth } from "../firebase";

export const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState({});

    //checks whether there is a user or not
    useEffect(() => {
        //if there is a user, it will set a current user
        const unsub = onAuthStateChanged(auth, (user) => {
            setCurrentUser(user);
            console.log(currentUser);
        });

        //cleanup function to prevent memory leaking
        return () => {
            unsub();
        }
    }, []);

    return (
        //children components is able to reach current user - see index.js
        <AuthContext.Provider value={{ currentUser }}>
            {children}
        </AuthContext.Provider>
    )
}