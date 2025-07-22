import React from "react";
import "./button.css";

// Simple utility function to conditionally join class names
const cn = (...classes) => classes.filter(Boolean).join(" ");

export const Button = React.forwardRef(
  ({ className, variant = "default", size = "default", disabled, children, ...props }, ref) => {
    return (
      <button
        className={cn(
          "button",
          `button-variant-${variant}`,
          `button-size-${size}`,
          disabled && "button-disabled",
          className
        )}
        disabled={disabled}
        ref={ref}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";