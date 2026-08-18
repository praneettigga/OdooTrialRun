import { useEffect, useMemo, useState, type ReactNode } from 'react'
import type { Session } from '@supabase/supabase-js'
import { getSupabase } from '../services/supabase'
import { AuthContext, type AuthContextValue } from './authContext'

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let active = true
    let unsubscribe: (() => void) | undefined

    try {
      const supabase = getSupabase()

      supabase.auth.getSession().then(({ data, error }) => {
        if (!active) return
        setSession(error ? null : data.session)
        setLoading(false)
      })

      const { data } = supabase.auth.onAuthStateChange((_event, nextSession) => {
        if (!active) return
        setSession(nextSession)
        setLoading(false)
      })
      unsubscribe = () => data.subscription.unsubscribe()
    } catch {
      // The login page already presents the configuration error on submission.
      // Keep public navigation usable when local environment variables are absent.
      setLoading(false)
    }

    return () => {
      active = false
      unsubscribe?.()
    }
  }, [])

  const value = useMemo<AuthContextValue>(
    () => ({
      session,
      loading,
      async signOut() {
        try {
          const { error } = await getSupabase().auth.signOut()
          return error?.message ?? null
        } catch (cause: unknown) {
          return cause instanceof Error ? cause.message : 'Could not sign out.'
        }
      },
    }),
    [loading, session],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
