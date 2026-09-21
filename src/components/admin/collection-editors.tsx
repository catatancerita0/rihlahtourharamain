/**
 * Editors for the record collections.
 *
 * Every editor works from a full record loaded out of the bundle, not from an
 * empty form. Two consequences follow, and both are deliberate: a field the form
 * does not expose (an itinerary, a hotel's facilities) survives a save instead
 * of being wiped, and a record the admin has never touched still opens with its
 * current values so it can be corrected rather than retyped.
 *
 * The panel itself is written in Indonesian. It is an internal tool for the
 * team, and translating a form into two languages would double the surface
 * without helping the person using it. What is bilingual is the content, and
 * every content field is edited in both languages side by side.
 */
import { useState } from "react";
import { useAdminCollection } from "../../hooks/useAdminCollection";
import type { ContentCollection } from "../../content/types";
import type {
  Article,
  Availability,
  FaqItem,
  GallerySlot,
  HotelInfo,
  PackageCategory,
  ProgramType,
  Promo,
  TeamMember,
  Testimonial,
  TravelPackage,
} from "../../content/types";
import { both } from "../../i18n/types";
import { blocksToText, textToBlocks } from "../../lib/article-text";
import type { AdminRecord } from "../../lib/admin-collections";
import { useContent } from "../../content/ContentProvider";

const availabilityValues: Availability[] = ["available", "limited", "full", "unknown"];
const availabilityLabels: Record<Availability, string> = {
  available: "Tersedia",
  limited: "Seat terbatas",
  full: "Penuh",
  unknown: "Belum dibuka",
};
import {
  AdminButton,
  AdminPanel,
  CheckboxField,
  Field,
  LocalizedField,
  LocalizedListField,
  MediaField,
  SaveState,
  SelectField,
  TextArea,
  TextField,
  emptyLocalized,
  emptyLocalizedList,
} from "./fields";

const keyFieldOf = (collection: ContentCollection): "slug" | "id" =>
  collection === "packages" || collection === "articles" ? "slug" : "id";

/**
 * Reads the identifying field off a record. The cast is needed because the
 * editors are generic over shapes that do not declare an index signature, and
 * the field name is decided by the collection rather than by the type.
 */
function keyOfRecord<T extends object>(doc: T, field: "slug" | "id"): string {
  const value = (doc as Record<string, unknown>)[field];
  return typeof value === "string" ? value : "";
}

function badges(record: AdminRecord<unknown>) {
  const items: Array<{ label: string; tone: "hidden" | "new" | "saved" }> = [];
  if (record.hidden) items.push({ label: "Tersembunyi", tone: "hidden" });
  if (!record.fromSeed) items.push({ label: "Baru", tone: "new" });
  else if (record.saved) items.push({ label: "Sudah diubah", tone: "saved" });
  return items;
}

const toneClass = {
  hidden: "border-status-full text-status-full",
  new: "border-emerald-600 text-emerald-800",
  saved: "border-emerald-300 text-charcoal-muted",
};

/**
 * One list, one open form at a time. Records are identified by slug or id,
 * because that is what a link from the public site points at and what the
 * backend uses as its primary key.
 */
