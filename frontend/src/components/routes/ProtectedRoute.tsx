import type { ReactNode } from "react";
import { useAuth } from "../context/AuthContext";
import { Navigate } from "react-router-dom";
import { Loader2 } from "lucide-react";

interface ProtectedRouteProps {
    children: ReactNode;
}

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
    const { isAuthenticated, isLoading } = useAuth();
    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="w-12 h-12 animate-spin text-emerald-600" />
            </div>
        );
    }
    if (!isAuthenticated) {
        return <Navigate to="/" replace />;
    }

    return <>{children}</>;
};
