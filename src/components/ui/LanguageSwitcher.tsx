import { useCopy, useLanguage } from "../../i18n/LanguageProvider";
import { chrome } from "../../i18n/strings";
import { LANGS, languageMeta, type Lang } from "../../i18n/types";

/**
 * A two-option switch rather than a dropdown: there are only two languages, and
 * both options stay visible, so the control never hides which language is
 * currently active.
 */
interface LanguageSwitcherProps {
  className?: string;
  /** The header bar sits on emerald, the mobile panel sits on the shell. */
  onLight?: boolean;
}

export function LanguageSwitcher({ className = "", onLight = false }: LanguageSwitcherProps) {
  const { lang, setLang } = useLanguage();
  const copy = useCopy(chrome);

  const labelClass = onLight ? "text-charcoal-muted" : "text-emerald-300";
  const borderClass = onLight ? "border-emerald-400" : "border-emerald-300";
  const activeClass = onLight ? "bg-emerald-800 text-shell" : "bg-shell text-emerald-900";
  const idleClass = onLight
    ? "text-charcoal-soft hover:bg-cream hover:text-emerald-900"
    : "text-emerald-100 hover:bg-emerald-700 hover:text-shell";

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {/* The label is dropped on the narrowest screens so the switch always fits
          beside the menu button instead of being pushed out of the bar. */}
      <span className={`text-label font-semibold uppercase ${labelClass} hidden sm:inline`}>
        {copy.language.label}
      </span>
      <div
        role="group"
        aria-label={copy.language.groupLabel}
        className={`flex overflow-hidden rounded-md border ${borderClass}`}
      >
        {LANGS.map((option: Lang) => {
          const active = option === lang;
          return (
            <button
              key={option}
              type="button"
              onClick={() => setLang(option)}
              aria-pressed={active}
              lang={languageMeta[option].htmlLang}
              className={`inline-flex min-h-11 min-w-11 items-center justify-center px-3 text-body-sm font-semibold transition-colors duration-200 ease-calm ${
                active ? activeClass : idleClass
              }`}
            >
              <span aria-hidden="true">{languageMeta[option].short}</span>
              <span className="sr-only">
                {copy.language.switchPrefix} {languageMeta[option].name}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
