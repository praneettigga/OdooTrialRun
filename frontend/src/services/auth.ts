import { getSupabase } from './supabase'

type AuthResult = { error: string | null }

// getSupabase() throws when the env vars are missing, and network failures
// reject too. Both are returned as `error` rather than thrown: the contract in
// docs/SERVICES.md is `Promise<{ error }>`, and callers set their submitting
// flag back from the resolved result. A throw here leaves the submit button
// disabled on "Checking…" forever with nothing on screen to explain it.
function toMessage(cause: unknown) {
  return cause instanceof Error ? cause.message : 'Could not reach the sign-in service.'
}

export async function signIn(email: string, password: string): Promise<AuthResult> {
  try {
    const { error } = await getSupabase().auth.signInWithPassword({ email, password })
    return { error: error?.message ?? null }
  } catch (cause: unknown) {
    return { error: toMessage(cause) }
  }
}

// Supabase resolves this for unknown addresses too, on purpose — a distinct
// "no such account" reply would let anyone enumerate registered emails. Callers
// must keep their success copy non-committal.
export async function requestPasswordReset(email: string): Promise<AuthResult> {
  try {
    const { error } = await getSupabase().auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    })
    return { error: error?.message ?? null }
  } catch (cause: unknown) {
    return { error: toMessage(cause) }
  }
}

// Runs against the session the recovery link established, so it needs no old
// password. Returns the same shape as the rest of this module.
export async function updatePassword(password: string): Promise<AuthResult> {
  try {
    const { error } = await getSupabase().auth.updateUser({ password })
    return { error: error?.message ?? null }
  } catch (cause: unknown) {
    return { error: toMessage(cause) }
  }
}

export async function signUp(
  email: string,
  password: string,
  username: string,
): Promise<AuthResult & { hasSession: boolean }> {
  try {
    const { data, error } = await getSupabase().auth.signUp({
      email,
      password,
      options: { data: { username } },
    })

    return { error: error?.message ?? null, hasSession: data.session !== null }
  } catch (cause: unknown) {
    return { error: toMessage(cause), hasSession: false }
  }
}
