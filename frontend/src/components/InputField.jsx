import { forwardRef } from 'react';

const InputField = forwardRef(({
  icon: Icon,
  label,
  name,
  type = 'text',
  value,
  onChange,
  placeholder,
  required,
  minLength,
  error,
  rightElement,
  inputMode,
  maxLength,
  className = '',
  autoComplete,
  ...props
}, ref) => {
  return (
    <div>
      {label && (
        <label htmlFor={name} className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          {label}
        </label>
      )}
      <div
        className={[
          'flex items-center w-full border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 focus-within:ring-2 focus-within:ring-indigo-500 focus-within:border-transparent transition-all duration-200',
          Icon ? 'pl-3' : 'pl-3',
          rightElement ? 'pr-1.5' : 'pr-3',
          className,
        ].join(' ')}
      >
        {Icon && (
          <span className="text-gray-400 flex-shrink-0 flex items-center">
            <Icon />
          </span>
        )}
        <input
          ref={ref}
          id={name}
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          minLength={minLength}
          inputMode={inputMode}
          maxLength={maxLength}
          autoComplete={autoComplete}
          className="flex-1 bg-transparent border-0 outline-none text-gray-900 dark:text-white text-sm py-2.5 px-2 placeholder-gray-400 dark:placeholder-gray-500"
          {...props}
        />
        {rightElement && (
          <span className="text-gray-400 flex-shrink-0 flex items-center">
            {rightElement}
          </span>
        )}
      </div>
      {error && (
        <p className="text-xs text-red-500 mt-1">{error}</p>
      )}
    </div>
  );
});

InputField.displayName = 'InputField';

export default InputField;
