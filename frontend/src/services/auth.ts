import { getSupabase } from './supabase'

type AuthResult = { error: string | null }

export async function signIn(email: string, password: string): Promise<AuthResult> {
  const { error } = await getSupabase().auth.signInWithPassword({ email, password })
  return { error: error?.message ?? null }
}

export async function signUp(email: string, password: string, username: string) {
  const { data, error } = await getSupabase().auth.signUp({
    email,
    password,
    options: { data: { username } },
  })

  return { error: error?.message ?? null, hasSession: data.session !== null }
}
