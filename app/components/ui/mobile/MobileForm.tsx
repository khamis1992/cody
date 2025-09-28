import { forwardRef, type HTMLAttributes, type ReactNode, useState } from 'react';
import { classNames } from '~/utils/classNames';
import { motion, AnimatePresence } from 'framer-motion';

interface FormFieldProps extends HTMLAttributes<HTMLDivElement> {
  label: string;
  required?: boolean;
  error?: string;
  helper?: string;
  children: ReactNode;
}

interface TextInputProps extends HTMLAttributes<HTMLInputElement> {
  label: string;
  type?: 'text' | 'email' | 'password' | 'tel' | 'url' | 'search';
  placeholder?: string;
  required?: boolean;
  error?: string;
  helper?: string;
  variant?: 'default' | 'filled' | 'outlined' | 'minimal';
  size?: 'sm' | 'md' | 'lg';
  icon?: {
    left?: string;
    right?: string;
  };
}

interface SelectInputProps extends HTMLAttributes<HTMLSelectElement> {
  label: string;
  options: Array<{ value: string; label: string; disabled?: boolean }>;
  placeholder?: string;
  required?: boolean;
  error?: string;
  helper?: string;
  variant?: 'default' | 'filled' | 'outlined' | 'minimal';
  size?: 'sm' | 'md' | 'lg';
}

interface CheckboxProps extends HTMLAttributes<HTMLInputElement> {
  label: string;
  description?: string;
  required?: boolean;
  error?: string;
  variant?: 'default' | 'switch' | 'card';
}

interface RadioGroupProps extends HTMLAttributes<HTMLDivElement> {
  name: string;
  label: string;
  options: Array<{
    value: string;
    label: string;
    description?: string;
    disabled?: boolean;
  }>;
  value?: string;
  onChange?: (value: string) => void;
  required?: boolean;
  error?: string;
  variant?: 'default' | 'card' | 'button';
  direction?: 'vertical' | 'horizontal';
}

interface FileUploadProps extends HTMLAttributes<HTMLDivElement> {
  label: string;
  accept?: string;
  multiple?: boolean;
  maxSize?: number;
  required?: boolean;
  error?: string;
  helper?: string;
  onFilesChange?: (files: FileList | null) => void;
  variant?: 'default' | 'dropzone' | 'button';
}

// Form Field Wrapper
export const FormField = forwardRef<HTMLDivElement, FormFieldProps>(({
  className,
  label,
  required = false,
  error,
  helper,
  children,
  ...props
}, ref) => {
  return (
    <div
      ref={ref}
      className={classNames('space-y-2', className)}
      {...props}
    >
      <label className="block text-sm font-medium text-gray-900 dark:text-gray-100">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>

      {children}

      <AnimatePresence>
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="text-sm text-red-600 dark:text-red-400 flex items-center gap-1"
          >
            <div className="i-ph:warning-circle w-4 h-4" />
            {error}
          </motion.p>
        )}
      </AnimatePresence>

      {helper && !error && (
        <p className="text-sm text-gray-600 dark:text-gray-400">
          {helper}
        </p>
      )}
    </div>
  );
});
FormField.displayName = 'FormField';

// Mobile Text Input
export const MobileTextInput = forwardRef<HTMLInputElement, TextInputProps>(({
  className,
  label,
  type = 'text',
  placeholder,
  required = false,
  error,
  helper,
  variant = 'default',
  size = 'md',
  icon,
  ...props
}, ref) => {
  const [isFocused, setIsFocused] = useState(false);

  const variantClasses = {
    default: 'bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 focus:border-blue-500 dark:focus:border-blue-400',
    filled: 'bg-gray-100 dark:bg-gray-800 border border-transparent focus:border-blue-500 dark:focus:border-blue-400',
    outlined: 'bg-transparent border-2 border-gray-300 dark:border-gray-700 focus:border-blue-500 dark:focus:border-blue-400',
    minimal: 'bg-transparent border-0 border-b-2 border-gray-300 dark:border-gray-700 focus:border-blue-500 dark:focus:border-blue-400 rounded-none',
  };

  const sizeClasses = {
    sm: 'px-3 py-2 text-sm h-10',
    md: 'px-4 py-3 text-base h-12',
    lg: 'px-4 py-4 text-lg h-14',
  };

  return (
    <FormField label={label} required={required} error={error} helper={helper}>
      <div className="relative">
        {icon?.left && (
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400 pointer-events-none">
            <div className={classNames(icon.left, 'w-5 h-5')} />
          </div>
        )}

        <input
          ref={ref}
          type={type}
          placeholder={placeholder}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className={classNames(
            'w-full rounded-xl transition-all duration-200 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400',
            'focus:outline-none focus:ring-4 focus:ring-blue-500/20',
            variantClasses[variant],
            sizeClasses[size],
            icon?.left ? 'pl-10' : '',
            icon?.right ? 'pr-10' : '',
            error ? 'border-red-500 dark:border-red-400' : '',
            className
          )}
          {...props}
        />

        {icon?.right && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400 pointer-events-none">
            <div className={classNames(icon.right, 'w-5 h-5')} />
          </div>
        )}

        {/* Focus indicator */}
        <AnimatePresence>
          {isFocused && variant !== 'minimal' && (
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="absolute inset-0 rounded-xl border-2 border-blue-500 dark:border-blue-400 pointer-events-none"
            />
          )}
        </AnimatePresence>
      </div>
    </FormField>
  );
});
MobileTextInput.displayName = 'MobileTextInput';

