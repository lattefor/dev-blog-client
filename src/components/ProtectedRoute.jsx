import { useUser } from "@clerk/clerk-react";
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children }) {
  const { isSignedIn, isLoaded } = useUser();
  
  // Show loading state while Clerk is initializing
  if (!isLoaded) {
    return <div>Loading...</div>;
  }
  
  // If not signed in, redirect to sign-in page
  if (!isSignedIn) {
    return <Navigate to="/sign-in" replace />;
  }
  
  // If signed in, render the protected component
  return children;
}