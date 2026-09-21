import { Link } from "react-router-dom";
import { contactHref, isPlaceholder, whatsappHref } from "../../config/site";
import { useContent } from "../../content/ContentProvider";
import { isNavHidden } from "../../content/bundle";
import type { NavKey } from "../../content/types";
import { useCopy, useLang } from "../../i18n/LanguageProvider";
import { chrome, type ChromeCopy } from "../../i18n/strings";
import { GeometricMotif } from "../ui/GeometricMotif";

// Each entry carries the page it stands for, so hiding a page removes it from
// the footer in the same move it is removed from the header.
type FooterLink = { label: keyof ChromeCopy["footer"]; to: string; navKey: NavKey | null };

const navigationLinks: FooterLink[] = [
  { label: "packages", to: "/paket-umrah", navKey: "paket-umrah" },
  { label: "schedule", to: "/jadwal", navKey: "jadwal" },
  { label: "about", to: "/tentang-kami", navKey: "tentang-kami" },
  { label: "guide", to: "/panduan", navKey: "panduan" },
  { label: "gallery", to: "/galeri", navKey: "galeri" },
  { label: "faq", to: "/faq", navKey: "faq" },
];

const legalLinks: FooterLink[] = [
  { label: "privacy", to: "/kebijakan-privasi", navKey: null },
  { label: "terms", to: "/syarat-ketentuan", navKey: null },
  { label: "cancellation", to: "/pembatalan-refund", navKey: null },
  { label: "licensing", to: "/legalitas", navKey: "legalitas" },
];

const inlineLink = "text-body-sm text-emerald-100 underline-offset-4 hover:text-shell hover:underline";

export function Footer() {
  const copy = useCopy(chrome);
  const { profile, navigation } = useContent();
  const tagline = useCopy(profile.tagline);

  const wa = whatsappHref(useLang(), undefined, profile);
  const mail = contactHref(profile.email, "mailto");
  const socialEntries = Object.entries(profile.social).filter(
    (entry): entry is [string, string] => typeof entry[1] === "string" && entry[1].length > 0,
  );
  const shown = (links: FooterLink[]) =>
    links.filter((item) => item.navKey === null || !isNavHidden(navigation, item.navKey));

  /** Config values that are still bracketed placeholders render as a labelled gap. */
  function ValueOrPending({ value }: { value: string }) {
    if (isPlaceholder(value)) {
      return <span className="text-emerald-300">{copy.state.pendingShort}</span>;
    }
    return <>{value}</>;
  }

  return (
    <footer className="on-dark bg-emerald-900 text-emerald-100">
      {/* Motif closes the page the way the hero opens it, and nowhere else. */}
      <GeometricMotif className="h-8 w-full text-emerald-700" scale={34} />

      <div className="shell-container py-12 sm:py-16">
        <div className="grid gap-10 lg:grid-cols-[1.25fr_1fr]">
          <div className="flex flex-col gap-4">
            <div>
              <p className="font-display text-3xl text-shell">{profile.brand}</p>
              <p className="mt-1 text-body text-emerald-100">{tagline}</p>
            </div>
            <dl className="mt-2 grid gap-3 text-body-sm sm:grid-cols-2">
              <div>
                <dt className="text-label font-semibold uppercase text-emerald-300">
                  {copy.footer.whatsappLabel}
                </dt>
                <dd className="mt-1">
                  {wa ? (
                    <a href={wa} target="_blank" rel="noreferrer" className={inlineLink}>
                      {profile.whatsappDisplay}
                    </a>
                  ) : (
                    <ValueOrPending value={profile.whatsappDisplay} />
                  )}
                </dd>
              </div>
              <div>
                <dt className="text-label font-semibold uppercase text-emerald-300">
                  {copy.footer.emailLabel}
                </dt>
                <dd className="mt-1">
                  {mail ? (
                    <a href={mail} className={inlineLink}>
                      {profile.email}
                    </a>
                  ) : (
                    <ValueOrPending value={profile.email} />
                  )}
                </dd>
              </div>
              <div className="sm:col-span-2">
                <dt className="text-label font-semibold uppercase text-emerald-300">
                  {copy.footer.addressLabel}
                </dt>
                <dd className="mt-1 text-emerald-100">
                  {profile.addressLines.map((line) => (
                    <span key={line} className="block">
                      <ValueOrPending value={line} />
                    </span>
                  ))}
                  <span className="mt-1 block text-emerald-300">
                    {copy.footer.hoursLabel}: <ValueOrPending value={profile.serviceHours} />
                  </span>
                </dd>
              </div>
            </dl>
            {/* No social accounts exist yet, so none are linked. Saying so is
                better than a row of dead icons. */}
            <p className="text-body-sm text-emerald-300">
              {socialEntries.length > 0 ? copy.footer.socialOfficial : copy.footer.socialNone}
            </p>
            {socialEntries.length > 0 ? (
              <ul className="flex flex-wrap gap-4">
                {socialEntries.map(([name, url]) => (
                  <li key={name}>
                    <a href={url} target="_blank" rel="noreferrer" className={inlineLink}>
                      {name}
                    </a>
                  </li>
                ))}
              </ul>
            ) : null}
          </div>

          <div className="grid gap-8 sm:grid-cols-2">
            <nav aria-label={copy.footer.footerNav}>
              <h2 className="text-label font-semibold uppercase text-emerald-300">
                {copy.footer.explore}
              </h2>
              <ul className="mt-3 flex flex-col gap-2">
                {shown(navigationLinks).map((item) => (
                  <li key={item.to}>
                    <Link to={item.to} className={inlineLink}>
                      {copy.footer[item.label]}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
            <nav aria-label={copy.footer.legalNav}>
              <h2 className="text-label font-semibold uppercase text-emerald-300">
                {copy.footer.legal}
              </h2>
              <ul className="mt-3 flex flex-col gap-2">
                {shown(legalLinks).map((item) => (
                  <li key={item.to}>
                    <Link to={item.to} className={inlineLink}>
                      {copy.footer[item.label]}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </div>

        <div className="mt-12 border-t border-emerald-700 pt-6">
          <p className="text-body-sm text-emerald-300">
            {copy.footer.businessNameLabel}:{" "}
            <ValueOrPending value={profile.legalEntity.businessName} />
            {isPlaceholder(profile.legalEntity.nib) ? (
              <span> · {copy.footer.nibMissing}</span>
            ) : (
              <span>
                {" "}
                · {copy.footer.nibPrefix} {profile.legalEntity.nib}
              </span>
            )}
          </p>
          <p className="mt-2 text-body-sm text-emerald-300">
            {copy.footer.legalNote}{" "}
            <Link to="/legalitas" className={inlineLink}>
              {copy.footer.licensing}
            </Link>
            {" · "}
            <Link to="/admin" className={inlineLink}>
              {copy.footer.admin}
            </Link>
          </p>
        </div>
      </div>
    </footer>
  );
}
