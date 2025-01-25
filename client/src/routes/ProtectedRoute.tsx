import { Navigate } from "react-router";
import { jwtDecode } from "jwt-decode";
type ProtectedRouteProps = {
    children: React.ReactNode
    roles?: string[]
}

interface TokenPayload {
    exp: number;
}

export default function ProtectedRoute({ children, roles }: ProtectedRouteProps) {
    const token = localStorage.getItem("token");
    if (!token) {
        return <Navigate to="/login" replace />;
    }

    const tokenParts = token.split(".");
    if (tokenParts.length !== 3) {
        localStorage.removeItem("token");
        return <Navigate to="/login" replace />;
    }

    try {
        // Dekoda token
        const decodedToken = jwtDecode<TokenPayload>(token);
        const currentTime = Date.now() / 1000;

        if (decodedToken.exp < currentTime) {
            localStorage.removeItem("token");
            return <Navigate to="/login" replace />;
        }

        return <>{children}</>;
    } catch (error) {
        console.error("Token decoding failed:", error);
        localStorage.removeItem("token");
        return <Navigate to="/login" replace />;
    }
}