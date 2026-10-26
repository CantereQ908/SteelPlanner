import { useState } from 'react'
import { MagazineForm } from '../components/MagazineForm'
import { SubmissionForm } from '../components/SubmissionForm'
import { SubmissionList } from '../components/SubmissionList'
import { useData } from '../data/DataProvider'
import { externalUrl, instagramHandle, instagramUrl } from '../lib/contact'
import { MAGAZINE_CATEGORY_LABEL, type Magazine, type Submission } from '../types'

type SubmissionTarget = Submission | { new: Partial<Submission> }

function MagazineCard({
  magazine,
  onEdit,
  onSubmission,
}: {
  magazine: Magazine
  onEdit(): void
  onSubmission(target: SubmissionTarget): void
}) {
  const { data } = useData()
  const handle = instagramHandle(magazine.instagram)
  return (
    <article className="magazine-card" data-category={magazine.category}>
      <div className="magazine-head">
        <div>
          <strong>{magazine.name}</strong>{' '}
          <span className="badge category-badge">{MAGAZINE_CATEGORY_LABEL[magazine.category]}</span>
        </div>
        <button className="btn small" onClick={onEdit}>
          Edytuj
        </button>
      </div>
      {(magazine.url || magazine.email || handle) && (
        <div className="tile-links">
          {magazine.url && (
            <a href={externalUrl(magazine.url)} target="_blank" rel="noreferrer">
              Strona zgłoszeń ↗
            </a>
          )}
          {magazine.email && <a href={`mailto:${magazine.email}`}>{magazine.email}</a>}
          {handle && (
            <a href={instagramUrl(magazine.instagram)} target="_blank" rel="noreferrer">
              @{handle}
            </a>
          )}
        </div>
      )}
      {magazine.notes && <p className="magazine-notes">{magazine.notes}</p>}
      <SubmissionList
        submissions={data.submissions.filter((s) => s.magazineId === magazine.id)}
        show="session"
        empty="Jeszcze nic tu nie wysłano."
        onOpen={onSubmission}
      />
      <div className="magazine-actions">
        <button className="btn small primary" onClick={() => onSubmission({ new: { magazineId: magazine.id } })}>
          Zgłoś sesję
        </button>
      </div>
    </article>
  )
}

export function MagazinesView() {
  const { data } = useData()
  const [query, setQuery] = useState('')
  // 'new' = nowy magazyn, Magazine = edycja
  const [magazineForm, setMagazineForm] = useState<Magazine | 'new' | null>(null)
  const [submissionForm, setSubmissionForm] = useState<SubmissionTarget | null>(null)

  const q = query.trim().toLowerCase()
  const visible = data.magazines
    .filter((m) => !q || m.name.toLowerCase().includes(q) || m.notes.toLowerCase().includes(q))
    .sort((a, b) => a.name.localeCompare(b.name, 'pl'))
  const unpublished = visible.filter((m) => m.category !== 'published')
  const published = visible.filter((m) => m.category !== 'unpublished')
  const waiting = data.submissions.filter((s) => s.status === 'sent')

  const card = (m: Magazine) => (
    <MagazineCard key={m.id} magazine={m} onEdit={() => setMagazineForm(m)} onSubmission={setSubmissionForm} />
  )

  return (
    <>
      <div className="view-head">
        <h1>Magazyny</h1>
        <div className="head-actions">
          <button className="btn" onClick={() => setSubmissionForm({ new: {} })}>
            Nowe zgłoszenie
          </button>
          <button className="btn primary" onClick={() => setMagazineForm('new')}>
            Dodaj magazyn
          </button>
        </div>
      </div>

      {data.magazines.length === 0 ? (
        <p className="empty">
          Tu zbierasz magazyny, do których wysyłasz sesje — osobno te na sesje niepublikowane i publikowane. Przy każdym
          widać, które sesje już do niego poszły i co z odpowiedzią.
        </p>
      ) : (
        <>
          {waiting.length > 0 && (
            <section className="waiting">
              <h2>
                Czeka na odpowiedź <span className="muted">({waiting.length})</span>
              </h2>
              <SubmissionList submissions={waiting} show="both" empty="" onOpen={setSubmissionForm} />
            </section>
          )}

          <div className="filter">
            <input
              type="search"
              placeholder="Szukaj magazynu"
              aria-label="Szukaj magazynu"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
          {visible.length === 0 && <p className="empty">Żaden magazyn nie pasuje do wyszukiwania.</p>}

          {unpublished.length > 0 && (
            <section>
              <h2>
                Na sesje niepublikowane <span className="muted">({unpublished.length})</span>
              </h2>
              <div className="magazine-grid">{unpublished.map(card)}</div>
            </section>
          )}
          {published.length > 0 && (
            <section>
              <h2>
                Na sesje publikowane <span className="muted">({published.length})</span>
              </h2>
              <div className="magazine-grid">{published.map(card)}</div>
            </section>
          )}
        </>
      )}

      {magazineForm && (
        <MagazineForm initial={magazineForm === 'new' ? undefined : magazineForm} onClose={() => setMagazineForm(null)} />
      )}
      {submissionForm && (
        <SubmissionForm
          initial={'new' in submissionForm ? undefined : submissionForm}
          defaults={'new' in submissionForm ? submissionForm.new : undefined}
          onClose={() => setSubmissionForm(null)}
        />
      )}
    </>
  )
}
