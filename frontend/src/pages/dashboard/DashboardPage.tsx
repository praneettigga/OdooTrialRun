import { useEffect, useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { Input } from '../../components/ui/Input'
import { ErrorState, Spinner } from '../../components/ui/states'
import { agoLabel, inr } from '../../format'
import { getProfile, updateProfile, type Profile } from '../../services/profile'
import { CURRENT_USER_ID, listListings } from '../../services/products'
import { listOrders } from '../../services/orders'

type Stats = { live: number; sold: number; drafts: number; orders: number; spent: number }

function StatTile({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-canvas-soft p-5">
      <dt className="text-sm text-body">{label}</dt>
      <dd className="mt-1 font-display text-display-sm text-ink">{value}</dd>
    </div>
  )
}

export function DashboardPage() {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [reloadKey, setReloadKey] = useState(0)

  const [editing, setEditing] = useState(false)
  const [username, setUsername] = useState('')
  const [fieldError, setFieldError] = useState<string | undefined>()
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError(null)

    Promise.all([
      getProfile(),
      listListings({ sellerId: CURRENT_USER_ID, status: 'any' }),
      listOrders(),
    ])
      .then(([p, listings, orders]) => {
        if (cancelled) return
        setProfile(p)
        setUsername(p.username)
        setStats({
          live: listings.filter((l) => l.status === 'available').length,
          sold: listings.filter((l) => l.status === 'sold').length,
          drafts: listings.filter((l) => l.status === 'draft').length,
          orders: orders.length,
          spent: orders.reduce((sum, o) => sum + o.totalAmount, 0),
        })
        setLoading(false)
      })
      .catch((e: unknown) => {
        if (cancelled) return
        setError(e instanceof Error ? e.message : 'Something went wrong.')
        setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [reloadKey])

  async function handleSave(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setFieldError(undefined)
    setSaved(false)

    // Mirrors the schema check so the user sees the error before the round trip.
    const trimmed = username.trim()
    if (trimmed.length < 2) {
      setFieldError('Username needs at least 2 characters.')
      return
    }
    if (trimmed.length > 40) {
      setFieldError('Username can be at most 40 characters.')
      return
    }

    setSaving(true)
    try {
      const updated = await updateProfile({
        username: username.trim(),
        avatarUrl: profile?.avatarUrl ?? null,
      })
      setProfile(updated)
      setEditing(false)
      setSaved(true)
    } catch (e: unknown) {
      setFieldError(e instanceof Error ? e.message : 'Could not save that.')
    }
    setSaving(false)
  }

  if (loading) {
    return (
      <div className="mx-auto w-full max-w-[1240px] px-6 py-10">
        <Spinner label="Loading your dashboard" />
      </div>
    )
  }

  if (error || !profile || !stats) {
    return (
      <div className="mx-auto w-full max-w-[1240px] px-6 py-10">
        <ErrorState
          message={error ?? 'Could not load your dashboard.'}
          onRetry={() => setReloadKey((k) => k + 1)}
        />
      </div>
    )
  }

  const initials = profile.username.slice(0, 2).toUpperCase()

  return (
    <div className="mx-auto w-full max-w-[1240px] px-6 py-10">
      <div className="border-b border-canvas-soft pb-6">
        <h1 className="font-display text-display-md">Dashboard</h1>
        <p className="mt-1 text-body">Your account, your listings and what you have bought.</p>
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-[360px_1fr]">
        <section className="self-start rounded-xl bg-canvas p-6 ring-1 ring-ink/10">
          <div className="flex items-center gap-4">
            {profile.avatarUrl ? (
              <img
                src={profile.avatarUrl}
                alt=""
                className="size-16 rounded-full object-cover"
              />
            ) : (
              <span
                aria-hidden="true"
                className="flex size-16 items-center justify-center rounded-full bg-primary font-display text-xl text-ink"
              >
                {initials}
              </span>
            )}
            <div className="min-w-0">
              <h2 className="truncate font-display text-display-sm text-ink">
                {profile.username}
              </h2>
              <p className="truncate text-sm text-mute">{profile.email}</p>
            </div>
          </div>

          {editing ? (
            <form onSubmit={handleSave} noValidate className="mt-6 flex flex-col gap-4">
              <Input
                label="Username"
                value={username}
                onChange={(e) => {
                  setUsername(e.target.value)
                  setFieldError(undefined)
                }}
                error={fieldError}
                hint="This is the name buyers see on your listings."
              />
              <div>
                <span className="text-sm font-semibold text-ink">Email</span>
                <p className="mt-1 rounded-md bg-canvas-soft px-4 py-3 text-sm text-body">
                  {profile.email}
                </p>
                <p className="mt-1 text-sm text-mute">
                  Email is managed by your sign-in and cannot be changed here.
                </p>
              </div>
              <div className="flex gap-3">
                <button
                  type="submit"
                  disabled={saving}
                  className="rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-ink transition-colors duration-150 hover:bg-primary-active disabled:opacity-50"
                >
                  {saving ? 'Saving…' : 'Save changes'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setEditing(false)
                    setUsername(profile.username)
                    setFieldError(undefined)
                  }}
                  className="rounded-xl px-5 py-2.5 text-sm font-semibold text-ink hover:bg-canvas-soft"
                >
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <>
              <dl className="mt-6 flex flex-col gap-3 text-sm">
                <div className="flex justify-between gap-4">
                  <dt className="text-mute">Username</dt>
                  <dd className="font-semibold text-ink">{profile.username}</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-mute">Email</dt>
                  <dd className="truncate font-semibold text-ink">{profile.email}</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-mute">Member since</dt>
                  <dd className="font-semibold text-ink">{agoLabel(profile.memberSinceDaysAgo)}</dd>
                </div>
              </dl>
              <button
                type="button"
                onClick={() => {
                  setEditing(true)
                  setSaved(false)
                }}
                className="mt-6 w-full rounded-xl border border-ink/20 px-5 py-2.5 text-sm font-semibold text-ink transition-colors duration-150 hover:border-ink/50"
              >
                Edit profile
              </button>
              {saved && (
                <p role="status" className="mt-3 text-sm font-semibold text-positive-deep">
                  Profile updated.
                </p>
              )}
            </>
          )}
        </section>

        <div>
          <h2 className="font-display text-display-sm">Activity</h2>
          <dl className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <StatTile label="Live listings" value={String(stats.live)} />
            <StatTile label="Sold" value={String(stats.sold)} />
            <StatTile label="Drafts" value={String(stats.drafts)} />
            <StatTile label="Orders placed" value={String(stats.orders)} />
          </dl>

          <div className="mt-4 rounded-xl bg-ink p-6 text-canvas-soft">
            <p className="text-sm">Spent on second-hand goods</p>
            <p className="mt-1 font-display text-display-md text-primary">
              {inr.format(stats.spent)}
            </p>
            <p className="mt-2 max-w-md text-sm text-canvas-soft/70">
              Every one of those items already existed. Nothing new had to be manufactured
              to put them in your home.
            </p>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <Link
              to="/my-listings"
              className="rounded-xl bg-canvas p-5 ring-1 ring-ink/10 transition-shadow duration-200 hover:shadow-md"
            >
              <p className="font-semibold text-ink">My listings</p>
              <p className="mt-1 text-sm text-body">
                Edit or remove anything you have put up for sale.
              </p>
            </Link>
            <Link
              to="/purchases"
              className="rounded-xl bg-canvas p-5 ring-1 ring-ink/10 transition-shadow duration-200 hover:shadow-md"
            >
              <p className="font-semibold text-ink">Previous purchases</p>
              <p className="mt-1 text-sm text-body">
                Everything you have bought, with the original prices.
              </p>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
