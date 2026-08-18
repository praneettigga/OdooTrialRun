// Profile. Stubbed at the real signature.
//
// Only username and avatar_url are editable: those are the columns
// docs/SCHEMA.md gives `profiles`. Email is Supabase-managed on auth.users and
// is read-only here. The wireframe's broader "user other info" has no columns
// behind it — logged in docs/TASKS.md rather than invented.

import { CURRENT_USER, type Profile } from '../fixtures/account'

export type { Profile }

const delay = (ms = 260) => new Promise((resolve) => setTimeout(resolve, ms))

let profile: Profile = { ...CURRENT_USER }

export async function getProfile(): Promise<Profile> {
  await delay()
  return { ...profile }
}

export type ProfileInput = {
  username: string
  avatarUrl: string | null
}

export async function updateProfile(input: ProfileInput): Promise<Profile> {
  await delay(420)
  const username = input.username.trim()
  if (username.length < 3) throw new Error('Username needs at least 3 characters.')
  // profiles.username is unique in the schema; the real call surfaces a 23505.
  profile = { ...profile, username, avatarUrl: input.avatarUrl }
  return { ...profile }
}
