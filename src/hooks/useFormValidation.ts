import { useState, useEffect, useRef } from 'react';

interface ValidationRules {
  required?: boolean;
  minSelections?: number;
}

interface ValidationErrors {
  [key: string]: string;
}

export const useFormValidation = (
  formData: Record<string, any>,
  rules: Record<string, ValidationRules>
) => {
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [isValid, setIsValid] = useState(false);
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const isInitialMount = useRef(true);

  useEffect(() => {
    // Skip validation on initial mount
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    const newErrors: ValidationErrors = {};

    Object.entries(rules).forEach(([field, rule]) => {
      const value = formData[field];
      const fieldTouched = touched[field] || false;

      // Only show errors if field has been touched and is invalid
      if (rule.required && fieldTouched) {
        if (Array.isArray(value)) {
          if (value.length === 0) {
            newErrors[field] = 'This field is required';
          } else if (rule.minSelections && value.length < rule.minSelections) {
            newErrors[field] = `Please select at least ${rule.minSelections} option(s)`;
          }
        } else if (typeof value === 'string') {
          if (!value.trim()) {
            newErrors[field] = 'This field is required';
          }
        } else if (typeof value === 'object') {
          if (!value || Object.keys(value).length === 0) {
            newErrors[field] = 'This field is required';
          }
        } else if (!value) {
          newErrors[field] = 'This field is required';
        }
      }
    });

    setErrors(newErrors);
    setIsValid(Object.keys(newErrors).length === 0);
  }, [formData, rules, touched]);

  // Mark field as touched when user interacts
  const markFieldTouched = (field: string) => {
    setTouched(prev => ({ ...prev, [field]: true }));
  };

  return { errors, isValid, markFieldTouched };
};