import React, { useState, useRef, useEffect } from 'react';
import { cn } from '@/tailwind/utils';
import { Input } from './input';
import { Textarea } from './textarea';

export interface EditableFieldProps {
  /** The current value to display/edit */
  value: string;
  /** Callback function when the value changes and is saved */
  onSave: (value: string) => void;
  /** Label for the field */
  label?: string;
  /** Placeholder text when empty */
  placeholder?: string;
  /** Type of input field to use */
  type?: 'text' | 'number' | 'textarea';
  /** Additional CSS class names */
  className?: string;
  /** CSS class for the display text */
  displayClassName?: string;
  /** CSS class for the input element */
  inputClassName?: string;
  /** CSS class for the label */
  labelClassName?: string;
  /** Whether the field is disabled */
  disabled?: boolean;
}

export function EditableField({
  value,
  onSave,
  label,
  placeholder = 'Click to edit',
  type = 'text',
  className,
  displayClassName,
  inputClassName,
  labelClassName,
  disabled = false,
}: EditableFieldProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [currentValue, setCurrentValue] = useState(value);
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);

  // Update local state when prop value changes
  useEffect(() => {
    setCurrentValue(value);
  }, [value]);

  // Focus input when entering edit mode
  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  const handleStartEdit = () => {
    if (!disabled) {
      setIsEditing(true);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setCurrentValue(e.target.value);
  };

  const handleBlur = () => {
    setIsEditing(false);
    if (currentValue !== value) {
      onSave(currentValue);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && type !== 'textarea') {
      e.preventDefault();
      setIsEditing(false);
      onSave(currentValue);
    } else if (e.key === 'Escape') {
      e.preventDefault();
      setIsEditing(false);
      setCurrentValue(value); // Reset to original value
    }
  };

  return (
    <div className={cn('group relative', className)}>
      {label && (
        <div
          className={cn('mb-1 text-base font-medium text-gray-700', labelClassName)}
          onClick={handleStartEdit}
        >
          {label}
        </div>
      )}

      {isEditing ? (
        <>
          {type === 'textarea' ? (
            <Textarea
              ref={inputRef as React.RefObject<HTMLTextAreaElement>}
              value={currentValue}
              onChange={handleChange}
              onBlur={handleBlur}
              onKeyDown={handleKeyDown}
              placeholder={placeholder}
              className={cn('min-h-[36px] touch-manipulation text-base', inputClassName)}
              disabled={disabled}
              rows={2}
            />
          ) : (
            <Input
              ref={inputRef as React.RefObject<HTMLInputElement>}
              type={type}
              value={currentValue}
              onChange={handleChange}
              onBlur={handleBlur}
              onKeyDown={handleKeyDown}
              placeholder={placeholder}
              className={cn('touch-manipulation text-base', inputClassName)}
              disabled={disabled}
            />
          )}
        </>
      ) : (
        <div
          onClick={handleStartEdit}
          className={cn(
            'min-h-[36px] cursor-text rounded-md border border-transparent px-2 py-1.5',
            'hover:border-gray-200 hover:bg-gray-50',
            'transition-colors duration-200',
            !value && 'text-gray-400 italic',
            disabled && 'cursor-default opacity-60 hover:border-transparent hover:bg-transparent',
            'touch-manipulation text-base',
            displayClassName,
          )}
        >
          {value || placeholder}
        </div>
      )}
    </div>
  );
}
