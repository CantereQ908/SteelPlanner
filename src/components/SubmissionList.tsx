import { useData } from '../data/DataProvider'
import { formatDate } from '../lib/dates'
import { SUBMISSION_STATUS_LABEL, type Submission } from '../types'

interface Props {
  submissions: Submission[]
  /** Co pokazać przy zgłoszeniu: nazwę magazynu, sesji czy obie. */
  show: 'magazine' | 'session' | 'both'
  empty: string
  onOpen(submission: Submission): void
}

export function SubmissionList({ submissions, show, empty, onOpen }: Props) {
  const { data } = useData()
  if (submissions.length === 0) return <p className="muted">{empty}</p>

  const sorted = [...submissions].sort((a, b) => b.sentDate.localeCompare(a.sentDate))
  return (
    <ul className="submissions">
      {sorted.map((s) => {
        const magazine = data.magazines.find((m) => m.id === s.magazineId)?.name ?? '?'
        const session = data.sessions.find((x) => x.id === s.sessionId)?.title ?? '?'
        const name = show === 'magazine' ? magazine : show === 'session' ? session : `${magazine} — ${session}`
        return (
          <li key={s.id}>
            <button className="submission" data-sub={s.status} onClick={() => onOpen(s)}>
              <span>{name}</span>
              <span className="sub-status">{SUBMISSION_STATUS_LABEL[s.status]}</span>
              <span className="muted">{formatDate(s.sentDate, { day: 'numeric', month: 'short' })}</span>
            </button>
          </li>
        )
      })}
    </ul>
  )
}
