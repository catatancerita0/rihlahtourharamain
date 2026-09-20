import { PageHeader } from "../components/layout/PageHeader";
import { ButtonLink } from "../components/ui/Button";
import { EmptyState } from "../components/ui/EmptyState";
import { SectionHeading } from "../components/ui/SectionHeading";
import { teamMembers } from "../content/site-content";

const roleDetails = [
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
];

export function PembimbingPage() {
  return (
    <>
      <PageHeader
        eyebrow="Pembimbing"
        title="Pembimbing yang mendampingi rombongan"
        intro="Halaman ini menampilkan pembimbing setelah penugasannya ditetapkan untuk setiap keberangkatan. Kami tidak menampilkan profil tanpa data yang bisa diverifikasi."
      />

      <section className="section bg-shell">
        <div className="shell-container">
          {teamMembers.length === 0 ? (
            <EmptyState
              title="Data pembimbing belum tersedia."
              description="Nama, peran, dan pengalaman pembimbing belum diberikan ke situs ini. Profil akan ditampilkan per keberangkatan, karena penugasan mengikuti tanggal dan jumlah jamaah pada rombongan tersebut."
              action={
                <ButtonLink to="/konsultasi" variant="primary">
                  Tanyakan pembimbing pada jadwal tertentu
                </ButtonLink>
              }
            />
          ) : (
            <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {teamMembers.map((member) => (
                <li key={member.id} className="rounded-lg border border-emerald-100 bg-shell p-5">
                  <h2 className="text-display-sm text-emerald-900">{member.name}</h2>
                  <p className="mt-1 text-body-sm font-semibold text-charcoal-muted">{member.role}</p>
                  {member.bio ? (
                    <p className="mt-3 text-body-sm text-charcoal-soft">{member.bio}</p>
                  ) : null}
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>

      <section className="section bg-emerald-50">
        <div className="shell-container">
          <SectionHeading
            eyebrow="Peran"
            title="Yang dikerjakan pembimbing selama perjalanan"
            intro="Tiga hal ini berlaku untuk setiap program, terlepas dari siapa yang ditugaskan."
          />
          <div className="mt-10 grid gap-6 lg:grid-cols-3">
            {roleDetails.map((item) => (
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
