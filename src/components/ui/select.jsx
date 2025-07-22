import React from "react";
import "./select.css";
import { FaChevronDown } from "react-icons/fa";

export function Select({ options, value, onChange, placeholder }) {
  return (
    <div className="select-container">
      <select
        className="select-input"
        value={value}
        onChange={onChange}
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <FaChevronDown className="select-icon" />
    </div>
  );
}