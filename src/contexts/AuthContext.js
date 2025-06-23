"use client";
import { createContext, useContext, useState, useEffect } from "react";

export const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export function AuthProvider({children}) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        checkAuthStatus();
    }, []);

    const checkAuthStatus = async () => {
        try {
            const res = await fetch("https://103.253.145.7:3000/api/users/me", {
                method: "GET",
                credentials: "include",
            });

            if (res.ok) {
                const userData = await res.json();
                setUser(userData);
            } else {
                setUser(null);
            }
        } catch (err) {
            console.error("Auth check fail: ", err);
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    const login = async () => {
        await checkAuthStatus();
    };

    const logout = async () => {
        try {
            await fetch("http://103.253.145.7:3000/api/users/logout", {
                method: "POST",
                credentials: "include",
            });
        } catch (err) {
            console.error("Logout fail: ", err);
        } finally {
            setUser(null);
        }
    };

    const value = {
        user,
        loading,
        login, 
        logout,
        isAuthenticated: !!user,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}