import React from "react";
import "./search-input.css";
import { FaSearch, FaTimes } from "react-icons/fa";

export function SearchInput({ placeholder, value, onChange }) {
  const handleClear = () => {
    // Create a synthetic event object similar to a native input
    const event = {
      target: { value: '' }
    };
    onChange(event);
  };
  
  // Check if dark mode is active
  const isDarkMode = document.documentElement.getAttribute('data-theme') === 'dark';
  
  return (
    <div className="search-container">
      <div className="search-input-wrapper">
        <FaSearch className="search-icon" />
        <input
          type="text"
          className="search-input"
          placeholder={placeholder}
          value={value}
          onChange={onChange}
        />
      </div>
      {value && (
        <button 
          type="button"
          onClick={handleClear}
          aria-label="Clear search"
          style={{
            marginLeft: '8px',
            backgroundColor: isDarkMode ? '#1f2937' : 'white',
            border: `1px solid ${isDarkMode ? 'rgba(255, 255, 255, 0.2)' : '#e2e8f0'}`,
            borderRadius: '50%',
            width: '24px',
            height: '24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            padding: 0
          }}
        >
          <FaTimes size={12} color={isDarkMode ? 'white' : '#4a5568'} />
        </button>
      )}
    </div>
  );
}