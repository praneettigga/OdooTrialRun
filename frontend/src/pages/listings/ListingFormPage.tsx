import { useEffect, useState, type FormEvent } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { Input } from '../../components/ui/Input'
import { Select } from '../../components/ui/Select'
import { ListingImage } from '../../components/ui/ListingImage'
import { ErrorState, Spinner } from '../../components/ui/states'
import {
  CATEGORIES,
  CONDITIONS,
  createListing,
  getListing,
  updateListing,
  type Category,
  type Condition,
  type ListingStatus,
} from '../../services/products'

// One component for add and edit — the fields and rules are identical, only the
// verb and the starting values differ.
type Errors = Partial<Record<'title' | 'description' | 'price' | 'category', string>>

const CATEGORY_OPTIONS = [
  { value: '', label: 'Choose a category' },
  ...CATEGORIES.map((c) => ({ value: c, label: c })),
]
const CONDITION_OPTIONS = CONDITIONS.map((c) => ({ value: c, label: c }))
const STATUS_OPTIONS = [
  { value: 'available', label: 'Publish it — visible in the marketplace' },
  { value: 'draft', label: 'Save as draft — only you can see it' },
]

function validate(fields: {
  title: string
  description: string
  price: string
  category: string
}): Errors {
  const errors: Errors = {}

  if (fields.title.trim().length < 4) errors.title = 'Give it a title of at least 4 characters.'
  if (fields.description.trim().length < 15)
    errors.description = 'Describe the condition in a sentence or two — at least 15 characters.'
  if (!fields.category) errors.category = 'Pick a category so buyers can find it.'

  const price = Number(fields.price)
  if (fields.price.trim() === '') errors.price = 'Enter a price.'
  else if (!Number.isFinite(price) || price < 0) errors.price = 'Price must be zero or more.'
  else if (price > 10_000_000) errors.price = 'That price looks like a typo.'

  return errors
}

