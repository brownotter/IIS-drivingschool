import { Navigate } from "react-router-dom";

function ProtectedRoute({
    children,
    allowedRole
}) {

    const storedUser =
        localStorage.getItem("user");

    if (!storedUser) {
        return <Navigate to="/" />;
    }

    const user = JSON.parse(storedUser);

console.log(user);
console.log(allowedRole);

if (user.role !== allowedRole) {
    return <Navigate to="/" />;
}

    return children;
}

export default ProtectedRoute;