import { forwardRef, type TextareaHTMLAttributes } from "react";

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea(
  { label, error, id, className = "", ...rest },
  ref
) {
  const areaId = id ?? rest.name;
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={areaId} className="text-sm font-medium text-ink">
          {label}
        </label>
      )}
      <textarea
        ref={ref}
        id={areaId}
        className={`min-h-[180px] resize-y rounded-md border bg-surface px-3 py-2.5 text-sm text-ink placeholder:text-ink-muted/60 transition-colors focus:border-action ${
          error ? "border-danger" : "border-border"
        } ${className}`}
        {...rest}
      />
      {error && <p className="text-xs font-medium text-danger">{error}</p>}
    </div>
  );
});
