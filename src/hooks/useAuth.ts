import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { User, Session } from '@supabase/supabase-js';

export function useAuth() {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        setSession(session);
        setUser(session.user);
      } else {
        const demoUserStr = typeof window !== 'undefined' ? localStorage.getItem('bossgt_demo_user') : null;
        if (demoUserStr) {
          try {
            const demoObj = JSON.parse(demoUserStr);
            const mockUser = {
              id: 'demo_user_id',
              email: demoObj.email || 'developer@bossgt.studio',
              user_metadata: { full_name: demoObj.fullName || 'BOSSgt Developer' }
            } as unknown as User;
            setUser(mockUser);
            setSession({ user: mockUser } as unknown as Session);
          } catch (e) {}
        }
      }
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        setSession(session);
        setUser(session.user);
      } else {
        const demoUserStr = typeof window !== 'undefined' ? localStorage.getItem('bossgt_demo_user') : null;
        if (demoUserStr) {
          try {
            const demoObj = JSON.parse(demoUserStr);
            const mockUser = {
              id: 'demo_user_id',
              email: demoObj.email || 'developer@bossgt.studio',
              user_metadata: { full_name: demoObj.fullName || 'BOSSgt Developer' }
            } as unknown as User;
            setUser(mockUser);
            setSession({ user: mockUser } as unknown as Session);
          } catch (e) {}
        } else {
          setSession(null);
          setUser(null);
        }
      }
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signOut = async () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('bossgt_demo_user');
      document.cookie = "bossgt_session=; path=/; max-age=0; SameSite=Lax";
    }
    try {
      await supabase.auth.signOut();
    } catch (e) {}
    setSession(null);
    setUser(null);
    if (typeof window !== 'undefined') {
      window.location.href = '/login';
    }
  };

  return {
    session,
    user,
    loading,
    signOut
  };
}
