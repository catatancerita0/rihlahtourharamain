/**
 * Editors for the single-row settings groups.
 *
 * Settings are saved as a whole group rather than field by field, because the
 * values only make sense together: the contact block has to match the licensing
 * block, and the homepage layout only reads correctly against the packages it
 * points at.
 *
 * Every group starts from the value currently in use, so switching a section off
 * and back on restores what was there instead of an empty default.
 */
import { useState } from "react";
import { useContent, useContentState } from "../../content/ContentProvider";
import { NAV_KEYS, HOME_SECTIONS } from "../../content/types";
import type {
  AboutContent,
  HomeSectionId,
  NavKey,
  NavigationSettings,
  SiteProfile,
} from "../../content/types";
import type { HomepageSettings } from "../../content/types";
import { saveSettings } from "../../lib/content-api";
import {
  AdminButton,
  AdminPanel,
  CheckboxField,
  Field,
  LocalizedField,
  LocalizedListField,
  MediaField,
  SaveState,
  TextArea,
  TextField,
  emptyLocalized,
} from "./fields";

type SaveStateValue = "idle" | "saving" | "saved" | "error";

function useSettingsWriter<T>() {
  const { refresh } = useContentState();
  const [state, setState] = useState<SaveStateValue>("idle");
  const [error, setError] = useState<string | null>(null);

  async function write(key: "profile" | "homepage" | "about" | "navigation", value: T) {
    setState("saving");
    setError(null);
    try {
      await saveSettings(key, value);
      await refresh();
      setState("saved");
      return true;
    } catch (cause) {
      setState("error");
      setError(cause instanceof Error ? cause.message : "Penyimpanan gagal.");
      return false;
    }
  }

  return { state, error, write };
}

const sectionLabels: Record<HomeSectionId, string> = {
  finder: "Pencarian paket",
  umrah: "Penjelasan tiga program Umrah",
  schedule: "Jadwal keberangkatan",
  why: "Alasan memilih Rihlah",
  process: "Gambaran proses",
  haji: "Program Haji",
  packages: "Isi halaman paket",
  guides: "Panduan jamaah",
  faq: "Pertanyaan",
  consult: "Ajakan konsultasi",
};

