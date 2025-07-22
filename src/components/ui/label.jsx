import React from "react";
import "./label.css";

// Simple utility function to conditionally join class names
const cn = (...classes) => classes.filter(Boolean).join(" ");

export const Label = React.forwardRef(
  ({ className, htmlFor, children, ...props }, ref) => {
    return (
      <label
        ref={ref}
        htmlFor={htmlFor}
        className={cn("label", className)}
        {...props}
      >
        {children}
      </label>
    );
  }
);

Label.displayName = "Label";