import type {
  InputHTMLAttributes,
  ReactNode,
  SelectHTMLAttributes,
  TextareaHTMLAttributes,
} from "react";

// Emerald 400 measures 3.53:1 against the shell surface, which is what makes
// the control boundary visible rather than decorative.
const controlClasses =
  "w-full rounded-md border border-emerald-400 bg-shell px-3.5 py-3 text-body text-charcoal placeholder:text-charcoal-muted read-only:bg-cream disabled:cursor-not-allowed disabled:border-emerald-200 disabled:bg-emerald-50 disabled:text-charcoal-muted";

const labelClasses = "block text-body-sm font-semibold text-charcoal";

interface FieldShellProps {
  id: string;
  label: string;
  hint?: string;
  error?: string;
  optional?: boolean;
  children: ReactNode;
}

function FieldShell({ id, label, hint, error, optional, children }: FieldShellProps) {
  const hintId = hint ? `${id}-hint` : undefined;
  const errorId = error ? `${id}-error` : undefined;

  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className={labelClasses}>
        {label}
        {optional ? <span className="ml-1 font-normal text-charcoal-muted">(opsional)</span> : null}
      </label>
      {children}
      {hint ? (
        <p id={hintId} className="text-body-sm text-charcoal-muted">
          {hint}
        </p>
      ) : null}
      {/* Error is text first, colour second: never a red border on its own. */}
      {error ? (
        <p id={errorId} role="alert" className="text-body-sm font-semibold text-status-full">
          {error}
        </p>
      ) : null}
    </div>
  );
}

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  id: string;
  label: string;
  hint?: string;
  error?: string;
  optional?: boolean;
}

export function Input({ id, label, hint, error, optional, className = "", ...rest }: InputProps) {
  return (
    <FieldShell id={id} label={label} hint={hint} error={error} optional={optional}>
      <input
        id={id}
        className={`${controlClasses} ${className}`.trim()}
        aria-invalid={error ? true : undefined}
        aria-describedby={
          [hint ? `${id}-hint` : null, error ? `${id}-error` : null].filter(Boolean).join(" ") ||
          undefined
        }
        {...rest}
      />
    </FieldShell>
  );
}

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  id: string;
  label: string;
  hint?: string;
  error?: string;
  children: ReactNode;
}

export function Select({ id, label, hint, error, className = "", children, ...rest }: SelectProps) {
  return (
    <FieldShell id={id} label={label} hint={hint} error={error}>
      <select
        id={id}
        className={`${controlClasses} appearance-none bg-[url("data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%27http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%27%20viewBox%3D%270%200%2012%2012%27%3E%3Cpath%20d%3D%27M2%204.5L6%208.5L10%204.5%27%20fill%3D%27none%27%20stroke%3D%27%23155046%27%20stroke-width%3D%271.6%27%2F%3E%3C%2Fsvg%3E")] bg-[length:12px_12px] bg-[right_1rem_center] bg-no-repeat pr-10 ${className}`.trim()}
        aria-invalid={error ? true : undefined}
        aria-describedby={
          [hint ? `${id}-hint` : null, error ? `${id}-error` : null].filter(Boolean).join(" ") ||
          undefined
        }
        {...rest}
      >
        {children}
      </select>
    </FieldShell>
  );
}

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  id: string;
  label: string;
  hint?: string;
  error?: string;
  optional?: boolean;
}

export function Textarea({
  id,
  label,
  hint,
  error,
  optional,
  className = "",
  ...rest
}: TextareaProps) {
  return (
    <FieldShell id={id} label={label} hint={hint} error={error} optional={optional}>
      <textarea
        id={id}
        className={`${controlClasses} min-h-32 resize-y ${className}`.trim()}
        aria-invalid={error ? true : undefined}
        aria-describedby={
          [hint ? `${id}-hint` : null, error ? `${id}-error` : null].filter(Boolean).join(" ") ||
          undefined
        }
        {...rest}
      />
    </FieldShell>
  );
}