export function HomepageEditor() {
  const { homepage, packages } = useContent();
  const [draft, setDraft] = useState<HomepageSettings>(homepage);
  const { state, error, write } = useSettingsWriter<HomepageSettings>();

  function toggleSection(section: HomeSectionId, visible: boolean) {
    setDraft((current) => ({
      ...current,
      hiddenSections: visible
        ? current.hiddenSections.filter((entry) => entry !== section)
        : [...current.hiddenSections, section],
    }));
  }

  function toggleFeatured(slug: string, pinned: boolean) {
    setDraft((current) => ({
      ...current,
      featuredPackageSlugs: pinned
        ? [...current.featuredPackageSlugs, slug]
        : current.featuredPackageSlugs.filter((entry) => entry !== slug),
    }));
  }

  return (
    <AdminPanel
      title="Beranda"
      description="Tentukan bagian mana yang tampil di beranda dan paket mana yang didahulukan pada pencarian."
      actions={<AdminButton onClick={() => void write("homepage", draft)}>Simpan</AdminButton>}
    >
      <div>
        <h3 className="text-body font-semibold text-emerald-900">Bagian beranda</h3>
        <p className="mt-1 text-label text-charcoal-muted">
          Bagian yang dimatikan tidak dihapus, hanya tidak dirender. Isinya masih bisa dibuka lagi
          kapan saja.
        </p>
        <div className="mt-3 grid gap-2 sm:grid-cols-2">
          {HOME_SECTIONS.map((section) => (
            <CheckboxField
              key={section}
              label={sectionLabels[section]}
              checked={!draft.hiddenSections.includes(section)}
              onChange={(checked) => toggleSection(section, checked)}
            />
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-body font-semibold text-emerald-900">Banner promo</h3>
        <div className="mt-2">
          <CheckboxField
            label="Izinkan banner promo di beranda"
            checked={draft.showPromoBanner}
            onChange={(checked) => setDraft({ ...draft, showPromoBanner: checked })}
            hint="Banner hanya muncul bila ada promo aktif yang ditandai tampil di banner."
          />
        </div>
      </div>

      <div>
        <h3 className="text-body font-semibold text-emerald-900">Paket unggulan</h3>
        <p className="mt-1 text-label text-charcoal-muted">
          Paket yang dicentang tampil lebih dahulu pada pencarian dan daftar paket.
        </p>
        <div className="mt-3 grid gap-2 sm:grid-cols-2">
          {packages.map((item) => (
            <CheckboxField
              key={item.slug}
              label={item.name.id}
              checked={draft.featuredPackageSlugs.includes(item.slug)}
              onChange={(checked) => toggleFeatured(item.slug, checked)}
            />
          ))}
        </div>
      </div>

      <SaveState state={state} message={error} />
    </AdminPanel>
  );
}

export function NavigationEditor() {
  const { navigation } = useContent();
  const [draft, setDraft] = useState<NavigationSettings>(navigation);
  const { state, error, write } = useSettingsWriter<NavigationSettings>();

  const labels: Record<NavKey, string> = {
    beranda: "Beranda",
    "paket-umrah": "Paket Umrah",
    "paket-haji": "Paket Haji",
    jadwal: "Jadwal",
    "tentang-kami": "Tentang Kami",
    pembimbing: "Pembimbing",
    panduan: "Panduan Jamaah",
    galeri: "Galeri",
    faq: "FAQ",
    legalitas: "Legalitas",
    kontak: "Kontak",
  };

  return (
    <AdminPanel
      title="Menu dan halaman"
      description="Halaman yang disembunyikan keluar dari menu utama dan menu footer. Alamatnya tetap bisa dibuka, sehingga tautan yang sudah terlanjur dibagikan ke jamaah tidak mati."
      actions={<AdminButton onClick={() => void write("navigation", draft)}>Simpan</AdminButton>}
    >
      <div className="grid gap-2 sm:grid-cols-2">
        {NAV_KEYS.map((key) => (
          <CheckboxField
            key={key}
            label={labels[key]}
            checked={!draft.hidden.includes(key)}
            onChange={(checked) =>
              setDraft({
                hidden: checked
                  ? draft.hidden.filter((entry) => entry !== key)
                  : [...draft.hidden, key],
              })
            }
          />
        ))}
      </div>
      {draft.hidden.length > 0 ? (
        <p className="text-body-sm text-charcoal-soft">
          {draft.hidden.length} halaman sedang disembunyikan dari menu.
        </p>
      ) : null}
      <SaveState state={state} message={error} />
    </AdminPanel>
  );
}

export function AboutEditor() {
  const { about } = useContent();
  const [draft, setDraft] = useState<AboutContent>(about);
  const { state, error, write } = useSettingsWriter<AboutContent>();

  return (
    <AdminPanel
      title="Tentang Kami"
      description="Isi halaman Tentang Kami, termasuk batas layanan yang ingin Anda nyatakan terbuka."
      actions={<AdminButton onClick={() => void write("about", draft)}>Simpan</AdminButton>}
    >
      <LocalizedField label="Paragraf pembuka" value={draft.intro} onChange={(v) => setDraft({ ...draft, intro: v ?? emptyLocalized() })} multiline rows={3} />
      <LocalizedField label="Paragraf cara kami bekerja" value={draft.howIntro} onChange={(v) => setDraft({ ...draft, howIntro: v ?? emptyLocalized() })} multiline rows={3} />
      <LocalizedField label="Paragraf tiga program" value={draft.programsBody} onChange={(v) => setDraft({ ...draft, programsBody: v ?? emptyLocalized() })} multiline rows={3} />
      <LocalizedField label="Paragraf konsultasi" value={draft.consultationBody} onChange={(v) => setDraft({ ...draft, consultationBody: v ?? emptyLocalized() })} multiline rows={3} />
      <LocalizedListField
        label="Batas layanan"
        value={draft.scopeLimits}
        onChange={(value) => setDraft({ ...draft, scopeLimits: value })}
        hint="Satu poin per baris. Ini yang tidak bisa Rihlah janjikan, dan menuliskannya membuat halaman terbaca jujur."
      />

      <div>
        <h3 className="text-body font-semibold text-emerald-900">Empat komitmen</h3>
        <p className="mt-1 text-label text-charcoal-muted">
          Daftar ini muncul di halaman Tentang Kami dan tidak bisa dikosongkan.
        </p>
        <div className="mt-3 flex flex-col gap-4">
          {draft.commitments.map((item, index) => (
            <div key={item.id} className="flex flex-col gap-3 rounded-md border border-emerald-100 p-3">
              <LocalizedField
                label={`Komitmen ${index + 1}`}
                value={item.title}
                onChange={(value) =>
                  setDraft({
                    ...draft,
                    commitments: draft.commitments.map((entry) =>
                      entry.id === item.id
                        ? { ...entry, title: value ?? emptyLocalized() }
                        : entry,
                    ),
                  })
                }
              />
              <LocalizedField
                label="Penjelasan"
                value={item.body}
                onChange={(value) =>
                  setDraft({
                    ...draft,
                    commitments: draft.commitments.map((entry) =>
                      entry.id === item.id ? { ...entry, body: value ?? emptyLocalized() } : entry,
                    ),
                  })
                }
                multiline
                rows={3}
              />
            </div>
          ))}
        </div>
      </div>

      <SaveState state={state} message={error} />
    </AdminPanel>
  );
}

export function ProfileEditor() {
  const { profile } = useContent();
  const [draft, setDraft] = useState<SiteProfile>(profile);
  const { state, error, write } = useSettingsWriter<SiteProfile>();

  function patch(partial: Partial<SiteProfile>) {
    setDraft((current) => ({ ...current, ...partial }));
  }

  return (
    <AdminPanel
      title="Kontak dan legalitas"
      description="Data ini dipakai oleh header, footer, halaman kontak, halaman legalitas, dan setiap tautan WhatsApp. Isi hanya dari dokumen resmi."
      actions={<AdminButton onClick={() => void write("profile", draft)}>Simpan</AdminButton>}
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <TextField label="Nama brand" value={draft.brand} onChange={(value) => patch({ brand: value })} />
        <TextField
          label="Nama pendek"
          value={draft.shortBrand}
          onChange={(value) => patch({ shortBrand: value })}
          hint="Dipakai pada logo di header."
        />
      </div>

      <LocalizedField label="Tagline" value={draft.tagline} onChange={(value) => patch({ tagline: value ?? emptyLocalized() })} />
      <LocalizedField
        label="Kalimat pembuka beranda"
        value={draft.operatingNote}
        onChange={(value) => patch({ operatingNote: value ?? emptyLocalized() })}
        multiline
        rows={3}
      />

      <div className="grid gap-4 sm:grid-cols-2">
        <TextField
          label="Nomor WhatsApp"
          value={draft.whatsappNumber}
          onChange={(value) => patch({ whatsappNumber: value })}
          hint="Digit internasional tanpa tanda plus, contoh 6281234567890. Selama berisi placeholder bertanda kurung, tautan WhatsApp tetap nonaktif."
        />
        <TextField
          label="Nomor WhatsApp untuk ditampilkan"
          value={draft.whatsappDisplay}
          onChange={(value) => patch({ whatsappDisplay: value })}
        />
        <TextField label="Email resmi" value={draft.email} onChange={(value) => patch({ email: value })} />
        <TextField label="Telepon kantor" value={draft.phone} onChange={(value) => patch({ phone: value })} />
      </div>

      <LocalizedField
        label="Pesan pembuka WhatsApp"
        value={draft.whatsappMessage}
        onChange={(value) => patch({ whatsappMessage: value ?? emptyLocalized() })}
        multiline
        rows={2}
      />

      <TextField label="Jam layanan" value={draft.serviceHours} onChange={(value) => patch({ serviceHours: value })} />
      <TextArea
        label="Alamat, satu baris per baris"
        rows={3}
        value={draft.addressLines.join("\n")}
        onChange={(value) =>
          patch({
            addressLines: value
              .split("\n")
              .map((line) => line.trim())
              .filter((line) => line !== ""),
          })
        }
      />

      <MediaField
        label="Foto utama beranda"
        folder="hero"
        value={draft.media.hero?.file ?? null}
        onChange={(value) =>
          patch({
            media: {
              hero: value
                ? { file: value, alt: draft.media.hero?.alt ?? emptyLocalized() }
                : null,
            },
          })
        }
        hint="Satu foto asli, rasio 4 banding 5."
      />
      {draft.media.hero ? (
        <LocalizedField
          label="Keterangan foto utama"
          value={draft.media.hero.alt}
          onChange={(value) =>
            patch({
              media: {
                hero: draft.media.hero
                  ? { file: draft.media.hero.file, alt: value ?? emptyLocalized() }
                  : null,
              },
            })
          }
          hint="Dipakai pembaca layar, jadi sebutkan apa yang terlihat pada foto."
        />
      ) : null}

      <div>
        <h3 className="text-body font-semibold text-emerald-900">Data badan usaha</h3>
        <div className="mt-3 grid gap-4 sm:grid-cols-2">
          <TextField
            label="Nama badan usaha"
            value={draft.legalEntity.businessName}
            onChange={(value) =>
              patch({ legalEntity: { ...draft.legalEntity, businessName: value } })
            }
          />
          <TextField
            label="NIB"
            value={draft.legalEntity.nib}
            onChange={(value) => patch({ legalEntity: { ...draft.legalEntity, nib: value } })}
          />
          <TextField
            label="Nomor izin PPIU"
            value={draft.legalEntity.ppiu}
            onChange={(value) => patch({ legalEntity: { ...draft.legalEntity, ppiu: value } })}
          />
          <TextField
            label="Nomor izin PIHK"
            value={draft.legalEntity.pihk}
            onChange={(value) => patch({ legalEntity: { ...draft.legalEntity, pihk: value } })}
          />
          <TextField
            label="Rekening resmi"
            value={draft.legalEntity.bankAccount}
            onChange={(value) => patch({ legalEntity: { ...draft.legalEntity, bankAccount: value } })}
          />
        </div>
      </div>

      <div>
        <h3 className="text-body font-semibold text-emerald-900">Salinan dokumen</h3>
        <p className="mt-1 text-label text-charcoal-muted">
          Unggah salinan izin agar jamaah bisa mencocokkan nomornya sendiri. Dokumen tanpa berkas
          tidak ditampilkan di situs.
        </p>
        <div className="mt-3 flex flex-col gap-3">
          {draft.legalEntity.documents.map((doc) => (
            <div key={doc.id} className="flex flex-col gap-3 rounded-md border border-emerald-100 p-3">
              <LocalizedField
                label="Nama dokumen"
                value={doc.label}
                onChange={(value) =>
                  patch({
                    legalEntity: {
                      ...draft.legalEntity,
                      documents: draft.legalEntity.documents.map((entry) =>
                        entry.id === doc.id ? { ...entry, label: value ?? emptyLocalized() } : entry,
                      ),
                    },
                  })
                }
              />
              <MediaField
                label="Berkas"
                folder="legalitas"
                value={doc.file}
                onChange={(value) =>
                  patch({
                    legalEntity: {
                      ...draft.legalEntity,
                      documents: draft.legalEntity.documents.map((entry) =>
                        entry.id === doc.id ? { ...entry, file: value } : entry,
                      ),
                    },
                  })
                }
              />
            </div>
          ))}
        </div>
        <div className="mt-3">
          <AdminButton
            variant="outline"
            onClick={() =>
              patch({
                legalEntity: {
                  ...draft.legalEntity,
                  documents: [
                    ...draft.legalEntity.documents,
                    { id: `doc-${Date.now().toString(36)}`, label: emptyLocalized(), file: null },
                  ],
                },
              })
            }
          >
            Tambah dokumen
          </AdminButton>
        </div>
      </div>

      <div>
        <h3 className="text-body font-semibold text-emerald-900">Media sosial</h3>
        <p className="mt-1 text-label text-charcoal-muted">
          Isi hanya akun yang benar-benar ada. Tautan kosong tidak dirender.
        </p>
        <div className="mt-3 grid gap-4 sm:grid-cols-3">
          {["instagram", "tiktok", "youtube"].map((network) => (
            <Field key={network} label={network}>
              <input
                type="url"
                value={draft.social[network] ?? ""}
                onChange={(event) =>
                  patch({ social: { ...draft.social, [network]: event.target.value || null } })
                }
                className="w-full rounded-md border border-emerald-200 bg-shell px-3 py-2 text-body-sm"
              />
            </Field>
          ))}
        </div>
      </div>

      <SaveState state={state} message={error} />
    </AdminPanel>
  );
}
