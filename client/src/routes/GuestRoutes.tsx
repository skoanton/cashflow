import { Navigate } from "react-router";

type GuestRouteProps = {
    children: React.ReactNode;
};

export default function GuestRoute({ children }: GuestRouteProps) {
    const token = localStorage.getItem("token");

    if (token) {
        return <Navigate to="/dashboard" replace />;
    }

    return <>{children}</>;
}