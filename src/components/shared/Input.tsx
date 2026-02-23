/* eslint-disable @typescript-eslint/no-explicit-any */
import { Input } from "@nextui-org/react";
import { useState } from "react";
interface props {
  type: string;
  label: string;
  placeholder: string;
  values: Record<string, string>;
  errors: Record<string, string>;
  id: string;
  handleChange: any;
  handleBlur: any;
}
const CustomInput = ({
  type,
  label,
  placeholder,
  errors,
  id,
  values,
  handleChange,
  handleBlur
}: props) => {
  const [showPassword, setShowPassword] = useState(false);

  const handleTogglePassword = () => {
    setShowPassword(prev => !prev);
  };

  return (
    <div className="relative">
      <Input
        id={id}
        // type={type}
        type={type === "password" && showPassword ? "text" : type}
        label={label}
        placeholder={placeholder}
        errorMessage={errors?.[id] || ''} // Use optional chaining to avoid undefined error
        value={values?.[id] || ''} // Ensure default empty value
        onChange={handleChange}
        onBlur={handleBlur}
        classNames={{ input: "text-[16px]" }}
      />

      {type === "password" &&
        <button
          type="button"
          onClick={handleTogglePassword}
          className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
        >
          {showPassword
            ? <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-5 h-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3.98 8.78a10.05 10.05 0 0116.04 0m-1.82 1.67a4 4 0 01-8.36 0m7.48-1.67A10.05 10.05 0 013.98 8.78m15.22.23a4.006 4.006 0 00-6.48-2.2m0 0a4.006 4.006 0 016.48 2.2M4.28 9.01a4.006 4.006 0 016.48 2.2"
                />
              </svg>
            : <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-5 h-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 18.75c-7.3 0-11.9-6.465-11.92-6.495a.75.75 0 010-.756C.1 11.715 4.7 5.25 12 5.25s11.9 6.465 11.92 6.495a.75.75 0 010 .756C23.9 13.035 19.3 19.5 12 19.5zm0-3.75a3.75 3.75 0 110-7.5 3.75 3.75 0 010 7.5z"
                />
              </svg>}
        </button>}
    </div>
  );
};

export default CustomInput;
