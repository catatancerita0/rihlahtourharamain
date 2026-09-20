import { useEffect, useId, useRef, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { site } from "../../config/site";
import { useCopy } from "../../i18n/LanguageProvider";
import { chrome, type ChromeCopy } from "../../i18n/strings";
import { ButtonLink } from "../ui/Button";
import { LanguageSwitcher } from "../ui/LanguageSwitcher";

/**
 * The full list needs the width of a wide desktop, so a laptop gets the four
 * entries that drive a decision and the menu button keeps the rest one tap
 * away. Home is left out of the trimmed set because the logo already links to it.
 */
const navItems: Array<{ label: keyof ChromeCopy["nav"]; to: string; onLaptop: boolean }> = [
  { label: "home", to: "/", onLaptop: false },
  { label: "umrah", to: "/paket-umrah", onLaptop: true },
  { label: "haji", to: "/paket-haji", onLaptop: true },
  { label: "schedule", to: "/jadwal", onLaptop: true },
  { label: "about", to: "/tentang-kami", onLaptop: false },
  { label: "guide", to: "/panduan", onLaptop: false },
  { label: "faq", to: "/faq", onLaptop: true },
];

const linkBase =
  "inline-flex min-h-11 items-center px-3 text-body-sm font-medium transition-colors duration-200 ease-calm";
const linkLight = "text-emerald-100 hover:text-shell";
const linkLightActive = "text-shell font-semibold";

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const toggleRef = useRef<HTMLButtonElement | null>(null);
  const panelId = useId();
  const { pathname } = useLocation();
  const copy = useCopy(chrome);

  // A route change while the menu is open would leave it covering the new page.
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!menuOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key !== "Escape") return;
      setMenuOpen(false);
      toggleRef.current?.focus();
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [menuOpen]);

  return (
    <header className="sticky top-0 z-40 bg-emerald-800 on-dark">
      <div className="shell-container">
        <div className="flex min-h-16 items-center justify-between gap-4 py-3 lg:min-h-20">
          <Link
            to="/"
            className="flex flex-col rounded-sm text-shell"
            aria-label={`${site.brand}, ${copy.nav.backHome}`}
          >
            <span className="font-display text-2xl leading-none tracking-tight lg:text-[1.75rem]">
              Rihlah
            </span>
            <span className="text-label font-semibold uppercase text-emerald-300">
              Tour Haramain
            </span>
          </Link>

          <nav aria-label={copy.nav.main} className="hidden lg:block">
            <ul className="flex items-center gap-1">
              {navItems.map((item) => (
                <li key={item.to} className={item.onLaptop ? undefined : "hidden xl:block"}>
                  <NavLink
                    to={item.to}
                    end={item.to === "/"}
                    className={({ isActive }) =>
                      `${linkBase} ${isActive ? linkLightActive : linkLight}`
                    }
                  >
                    {copy.nav[item.label]}
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex items-center gap-3">
            {/* Visible from the smallest screen that can fit it, rather than only
                beside the full navigation. Hidden below sm because the panel
                carries the same control there. */}
            <LanguageSwitcher className="hidden sm:flex" />

            <ButtonLink to="/konsultasi" variant="accent" className="hidden sm:inline-flex">
              {copy.cta.consult}
            </ButtonLink>

            {/* Labelled, not a bare icon, so the control explains itself. */}
            <button
              ref={toggleRef}
              type="button"
              onClick={() => setMenuOpen((open) => !open)}
              aria-expanded={menuOpen}
              aria-controls={panelId}
              className="inline-flex min-h-11 items-center gap-2 rounded-md border border-emerald-300 px-3 text-body-sm font-semibold text-shell hover:bg-emerald-700 xl:hidden"
            >
              <svg width="16" height="12" viewBox="0 0 16 12" aria-hidden="true" focusable="false">
                <path
                  d={menuOpen ? "M1 1 L15 11 M15 1 L1 11" : "M0 1h16M0 6h16M0 11h16"}
                  stroke="currentColor"
                  strokeWidth="1.7"
                  strokeLinecap="round"
                />
              </svg>
              {menuOpen ? copy.nav.close : copy.nav.menu}
            </button>
          </div>
        </div>
      </div>

      {menuOpen ? (
        <div
          id={panelId}
          className="absolute inset-x-0 top-full max-h-[75dvh] overflow-y-auto border-t border-emerald-700 bg-shell shadow-panel xl:hidden"
        >
          <nav aria-label={copy.nav.mainMobile} className="shell-container py-4">
            <ul className="flex flex-col divide-y divide-emerald-100">
              {navItems.map((item) => (
                <li key={item.to}>
                  <NavLink
                    to={item.to}
                    end={item.to === "/"}
                    className={({ isActive }) =>
                      `flex min-h-12 items-center text-body font-medium ${
                        isActive ? "text-emerald-800 font-semibold" : "text-charcoal-soft"
                      }`
                    }
                  >
                    {copy.nav[item.label]}
                  </NavLink>
                </li>
              ))}
            </ul>
            <ButtonLink to="/konsultasi" variant="primary" size="lg" className="mt-5 w-full">
              {copy.cta.consult}
            </ButtonLink>
            <div className="mt-5 border-t border-emerald-100 pt-5 sm:hidden">
              <LanguageSwitcher onLight />
            </div>
          </nav>
        </div>
      ) : null}
    </header>
  );
}
