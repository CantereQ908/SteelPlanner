export type Role = 'model' | 'stylist' | 'makeup'
export type Status = 'planned' | 'confirmed' | 'done'

export interface Person {
  id: string
  name: string
  email: string
  instagram: string
  role: Role
  /** Dowolna notatka o osobie; może być pusta */
  note: string
}

export interface Session {
  id: string
  title: string
  /** YYYY-MM-DD */
  date: string
  /** Początek: HH:MM albo pusty string */
  time: string
  /** Koniec: HH:MM albo pusty string */
  endTime: string
  location: string
  description: string
  status: Status
  personIds: string[]
}

export interface Task {
  id: string
  /** null = zadanie ogólne, niepowiązane z żadną sesją */
  sessionId: string | null
  /** null = zadanie główne; inaczej id zadania, którego to jest podzadaniem */
  parentId: string | null
  title: string
  done: boolean
  /** Termin: YYYY-MM-DD albo pusty string */
  dueDate: string
  /** Godzina terminu: HH:MM albo pusty string */
  dueTime: string
  /** ISO, wyznacza kolejność na liście */
  createdAt: string
}

export type PostFormat = 'post' | 'carousel' | 'reel' | 'story'
export type PostStatus = 'idea' | 'ready' | 'published'

export interface Post {
  id: string
  /** null = post niepowiązany z sesją */
  sessionId: string | null
  /** YYYY-MM-DD albo pusty string, gdy data jeszcze nieustalona */
  date: string
  /** HH:MM albo pusty string */
  time: string
  format: PostFormat
  status: PostStatus
  caption: string
  hashtags: string
  /** Osoby do oznaczenia */
  personIds: string[]
  /** Uwagi robocze, np. które zdjęcia */
  notes: string
}

export type MagazineCategory = 'unpublished' | 'published' | 'both'
export type SubmissionStatus = 'sent' | 'accepted' | 'rejected' | 'published'

export interface Magazine {
  id: string
  name: string
  /** Jakie sesje przyjmuje: niepublikowane, publikowane czy oba rodzaje */
  category: MagazineCategory
  /** Link do formularza / strony ze zgłoszeniami */
  url: string
  email: string
  instagram: string
  /** Wymagania, np. liczba zdjęć, format, ekskluzywność */
  notes: string
}

/** Zgłoszenie konkretnej sesji do konkretnego magazynu. */
export interface Submission {
  id: string
  magazineId: string
  sessionId: string
  status: SubmissionStatus
  /** YYYY-MM-DD */
  sentDate: string
  notes: string
}

export interface Data {
  people: Person[]
  sessions: Session[]
  tasks: Task[]
  posts: Post[]
  magazines: Magazine[]
  submissions: Submission[]
}

export const ROLES: Role[] = ['model', 'stylist', 'makeup']

export const ROLE_LABEL: Record<Role, string> = {
  model: 'Model',
  stylist: 'Stylista',
  makeup: 'Makijażysta',
}

export const ROLE_LABEL_PLURAL: Record<Role, string> = {
  model: 'Modele',
  stylist: 'Styliści',
  makeup: 'Makijażyści',
}

export const POST_FORMATS: PostFormat[] = ['post', 'carousel', 'reel', 'story']

export const POST_FORMAT_LABEL: Record<PostFormat, string> = {
  post: 'Post',
  carousel: 'Karuzela',
  reel: 'Reels',
  story: 'Relacja',
}

export const POST_STATUSES: PostStatus[] = ['idea', 'ready', 'published']

export const POST_STATUS_LABEL: Record<PostStatus, string> = {
  idea: 'Pomysł',
  ready: 'Gotowy',
  published: 'Opublikowany',
}

export const MAGAZINE_CATEGORIES: MagazineCategory[] = ['unpublished', 'published', 'both']

export const MAGAZINE_CATEGORY_LABEL: Record<MagazineCategory, string> = {
  unpublished: 'Niepublikowane',
  published: 'Publikowane',
  both: 'Oba rodzaje',
}

export const SUBMISSION_STATUSES: SubmissionStatus[] = ['sent', 'accepted', 'rejected', 'published']

export const SUBMISSION_STATUS_LABEL: Record<SubmissionStatus, string> = {
  sent: 'Wysłana',
  accepted: 'Przyjęta',
  rejected: 'Odrzucona',
  published: 'Opublikowana',
}

export const STATUSES: Status[] = ['planned', 'confirmed', 'done']

export const STATUS_LABEL: Record<Status, string> = {
  planned: 'Planowana',
  confirmed: 'Potwierdzona',
  done: 'Zakończona',
}
