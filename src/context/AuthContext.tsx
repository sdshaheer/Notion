import React, { useState, useEffect, createContext, useContext } from "react";
import { auth } from '../firebase/firebase'
import { onAuthStateChanged, signOut, User } from 'firebase/auth'

interface UserData {
    accessToken: string | undefined;
    uid: string;
    email: string | null;
}

interface AuthContextType {
    user: UserData | null;
    isUserLoggedIn: boolean;
    isAuthLoading: boolean;
    logout: () => void;
}

interface AuthProviderProps {
    children: React.ReactNode;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {

    const [user, setUser] = useState<UserData | null>(null);
    const [isUserLoggedIn, setIsUserLoggedIn] = useState(false)
    const [isAuthLoading, setIsAuthLoading] = useState(true)

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, initializeUser)
        return () => unsubscribe();

    }, [])

    const initializeUser = async (user: User | null) => {
        if (user) {
            const accessToken = await user.getIdToken();
            const data: UserData = {
                accessToken,
                uid: user?.uid,
                email: user?.email
            }
            localStorage.setItem('user', JSON.stringify(data))
            setUser({ ...data })
            setIsUserLoggedIn(true)
        } else {
            localStorage.removeItem('user')
            setUser(null)
            setIsUserLoggedIn(false)
        }
        setIsAuthLoading(false)
    }

    const logout = () => {
        signOut(auth)
            .then(() => {
                setUser(null);
                setIsUserLoggedIn(false);
                localStorage.removeItem('user');
            })
            .catch((error) => {
                console.error('Error logging out:', error);
            });
    };


    const value = {
        user,
        isUserLoggedIn,
        isAuthLoading,
        logout
    }

    return (
        <AuthContext.Provider value={value}>
            {!isAuthLoading && children}
        </AuthContext.Provider>
    )
}

export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};