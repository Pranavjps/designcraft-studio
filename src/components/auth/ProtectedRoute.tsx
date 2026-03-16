import { Navigate, useLocation } from "react-router-dom";
import api from "@/lib/api";

interface ProtectedRouteProps {
    children: React.ReactNode;
}

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
    const location = useLocation();
    const isAuthenticated = api.isAuthenticated();

    if (!isAuthenticated) {
        // Redirect to login but save the current location to redirect back after logging in
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    return <>{children}</>;
};
