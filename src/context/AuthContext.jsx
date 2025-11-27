import { createContext, useEffect, useState, useContext } from "react";
import { supabase } from "../supabaseClient";

const AuthContext = createContext();

export const AuthContextProvider = ({children}) => {
    const [session, setSession] = useState(undefined);

    //signup
    const signUpNewUser = async (email, password) => {
        const { data, error } = await supabase.auth.signUp({
            email: email,
            password: password,
        });

        if(error) {
            console.error("Error signing up: ", error);
            return { success: false, error };
        }
        return { success: true, data };
    };

    //signin
    const signInUser = async ({ email, password}) => {
        try{
            const {data, error } = await supabase.auth.signInWithPassword({
                email: email,
                password, password,
            });
            if (error) {
                console.error("Sign in error occurred: " + error);
                return { success: false, error: error.message };
             }
             console.log("sign-in success: " + data);
            } catch(error){
                console.error("an error occurred: ", error);
             }
        };
    

    useEffect(() => {
supabase.Auth.getSession().then(({ data: { session } }) => {
    setSession(session);
});

supabase.Auth.onAuthStateChange((_event, session) => {
    setSession(session);
});
    }, []);

    //signout
    const signOut = () => {
        const {error} = supabase.auth.signOut();
        if(error){
            console.error("There was an error: " + error );
        }
    };



    return (
        <AuthContext.Provider value={{ session, signUpNewUser, signInUser, signOut }}>{children}</AuthContext.Provider>
    );
};

export const UserAuth = () => {
    return useContext(AuthContext);
};