// Mobile Select Input
export const MobileSelect = forwardRef<HTMLSelectElement, SelectInputProps>(({
  className,
  label,
  options,
  placeholder,
  required = false,
  error,
  helper,
  variant = 'default',
  size = 'md',
  ...props
}, ref) => {
  const variantClasses = {
    default: 'bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 focus:border-blue-500 dark:focus:border-blue-400',
    filled: 'bg-gray-100 dark:bg-gray-800 border border-transparent focus:border-blue-500 dark:focus:border-blue-400',
    outlined: 'bg-transparent border-2 border-gray-300 dark:border-gray-700 focus:border-blue-500 dark:focus:border-blue-400',
    minimal: 'bg-transparent border-0 border-b-2 border-gray-300 dark:border-gray-700 focus:border-blue-500 dark:focus:border-blue-400 rounded-none',
  };

  const sizeClasses = {
    sm: 'px-3 py-2 text-sm h-10',
    md: 'px-4 py-3 text-base h-12',
    lg: 'px-4 py-4 text-lg h-14',
  };

  return (
    <FormField label={label} required={required} error={error} helper={helper}>
      <div className="relative">
        <select
          ref={ref}
          className={classNames(
            'w-full rounded-xl transition-all duration-200 text-gray-900 dark:text-gray-100',
            'focus:outline-none focus:ring-4 focus:ring-blue-500/20 appearance-none',
            'pr-10 cursor-pointer',
            variantClasses[variant],
            sizeClasses[size],
            error ? 'border-red-500 dark:border-red-400' : '',
            className
          )}
          {...props}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((option) => (
            <option
              key={option.value}
              value={option.value}
              disabled={option.disabled}
            >
              {option.label}
            </option>
          ))}
        </select>

        {/* Custom arrow */}
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400 pointer-events-none">
          <div className="i-ph:caret-down w-5 h-5" />
        </div>
      </div>
    </FormField>
  );
});
MobileSelect.displayName = 'MobileSelect';

