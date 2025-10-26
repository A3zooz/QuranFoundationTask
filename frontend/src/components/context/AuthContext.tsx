import { createContext, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";
import axios from "../../lib/axios.ts";

interface User {
    id: number;
    email: string;
}

interface AuthContextType {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (email: string, password: string) => Promise<void>;
    register: (email: string, password: string) => Promise<void>;
    logout: () => void;
}


const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [token, setToken] = useState<string | null>("");
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const storedToken = localStorage.getItem("token");
        const storedUser = localStorage.getItem("user");

        if (storedToken && storedUser) {
            console.log(storedToken, storedUser)
            setToken(storedToken);
            setUser(JSON.parse(storedUser));
        }
        else{
            
        }
        setIsLoading(false);
    }, []);

    const login = async (email: string, password: string) => {
        const response = await axios.post(`/auth/login`, {
            email: email,
            password: password,
        });
        const { token: newToken, user: newUser } = response.data;
        setToken(newToken);
        setUser(newUser);
        localStorage.setItem("token", newToken);
        localStorage.setItem("user", JSON.stringify(newUser));
    };

    const register = async (email: string, password: string) => {
        const response = await axios.post(`/auth/register`, {
            email,
            password,
        });
        console.log(response)
        const { token: newToken, user: newUser } = response.data;
        setToken(newToken);
        setUser(newUser);

        localStorage.setItem("token", newToken);
        localStorage.setItem("user", JSON.stringify(newUser));
    };
    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setToken(null);
        setUser(null);
        
    };

    const isAuthenticated = !!token;

    return (
        <AuthContext.Provider
            value={{
                register,
                isLoading,
                user,
                token,
                isAuthenticated,
                login,
                logout,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within  AuthContext provider");
    }
    return context;
};