export function CollectionEditor<T extends object>({
  collection,
  title,
  description,
  emptyNote,
  titleOf,
  summaryOf,
  newRecord,
  renderForm,
  addLabel,
  canAdd = true,
}: {
  collection: ContentCollection;
  title: string;
  description?: string;
  emptyNote?: string;
  titleOf: (record: T) => string;
  summaryOf?: (record: T) => string;
  newRecord?: () => T;
  renderForm: (draft: T, patch: (partial: Partial<T>) => void) => React.ReactNode;
  addLabel?: string;
  canAdd?: boolean;
}) {
  const ops = useAdminCollection<T>(collection);
  const keyField = keyFieldOf(collection);
  const [openKey, setOpenKey] = useState<string | null>(null);
  const [draft, setDraft] = useState<T | null>(null);
  const [isNew, setIsNew] = useState(false);

  function openRecord(record: AdminRecord<T>) {
    setOpenKey(record.key);
    setIsNew(false);
    // A copy, so cancelling leaves the bundle untouched.
    setDraft(JSON.parse(JSON.stringify(record.doc)) as T);
  }

  function startNew() {
    if (!newRecord) return;
    setOpenKey("");
    setIsNew(true);
    setDraft(newRecord());
  }

  function patch(partial: Partial<T>) {
    setDraft((current) => (current ? { ...current, ...partial } : current));
  }

  async function save() {
    if (!draft) return;
    const key = keyOfRecord(draft, keyField).trim();
    if (key === "") return;
    const index = ops.records.findIndex((record) => record.key === key);
    const position = isNew || index < 0 ? ops.records.length : ops.records[index].position;
    const ok = await ops.save(key, draft, position);
    if (ok) setOpenKey(null);
  }

  return (
    <AdminPanel
      title={title}
      description={description}
      actions={
        canAdd && newRecord ? (
          <AdminButton variant="outline" onClick={startNew}>
            {addLabel ?? "Tambah"}
          </AdminButton>
        ) : undefined
      }
    >
      {ops.error ? (
        <p role="alert" className="rounded-md border border-status-full bg-cream p-3 text-body-sm text-status-full">
          Daftar tidak dapat dimuat: {ops.error}
        </p>
      ) : null}

      {ops.loading ? <p className="text-body-sm text-charcoal-soft">Memuat daftar isi...</p> : null}

      {!ops.loading && ops.records.length === 0 ? (
        <p className="text-body-sm text-charcoal-soft">
          {emptyNote ?? "Belum ada catatan pada bagian ini."}
        </p>
      ) : null}

      {ops.unreadable.length > 0 ? (
        <div className="rounded-md border border-status-full bg-cream p-3">
          <p className="text-body-sm font-semibold text-status-full">
            {ops.unreadable.length} catatan di backend tidak dapat dibaca dan tidak ditampilkan di
            situs.
          </p>
          <ul className="mt-1 text-label text-charcoal-soft">
            {ops.unreadable.map((row) => (
              <li key={row.slug}>
                {row.collection} / {row.slug}
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      <ul className="flex flex-col divide-y divide-emerald-100">
        {ops.records.map((record) => {
          const isOpen = openKey === record.key;
          return (
            <li key={record.key} className="py-3">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="flex flex-col gap-1">
                  <span
                    className={`text-body font-semibold ${
                      record.hidden ? "text-charcoal-muted line-through" : "text-emerald-900"
                    }`}
                  >
                    {titleOf(record.doc)}
                  </span>
                  <span className="flex flex-wrap items-center gap-2">
                    <span className="text-label text-charcoal-muted">{record.key}</span>
                    {badges(record).map((badge) => (
                      <span
                        key={badge.label}
                        className={`rounded-sm border px-2 py-0.5 text-label font-semibold uppercase ${toneClass[badge.tone]}`}
                      >
                        {badge.label}
                      </span>
                    ))}
                  </span>
                  {summaryOf ? (
                    <span className="text-label text-charcoal-muted">{summaryOf(record.doc)}</span>
                  ) : null}
                </div>

                <div className="flex flex-wrap gap-2">
                  <AdminButton variant="outline" onClick={() => openRecord(record)}>
                    {isOpen ? "Sedang dibuka" : "Ubah"}
                  </AdminButton>
                  <AdminButton
                    variant="outline"
                    onClick={() => void ops.move(record.key, -1)}
                  >
                    Naik
                  </AdminButton>
                  <AdminButton variant="outline" onClick={() => void ops.move(record.key, 1)}>
                    Turun
                  </AdminButton>
                  <AdminButton
                    variant="outline"
                    onClick={() => void ops.setHidden(record.key, !record.hidden)}
                  >
                    {record.hidden ? "Tampilkan" : "Sembunyikan"}
                  </AdminButton>
                  {!record.fromSeed ? (
                    <AdminButton
                      variant="danger"
                      onClick={() => void ops.remove(record.key)}
                    >
                      Hapus
                    </AdminButton>
                  ) : null}
                </div>
              </div>

              {isOpen && draft ? (
                <div className="mt-4 flex flex-col gap-4 rounded-lg border border-emerald-200 bg-shell p-4">
                  <Field label={keyField === "slug" ? "Slug" : "ID"} required>
                    <input
                      type="text"
                      value={keyOfRecord(draft, keyField)}
                      disabled={!isNew}
                      onChange={(event) => patch({ [keyField]: event.target.value } as Partial<T>)}
                      className="w-full rounded-md border border-emerald-200 bg-cream px-3 py-2 text-body-sm disabled:text-charcoal-muted"
                    />
                  </Field>
                  <p className="text-label text-charcoal-muted">
                    {keyField === "slug"
                      ? "Slug menjadi alamat halaman dan tidak diubah setelah catatan dibuat."
                      : "ID dipakai backend sebagai kunci dan tidak diubah setelah catatan dibuat."}
                  </p>

                  {renderForm(draft, patch)}

                  <div className="flex flex-wrap items-center gap-3 border-t border-emerald-100 pt-4">
                    <AdminButton onClick={() => void save()}>Simpan</AdminButton>
                    <AdminButton
                      variant="outline"
                      onClick={() => {
                        setOpenKey(null);
                        setDraft(null);
                      }}
                    >
                      Batal
                    </AdminButton>
                    <SaveState state={ops.saveState} message={ops.saveError} />
                  </div>
                </div>
              ) : null}
            </li>
          );
        })}
      </ul>
    </AdminPanel>
  );
}

// --- packages ----------------------------------------------------------------

function HotelFields({
  label,
  hotel,
  onChange,
}: {
  label: string;
  hotel: HotelInfo | null;
  onChange: (hotel: HotelInfo | null) => void;
}) {
  if (!hotel) {
    return (
      <div className="rounded-md border border-dashed border-emerald-300 p-3">
        <p className="text-body-sm font-semibold text-emerald-900">{label}</p>
        <p className="mt-1 text-label text-charcoal-muted">
          Belum ditetapkan. Halaman paket menampilkan status belum ditetapkan, bukan nama hotel
          perkiraan.
        </p>
        <div className="mt-2">
          <AdminButton
            variant="outline"
            onClick={() =>
              onChange({
                name: emptyLocalized(),
                city: { id: "Makkah", en: "Makkah" },
                category: null,
                distance: null,
                roomType: null,
                facilities: emptyLocalizedList(),
                photo: null,
              })
            }
          >
            Tambahkan {label.toLowerCase()}
          </AdminButton>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3 rounded-md border border-emerald-100 p-3">
      <div className="flex items-center justify-between gap-3">
        <p className="text-body-sm font-semibold text-emerald-900">{label}</p>
        <AdminButton variant="danger" onClick={() => onChange(null)}>
          Kosongkan
        </AdminButton>
      </div>
      <LocalizedField
        label="Nama hotel"
        value={hotel.name}
        onChange={(value) => onChange({ ...hotel, name: value ?? emptyLocalized() })}
      />
      <LocalizedField
        label="Kota"
        value={hotel.city}
        onChange={(value) => onChange({ ...hotel, city: value ?? { id: "Makkah", en: "Makkah" } })}
      />
      <LocalizedField
        label="Kategori"
        value={hotel.category}
        onChange={(value) => onChange({ ...hotel, category: value })}
        hint="Kosongkan bila kategorinya belum ditetapkan."
      />
      <LocalizedField
        label="Jarak ke area ibadah"
        value={hotel.distance}
        onChange={(value) => onChange({ ...hotel, distance: value })}
        hint="Jangan mengisi perkiraan. Kosongkan sampai jaraknya benar-benar diketahui."
      />
      <LocalizedField
        label="Tipe kamar"
        value={hotel.roomType}
        onChange={(value) => onChange({ ...hotel, roomType: value })}
      />
      <LocalizedListField
        label="Fasilitas hotel"
        value={hotel.facilities}
        onChange={(value) => onChange({ ...hotel, facilities: value })}
      />
      <MediaField
        label="Foto kamar"
        folder="hotel"
        value={hotel.photo}
        onChange={(value) => onChange({ ...hotel, photo: value })}
      />
    </div>
  );
}

function PackageForm({
  draft,
  patch,
}: {
  draft: TravelPackage;
  patch: (partial: Partial<TravelPackage>) => void;
}) {
  return (
    <>
      <LocalizedField label="Nama paket" value={draft.name} onChange={(v) => patch({ name: v ?? emptyLocalized() })} />
      <div className="grid gap-4 sm:grid-cols-2">
        <SelectField<PackageCategory>
          label="Jenis"
          value={draft.category}
          onChange={(value) => patch({ category: value })}
          options={[
            { value: "umrah", label: "Umrah" },
            { value: "haji", label: "Haji" },
          ]}
        />
        <SelectField<ProgramType>
          label="Program"
          value={draft.type}
          onChange={(value) => patch({ type: value })}
          options={[
            { value: "reguler", label: "Reguler" },
            { value: "plus", label: "Plus" },
            { value: "private", label: "Private" },
          ]}
        />
      </div>
      <LocalizedField label="Kalimat singkat" value={draft.focus} onChange={(v) => patch({ focus: v ?? emptyLocalized() })} multiline rows={2} />
      <LocalizedField label="Penjelasan panjang" value={draft.summary} onChange={(v) => patch({ summary: v ?? emptyLocalized() })} multiline rows={4} />

      <div className="grid gap-4 sm:grid-cols-3">
        <TextField
          label="Tanggal keberangkatan"
          type="date"
          value={draft.departureDate ?? ""}
          onChange={(value) => patch({ departureDate: value || null })}
        />
        <TextField
          label="Bulan keberangkatan"
          type="month"
          value={draft.departureMonth ?? ""}
          onChange={(value) => patch({ departureMonth: value || null })}
          hint="Dipakai bila tanggal pastinya belum ditetapkan."
        />
        <TextField
          label="Harga per jamaah"
          type="number"
          value={draft.price === null ? "" : String(draft.price)}
          onChange={(value) => patch({ price: value === "" ? null : Number(value) })}
          hint="Rupiah, tanpa titik."
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <SelectField<Availability>
          label="Status kursi"
          value={draft.availability}
          onChange={(value) => patch({ availability: value })}
          options={availabilityValues.map((value) => ({
            value,
            label: availabilityLabels[value],
          }))}
        />
        <TextField
          label="Catatan harga"
          value={draft.priceNote?.id ?? ""}
          onChange={(value) =>
            patch(
              value === "" && !draft.priceNote?.en
                ? { priceNote: null }
                : { priceNote: { id: value, en: draft.priceNote?.en ?? "" } },
            )
          }
          hint="Teks Indonesia. Versi Inggris ada di bagian dua bahasa di bawah."
        />
      </div>

      <LocalizedField label="Catatan harga (dua bahasa)" value={draft.priceNote} onChange={(v) => patch({ priceNote: v })} />
      <LocalizedField label="Durasi" value={draft.duration} onChange={(v) => patch({ duration: v })} hint="Kosongkan bila belum ditetapkan." />
      <LocalizedField label="Maskapai" value={draft.airline} onChange={(v) => patch({ airline: v })} hint="Kosongkan bila belum ditetapkan." />

      <MediaField
        label="Foto utama paket"
        folder="paket"
        value={draft.thumbnail}
        onChange={(value) => patch({ thumbnail: value })}
      />

      <LocalizedListField label="Cocok untuk" value={draft.audiences} onChange={(v) => patch({ audiences: v })} />
      <LocalizedListField label="Yang membedakan" value={draft.differentiators} onChange={(v) => patch({ differentiators: v })} />
      <LocalizedListField label="Fasilitas termasuk" value={draft.included} onChange={(v) => patch({ included: v })} />
      <LocalizedListField label="Fasilitas tidak termasuk" value={draft.excluded} onChange={(v) => patch({ excluded: v })} />
      <LocalizedListField label="Dokumen yang perlu disiapkan" value={draft.documents} onChange={(v) => patch({ documents: v })} />
      <LocalizedListField label="Syarat dan ketentuan" value={draft.terms} onChange={(v) => patch({ terms: v })} />

      <HotelFields label="Hotel Makkah" hotel={draft.makkahHotel} onChange={(value) => patch({ makkahHotel: value })} />
      <HotelFields label="Hotel Madinah" hotel={draft.madinahHotel} onChange={(value) => patch({ madinahHotel: value })} />

      <div className="rounded-md border border-dashed border-emerald-300 p-3">
        <p className="text-body-sm font-semibold text-emerald-900">Itinerary dan galeri</p>
        <p className="mt-1 text-label text-charcoal-muted">
          Itinerary harian dan foto tambahan pada paket ini dipertahankan apa adanya saat
          disimpan, sebanyak {draft.itinerary.length} hari dan {draft.gallery.length} foto. Kedua
          bagian itu belum punya editor di panel ini, jadi isinya masih diatur dari kode.
        </p>
      </div>

    </>
  );
}

export function PackagesEditor({ kind }: { kind: PackageCategory }) {
  const label = kind === "umrah" ? "Paket Umrah" : "Paket Haji";
  return (
    <CollectionEditor<TravelPackage>
      collection="packages"
      title={label}
      description="Isi program, harga, tanggal, hotel, dan status kursi. Semua perubahan langsung tampil di situs setelah disimpan."
      titleOf={(item) => item.name.id || item.slug}
      summaryOf={(item) =>
        [
          item.departureDate ?? item.departureMonth ?? "tanggal belum ditetapkan",
          item.price === null ? "harga belum dipublikasikan" : `Rp ${item.price.toLocaleString("id-ID")}`,
          `status: ${item.availability}`,
        ].join(" · ")
      }
      newRecord={() => ({
        id: `pkg-${kind}-${Date.now().toString(36)}`,
        slug: "",
        name: emptyLocalized(),
        category: kind,
        type: "reguler",
        focus: emptyLocalized(),
        summary: emptyLocalized(),
        audiences: emptyLocalizedList(),
        differentiators: emptyLocalizedList(),
        duration: null,
        departureDate: null,
        departureMonth: null,
        airline: null,
        makkahHotel: null,
        madinahHotel: null,
        price: null,
        priceNote: null,
        availability: "unknown",
        thumbnail: null,
        gallery: [],
        itinerary: [],
        included: emptyLocalizedList(),
        excluded: emptyLocalizedList(),
        documents: emptyLocalizedList(),
        terms: emptyLocalizedList(),
      })}
      addLabel={`Tambah ${label.toLowerCase()}`}
      renderForm={(draft, patch) => <PackageForm draft={draft} patch={patch} />}
    />
  );
}

export function ScheduleEditor() {
  const ops = useAdminCollection<TravelPackage>("packages");
  const [openKey, setOpenKey] = useState<string | null>(null);
  const [draft, setDraft] = useState<TravelPackage | null>(null);

  function open(record: AdminRecord<TravelPackage>) {
    setOpenKey(record.key);
    setDraft(JSON.parse(JSON.stringify(record.doc)) as TravelPackage);
  }

  return (
    <AdminPanel
      title="Jadwal Keberangkatan"
      description="Jadwal diambil dari data paket, jadi satu keberangkatan diisi satu kali. Yang kosong ditandai belum ditetapkan di halaman jadwal."
    >
      <ul className="flex flex-col divide-y divide-emerald-100">
        {ops.records
          .filter((record) => record.doc.category === "umrah" || record.doc.category === "haji")
          .map((record) => {
            const item = record.doc;
            const open_ = openKey === record.key;
            return (
              <li key={record.key} className="py-3">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex flex-col">
                    <span className="text-body font-semibold text-emerald-900">{item.name.id}</span>
                    <span className="text-label text-charcoal-muted">
                      {item.departureDate ?? item.departureMonth ?? "tanggal belum ditetapkan"} ·{" "}
                      {item.price === null ? "harga belum dipublikasikan" : `Rp ${item.price.toLocaleString("id-ID")}`} ·{" "}
                      {item.availability}
                    </span>
                  </div>
                  <AdminButton variant="outline" onClick={() => open(record)}>
                    {open_ ? "Sedang dibuka" : "Ubah jadwal"}
                  </AdminButton>
                </div>

                {open_ && draft ? (
                  <div className="mt-4 flex flex-col gap-4 rounded-lg border border-emerald-200 bg-shell p-4">
                    <div className="grid gap-4 sm:grid-cols-3">
                      <TextField
                        label="Tanggal keberangkatan"
                        type="date"
                        value={draft.departureDate ?? ""}
                        onChange={(value) => setDraft({ ...draft, departureDate: value || null })}
                      />
                      <TextField
                        label="Bulan keberangkatan"
                        type="month"
                        value={draft.departureMonth ?? ""}
                        onChange={(value) => setDraft({ ...draft, departureMonth: value || null })}
                      />
                      <TextField
                        label="Harga per jamaah"
                        type="number"
                        value={draft.price === null ? "" : String(draft.price)}
                        onChange={(value) =>
                          setDraft({ ...draft, price: value === "" ? null : Number(value) })
                        }
                      />
                    </div>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <SelectField<Availability>
                        label="Status kursi"
                        value={draft.availability}
                        onChange={(value) => setDraft({ ...draft, availability: value })}
                        options={availabilityValues.map((value) => ({
                          value,
                          label: availabilityLabels[value],
                        }))}
                      />
                      <LocalizedField
                        label="Durasi"
                        value={draft.duration}
                        onChange={(value) => setDraft({ ...draft, duration: value })}
                      />
                    </div>
                    <div className="flex flex-wrap items-center gap-3 border-t border-emerald-100 pt-4">
                      <AdminButton
                        onClick={() =>
                          void ops
                            .save(record.key, draft, record.position)
                            .then((ok) => ok && setOpenKey(null))
                        }
                      >
                        Simpan jadwal
                      </AdminButton>
                      <AdminButton variant="outline" onClick={() => setOpenKey(null)}>
                        Batal
                      </AdminButton>
                      <SaveState state={ops.saveState} message={ops.saveError} />
                    </div>
                  </div>
                ) : null}
              </li>
            );
          })}
      </ul>
    </AdminPanel>
  );
}

export function ArticlesEditor() {
  return (
    <CollectionEditor<Article>
      collection="articles"
      title="Panduan Jamaah"
      description="Artikel panduan. Badan artikel ditulis sebagai kerangka: blok dipisahkan baris kosong, baris diawali - menjadi daftar, ## menjadi subjudul, dan > menjadi catatan."
      titleOf={(item) => item.title.id || item.slug}
      summaryOf={(item) => `${item.category.id} · ${item.publishedAt ?? "tanggal belum diisi"}`}
      addLabel="Tambah artikel"
      newRecord={() => ({
        id: `art-${Date.now().toString(36)}`,
        slug: "",
        title: emptyLocalized(),
        category: both("Panduan"),
        excerpt: emptyLocalized(),
        content: { id: [], en: [] },
        thumbnail: null,
        author: null,
        publishedAt: null,
      })}
      renderForm={(draft, patch) => (
        <>
          <LocalizedField label="Judul" value={draft.title} onChange={(v) => patch({ title: v ?? emptyLocalized() })} />
          <LocalizedField label="Ringkasan" value={draft.excerpt} onChange={(v) => patch({ excerpt: v ?? emptyLocalized() })} multiline rows={3} />
          <LocalizedField label="Kategori" value={draft.category} onChange={(v) => patch({ category: v ?? both("Panduan") })} />
          <LocalizedField label="Penulis" value={draft.author} onChange={(v) => patch({ author: v })} hint="Kosongkan bila nama penulis belum ditetapkan." />
          <TextField
            label="Tanggal terbit"
            type="date"
            value={draft.publishedAt ?? ""}
            onChange={(value) => patch({ publishedAt: value || null })}
          />
          <MediaField label="Gambar sampul" folder="panduan" value={draft.thumbnail} onChange={(value) => patch({ thumbnail: value })} />
          <TextArea
            label="Isi artikel (Bahasa Indonesia)"
            rows={14}
            value={blocksToText(draft.content.id)}
            onChange={(value) => patch({ content: { ...draft.content, id: textToBlocks(value) } })}
            hint="Pisahkan blok dengan baris kosong. Awali baris dengan - untuk daftar, ## untuk subjudul, > untuk catatan."
          />
          <TextArea
            label="Isi artikel (English)"
            rows={14}
            value={blocksToText(draft.content.en)}
            onChange={(value) => patch({ content: { ...draft.content, en: textToBlocks(value) } })}
            hint="Terjemahan penuh. Halaman Inggris membaca versi ini, bukan versi Indonesia."
          />
        </>
      )}
    />
  );
}

export function PromosEditor() {
  const { packages } = useContent();
  return (
    <CollectionEditor<Promo>
      collection="promos"
      title="Promo"
      description="Promo muncul otomatis pada paket yang dipilih dan, bila ditandai, pada banner beranda. Promo berhenti tampil sendiri setelah tanggal berakhirnya lewat, jadi tidak ada yang perlu dimatikan manual."
      titleOf={(item) => item.title.id || item.id}
      summaryOf={(item) =>
        [item.packageSlug ?? "semua program", item.endsAt ?? "tanpa tanggal berakhir", item.featured ? "di banner" : "tidak di banner"].join(" · ")
      }
      addLabel="Tambah promo"
      newRecord={() => ({
        id: `promo-${Date.now().toString(36)}`,
        title: emptyLocalized(),
        detail: emptyLocalized(),
        packageSlug: null,
        endsAt: null,
        featured: false,
      })}
      renderForm={(draft, patch) => (
        <>
          <LocalizedField label="Judul promo" value={draft.title} onChange={(v) => patch({ title: v ?? emptyLocalized() })} />
          <LocalizedField label="Keterangan" value={draft.detail} onChange={(v) => patch({ detail: v })} multiline rows={3} />
          <Field label="Berlaku untuk paket">
            <select
              value={draft.packageSlug ?? ""}
              onChange={(event) => patch({ packageSlug: event.target.value || null })}
              className="w-full rounded-md border border-emerald-200 bg-shell px-3 py-2 text-body-sm"
            >
              <option value="">Semua program</option>
              {packages.map((item) => (
                <option key={item.slug} value={item.slug}>
                  {item.name.id}
                </option>
              ))}
            </select>
          </Field>
          <TextField
            label="Berakhir pada"
            type="date"
            value={draft.endsAt ?? ""}
            onChange={(value) => patch({ endsAt: value || null })}
            hint="Kosongkan hanya bila promo memang tidak punya batas waktu."
          />
          <CheckboxField
            label="Tampilkan pada banner beranda"
            checked={draft.featured}
            onChange={(checked) => patch({ featured: checked })}
            hint="Promo tetap muncul pada paket terkait meski banner dimatikan."
          />
        </>
      )}
    />
  );
}

export function FaqsEditor() {
  return (
    <CollectionEditor<FaqItem>
      collection="faqs"
      title="FAQ"
      description="Pertanyaan yang benar-benar ditanyakan jamaah. Nomor urut menentukan posisi pertanyaan di halaman FAQ."
      titleOf={(item) => item.question.id || item.id}
      summaryOf={(item) => item.category.id}
      addLabel="Tambah pertanyaan"
      newRecord={() => ({
        id: `faq-${Date.now().toString(36)}`,
        category: both("Umum"),
        question: emptyLocalized(),
        answer: emptyLocalized(),
        order: 0,
      })}
      renderForm={(draft, patch) => (
        <>
          <LocalizedField label="Kategori" value={draft.category} onChange={(v) => patch({ category: v ?? both("Umum") })} />
          <LocalizedField label="Pertanyaan" value={draft.question} onChange={(v) => patch({ question: v ?? emptyLocalized() })} multiline rows={2} />
          <LocalizedField label="Jawaban" value={draft.answer} onChange={(v) => patch({ answer: v ?? emptyLocalized() })} multiline rows={5} />
          <TextField
            label="Nomor urut"
            type="number"
            value={String(draft.order)}
            onChange={(value) => patch({ order: Number(value) || 0 })}
          />
        </>
      )}
    />
  );
}

export function GalleryEditor() {
  return (
    <CollectionEditor<GallerySlot>
      collection="gallery"
      title="Galeri"
      description="Slot foto. Slot tanpa foto menampilkan keterangan bahwa dokumentasi belum ada, bukan gambar stok."
      titleOf={(item) => item.label.id || item.id}
      summaryOf={(item) => (item.photo ? item.photo : "belum ada foto")}
      addLabel="Tambah slot"
      newRecord={() => ({
        id: `gal-${Date.now().toString(36)}`,
        label: emptyLocalized(),
        description: emptyLocalized(),
        photo: null,
      })}
      renderForm={(draft, patch) => (
        <>
          <LocalizedField label="Judul slot" value={draft.label} onChange={(v) => patch({ label: v ?? emptyLocalized() })} />
          <LocalizedField label="Keterangan" value={draft.description} onChange={(v) => patch({ description: v ?? emptyLocalized() })} multiline rows={3} />
          <MediaField label="Foto" folder="galeri" value={draft.photo} onChange={(value) => patch({ photo: value })} />
        </>
      )}
    />
  );
}

export function TeamEditor() {
  return (
    <CollectionEditor<TeamMember>
      collection="team"
      title="Pembimbing"
      description="Profil pembimbing. Selama daftar ini kosong, halaman pembimbing menampilkan keterangan bahwa datanya belum tersedia."
      titleOf={(item) => item.name.id || item.id}
      summaryOf={(item) => item.role.id}
      addLabel="Tambah pembimbing"
      newRecord={() => ({
        id: `team-${Date.now().toString(36)}`,
        name: emptyLocalized(),
        role: emptyLocalized(),
        photo: null,
        bio: null,
      })}
      renderForm={(draft, patch) => (
        <>
          <LocalizedField label="Nama" value={draft.name} onChange={(v) => patch({ name: v ?? emptyLocalized() })} />
          <LocalizedField label="Peran" value={draft.role} onChange={(v) => patch({ role: v ?? emptyLocalized() })} />
          <LocalizedField label="Keterangan" value={draft.bio} onChange={(v) => patch({ bio: v })} multiline rows={3} />
          <MediaField
            label="Foto asli orang tersebut"
            folder="pembimbing"
            value={draft.photo}
            onChange={(value) => patch({ photo: value })}
            hint="Gunakan foto asli. Jangan memakai foto stok yang bukan orangnya."
          />
        </>
      )}
    />
  );
}

export function TestimonialsEditor() {
  return (
    <CollectionEditor<Testimonial>
      collection="testimonials"
      title="Testimonial"
      description="Hanya testimonial yang benar-benar diberikan jamaah. Selama daftar ini kosong, bagian testimonial tidak ditampilkan di situs."
      titleOf={(item) => item.name.id || item.id}
      summaryOf={(item) => item.publishedAt ?? "tanggal belum diisi"}
      addLabel="Tambah testimonial"
      newRecord={() => ({
        id: `testi-${Date.now().toString(36)}`,
        name: emptyLocalized(),
        photo: null,
        packageName: null,
        quote: emptyLocalized(),
        publishedAt: null,
      })}
      renderForm={(draft, patch) => (
        <>
          <LocalizedField label="Nama jamaah" value={draft.name} onChange={(v) => patch({ name: v ?? emptyLocalized() })} />
          <LocalizedField label="Kutipan" value={draft.quote} onChange={(v) => patch({ quote: v ?? emptyLocalized() })} multiline rows={4} />
          <LocalizedField label="Nama paket" value={draft.packageName} onChange={(v) => patch({ packageName: v })} />
          <TextField
            label="Tanggal"
            type="date"
            value={draft.publishedAt ?? ""}
            onChange={(value) => patch({ publishedAt: value || null })}
          />
          <MediaField
            label="Foto jamaah"
            folder="testimonial"
            value={draft.photo}
            onChange={(value) => patch({ photo: value })}
            hint="Minta izin sebelum mengunggah foto jamaah."
          />
        </>
      )}
    />
  );
}