// Mobile Checkbox
export const MobileCheckbox = forwardRef<HTMLInputElement, CheckboxProps>(({
  className,
  label,
  description,
  required = false,
  error,
  variant = 'default',
  ...props
}, ref) => {
  const [isChecked, setIsChecked] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsChecked(e.target.checked);
    props.onChange?.(e);
  };

  if (variant === 'switch') {
    return (
      <FormField label={label} required={required} error={error}>
        <label className="flex items-center justify-between cursor-pointer">
          <div>
            {description && (
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {description}
              </p>
            )}
          </div>
          <div className="relative">
            <input
              ref={ref}
              type="checkbox"
              className="sr-only"
              onChange={handleChange}
              {...props}
            />
            <div className={classNames(
              'w-12 h-6 rounded-full transition-colors duration-200',
              isChecked
                ? 'bg-blue-600 dark:bg-blue-500'
                : 'bg-gray-300 dark:bg-gray-600'
            )}>
              <motion.div
                animate={{ x: isChecked ? 24 : 0 }}
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                className="w-6 h-6 bg-white rounded-full shadow-md"
              />
            </div>
          </div>
        </label>
      </FormField>
    );
  }

  if (variant === 'card') {
    return (
      <FormField label={label} required={required} error={error}>
        <label className={classNames(
          'flex items-start gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all duration-200',
          isChecked
            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
            : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600',
          className
        )}>
          <input
            ref={ref}
            type="checkbox"
            className="sr-only"
            onChange={handleChange}
            {...props}
          />
          <div className={classNames(
            'w-5 h-5 rounded border-2 flex items-center justify-center transition-all duration-200',
            isChecked
              ? 'border-blue-500 bg-blue-500'
              : 'border-gray-300 dark:border-gray-600'
          )}>
            <AnimatePresence>
              {isChecked && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  className="i-ph:check w-3 h-3 text-white"
                />
              )}
            </AnimatePresence>
          </div>
          <div className="flex-1">
            <div className="font-medium text-gray-900 dark:text-gray-100">
              {label}
            </div>
            {description && (
              <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                {description}
              </div>
            )}
          </div>
        </label>
      </FormField>
    );
  }

  return (
    <FormField label="" required={required} error={error}>
      <label className="flex items-center gap-3 cursor-pointer">
        <input
          ref={ref}
          type="checkbox"
          className="sr-only"
          onChange={handleChange}
          {...props}
        />
        <div className={classNames(
          'w-5 h-5 rounded border-2 flex items-center justify-center transition-all duration-200',
          isChecked
            ? 'border-blue-500 bg-blue-500'
            : 'border-gray-300 dark:border-gray-600'
        )}>
          <AnimatePresence>
            {isChecked && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                className="i-ph:check w-3 h-3 text-white"
              />
            )}
          </AnimatePresence>
        </div>
        <div>
          <div className="font-medium text-gray-900 dark:text-gray-100">
            {label}
          </div>
          {description && (
            <div className="text-sm text-gray-600 dark:text-gray-400">
              {description}
            </div>
          )}
        </div>
      </label>
    </FormField>
  );
});
MobileCheckbox.displayName = 'MobileCheckbox';

// Mobile Radio Group
export const MobileRadioGroup = forwardRef<HTMLDivElement, RadioGroupProps>(({
  className,
  name,
  label,
  options,
  value,
  onChange,
  required = false,
  error,
  variant = 'default',
  direction = 'vertical',
  ...props
}, ref) => {
  const handleChange = (optionValue: string) => {
    onChange?.(optionValue);
  };

  return (
    <FormField label={label} required={required} error={error}>
      <div
        ref={ref}
        className={classNames(
          'space-y-2',
          direction === 'horizontal' ? 'flex flex-wrap gap-2' : '',
          className
        )}
        {...props}
      >
        {options.map((option) => {
          const isSelected = value === option.value;

          if (variant === 'card') {
            return (
              <label
                key={option.value}
                className={classNames(
                  'flex items-start gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all duration-200',
                  isSelected
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                    : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600',
                  option.disabled ? 'opacity-50 cursor-not-allowed' : ''
                )}
              >
                <input
                  type="radio"
                  name={name}
                  value={option.value}
                  checked={isSelected}
                  onChange={() => handleChange(option.value)}
                  disabled={option.disabled}
                  className="sr-only"
                />
                <div className={classNames(
                  'w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all duration-200',
                  isSelected
                    ? 'border-blue-500'
                    : 'border-gray-300 dark:border-gray-600'
                )}>
                  <AnimatePresence>
                    {isSelected && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0 }}
                        className="w-2.5 h-2.5 rounded-full bg-blue-500"
                      />
                    )}
                  </AnimatePresence>
                </div>
                <div className="flex-1">
                  <div className="font-medium text-gray-900 dark:text-gray-100">
                    {option.label}
                  </div>
                  {option.description && (
                    <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      {option.description}
                    </div>
                  )}
                </div>
              </label>
            );
          }

          if (variant === 'button') {
            return (
              <label
                key={option.value}
                className={classNames(
                  'inline-flex items-center justify-center px-4 py-2 rounded-xl border-2 cursor-pointer transition-all duration-200 font-medium',
                  isSelected
                    ? 'border-blue-500 bg-blue-500 text-white'
                    : 'border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:border-gray-400 dark:hover:border-gray-500',
                  option.disabled ? 'opacity-50 cursor-not-allowed' : ''
                )}
              >
                <input
                  type="radio"
                  name={name}
                  value={option.value}
                  checked={isSelected}
                  onChange={() => handleChange(option.value)}
                  disabled={option.disabled}
                  className="sr-only"
                />
                {option.label}
              </label>
            );
          }

          return (
            <label
              key={option.value}
              className="flex items-center gap-3 cursor-pointer"
            >
              <input
                type="radio"
                name={name}
                value={option.value}
                checked={isSelected}
                onChange={() => handleChange(option.value)}
                disabled={option.disabled}
                className="sr-only"
              />
              <div className={classNames(
                'w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all duration-200',
                isSelected
                  ? 'border-blue-500'
                  : 'border-gray-300 dark:border-gray-600'
              )}>
                <AnimatePresence>
                  {isSelected && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      className="w-2.5 h-2.5 rounded-full bg-blue-500"
                    />
                  )}
                </AnimatePresence>
              </div>
              <div>
                <div className="font-medium text-gray-900 dark:text-gray-100">
                  {option.label}
                </div>
                {option.description && (
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {option.description}
                  </div>
                )}
              </div>
            </label>
          );
        })}
      </div>
    </FormField>
  );
});
MobileRadioGroup.displayName = 'MobileRadioGroup';

