import React, { useState, useRef, useEffect } from "react";
import "./modern-select.css";
import { FaChevronDown } from "react-icons/fa";

export function ModernSelect({ options, value, onChange, placeholder }) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedValue, setSelectedValue] = useState(value || "");
  const selectRef = useRef(null);
  
  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (selectRef.current && !selectRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  
  // Update internal state when value prop changes
  useEffect(() => {
    setSelectedValue(value || "");
  }, [value]);
  
  const handleSelect = (option) => {
    setSelectedValue(option.value);
    setIsOpen(false);
    if (onChange) {
      // Create a synthetic event object similar to a native select
      const event = {
        target: {
          value: option.value
        }
      };
      onChange(event);
    }
  };
  
  // Find the selected option's label
  const selectedLabel = options.find(opt => opt.value === selectedValue)?.label || placeholder || "Select...";
  
  return (
    <div className="modern-select-container" ref={selectRef}>
      <div 
        className="modern-select-trigger"
        onClick={() => setIsOpen(!isOpen)}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            setIsOpen(!isOpen);
          }
        }}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <span className={`modern-select-value ${!selectedValue ? 'placeholder' : ''}`}>
          {selectedLabel}
        </span>
        <FaChevronDown className={`modern-select-icon ${isOpen ? 'open' : ''}`} />
      </div>
      
      {isOpen && (
        <div className="modern-select-dropdown">
          <ul className="modern-select-options" role="listbox">
            {placeholder && (
              <li 
                className={`modern-select-option ${!selectedValue ? 'selected' : ''}`}
                onClick={() => handleSelect({ value: "", label: placeholder })}
                role="option"
                aria-selected={!selectedValue}
              >
                {placeholder}
              </li>
            )}
            {options.map((option) => (
              <li 
                key={option.value} 
                className={`modern-select-option ${selectedValue === option.value ? 'selected' : ''}`}
                onClick={() => handleSelect(option)}
                role="option"
                aria-selected={selectedValue === option.value}
              >
                {option.label}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}