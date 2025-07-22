import React from "react";
import "./textarea.css";

// Simple utility function to conditionally join class names
const cn = (...classes) => classes.filter(Boolean).join(" ");

export const Textarea = React.forwardRef(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        className={cn("textarea", className)}
        ref={ref}
        {...props}
      />
    );
  }
);

Textarea.displayName = "Textarea";