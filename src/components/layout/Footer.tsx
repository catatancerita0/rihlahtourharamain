import { Link } from "react-router-dom";
import { contactHref, isPlaceholder, site, whatsappHref } from "../../config/site";
import { GeometricMotif } from "../ui/GeometricMotif";

const navigationLinks = [
  { label: "Paket", to: "/paket-umrah" },
  { label: "Jadwal", to: "/jadwal" },
  { label: "Tentang Kami", to: "/tentang-kami" },
  { label: "Panduan", to: "/panduan" },
  { label: "Galeri", to: "/galeri" },
  { label: "FAQ", to: "/faq" },
];

const legalLinks = [
  { label: "Kebijakan Privasi", to: "/kebijakan-privasi" },
  { label: "Syarat & Ketentuan", to: "/syarat-ketentuan" },
  { label: "Pembatalan & Refund", to: "/pembatalan-refund" },
  { label: "Legalitas", to: "/legalitas" },
];

const inlineLink = "text-body-sm text-emerald-100 underline-offset-4 hover:text-shell hover:underline";

/** Config values that are still bracketed placeholders render as a labelled gap. */
function OrPending({ value, label }: { value: string; label: string }) {
  if (isPlaceholder(value)) {
    return (
      <span className="text-emerald-300">
        {label} belum diisi
      </span>
    );
  }
  return <>{value}</>;
}

export function Footer() {
  const wa = whatsappHref();
  const mail = contactHref(site.email, "mailto");
  const socialEntries = Object.entries(site.social).filter(
    (entry): entry is [string, string] => typeof entry[1] === "string" && entry[1].length > 0,
  );

  return (
    <footer className="on-dark bg-emerald-900 text-emerald-100">
      {/* Motif closes the page the way the hero opens it, and nowhere else. */}
      <GeometricMotif className="h-8 w-full text-emerald-700" scale={34} />

      <div className="shell-container py-12 sm:py-16">
        <div className="grid gap-10 lg:grid-cols-[1.25fr_1fr]">
          <div className="flex flex-col gap-4">
            <div>
              <p className="font-display text-3xl text-shell">{site.brand}</p>
              <p className="mt-1 text-body text-emerald-100">{site.tagline}</p>
            </div>
            <dl className="mt-2 grid gap-3 text-body-sm sm:grid-cols-2">
              <div>
                <dt className="text-label font-semibold uppercase text-emerald-300">WhatsApp</dt>
                <dd className="mt-1">
                  {wa ? (
                    <a href={wa} target="_blank" rel="noreferrer" className={inlineLink}>
                      {site.whatsappDisplay}
                    </a>
                  ) : (
                    <OrPending value={site.whatsappDisplay} label="Nomor WhatsApp" />
                  )}
                </dd>
              </div>
              <div>
                <dt className="text-label font-semibold uppercase text-emerald-300">Email</dt>
                <dd className="mt-1">
                  {mail ? (
                    <a href={mail} className={inlineLink}>
                      {site.email}
                    </a>
                  ) : (
                    <OrPending value={site.email} label="Email resmi" />
                  )}
                </dd>
              </div>
              <div className="sm:col-span-2">
                <dt className="text-label font-semibold uppercase text-emerald-300">Alamat</dt>
                <dd className="mt-1 text-emerald-100">
                  {site.addressLines.map((line) => (
                    <span key={line} className="block">
                      <OrPending value={line} label="Alamat kantor" />
                    </span>
                  ))}
                  <span className="mt-1 block text-emerald-300">
                    <OrPending value={site.serviceHours} label="Jam layanan" />
                  </span>
                </dd>
              </div>
            </dl>
            {/* No social accounts exist yet, so none are linked. Saying so is
                better than a row of dead icons. */}
            <p className="text-body-sm text-emerald-300">
              {socialEntries.length > 0
                ? "Akun resmi:"
                : "Akun media sosial resmi belum ditautkan ke situs ini."}
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
            <nav aria-label="Navigasi footer">
              <h2 className="text-label font-semibold uppercase text-emerald-300">Jelajahi</h2>
              <ul className="mt-3 flex flex-col gap-2">
                {navigationLinks.map((item) => (
                  <li key={item.to}>
                    <Link to={item.to} className={inlineLink}>
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
            <nav aria-label="Informasi legal">
              <h2 className="text-label font-semibold uppercase text-emerald-300">Legal</h2>
              <ul className="mt-3 flex flex-col gap-2">
                {legalLinks.map((item) => (
                  <li key={item.to}>
                    <Link to={item.to} className={inlineLink}>
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </div>

        <div className="mt-12 border-t border-emerald-700 pt-6">
          <p className="text-body-sm text-emerald-300">
            <OrPending value={site.legalEntity.businessName} label="Nama badan usaha" />
            {isPlaceholder(site.legalEntity.nib) ? (
              <span> · NIB belum diisi</span>
            ) : (
              <span> · NIB {site.legalEntity.nib}</span>
            )}
          </p>
          <p className="mt-2 text-body-sm text-emerald-300">
            Data legalitas lengkap ada di halaman{" "}
            <Link to="/legalitas" className={inlineLink}>
              legalitas
            </Link>
            .
          </p>
        </div>
      </div>
    </footer>
  );
}
