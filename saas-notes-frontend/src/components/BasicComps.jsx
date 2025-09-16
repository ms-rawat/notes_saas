
import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

export const PasswordInput = ({ label, placeholder, value, onChange, ...rest }) => {
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="relative mb-6">
      <label htmlFor="password-input" className="block text-sm font-medium text-slate-300 mb-2">
        {label}
      </label>
      <div className="relative">
        <input
          id="password-input"
          type={showPassword ? 'text' : 'password'}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          {...rest}
        />
        <button
          type="button"
          onClick={togglePasswordVisibility}
          className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-white transition-colors duration-200 focus:outline-none"
          aria-label={showPassword ? 'Hide password' : 'Show password'}
        >
          {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
        </button>
      </div>
    </div>
  );
};