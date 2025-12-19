import React, { useState, useEffect, useRef } from "react";
import { ChevronsUpDown, X, Loader2, Plus } from "lucide-react";

const CustomSelect = ({
  placeholder = "Select or type...",
  options = [],
  value, // Can be an ID, object, or string
  onChange,
  onSearch,
  isLoading = false,
  allowClear = true,
  freeSolo = false,
  icon: Icon,
  disabled = false,
  className = "",
  notFoundText = "No results found",
  createText = "Create",
  onCreateOption,
  autoHighlight = true,
  label,
}) => {
  const [open, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [highlightedIndex, setHighlightedIndex] = useState(0);
  const wrapperRef = useRef(null);
  const inputRef = useRef(null);

  // Find the selected option based on value prop
  const getSelectedOption = () => {
    if (!value) return null;

    if (typeof value === "object") {
      return options.find((opt) => opt.value === value.value) || value;
    }

    return options.find((opt) => String(opt.value) === String(value));
  };

  const selectedOption = getSelectedOption();

  // Update input value when selection changes or options update
  useEffect(() => {
    if (selectedOption) {
      setInputValue(selectedOption.label || "");
    } else if (!freeSolo) {
      setInputValue("");
    }
  }, [selectedOption, freeSolo]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setOpen(false);
        // Reset input if no valid selection in non-freeSolo mode
        if (!freeSolo && !selectedOption) {
          setInputValue("");
        }
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [selectedOption, freeSolo]);

  // Handle input changes
  const handleInputChange = (e) => {
    const val = e.target.value;
    setInputValue(val);
    setOpen(true);
    setHighlightedIndex(0);

    if (onSearch) {
      onSearch(val);
    }

    // In freeSolo mode, update value immediately
    if (freeSolo && !val) {
      onChange(null);
    }
  };

  // Filter options based on input
  const filteredOptions = inputValue
    ? options.filter((opt) =>
      opt.label.toLowerCase().includes(inputValue.toLowerCase())
    )
    : options;

  // Check if current input matches any option
  const exactMatch = filteredOptions.find(
    (opt) => opt.label.toLowerCase() === inputValue.toLowerCase()
  );

  // Show create option if freeSolo, no exact match, and input is not empty
  const showCreateOption = freeSolo && !exactMatch && inputValue.trim() !== "";

  const handleSelect = (option) => {
    onChange(option);
    setInputValue(option.label);
    setOpen(false);
    setHighlightedIndex(0);
  };

  const handleCreateOption = () => {
    const newOption = { value: inputValue, label: inputValue };
    if (onCreateOption) {
      onCreateOption(newOption);
    }
    handleSelect(newOption);
  };

  const handleClear = (e) => {
    e.stopPropagation();
    onChange(null);
    setInputValue("");
    if (onSearch) {
      onSearch("");
    }
    inputRef.current?.focus();
  };

  const handleKeyDown = (e) => {
    if (!open && (e.key === "ArrowDown" || e.key === "ArrowUp")) {
      setOpen(true);
      return;
    }

    if (!open) return;

    const totalOptions = filteredOptions.length + (showCreateOption ? 1 : 0);

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setHighlightedIndex((prev) => (prev + 1) % totalOptions);
        break;
      case "ArrowUp":
        e.preventDefault();
        setHighlightedIndex(
          (prev) => (prev - 1 + totalOptions) % totalOptions
        );
        break;
      case "Enter":
        e.preventDefault();
        if (totalOptions === 0) return;
        if (highlightedIndex < filteredOptions.length) {
          handleSelect(filteredOptions[highlightedIndex]);
        } else if (showCreateOption) {
          handleCreateOption();
        }
        break;
      case "Escape":
        setOpen(false);
        break;
      default:
        break;
    }
  };

  const handleFocus = () => {
    setOpen(true);
    if (onSearch && !inputValue) {
      onSearch("");
    }
  };

  return (
    <div
      ref={wrapperRef}
      className={`relative w-full ${disabled ? "opacity-60 pointer-events-none" : ""
        } ${className}`}
    >
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
        </label>
      )}

      {/* Input Field */}
      <div className="relative flex items-center">
        {Icon && (
          <div className="absolute left-3 pointer-events-none z-10">
            <Icon size={18} className="text-gray-500" />
          </div>
        )}

        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onFocus={handleFocus}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={disabled}
          className={`w-full border border-gray-300 bg-white rounded-xl ${Icon ? "pl-10" : "pl-3"
            } pr-20 py-2.5 shadow-sm hover:shadow transition outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent text-gray-900 placeholder-gray-400`}
        />

        <div className="absolute right-3 flex items-center gap-2 z-10">
          {allowClear && inputValue && (
            <button
              onClick={handleClear}
              className="text-gray-400 hover:text-gray-600 transition"
              type="button"
              tabIndex={-1}
            >
              <X size={16} />
            </button>
          )}
          {isLoading ? (
            <Loader2 size={16} className="animate-spin text-gray-400" />
          ) : (
            <button
              onClick={() => setOpen(!open)}
              className="text-gray-400 transition"
              type="button"
              tabIndex={-1}
            >
              <ChevronsUpDown
                size={16}
                className={`transition-transform ${open ? "rotate-180" : ""}`}
              />
            </button>
          )}
        </div>
      </div>

      {/* Dropdown */}
      {open && (
        <div className="absolute z-50 mt-1 w-full bg-white border border-gray-200 rounded-xl shadow-lg max-h-64 overflow-auto">
          {isLoading ? (
            <div className="p-3 text-center text-gray-400 text-sm">
              <Loader2 className="animate-spin inline-block mr-1" size={14} />
              Loading...
            </div>
          ) : (
            <>
              {/* Filtered Options */}
              {filteredOptions.length > 0 ? (
                filteredOptions.map((option, index) => (
                  <div
                    key={option.value}
                    onClick={() => handleSelect(option)}
                    onMouseEnter={() => setHighlightedIndex(index)}
                    className={`px-3 py-2 text-sm cursor-pointer transition ${highlightedIndex === index
                        ? "bg-blue-100"
                        : "hover:bg-blue-50"
                      } ${selectedOption?.value === option.value
                        ? "font-medium text-blue-600"
                        : ""
                      }`}
                  >
                    {option.label}
                  </div>
                ))
              ) : (
                !showCreateOption && (
                  <div className="p-3 text-center text-gray-400 text-sm">
                    {notFoundText}
                  </div>
                )
              )}

              {/* Create New Option */}
              {showCreateOption && (
                <div
                  onClick={handleCreateOption}
                  onMouseEnter={() =>
                    setHighlightedIndex(filteredOptions.length)
                  }
                  className={`px-3 py-2 text-sm cursor-pointer transition ${filteredOptions.length > 0 ? "border-t border-gray-100" : ""
                    } flex items-center gap-2 ${highlightedIndex === filteredOptions.length
                      ? "bg-green-50"
                      : "hover:bg-green-50"
                    }`}
                >
                  <Plus size={16} className="text-green-600" />
                  <span className="text-green-600 font-medium">
                    {createText} "{inputValue}"
                  </span>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default CustomSelect;