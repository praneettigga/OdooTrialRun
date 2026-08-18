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
  if (username.length < 2) throw new Error('Username needs at least 2 characters.')
  if (username.length > 40) throw new Error('Username can be at most 40 characters.')
  // Matches the schema check: char_length(btrim(username)) between 2 and 40.
  // Note: username is NOT unique in the migration, so no 23505 to handle.
  profile = { ...profile, username, avatarUrl: input.avatarUrl }
  return { ...profile }
}