// Mobile File Upload
export const MobileFileUpload = forwardRef<HTMLDivElement, FileUploadProps>(({
  className,
  label,
  accept,
  multiple = false,
  maxSize,
  required = false,
  error,
  helper,
  onFilesChange,
  variant = 'dropzone',
  ...props
}, ref) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);

  const handleFileChange = (files: FileList | null) => {
    setSelectedFiles(files);
    onFilesChange?.(files);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileChange(files);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  if (variant === 'button') {
    return (
      <FormField label={label} required={required} error={error} helper={helper}>
        <label className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl cursor-pointer transition-colors duration-200">
          <div className="i-ph:upload w-5 h-5" />
          Choose {multiple ? 'Files' : 'File'}
          <input
            type="file"
            accept={accept}
            multiple={multiple}
            onChange={(e) => handleFileChange(e.target.files)}
            className="sr-only"
          />
        </label>
        {selectedFiles && (
          <div className="mt-2 space-y-1">
            {Array.from(selectedFiles).map((file, index) => (
              <div key={index} className="text-sm text-gray-600 dark:text-gray-400">
                {file.name} ({formatFileSize(file.size)})
              </div>
            ))}
          </div>
        )}
      </FormField>
    );
  }

  return (
    <FormField label={label} required={required} error={error} helper={helper}>
      <div
        ref={ref}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={classNames(
          'relative border-2 border-dashed rounded-xl p-6 text-center transition-all duration-200',
          isDragOver
            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
            : 'border-gray-300 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-600',
          error ? 'border-red-500 dark:border-red-400' : '',
          className
        )}
        {...props}
      >
        <input
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={(e) => handleFileChange(e.target.files)}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />

        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
            <div className="i-ph:upload w-6 h-6 text-gray-600 dark:text-gray-400" />
          </div>

          <div>
            <p className="font-medium text-gray-900 dark:text-gray-100">
              {isDragOver ? 'Drop files here' : 'Upload files'}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Drag and drop or click to browse
            </p>
            {maxSize && (
              <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                Max size: {formatFileSize(maxSize)}
              </p>
            )}
          </div>
        </div>

        {selectedFiles && (
          <div className="mt-4 space-y-2">
            {Array.from(selectedFiles).map((file, index) => (
              <div key={index} className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="flex items-center gap-2">
                  <div className="i-ph:file w-4 h-4 text-gray-600 dark:text-gray-400" />
                  <span className="text-sm text-gray-900 dark:text-gray-100 truncate">
                    {file.name}
                  </span>
                </div>
                <span className="text-xs text-gray-500 dark:text-gray-500">
                  {formatFileSize(file.size)}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </FormField>
  );
});
MobileFileUpload.displayName = 'MobileFileUpload';

// Usage Examples
export const MobileFormExamples = {
  loginForm: {
    email: {
      label: "Email",
      type: "email" as const,
      placeholder: "Enter your email",
      required: true,
      icon: { left: 'i-ph:envelope' },
    },
    password: {
      label: "Password",
      type: "password" as const,
      placeholder: "Enter your password",
      required: true,
      icon: { left: 'i-ph:lock' },
    },
    remember: {
      label: "Remember me",
      description: "Keep me logged in for 30 days",
    },
  },

  profileForm: {
    name: {
      label: "Full Name",
      placeholder: "John Doe",
      required: true,
    },
    bio: {
      label: "Bio",
      placeholder: "Tell us about yourself...",
      helper: "Maximum 160 characters",
    },
    country: {
      label: "Country",
      options: [
        { value: "us", label: "United States" },
        { value: "ca", label: "Canada" },
        { value: "uk", label: "United Kingdom" },
      ],
      placeholder: "Select your country",
    },
    notifications: {
      label: "Email Notifications",
      description: "Receive updates about your account",
      variant: "switch" as const,
    },
  },
};