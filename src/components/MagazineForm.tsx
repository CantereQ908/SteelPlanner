import { useState, type FormEvent } from 'react'
import { useData } from '../data/DataProvider'
import { MAGAZINE_CATEGORIES, MAGAZINE_CATEGORY_LABEL, type Magazine, type MagazineCategory } from '../types'
import { Modal } from './Modal'

export function MagazineForm({ initial, onClose }: { initial?: Magazine; onClose(): void }) {
  const { data, saveMagazine, deleteMagazine } = useData()
  const [name, setName] = useState(initial?.name ?? '')
  const [category, setCategory] = useState<MagazineCategory>(initial?.category ?? 'unpublished')
  const [url, setUrl] = useState(initial?.url ?? '')
  const [email, setEmail] = useState(initial?.email ?? '')
  const [instagram, setInstagram] = useState(initial?.instagram ?? '')
  const [notes, setNotes] = useState(initial?.notes ?? '')

  const submit = (e: FormEvent) => {
    e.preventDefault()
    void saveMagazine({
      id: initial?.id ?? crypto.randomUUID(),
      name: name.trim(),
      category,
      url: url.trim(),
      email: email.trim(),
      instagram: instagram.trim(),
      notes: notes.trim(),
    })
    onClose()
  }

  const remove = () => {
    if (!initial) return
    const count = data.submissions.filter((s) => s.magazineId === initial.id).length
    const extra = count > 0 ? ` Razem z nim znikną zgłoszenia sesji (${count}).` : ''
    if (!confirm(`Usunąć magazyn „${initial.name}"?${extra}`)) return
    void deleteMagazine(initial.id)
    onClose()
  }

  return (
    <Modal title={initial ? 'Edytuj magazyn' : 'Nowy magazyn'} onClose={onClose}>
      <form className="form" onSubmit={submit}>
        <label>
          Nazwa
          <input value={name} onChange={(e) => setName(e.target.value)} required autoFocus />
        </label>
        <fieldset className="segmented" data-category={category}>
          <legend>Przyjmuje sesje</legend>
          {MAGAZINE_CATEGORIES.map((c) => (
            <label key={c}>
              <input type="radio" name="category" checked={category === c} onChange={() => setCategory(c)} />
              <span>{MAGAZINE_CATEGORY_LABEL[c]}</span>
            </label>
          ))}
        </fieldset>
        <label>
          Link do zgłoszeń
          <input
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            inputMode="url"
            placeholder="np. magazyn.com/submissions"
            autoCapitalize="none"
            autoCorrect="off"
          />
        </label>
        <div className="form-row">
          <label>
            E-mail
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          </label>
          <label>
            Instagram
            <input
              value={instagram}
              onChange={(e) => setInstagram(e.target.value)}
              placeholder="@nazwa"
              autoCapitalize="none"
              autoCorrect="off"
            />
          </label>
        </div>
        <label>
          Wymagania i notatki
          <textarea
            rows={4}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Np. min. 8 zdjęć, tylko ekskluzywne, czas odpowiedzi, opłata"
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
    </Modal>
  )
}
