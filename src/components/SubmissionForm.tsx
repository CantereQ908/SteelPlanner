import { useState, type FormEvent } from 'react'
import { useData } from '../data/DataProvider'
import { formatDate, todayISO } from '../lib/dates'
import { SUBMISSION_STATUSES, SUBMISSION_STATUS_LABEL, type Submission, type SubmissionStatus } from '../types'
import { Modal } from './Modal'

interface Props {
  initial?: Submission
  /** Np. magazyn albo sesja, z których otwarto formularz. */
  defaults?: Partial<Submission>
  onClose(): void
}

export function SubmissionForm({ initial, defaults, onClose }: Props) {
  const { data, saveSubmission, deleteSubmission } = useData()
  const start = { ...defaults, ...initial }
  const [magazineId, setMagazineId] = useState(start.magazineId ?? '')
  const [sessionId, setSessionId] = useState(start.sessionId ?? '')
  const [status, setStatus] = useState<SubmissionStatus>(start.status ?? 'sent')
  const [sentDate, setSentDate] = useState(start.sentDate ?? todayISO())
  const [notes, setNotes] = useState(start.notes ?? '')

  const magazines = [...data.magazines].sort((a, b) => a.name.localeCompare(b.name, 'pl'))
  const sessions = [...data.sessions].sort((a, b) => b.date.localeCompare(a.date))
  // Sesje już zgłoszone do wybranego magazynu (poza edytowanym zgłoszeniem)
  const alreadySent = new Set(
    data.submissions.filter((s) => s.magazineId === magazineId && s.id !== initial?.id).map((s) => s.sessionId),
  )

  const submit = (e: FormEvent) => {
    e.preventDefault()
    void saveSubmission({
      id: initial?.id ?? crypto.randomUUID(),
      magazineId,
      sessionId,
      status,
      sentDate,
      notes: notes.trim(),
    })
    onClose()
  }

  const remove = () => {
    if (!initial || !confirm('Usunąć to zgłoszenie?')) return
    void deleteSubmission(initial.id)
    onClose()
  }

  return (
    <Modal title={initial ? 'Edytuj zgłoszenie' : 'Nowe zgłoszenie'} onClose={onClose}>
      {magazines.length === 0 || sessions.length === 0 ? (
        <>
          <p className="muted">
            {magazines.length === 0
              ? 'Najpierw dodaj magazyn w zakładce Magazyny.'
              : 'Najpierw dodaj sesję, którą chcesz zgłosić.'}
          </p>
          <div className="form-actions">
            <span className="spacer" />
            <button type="button" className="btn" onClick={onClose}>
              Zamknij
            </button>
          </div>
        </>
      ) : (
        <form className="form" onSubmit={submit}>
          <label>
            Magazyn
            <select value={magazineId} onChange={(e) => setMagazineId(e.target.value)} required>
              <option value="" disabled>
                — wybierz —
              </option>
              {magazines.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name}
                </option>
              ))}
            </select>
          </label>
          <label>
            Sesja
            <select value={sessionId} onChange={(e) => setSessionId(e.target.value)} required>
              <option value="" disabled>
                — wybierz —
              </option>
              {sessions.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.title} · {formatDate(s.date, { day: 'numeric', month: 'short', year: 'numeric' })}
                  {alreadySent.has(s.id) ? ' (już tu zgłoszona)' : ''}
                </option>
              ))}
            </select>
          </label>
          {alreadySent.has(sessionId) && (
            <p className="notice">Ta sesja była już zgłoszona do tego magazynu.</p>
          )}
          <div className="form-row">
            <label>
              Status
              <select value={status} onChange={(e) => setStatus(e.target.value as SubmissionStatus)}>
                {SUBMISSION_STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {SUBMISSION_STATUS_LABEL[s]}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Data wysłania
              <input type="date" value={sentDate} onChange={(e) => setSentDate(e.target.value)} required />
            </label>
          </div>
          <label>
            Notatka
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Np. które zdjęcia, numer zgłoszenia, odpowiedź redakcji"
            />
          </label>
          <div className="form-actions">
            {initial && (
              <button type="button" className="btn danger" onClick={remove}>
                Usuń
              </button>
            )}
            <span className="spacer" />
            <button type="button" className="btn" onClick={onClose}>
              Anuluj
            </button>
            <button type="submit" className="btn primary">
              Zapisz
            </button>
          </div>
        </form>
      )}
    </Modal>
  )
}
