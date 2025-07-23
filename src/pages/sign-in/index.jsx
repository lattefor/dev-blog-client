import React from "react";
import { SignIn } from "@clerk/clerk-react";
import classes from "./styles.module.css";
import { useLocation } from "react-router-dom";

export default function SignInPage() {
  const location = useLocation();
  const returnUrl = location.state?.returnUrl || "/";
  
  return (
    <div className={classes.wrapper}>
      <SignIn 
        routing="path" 
        path="/sign-in" 
        signUpUrl="/sign-up"
        redirectUrl={returnUrl}
      />
    </div>
  );
}