export function ListingFormPage() {
  const { id } = useParams()
  const isEdit = Boolean(id)
  const navigate = useNavigate()

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState('')
  const [price, setPrice] = useState('')
  const [condition, setCondition] = useState<Condition>('Good')
  const [status, setStatus] = useState<ListingStatus>('available')

  const [errors, setErrors] = useState<Errors>({})
  const [formError, setFormError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [loading, setLoading] = useState(isEdit)
  const [loadError, setLoadError] = useState<string | null>(null)

  useEffect(() => {
    if (!id) return
    let cancelled = false
    setLoading(true)

    getListing(id)
      .then((listing) => {
        if (cancelled) return
        if (!listing) {
          setLoadError('That listing no longer exists.')
        } else {
          setTitle(listing.title)
          setDescription(listing.description)
          setCategory(listing.category)
          setPrice(String(listing.price))
          setCondition(listing.condition)
          setStatus(listing.status === 'sold' ? 'available' : listing.status)
        }
        setLoading(false)
      })
      .catch(() => {
        if (cancelled) return
        setLoadError('Could not load that listing.')
        setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [id])

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setFormError(null)

    const found = validate({ title, description, price, category })
    setErrors(found)
    if (Object.keys(found).length > 0) return

    setSubmitting(true)
    try {
      const input = {
        title: title.trim(),
        description: description.trim(),
        category: category as Category,
        price: Number(price),
        condition,
        status,
      }
      if (id) await updateListing(id, input)
      else await createListing(input)
      navigate('/my-listings')
    } catch (e: unknown) {
      setFormError(e instanceof Error ? e.message : 'Could not save that listing.')
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="mx-auto w-full max-w-2xl px-6 py-10">
        <Spinner label="Loading listing" />
      </div>
    )
  }

  if (loadError) {
    return (
      <div className="mx-auto w-full max-w-2xl px-6 py-10">
        <ErrorState message={loadError} />
      </div>
    )
  }

  return (
    <div className="mx-auto w-full max-w-2xl px-6 py-10">
      <Link
        to="/my-listings"
        className="inline-flex items-center gap-2 rounded-md py-2 text-sm font-semibold text-body hover:text-ink"
      >
        <svg viewBox="0 0 24 24" className="size-4" fill="none" aria-hidden="true">
          <path
            d="M15 5l-7 7 7 7"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        Back to my listings
      </Link>

      <h1 className="mt-4 font-display text-display-md">
        {isEdit ? 'Edit listing' : 'Add a new listing'}
      </h1>
      <p className="mt-2 text-body">
        {isEdit
          ? 'Changes go live as soon as you save.'
          : 'Four fields and it is live. You can edit any of it later.'}
      </p>

      <form onSubmit={handleSubmit} noValidate className="mt-8 flex flex-col gap-5">
        <Input
          label="Product title"
          value={title}
          onChange={(e) => {
            setTitle(e.target.value)
            if (errors.title) setErrors({ ...errors, title: undefined })
          }}
          error={errors.title}
          placeholder="Teak writing desk with drawer"
        />

        <Select
          label="Category"
          value={category}
          onChange={(e) => {
            setCategory(e.target.value)
            if (errors.category) setErrors({ ...errors, category: undefined })
          }}
          error={errors.category}
          options={CATEGORY_OPTIONS}
        />

        <div className="flex flex-col gap-1.5">
          <label htmlFor="description" className="text-sm font-semibold text-ink">
            Description
          </label>
          <textarea
            id="description"
            rows={5}
            value={description}
            onChange={(e) => {
              setDescription(e.target.value)
              if (errors.description) setErrors({ ...errors, description: undefined })
            }}
            aria-invalid={errors.description ? true : undefined}
            aria-describedby={errors.description ? 'description-error' : 'description-hint'}
            placeholder="Say how worn it is, anything that does not work, and where it can be collected."
            className={`w-full rounded-md border bg-canvas px-4 py-3 text-base text-ink placeholder:text-mute ${
              errors.description ? 'border-negative' : 'border-ink/25 hover:border-ink/50'
            }`}
          />
          {errors.description ? (
            <p id="description-error" className="text-sm font-medium text-negative-deep">
              {errors.description}
            </p>
          ) : (
            <p id="description-hint" className="text-sm text-mute">
              Buyers trust an honest flaw more than a perfect description.
            </p>
          )}
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <Input
            label="Price (₹)"
            type="number"
            min="0"
            inputMode="numeric"
            value={price}
            onChange={(e) => {
              setPrice(e.target.value)
              if (errors.price) setErrors({ ...errors, price: undefined })
            }}
            error={errors.price}
            placeholder="6400"
          />
          <Select
            label="Condition"
            value={condition}
            onChange={(e) => setCondition(e.target.value as Condition)}
            options={CONDITION_OPTIONS}
          />
        </div>

        <div>
          <span className="text-sm font-semibold text-ink">Photo</span>
          <div className="mt-1.5 flex items-center gap-4 rounded-xl border border-dashed border-ink/25 p-4">
            <ListingImage
              category={(category || 'Furniture') as Category}
              imageUrl={null}
              alt="Listing photo placeholder"
              className="size-20 shrink-0 rounded-lg"
              markSize="size-7"
            />
            <div className="text-sm text-body">
              <p className="font-semibold text-ink">Photo upload lands with storage</p>
              <p className="mt-0.5">
                Listings show this placeholder until Supabase storage is wired up.
              </p>
            </div>
          </div>
        </div>

        <Select
          label="Visibility"
          value={status}
          onChange={(e) => setStatus(e.target.value as ListingStatus)}
          options={STATUS_OPTIONS}
        />

        {formError && (
          <p
            role="alert"
            className="rounded-md bg-primary-pale px-4 py-3 text-sm font-medium text-ink-deep"
          >
            {formError}
          </p>
        )}

        <div className="flex flex-wrap gap-3">
          <button
            type="submit"
            disabled={submitting}
            className="rounded-xl bg-primary px-7 py-3.5 text-base font-semibold text-ink transition-colors duration-150 hover:bg-primary-active disabled:opacity-50"
          >
            {submitting ? 'Saving…' : isEdit ? 'Save changes' : 'Publish listing'}
          </button>
          <Link
            to="/my-listings"
            className="rounded-xl px-7 py-3.5 text-base font-semibold text-ink transition-colors duration-150 hover:bg-canvas-soft"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  )
}
