/**
 * The admin panel.
 *
 * It is a separate route that ordinary visitors never reach, and signing in is
 * not what grants access: the database checks the account against an admins
 * table, so a session alone does nothing. The public pages do not read this
 * state at all, which is why the site stays open to everyone without a login.
 */
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArticlesEditor,
  FaqsEditor,
  GalleryEditor,
  PackagesEditor,
  PromosEditor,
  ScheduleEditor,
  TeamEditor,
  TestimonialsEditor,
} from "../components/admin/collection-editors";
import {
  AboutEditor,
  HomepageEditor,
  NavigationEditor,
  ProfileEditor,
} from "../components/admin/settings-editors";
import { AdminButton, AdminPanel, SaveState, TextField } from "../components/admin/fields";
import { PageHeader } from "../components/layout/PageHeader";
import { backendConfig, backendConfigured } from "../config/backend";
import { useContentState } from "../content/ContentProvider";
import { currentAdmin, signIn, signOut } from "../lib/content-api";

const TABS = [
  { key: "ringkasan", label: "Ringkasan" },
  { key: "paket-umrah", label: "Paket Umrah" },
  { key: "paket-haji", label: "Paket Haji" },
  { key: "jadwal", label: "Jadwal" },
  { key: "panduan", label: "Panduan Jamaah" },
  { key: "promo", label: "Promo" },
  { key: "faq", label: "FAQ" },
  { key: "galeri", label: "Galeri" },
  { key: "pembimbing", label: "Pembimbing" },
  { key: "testimonial", label: "Testimonial" },
  { key: "beranda", label: "Beranda" },
  { key: "halaman", label: "Menu dan Halaman" },
  { key: "tentang", label: "Tentang Kami" },
  { key: "kontak", label: "Kontak dan Legalitas" },
] as const;

type TabKey = (typeof TABS)[number]["key"];

/**
 * Shown while the project has no backend yet. It states the exact steps rather
 * than a generic error, because the panel cannot work until the database and the
 * public keys exist.
 */
function SetupNotice() {
  return (
    <div id="admin-setup" className="flex flex-col gap-5">
      <AdminPanel
        title="Backend belum diatur"
        description="Panel admin memakai Supabase untuk menyimpan isi situs. Situs publik tetap berjalan seperti biasa memakai isi yang tertanam di kode, jadi tidak ada halaman yang rusak karena panel ini belum aktif."
      >
        <ol className="flex flex-col gap-4">
          <li className="flex gap-3">
            <span className="tabular font-display text-xl text-emerald-800">01</span>
            <div>
              <p className="text-body font-semibold text-emerald-900">
                Buat proyek Supabase, lalu jalankan skema
              </p>
              <p className="mt-1 max-w-prose text-body-sm text-charcoal-soft">
                Buka Supabase, buat proyek baru, lalu jalankan seluruh isi berkas{" "}
                <code className="rounded-sm bg-cream px-1">supabase/schema.sql</code> pada SQL
                Editor. Skema itu membuat tabel isi, bucket penyimpanan, dan aturan izin. Aman
                dijalankan lebih dari sekali.
              </p>
            </div>
          </li>
          <li className="flex gap-3">
            <span className="tabular font-display text-xl text-emerald-800">02</span>
            <div>
              <p className="text-body font-semibold text-emerald-900">
                Isi dua nilai publik dari Project Settings, API
              </p>
              <p className="mt-1 max-w-prose text-body-sm text-charcoal-soft">
                Tambahkan pada Settings, Environment:{" "}
                <code className="rounded-sm bg-cream px-1">VITE_SUPABASE_URL</code> dan{" "}
                <code className="rounded-sm bg-cream px-1">VITE_SUPABASE_ANON_KEY</code>. Keduanya
                nilai publik yang memang ikut masuk ke berkas JavaScript, dan yang membatasi akses
                adalah aturan izin di database. Kunci{" "}
                <code className="rounded-sm bg-cream px-1">service_role</code> tidak dipakai di
                proyek ini dan tidak boleh ditambahkan.
              </p>
            </div>
          </li>
          <li className="flex gap-3">
            <span className="tabular font-display text-xl text-emerald-800">03</span>
            <div>
              <p className="text-body font-semibold text-emerald-900">
                Buat akun admin, lalu daftarkan sebagai admin
              </p>
              <p className="mt-1 max-w-prose text-body-sm text-charcoal-soft">
                Buat pengguna pada Authentication, Users, Add user dengan email dan kata sandi.
                Setelah itu jalankan pernyataan{" "}
                <code className="rounded-sm bg-cream px-1">insert into public.admins</code> yang
                ada di bagian akhir berkas skema, dengan email admin tersebut. Tanpa langkah ini,
                akun yang bisa masuk tetap tidak punya akses tulis.
              </p>
            </div>
          </li>
        </ol>
        <p className="text-body-sm text-charcoal-soft">
          Setelah kedua nilai diisi, halaman ini berubah menjadi formulir masuk. Lihat{" "}
          <code className="rounded-sm bg-cream px-1">PANDUAN-ADMIN.md</code> untuk langkah yang
          lebih lengkap.
        </p>
        <p className="text-label text-charcoal-muted">
          Nilai yang terbaca sekarang: {backendConfig.url ? "URL terisi" : "URL kosong"} ·{" "}
          {backendConfig.anonKey ? "kunci publik terisi" : "kunci publik kosong"}
        </p>
      </AdminPanel>
    </div>
  );
}

