import { useEffect, useId, useRef, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { site } from "../../config/site";
import { ButtonLink } from "../ui/Button";

const navItems = [
  { label: "Beranda", to: "/" },
  { label: "Paket Umrah", to: "/paket-umrah" },
  { label: "Paket Haji", to: "/paket-haji" },
  { label: "Jadwal", to: "/jadwal" },
  { label: "Tentang Kami", to: "/tentang-kami" },
  { label: "Panduan Jamaah", to: "/panduan" },
  { label: "FAQ", to: "/faq" },
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
            aria-label={`${site.brand}, kembali ke beranda`}
          >
            <span className="font-display text-2xl leading-none tracking-tight lg:text-[1.75rem]">
              Rihlah
            </span>
            <span className="text-label font-semibold uppercase text-emerald-300">
              Tour Haramain
            </span>
          </Link>

          <nav aria-label="Navigasi utama" className="hidden xl:block">
            <ul className="flex items-center gap-1">
              {navItems.map((item) => (
                <li key={item.to}>
                  <NavLink
                    to={item.to}
                    end={item.to === "/"}
                    className={({ isActive }) =>
                      `${linkBase} ${isActive ? linkLightActive : linkLight}`
                    }
                  >
                    {item.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex items-center gap-3">
            <ButtonLink to="/konsultasi" variant="accent" className="hidden sm:inline-flex">
              Konsultasi Umrah
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
              {menuOpen ? "Tutup" : "Menu"}
            </button>
          </div>
        </div>
      </div>

      {menuOpen ? (
        <div
          id={panelId}
          className="absolute inset-x-0 top-full max-h-[75dvh] overflow-y-auto border-t border-emerald-700 bg-shell shadow-panel xl:hidden"
        >
          <nav aria-label="Navigasi utama versi seluler" className="shell-container py-4">
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
                    {item.label}
                  </NavLink>
                </li>
              ))}
            </ul>
            <ButtonLink to="/konsultasi" variant="primary" size="lg" className="mt-5 w-full">
              Konsultasi Umrah
            </ButtonLink>
          </nav>
        </div>
      ) : null}
    </header>
  );
}
