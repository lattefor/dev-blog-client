import React from "react";
import "./search-input.css";
import { FaSearch } from "react-icons/fa";

export function SearchInput({ placeholder, value, onChange }) {
  return (
    <div className="search-container">
      <FaSearch className="search-icon" />
      <input
        type="text"
        className="search-input"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
      />
    </div>
  );
}