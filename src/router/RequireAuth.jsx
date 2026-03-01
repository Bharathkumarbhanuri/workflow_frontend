import { Navigate, useLocation } from "react-router-dom";

export default function RequireAuth({ children }) {
  const token = localStorage.getItem("token");
  const location = useLocation();

  // Function to check if the token is expired
  const isTokenExpired = (token) => {
    const decodedToken = JSON.parse(atob(token.split('.')[1]));
    return decodedToken.exp * 1000 < Date.now();
  };

  // Check if token exists and if it's expired
  if (!token || isTokenExpired(token)) {
    // Redirect to login page with the current location
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  return children;
}
