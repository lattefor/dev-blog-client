import React from "react";
import "./input.css";

// Simple utility function to conditionally join class names
const cn = (...classes) => classes.filter(Boolean).join(" ");

export const Input = React.forwardRef(
  ({ className, type = "text", ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn("input", className)}
        ref={ref}
        {...props}
      />
    );
  }
);

Input.displayName = "Input";