function SignInForm({ onSuccess }: { onSuccess: (email: string) => void }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [state, setState] = useState<"idle" | "saving" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

  async function submit() {
    if (email.trim() === "" || password === "") {
      setState("error");
      setError("Email dan kata sandi wajib diisi.");
      return;
    }
    setState("saving");
    setError(null);
    try {
      await signIn(email.trim(), password);
      const name = await currentAdmin();
      if (!name) {
        // A valid account that is not in the admins table. Saying which of the
        // two failed is the difference between a five minute fix and a search.
        setState("error");
        setError(
          "Akun ini bisa masuk, tetapi belum terdaftar sebagai admin sehingga belum punya akses mengubah isi.",
        );
        return;
      }
      onSuccess(name);
    } catch (cause) {
      setState("error");
      setError(cause instanceof Error ? cause.message : "Tidak dapat masuk.");
    }
  }

  return (
    <div className="max-w-md">
      <AdminPanel
        title="Masuk sebagai admin"
        description="Gunakan email dan kata sandi akun admin yang sudah didaftarkan pada tabel admins."
      >
        <form
          className="flex flex-col gap-4"
          onSubmit={(event) => {
            event.preventDefault();
            void submit();
          }}
        >
          <TextField
            label="Email"
            type="email"
            value={email}
            onChange={setEmail}
            required
            placeholder="nama@contoh.com"
          />
          <TextField
            label="Kata sandi"
            type="password"
            value={password}
            onChange={setPassword}
            required
          />
          <div className="flex flex-wrap items-center gap-3">
            <AdminButton type="submit" disabled={state === "saving"}>
              {state === "saving" ? "Memeriksa..." : "Masuk"}
            </AdminButton>
            <SaveState state={state === "saving" ? "saving" : state === "error" ? "error" : "idle"} message={error} />
          </div>
        </form>
      </AdminPanel>
    </div>
  );
}

