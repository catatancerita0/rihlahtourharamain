import { Suspense, lazy } from "react";
import { Route, Routes } from "react-router-dom";
import { Layout } from "./components/layout/Layout";
import { AboutPage } from "./pages/AboutPage";
import { CancellationPage } from "./pages/CancellationPage";
import { ConsultationPage } from "./pages/ConsultationPage";
import { ContactPage } from "./pages/ContactPage";
import { FaqPage } from "./pages/FaqPage";
import { GalleryPage } from "./pages/GalleryPage";
import { GuideArticlePage } from "./pages/GuideArticlePage";
import { GuidePage } from "./pages/GuidePage";
import { HajiPage } from "./pages/HajiPage";
import { HomePage } from "./pages/HomePage";
import { LegalityPage } from "./pages/LegalityPage";
import { NotFoundPage } from "./pages/NotFoundPage";
import { PackageDetailPage } from "./pages/PackageDetailPage";
import { PackageListPage } from "./pages/PackageListPage";
import { PembimbingPage } from "./pages/PembimbingPage";
import { PrivacyPage } from "./pages/PrivacyPage";
import { SchedulePage } from "./pages/SchedulePage";
import { TermsPage } from "./pages/TermsPage";

/**
 * The panel is loaded only when someone opens /admin. It is a large amount of
 * form code that no visitor needs, so it should not sit in the bundle that
 * every page downloads.
 */
const AdminPage = lazy(() =>
  import("./pages/AdminPage").then((module) => ({ default: module.AdminPage })),
);

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/paket-umrah" element={<PackageListPage category="umrah" />} />
        <Route path="/paket-umrah/:slug" element={<PackageDetailPage category="umrah" />} />
        <Route path="/paket-haji" element={<HajiPage />} />
        {/* Package cards build detail links from the category, so the Haji
            detail route has to exist before a Haji package is published. */}
        <Route path="/paket-haji/:slug" element={<PackageDetailPage category="haji" />} />
        <Route path="/jadwal" element={<SchedulePage />} />
        <Route path="/tentang-kami" element={<AboutPage />} />
        <Route path="/pembimbing" element={<PembimbingPage />} />
        <Route path="/panduan" element={<GuidePage />} />
        <Route path="/panduan/:slug" element={<GuideArticlePage />} />
        <Route path="/galeri" element={<GalleryPage />} />
        <Route path="/faq" element={<FaqPage />} />
        <Route path="/legalitas" element={<LegalityPage />} />
        <Route path="/konsultasi" element={<ConsultationPage />} />
        <Route path="/kontak" element={<ContactPage />} />
        <Route path="/kebijakan-privasi" element={<PrivacyPage />} />
        <Route path="/syarat-ketentuan" element={<TermsPage />} />
        <Route path="/pembatalan-refund" element={<CancellationPage />} />
        {/* Admin lives inside the layout so the panel keeps the same header,
            footer and language switch as the rest of the site. Access is
            decided by the database, not by this route being unlisted. */}
        <Route
          path="/admin"
          element={
            <Suspense
              fallback={
                <div className="section bg-shell">
                  <div className="shell-container">
                    <p role="status" className="text-body text-charcoal-soft">
                      Memuat panel admin...
                    </p>
                  </div>
                </div>
              }
            >
              <AdminPage />
            </Suspense>
          }
        />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}
