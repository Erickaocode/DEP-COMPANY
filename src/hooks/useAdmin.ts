import { useEffect, useState } from 'react'
import type { Session } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase'

type AdminState = {
  loading: boolean
  session: Session | null
  isAdmin: boolean
}

// Sessão do Supabase Auth + verificação na tabela `admins`.
// A segurança de verdade está nas políticas RLS do banco (supabase/policies.sql);
// isto só decide o que mostrar na tela.
export function useAdmin(): AdminState {
  const [state, setState] = useState<AdminState>({ loading: true, session: null, isAdmin: false })

  useEffect(() => {
    let active = true

    async function check(session: Session | null) {
      if (!session) {
        if (active) setState({ loading: false, session: null, isAdmin: false })
        return
      }
      const { data } = await supabase
        .from('admins')
        .select('user_id')
        .eq('user_id', session.user.id)
        .maybeSingle()
      if (active) setState({ loading: false, session, isAdmin: !!data })
    }

    supabase.auth.getSession().then(({ data }) => check(data.session))
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      // setTimeout evita chamar o Supabase dentro do callback de auth (pode travar)
      setTimeout(() => check(session), 0)
    })

    return () => {
      active = false
      listener.subscription.unsubscribe()
    }
  }, [])

  return state
}

export async function signOut() {
  await supabase.auth.signOut()
}