export function AdminPage() {
  const { status, error, bundle, rejected } = useContentState();
  const [session, setSession] = useState<{ email: string } | null | "checking">("checking");
  const [tab, setTab] = useState<TabKey>("ringkasan");

  useEffect(() => {
    if (!backendConfigured()) {
      setSession(null);
      return;
    }
    void currentAdmin().then((email) => setSession(email ? { email } : null));
  }, []);

  if (!backendConfigured()) {
    return (
      <>
        <PageHeader
          eyebrow="Panel Admin"
          title="Panel admin Rihlah"
          intro="Panel ini dipakai tim Rihlah untuk memperbarui paket, jadwal, panduan, promo, dan data resmi. Pengunjung situs tidak perlu masuk untuk melihat halaman mana pun."
        >
          <Link
            to="/"
            className="rounded-sm text-body-sm font-semibold text-shell underline underline-offset-4"
          >
            Kembali ke situs
          </Link>
        </PageHeader>
        <div className="section bg-shell">
          <div className="shell-container">
            <SetupNotice />
          </div>
        </div>
      </>
    );
  }

  if (session === "checking") {
    return (
      <>
        <PageHeader
          eyebrow="Panel Admin"
          title="Memeriksa sesi"
          intro="Sebentar, sedang memastikan apakah peramban ini sudah masuk sebagai admin."
        />
        <div className="section bg-shell">
          <div className="shell-container">
            <p role="status" className="text-body text-charcoal-soft">
              Memeriksa sesi...
            </p>
          </div>
        </div>
      </>
    );
  }

  if (!session) {
    return (
      <>
        <PageHeader
          eyebrow="Panel Admin"
          title="Masuk untuk mengubah isi situs"
          intro="Situs publik tetap terbuka tanpa login. Halaman ini hanya untuk tim yang memperbarui isi."
        >
          <Link
            to="/"
            className="rounded-sm text-body-sm font-semibold text-shell underline underline-offset-4"
          >
            Kembali ke situs
          </Link>
        </PageHeader>
        <div className="section bg-shell">
          <div className="shell-container">
            <SignInForm onSuccess={(email) => setSession({ email })} />
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <PageHeader
        eyebrow="Panel Admin"
        title="Kelola isi situs"
        intro="Perubahan disimpan ke database dan langsung dipakai situs setelah tersimpan."
      >
        <div className="flex flex-wrap items-center gap-4">
          <span className="text-body-sm text-emerald-100">Masuk sebagai {session.email}</span>
          <AdminButton
            variant="outline"
            onClick={() => {
              void signOut().then(() => setSession(null));
            }}
          >
            Keluar
          </AdminButton>
        </div>
      </PageHeader>

      <section className="section bg-shell">
        <div className="shell-container flex flex-col gap-6">
          <div className="flex flex-wrap gap-2" role="tablist" aria-label="Bagian panel admin">
            {TABS.map((entry) => (
              <button
                key={entry.key}
                type="button"
                role="tab"
                aria-selected={tab === entry.key}
                onClick={() => setTab(entry.key)}
                className={`inline-flex min-h-11 items-center rounded-md border px-3 text-body-sm font-semibold ${
                  tab === entry.key
                    ? "border-emerald-800 bg-emerald-800 text-shell"
                    : "border-emerald-200 text-emerald-800 hover:bg-emerald-50"
                }`}
              >
                {entry.label}
              </button>
            ))}
          </div>

          {tab === "ringkasan" ? (
            <AdminPanel
              title="Ringkasan"
              description="Keadaan isi situs saat ini: dari mana datanya dibaca dan apakah ada catatan yang bermasalah."
            >
              <ul className="flex flex-col gap-2 text-body-sm text-charcoal-soft">
                <li>
                  Sumber isi:{" "}
                  <strong className="text-emerald-900">
                    {status === "live"
                      ? "database"
                      : status === "loading"
                        ? "sedang memuat dari database"
                        : "isi bawaan di kode"}
                  </strong>
                  {status === "error" ? ` (pemuatan gagal: ${error})` : ""}
                </li>
                <li>Paket tersimpan: {bundle.packages.length}</li>
                <li>Artikel panduan: {bundle.articles.length}</li>
                <li>Pertanyaan FAQ: {bundle.faqs.length}</li>
                <li>Promo aktif: {bundle.promos.length}</li>
                <li>Slot galeri: {bundle.gallerySlots.length}</li>
                <li>Pembimbing: {bundle.teamMembers.length}</li>
                <li>Testimonial: {bundle.testimonials.length}</li>
              </ul>
              {rejected.length > 0 ? (
                <div className="rounded-md border border-status-full bg-cream p-3">
                  <p className="text-body-sm font-semibold text-status-full">
                    {rejected.length} catatan di database tidak dapat dibaca dan diabaikan:
                  </p>
                  <ul className="mt-1 text-label text-charcoal-soft">
                    {rejected.map((entry) => (
                      <li key={`${entry.collection}-${entry.slug}`}>
                        {entry.collection} / {entry.slug}: {entry.reason}
                      </li>
                    ))}
                  </ul>
                </div>
              ) : (
                <p className="text-body-sm text-charcoal-soft">
                  Tidak ada catatan bermasalah. Semua data yang dikirim database berhasil dibaca.
                </p>
              )}
              <p className="text-body-sm text-charcoal-soft">
                Situs publik tidak pernah meminta pengunjung masuk. Halaman ini satu-satunya bagian
                yang memerlukan akun.
              </p>
            </AdminPanel>
          ) : null}

          {tab === "paket-umrah" ? <PackagesEditor kind="umrah" /> : null}
          {tab === "paket-haji" ? <PackagesEditor kind="haji" /> : null}
          {tab === "jadwal" ? <ScheduleEditor /> : null}
          {tab === "panduan" ? <ArticlesEditor /> : null}
          {tab === "promo" ? <PromosEditor /> : null}
          {tab === "faq" ? <FaqsEditor /> : null}
          {tab === "galeri" ? <GalleryEditor /> : null}
          {tab === "pembimbing" ? <TeamEditor /> : null}
          {tab === "testimonial" ? <TestimonialsEditor /> : null}
          {tab === "beranda" ? <HomepageEditor /> : null}
          {tab === "halaman" ? <NavigationEditor /> : null}
          {tab === "tentang" ? <AboutEditor /> : null}
          {tab === "kontak" ? <ProfileEditor /> : null}
        </div>
      </section>
    </>
  );
}
