/**
 * Form primitives for the admin panel.
 *
 * The forms are bilingual by construction: every value a visitor reads is
 * edited side by side as Indonesian and English, which is why `LocalizedField`
 * exists rather than a plain text input with a language switch. Leaving one
 * language blank is possible but never silent: the control shows which side is
 * empty, and the content layer treats an empty side as missing rather than
 * borrowing the other one.
 */
import { useState } from "react";
import type { ReactNode } from "react";
import type { Localized } from "../../i18n/types";
import { t } from "../../i18n/types";
import { uploadMedia } from "../../lib/content-api";
import { assetUrl } from "../../lib/media";

const inputClass =
  "w-full rounded-md border border-emerald-200 bg-shell px-3 py-2 text-body-sm text-charcoal focus:border-emerald-600";

export function Field({
  label,
  hint,
  children,
  required,
}: {
  label: string;
  hint?: string;
  children: ReactNode;
  required?: boolean;
}) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-body-sm font-semibold text-emerald-900">
        {label}
        {required ? <span className="text-charcoal-muted"> *</span> : null}
      </span>
      {children}
      {hint ? <span className="text-label text-charcoal-muted">{hint}</span> : null}
    </label>
  );
}

export function TextField({
  label,
  value,
  onChange,
  hint,
  type = "text",
  placeholder,
  required,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  hint?: string;
  type?: "text" | "number" | "date" | "month" | "email" | "url" | "password";
  placeholder?: string;
  required?: boolean;
}) {
  return (
    <Field label={label} hint={hint} required={required}>
      <input
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
        className={inputClass}
      />
    </Field>
  );
}

export function TextArea({
  label,
  value,
  onChange,
  hint,
  rows = 4,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  hint?: string;
  rows?: number;
  placeholder?: string;
}) {
  return (
    <Field label={label} hint={hint}>
      <textarea
        value={value}
        rows={rows}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
        className={`${inputClass} font-sans`}
      />
    </Field>
  );
}

export function SelectField<T extends string>({
  label,
  value,
  options,
  onChange,
  hint,
}: {
  label: string;
  value: T;
  options: Array<{ value: T; label: string }>;
  onChange: (value: T) => void;
  hint?: string;
}) {
  return (
    <Field label={label} hint={hint}>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value as T)}
        className={inputClass}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </Field>
  );
}

export function CheckboxField({
  label,
  checked,
  onChange,
  hint,
}: {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  hint?: string;
}) {
  return (
    <label className="flex items-start gap-3 rounded-md border border-emerald-100 bg-shell p-3">
      <input
        type="checkbox"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
        className="mt-1 h-4 w-4 accent-emerald-800"
      />
      <span>
        <span className="block text-body-sm font-semibold text-emerald-900">{label}</span>
        {hint ? <span className="block text-label text-charcoal-muted">{hint}</span> : null}
      </span>
    </label>
  );
}

/** A pair of inputs, one per language, kept together so neither can be forgotten. */
export function LocalizedField({
  label,
  value,
  onChange,
  hint,
  multiline,
  rows = 2,
}: {
  label: string;
  value: Localized<string> | null;
  onChange: (value: Localized<string> | null) => void;
  hint?: string;
  multiline?: boolean;
  rows?: number;
}) {
  const id = value?.id ?? "";
  const en = value?.en ?? "";

  function update(side: "id" | "en", next: string) {
    // Clearing both sides removes the value entirely, which is how a field like
    // "duration" or "airline" is taken back to its unpublished state.
    if (next === "" && value === null) return;
    const merged = { id: side === "id" ? next : id, en: side === "en" ? next : en };
    onChange(Object.values(merged).every((entry) => entry.trim() === "") ? null : merged);
  }

  return (
    <div className="flex flex-col gap-2">
      <span className="text-body-sm font-semibold text-emerald-900">{label}</span>
      {hint ? <span className="text-label text-charcoal-muted">{hint}</span> : null}
      <div className="grid gap-2 sm:grid-cols-2">
        {(["id", "en"] as const).map((side) => (
          <label key={side} className="flex flex-col gap-1">
            <span className="text-label font-semibold uppercase text-charcoal-muted">
              {side === "id" ? "Bahasa Indonesia" : "English"}
            </span>
            {multiline ? (
              <textarea
                value={side === "id" ? id : en}
                rows={rows}
                onChange={(event) => update(side, event.target.value)}
                className={inputClass}
              />
            ) : (
              <input
                type="text"
                value={side === "id" ? id : en}
                onChange={(event) => update(side, event.target.value)}
                className={inputClass}
              />
            )}
          </label>
        ))}
      </div>
    </div>
  );
}

/**
 * A list of short strings per language, one item per line. Lines are the right
 * unit here: everything stored this way is a bullet or a row in a table, and a
 * textarea keeps the whole list visible while it is being edited.
 */
