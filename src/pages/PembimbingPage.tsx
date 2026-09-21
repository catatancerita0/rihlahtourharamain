import { PageHeader } from "../components/layout/PageHeader";
import { ButtonLink } from "../components/ui/Button";
import { EmptyState } from "../components/ui/EmptyState";
import { Media } from "../components/ui/Media";
import { SectionHeading } from "../components/ui/SectionHeading";
import { teamMembers } from "../content/site-content";
import { useCopy, usePick } from "../i18n/LanguageProvider";
import type { Localized } from "../i18n/types";

const idCopy = {
  eyebrow: "Pembimbing",
  title: "Pembimbing yang mendampingi rombongan",
  intro:
    "Halaman ini menampilkan pembimbing setelah penugasannya ditetapkan untuk setiap keberangkatan. Kami tidak menampilkan profil tanpa data yang bisa diverifikasi.",
  emptyTitle: "Data pembimbing belum tersedia.",
  emptyBody:
    "Nama, peran, dan pengalaman pembimbing belum diberikan ke situs ini. Profil akan ditampilkan per keberangkatan, karena penugasan mengikuti tanggal dan jumlah jamaah pada rombongan tersebut.",
  askButton: "Tanyakan pembimbing pada jadwal tertentu",
  roleEyebrow: "Peran",
  roleTitle: "Yang dikerjakan pembimbing selama perjalanan",
  roleIntro: "Tiga hal ini berlaku untuk setiap program, terlepas dari siapa yang ditugaskan.",
  roles: [
    {
      id: "lapangan",
      title: "Mendampingi kegiatan harian",
      body: "Pembimbing mengarahkan urutan kegiatan, titik kumpul, dan waktu bergerak supaya rombongan tidak terpecah.",
    },
    {
      id: "lansia",
      title: "Menangani ritme jamaah lansia",
      body: "Jamaah yang membutuhkan ritme lebih lambat dibantu sejak konsultasi, lalu pendampingannya disesuaikan di lapangan.",
    },
    {
      id: "darurat",
      title: "Menjadi titik kontak saat ada kendala",
      body: "Kebutuhan mendesak disampaikan ke pembimbing, bukan ke pihak di luar rombongan, agar penanganannya tetap terkoordinasi.",
    },
  ],
};

const enCopy: typeof idCopy = {
  eyebrow: "Group guides",
  title: "The people who accompany the group",
  intro:
    "This page shows guides once their assignment is set for a departure. We do not publish profiles without data that can be verified.",
  emptyTitle: "Guide data is not available yet.",
  emptyBody:
    "The names, roles and experience of the guides have not been provided to this site. Profiles will be shown per departure, because assignments follow the date and the number of pilgrims in that group.",
  askButton: "Ask about the guide on a specific departure",
  roleEyebrow: "The role",
  roleTitle: "What a guide does during the trip",
  roleIntro: "These three things apply to every programme, whoever is assigned.",
  roles: [
    {
      id: "lapangan",
      title: "Accompanying the daily programme",
      body: "The guide directs the order of activities, assembly points and movement times so the group does not get split up.",
    },
    {
      id: "lansia",
      title: "Managing the pace of elderly pilgrims",
      body: "Pilgrims who need a slower pace are helped from the consultation onwards, and the support is adjusted on the ground.",
    },
    {
      id: "darurat",
      title: "Being the contact point when something goes wrong",
      body: "Urgent needs go to the guide rather than to anyone outside the group, so they can be handled in a coordinated way.",
    },
  ],
};

const copy: Localized<typeof idCopy> = { id: idCopy, en: enCopy };

export function PembimbingPage() {
  const c = useCopy(copy);
  const L = usePick();

  return (
    <>
      <PageHeader eyebrow={c.eyebrow} title={c.title} intro={c.intro} />

      <section className="section bg-shell">
        <div className="shell-container">
          {teamMembers.length === 0 ? (
            <EmptyState
              title={c.emptyTitle}
              description={c.emptyBody}
              action={
                <ButtonLink to="/konsultasi" variant="primary">
                  {c.askButton}
                </ButtonLink>
              }
            />
          ) : (
            <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {teamMembers.map((member) => (
                <li key={member.id} className="rounded-lg border border-emerald-100 bg-shell p-5">
                  {/* A real portrait of the person named below, never a stock face. */}
                  {member.photo ? (
                    <Media src={member.photo} alt={L(member.name)} ratio="1/1" className="mb-5" />
                  ) : null}
                  <h2 className="text-display-sm text-emerald-900">{L(member.name)}</h2>
                  <p className="mt-1 text-body-sm font-semibold text-charcoal-muted">
                    {L(member.role)}
                  </p>
                  {member.bio ? (
                    <p className="mt-3 text-body-sm text-charcoal-soft">{L(member.bio)}</p>
                  ) : null}
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>

      <section className="section bg-emerald-50">
        <div className="shell-container">
          <SectionHeading eyebrow={c.roleEyebrow} title={c.roleTitle} intro={c.roleIntro} />
          <div className="mt-10 grid gap-6 lg:grid-cols-3">
            {c.roles.map((item) => (
              <div key={item.id} className="rounded-lg border border-emerald-200 bg-shell p-5">
                <h3 className="text-body-lg font-semibold text-emerald-900">{item.title}</h3>
                <p className="mt-2 text-body-sm text-charcoal-soft">{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
