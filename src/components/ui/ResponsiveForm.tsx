'use client';

import React, { ReactNode } from 'react';
import { useForm, FormProvider, SubmitHandler, UseFormReturn, FieldValues } from 'react-hook-form';

interface FormFieldProps {
  label: string;
  name: string;
  required?: boolean;
  helpText?: string;
  error?: string;
  className?: string;
  children: ReactNode;
  labelClassName?: string;
  containerClassName?: string;
}

export const FormField: React.FC<FormFieldProps> = ({
  label,
  name,
  required = false,
  helpText,
  error,
  className = '',
  children,
  labelClassName = '',
  containerClassName = '',
}) => {
  return (
    <div className={`mb-4 ${containerClassName}`}>
      <label 
        htmlFor={name} 
        className={`block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 ${labelClassName}`}
      >
        {label}
        {required && <span className="text-red-500">*</span>}
      </label>
      <div className={className}>
        {children}
      </div>
      {helpText && !error && (
        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">{helpText}</p>
      )}
      {error && (
        <p className="mt-1 text-xs text-red-600 dark:text-red-400">{error}</p>
      )}
    </div>
  );
};

interface ResponsiveFormProps<T extends FieldValues> {
  children: (methods: UseFormReturn<T>) => ReactNode;
  onSubmit: SubmitHandler<T>;
  defaultValues?: Partial<T>;
  className?: string;
  formClassName?: string;
  submitButtonText?: string;
  submitButtonClassName?: string;
  resetOnSubmit?: boolean;
  showSubmitButton?: boolean;
  mode?: 'onChange' | 'onBlur' | 'onSubmit' | 'onTouched' | 'all';
}

const ResponsiveForm = <T extends FieldValues>({
  children,
  onSubmit,
  defaultValues,
  className = '',
  formClassName = 'space-y-4',
  submitButtonText = 'Submit',
  submitButtonClassName = 'w-full sm:w-auto',
  resetOnSubmit = false,
  showSubmitButton = true,
  mode = 'onSubmit',
}: ResponsiveFormProps<T>) => {
  const methods = useForm<T>({ 
    defaultValues: defaultValues as any,
    mode,
  });

  const { handleSubmit, reset } = methods;

  const handleFormSubmit = async (data: T) => {
    try {
      await onSubmit(data);
      if (resetOnSubmit) {
        reset();
      }
    } catch (error) {
      console.error('Form submission error:', error);
    }
  };

  return (
    <FormProvider {...methods}>
      <form 
        onSubmit={handleSubmit(handleFormSubmit)} 
        className={`w-full ${className}`}
      >
        <div className={formClassName}>
          {children(methods)}
          
          {showSubmitButton && (
            <div className="mt-6">
              <button
                type="submit"
                className={`inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-brand-600 hover:bg-brand-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500 ${submitButtonClassName}`}
              >
                {submitButtonText}
              </button>
            </div>
          )}
        </div>
      </form>
    </FormProvider>
  );
};

export default ResponsiveForm;
