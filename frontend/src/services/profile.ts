import { getSupabase } from './supabase'

export type Profile = {
  id: string
  username: string
  email: string
  avatarUrl: string | null
  memberSinceDaysAgo: number
}

export type ProfileInput = {
  username: string
  avatarUrl: string | null
}

function daysAgo(createdAt: string) {
  return Math.max(0, Math.floor((Date.now() - new Date(createdAt).getTime()) / 86_400_000))
}

async function currentUser() {
  const { data, error } = await getSupabase().auth.getUser()
  if (error) throw new Error(error.message)
  if (!data.user) throw new Error('Sign in to view your profile.')
  return data.user
}

function toProfile(
  row: { id: string; username: string; avatar_url: string | null; created_at: string },
  email: string,
): Profile {
  return {
    id: row.id,
    username: row.username,
    email,
    avatarUrl: row.avatar_url,
    memberSinceDaysAgo: daysAgo(row.created_at),
  }
}

export async function getProfile(): Promise<Profile> {
  const user = await currentUser()
  const { data, error } = await getSupabase()
    .from('profiles')
    .select('id, username, avatar_url, created_at')
    .eq('id', user.id)
    .maybeSingle()

  if (error) throw new Error(error.message)
  if (!data) throw new Error('Your profile could not be found.')
  return toProfile(data, user.email ?? '')
}
export async function updateProfile(input: ProfileInput): Promise<Profile> {
  const username = input.username.trim()
  if (username.length < 2) throw new Error('Username needs at least 2 characters.')
  if (username.length > 40) throw new Error('Username can be at most 40 characters.')

  const user = await currentUser()
  const { data, error } = await getSupabase()
    .from('profiles')
    .update({ username, avatar_url: input.avatarUrl })
    .eq('id', user.id)
    .select('id, username, avatar_url, created_at')
    .single()

  if (error) throw new Error(error.message)
  return toProfile(data, user.email ?? '')
}
