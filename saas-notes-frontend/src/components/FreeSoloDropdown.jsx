import React, { useEffect, useState } from "react";
import { Select, Input } from "antd";
import { ChevronDown, X } from "lucide-react";

const { Option } = Select;

const FreeSoloDropdown = ({
  options = [],
  placeholder = "Type or select...",
  value = "",
  onSelect = () => {},
  onInputChange = () => {},
  className = "",
  allowCustom = true, // allow new items
}) => {
  const [inputValue, setInputValue] = useState(value?.name || value || "");

  const handleChange = (newValue) => {
    setInputValue(newValue);
    onSelect({ name: newValue });
  };

  const handleSearch = (text) => {
    onInputChange(text);
  };

  const handleClear = () => {
    setInputValue("");
    onSelect("");
  };

  useEffect(() => {
    onInputChange(inputValue);
  }, [inputValue]);


  return (
    <div className={`relative w-full ${className}`}>
      <Select
        showSearch
        value={inputValue}
        placeholder={placeholder}
        onChange={handleChange}
        onSearch={(v)=>setInputValue(v)}
        allowClear
        suffixIcon={<ChevronDown className="text-gray-400" size={16} />}
        className="w-full text-sm rounded-md shadow-sm custom-select"
        optionFilterProp="children"
        filterOption={(input, option) =>
          option.children.toLowerCase().includes(input.toLowerCase())
        }
        dropdownRender={(menu) => (
          <div>
            {menu}
            {allowCustom && inputValue && !options.some(o => o.name === inputValue) && (
              <div
                className="p-2 text-blue-600 cursor-pointer hover:bg-blue-50"
                onClick={() => handleChange(inputValue)}
              >
                ➕ Add “{inputValue}”
              </div>
            )}
          </div>
        )}
      >
        {options.map((option, index) => (
          <Option key={index} value={option.name}>
            {option.name}
          </Option>
        ))}
      </Select>

      {inputValue && (
        <button
          onClick={handleClear}
          className="absolute right-9 top-1/2 transform -translate-y-1/2 p-1 hover:bg-gray-100 rounded transition-colors"
        >
          <X className="w-4 h-4 text-gray-400" />
        </button>
      )}
    </div>
  );
};

export default React.memo(FreeSoloDropdown);
