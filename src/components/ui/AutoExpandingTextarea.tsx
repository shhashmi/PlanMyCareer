import { useRef, useEffect, useCallback, TextareaHTMLAttributes } from 'react';

interface AutoExpandingTextareaProps
  extends Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, 'onSubmit'> {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onSubmit?: () => void;
  minHeight?: number;
  maxHeight?: number;
}

export default function AutoExpandingTextarea({
  value,
  onChange,
  onSubmit,
  minHeight = 48,
  maxHeight = 150,
  style,
  ...props
}: AutoExpandingTextareaProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const adjustHeight = useCallback(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    // Reset height to calculate scrollHeight properly
    textarea.style.height = `${minHeight}px`;

    // Calculate new height based on content
    const newHeight = Math.min(Math.max(textarea.scrollHeight, minHeight), maxHeight);
    textarea.style.height = `${newHeight}px`;

    // Show scrollbar when content exceeds max height
    textarea.style.overflowY = textarea.scrollHeight > maxHeight ? 'auto' : 'hidden';
  }, [minHeight, maxHeight]);

  useEffect(() => {
    adjustHeight();
  }, [value, adjustHeight]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey && onSubmit) {
      e.preventDefault();
      onSubmit();
    }
    props.onKeyDown?.(e);
  };

  return (
    <textarea
      ref={textareaRef}
      value={value}
      onChange={onChange}
      onKeyDown={handleKeyDown}
      rows={1}
      style={{
        resize: 'none',
        minHeight: `${minHeight}px`,
        maxHeight: `${maxHeight}px`,
        overflowY: 'hidden',
        ...style,
      }}
      {...props}
    />
  );
}
