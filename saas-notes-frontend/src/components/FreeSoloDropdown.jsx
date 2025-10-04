
import { useState, useRef, useEffect } from 'react';
import { ChevronDown, X } from 'lucide-react';

const FreeSoloDropdown = ({ 
  options = [], 
  placeholder = "Type or select...", 
  value = "", 
  onChange = () => {},
  onInputChange = () => {},
  className = "",
  maxHeight = "200px"
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState(value?.name || "");
  const [filteredOptions, setFilteredOptions] = useState(options);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  
  const inputRef = useRef(null);
  const dropdownRef = useRef(null);
  useEffect(() => {
    if(typeof value === 'string') {
      setInputValue(value);
    }else if( value && value.name)
    {
      setInputValue(value.name);
    }else{
      setInputValue('');
    }
  }, [value]);

  useEffect(() => {
    if (inputValue) {
      console.log(inputValue)
      const filtered = options.filter(option =>
        option?.name?.toLowerCase().includes(inputValue?.name?.toLowerCase())
      );
      setFilteredOptions(filtered);
    } else {
      setFilteredOptions(options);
    }
    setHighlightedIndex(-1);
  }, [inputValue, options]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleInputChange = (e) => {
    // console.log(e.target.value);
    const newValue = e.target.value;
    setInputValue(newValue);
    onInputChange(newValue);
    setIsOpen(true);
  };

  const handleOptionClick = (option) => {
    setInputValue(option.name);
    onChange(option);
    setIsOpen(false);
    inputRef.current?.focus();
  };

  const handleKeyDown = (e) => {
    if (!isOpen && (e.key === 'ArrowDown' || e.key === 'ArrowUp')) {
      setIsOpen(true);
      return;
    }

    if (!isOpen) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setHighlightedIndex(prev => 
          prev < filteredOptions.length - 1 ? prev + 1 : 0
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setHighlightedIndex(prev => 
          prev > 0 ? prev - 1 : filteredOptions.length - 1
        );
        break;
      case 'Enter':
        e.preventDefault();
        if (highlightedIndex >= 0) {
          handleOptionClick(filteredOptions[highlightedIndex]);
        } else {
          setIsOpen(false);
        }
        break;
      case 'Escape':
        setIsOpen(false);
        inputRef.current?.blur();
        break;
      case 'Tab':
        setIsOpen(false);
        break;
    }
  };

  const handleClear = () => {
    setInputValue('');
    onChange('');
    inputRef.current?.focus();
  };

  return (
    <div className={`relative w-full ${className}`} ref={dropdownRef}>
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={inputValue }
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => setIsOpen(true)}
          placeholder={placeholder}
          className="w-full px-3 py-2 pr-20 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white"
        />
        
        <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center gap-1">
          {inputValue && (
            <button
              onClick={handleClear}
              className="p-1 hover:bg-gray-100 rounded transition-colors"
              tabIndex={-1}
            >
              <X className="w-4 h-4 text-gray-400" />
            </button>
          )}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-1 hover:bg-gray-100 rounded transition-colors"
            tabIndex={-1}
          >
            <ChevronDown 
              className={`w-4 h-4 text-gray-400 transition-transform ${
                isOpen ? 'rotate-180' : ''
              }`} 
            />
          </button>
        </div>
      </div>

      {isOpen && (
        <div 
          className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg"
          style={{ maxHeight }}
        >
          <div className="overflow-auto" style={{ maxHeight }}>
            {filteredOptions.length > 0 ? (
              filteredOptions.map((option, index) => (
                <div
                  key={index}
                  onClick={() => handleOptionClick(option)}
                  className={`px-3 py-2 cursor-pointer transition-colors ${
                    index === highlightedIndex
                      ? 'bg-blue-50 text-blue-600'
                      : 'hover:bg-gray-50'
                  }`}
                >
                  {option.name}
                </div>
              ))
            ) : inputValue ? (
              <div className="px-3 py-2 text-gray-500 italic">
                Press Enter to add "{JSON.stringify(inputValue)}"
              </div>
            ) : (
              <div className="px-3 py-2 text-gray-500 italic">
                No options available
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};


export default FreeSoloDropdown;