export function LocalizedListField({
  label,
  value,
  onChange,
  hint,
  rows = 5,
}: {
  label: string;
  value: Localized<string[]>;
  onChange: (value: Localized<string[]>) => void;
  hint?: string;
  rows?: number;
}) {
  function parse(text: string): string[] {
    return text
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line !== "");
  }

  return (
    <div className="flex flex-col gap-2">
      <span className="text-body-sm font-semibold text-emerald-900">{label}</span>
      {hint ? <span className="text-label text-charcoal-muted">{hint}</span> : null}
      <div className="grid gap-2 sm:grid-cols-2">
        {(["id", "en"] as const).map((side) => (
          <label key={side} className="flex flex-col gap-1">
            <span className="text-label font-semibold uppercase text-charcoal-muted">
              {side === "id" ? "Bahasa Indonesia" : "English"}
            </span>
            <textarea
              value={value[side].join("\n")}
              rows={rows}
              onChange={(event) => onChange({ ...value, [side]: parse(event.target.value) })}
              className={inputClass}
            />
          </label>
        ))}
      </div>
    </div>
  );
}

/** An empty pair, so a new record starts with both languages present. */
export function emptyLocalized(): Localized<string> {
  return t("", "");
}

export function emptyLocalizedList(): Localized<string[]> {
  return { id: [], en: [] };
}

/**
 * Uploads through the backend bucket and stores the resulting URL. The field
 * shows the file that will be used, and refuses to pretend when nothing is set:
 * an empty field is what produces the labelled photo slot on the public site.
 */
export function MediaField({
  label,
  value,
  onChange,
  folder,
  hint,
}: {
  label: string;
  value: string | null;
  onChange: (value: string | null) => void;
  folder: string;
  hint?: string;
}) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleUpload(file: File | null) {
    if (!file) return;
    setBusy(true);
    setError(null);
    try {
      onChange(await uploadMedia(file, folder));
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Unggahan gagal.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex flex-col gap-2 rounded-md border border-emerald-100 bg-shell p-3">
      <span className="text-body-sm font-semibold text-emerald-900">{label}</span>
      {hint ? <span className="text-label text-charcoal-muted">{hint}</span> : null}
      <div className="flex items-center gap-3">
        {value ? (
          <img
            src={assetUrl(value) ?? value}
            alt=""
            className="h-16 w-16 rounded-md border border-emerald-100 object-cover"
          />
        ) : (
          <span className="flex h-16 w-16 items-center justify-center rounded-md border border-dashed border-emerald-300 text-label text-charcoal-muted">
            Kosong
          </span>
        )}
        <div className="flex flex-col gap-1">
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp,image/avif,application/pdf"
            onChange={(event) => void handleUpload(event.target.files?.[0] ?? null)}
            className="text-body-sm"
          />
          <span className="text-label text-charcoal-muted">
            {value ? value : "Belum ada berkas"}
          </span>
        </div>
      </div>
      <div className="flex gap-3">
        {busy ? <span className="text-label text-charcoal-muted">Mengunggah...</span> : null}
        {value ? (
          <button
            type="button"
            onClick={() => onChange(null)}
            className="text-label font-semibold text-emerald-800 underline underline-offset-4"
          >
            Kosongkan
          </button>
        ) : null}
      </div>
      {error ? <span className="text-label text-status-full">{error}</span> : null}
    </div>
  );
}

export function AdminPanel({
  title,
  description,
  children,
  actions,
}: {
  title: string;
  description?: string;
  children: ReactNode;
  actions?: ReactNode;
}) {
  return (
    <section className="rounded-lg border border-emerald-100 bg-cream p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-display-sm text-emerald-900">{title}</h2>
          {description ? (
            <p className="mt-1 max-w-prose text-body-sm text-charcoal-soft">{description}</p>
          ) : null}
        </div>
        {actions}
      </div>
      <div className="mt-5 flex flex-col gap-5">{children}</div>
    </section>
  );
}

export function AdminButton({
  children,
  onClick,
  variant = "primary",
  type = "button",
  disabled,
}: {
  children: ReactNode;
  onClick?: () => void;
  variant?: "primary" | "outline" | "danger";
  type?: "button" | "submit";
  disabled?: boolean;
}) {
  const styles = {
    primary: "bg-emerald-800 text-shell hover:bg-emerald-700",
    outline: "border border-emerald-800 text-emerald-800 hover:bg-emerald-50",
    danger: "border border-status-full text-status-full hover:bg-cream",
  }[variant];

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`inline-flex min-h-11 items-center justify-center rounded-md px-4 text-body-sm font-semibold disabled:opacity-60 ${styles}`}
    >
      {children}
    </button>
  );
}

/** Result of a save, shown next to the button that caused it. */
export function SaveState({ state, message }: { state: "idle" | "saving" | "saved" | "error"; message?: string | null }) {
  if (state === "idle") return null;
  const text = {
    saving: "Menyimpan...",
    saved: "Tersimpan.",
    error: message ?? "Gagal menyimpan.",
  }[state];
  return (
    <span
      role="status"
      className={`text-body-sm font-semibold ${
        state === "error" ? "text-status-full" : "text-emerald-800"
      }`}
    >
      {text}
    </span>
  );
}
