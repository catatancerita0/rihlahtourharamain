import { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { useCopy } from "../../i18n/LanguageProvider";
import { chrome } from "../../i18n/strings";
import { WhatsAppButton } from "../WhatsAppButton";
import { Footer } from "./Footer";
import { Header } from "./Header";

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
  }, [pathname]);

  return null;
}

export function Layout() {
  const copy = useCopy(chrome);

  return (
    <div className="flex min-h-dvh flex-col">
      <ScrollToTop />
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-shell focus:px-4 focus:py-3 focus:text-body-sm focus:font-semibold focus:text-emerald-900"
      >
        {copy.skipToContent}
      </a>
      <Header />
      <main id="main" className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <WhatsAppButton />
    </div>
  );
}
