import { Link } from "react-router-dom";
import { contactHref, isPlaceholder, site, whatsappHref } from "../../config/site";
import { useCopy } from "../../i18n/LanguageProvider";
import { chrome, type ChromeCopy } from "../../i18n/strings";
import { GeometricMotif } from "../ui/GeometricMotif";

const navigationLinks: Array<{ label: keyof ChromeCopy["footer"]; to: string }> = [
  { label: "packages", to: "/paket-umrah" },
  { label: "schedule", to: "/jadwal" },
  { label: "about", to: "/tentang-kami" },
  { label: "guide", to: "/panduan" },
  { label: "gallery", to: "/galeri" },
  { label: "faq", to: "/faq" },
];

const legalLinks: Array<{ label: keyof ChromeCopy["footer"]; to: string }> = [
  { label: "privacy", to: "/kebijakan-privasi" },
  { label: "terms", to: "/syarat-ketentuan" },
  { label: "cancellation", to: "/pembatalan-refund" },
  { label: "licensing", to: "/legalitas" },
];

const inlineLink = "text-body-sm text-emerald-100 underline-offset-4 hover:text-shell hover:underline";

export function Footer() {
  const copy = useCopy(chrome);
  const tagline = useCopy(site.tagline);

  const wa = whatsappHref();
  const mail = contactHref(site.email, "mailto");
  const socialEntries = Object.entries(site.social).filter(
    (entry): entry is [string, string] => typeof entry[1] === "string" && entry[1].length > 0,
  );

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
              <p className="font-display text-3xl text-shell">{site.brand}</p>
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
                      {site.whatsappDisplay}
                    </a>
                  ) : (
                    <ValueOrPending value={site.whatsappDisplay} />
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
                      {site.email}
                    </a>
                  ) : (
                    <ValueOrPending value={site.email} />
                  )}
                </dd>
              </div>
              <div className="sm:col-span-2">
                <dt className="text-label font-semibold uppercase text-emerald-300">
                  {copy.footer.addressLabel}
                </dt>
                <dd className="mt-1 text-emerald-100">
                  {site.addressLines.map((line) => (
                    <span key={line} className="block">
                      <ValueOrPending value={line} />
                    </span>
                  ))}
                  <span className="mt-1 block text-emerald-300">
                    {copy.footer.hoursLabel}: <ValueOrPending value={site.serviceHours} />
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
                {navigationLinks.map((item) => (
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
                {legalLinks.map((item) => (
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
            {copy.footer.businessNameLabel}: <ValueOrPending value={site.legalEntity.businessName} />
            {isPlaceholder(site.legalEntity.nib) ? (
              <span> · {copy.footer.nibMissing}</span>
            ) : (
              <span>
                {" "}
                · {copy.footer.nibPrefix} {site.legalEntity.nib}
              </span>
            )}
          </p>
          <p className="mt-2 text-body-sm text-emerald-300">
            {copy.footer.legalNote}{" "}
            <Link to="/legalitas" className={inlineLink}>
              {copy.footer.licensing}
            </Link>
          </p>
        </div>
      </div>
    </footer>
  );
}
