import React, { InputHTMLAttributes, ChangeEvent } from 'react';
import { tw } from 'twind';

interface Props extends Omit<InputHTMLAttributes<any>, 'onChange'> {
  className?: string;
  onChange: (value: string) => void;
}
const Input = (props: Props) => {
  const { className, children, onChange, ...rest } = props;

  const handleOnChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (onChange) {
      onChange(e.target.value);
    }
    return null;
  };

  return (
    <label>
      <input
        className={tw`focus:outline-none bg-gray-500 py-2 px-3 w-full appearance-none transition duration-150 ease-in-out border border-gray-500 text-gray-200 ${className}`}
        onChange={handleOnChange}
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="off"
        spellCheck="false"
        {...rest}
      />
    </label>
  );
};

export default Input;
