import React from "react";
import { SignUp } from "@clerk/clerk-react";
import classes from "./styles.module.css";

export default function SignUpPage() {
  return (
    <div className={classes.wrapper}>
      <SignUp 
        routing="path" 
        path="/sign-up" 
        signInUrl="/sign-in"
        redirectUrl="/"
      />
    </div>
  );
}