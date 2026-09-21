import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { isLang, languageMeta, type Lang, type Localized } from "./types";

const STORAGE_KEY = "rihlah.language";

interface LanguageValue {
  lang: Lang;
  setLang: (lang: Lang) => void;
}

const LanguageContext = createContext<LanguageValue | null>(null);

function readStoredLanguage(): Lang {
  // Storage throws in some privacy modes, and the render pass also runs in Node
  // during route verification, so both cases fall back to the home language.
  if (typeof window === "undefined") return "id";
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (isLang(stored)) return stored;
  } catch {
    // Ignore: the reader simply gets Indonesian until they choose otherwise.
  }
  return "id";
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(readStoredLanguage);

  const setLang = useCallback((next: Lang) => {
    setLangState(next);
    try {
      window.localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // Ignore: the choice still applies for this visit.
    }
  }, []);

  // Screen readers and search engines read the document language, and the
  // static index.html can only declare one of them.
  useEffect(() => {
    document.documentElement.lang = languageMeta[lang].htmlLang;
  }, [lang]);

  const value = useMemo<LanguageValue>(() => ({ lang, setLang }), [lang, setLang]);

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

function useLanguageValue(): LanguageValue {
  const value = useContext(LanguageContext);
  if (!value) {
    throw new Error("LanguageProvider is missing above this component");
  }
  return value;
}

export function useLang(): Lang {
  return useLanguageValue().lang;
}

export function useLanguage(): LanguageValue {
  return useLanguageValue();
}

/** Selects the branch of a colocated copy object for the active language. */
export function useCopy<T>(copy: Localized<T>): T {
  return copy[useLang()];
}

/**
 * Returns a reader for content values: `const L = usePick()` then `L(pkg.name)`.
 * Content passes through components as `Localized` values, so without this every
 * component would repeat `value[lang]` and the language lookup would be spread
 * across the whole tree instead of sitting in one hook.
 */
export function usePick(): <T>(value: Localized<T>) => T {
  const lang = useLang();
  return useCallback(<T,>(value: Localized<T>) => value[lang], [lang]);
}
