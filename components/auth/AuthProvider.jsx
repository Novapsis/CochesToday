'use client';
import { createContext, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase';
import { getOrCreateUser } from '@/actions/user'; // Import our new server action

const AuthContext = createContext({});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null); // This will be our full user profile
  const [loading, setLoading] = useState(true);
  const supabase = createClient();
  const router = useRouter();

  useEffect(() => {
    const processUser = async (session) => {
      setLoading(true);
      if (session) {
        const profile = await getOrCreateUser(session.user);
        setUser(profile);
      } else {
        setUser(null);
      }
      setLoading(false);
    };

    // Process initial session on component mount
    supabase.auth.getSession().then(({ data: { session } }) => {
      processUser(session);
    });

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        processUser(session);
      }
    );

    return () => {
      subscription?.unsubscribe();
    };
  }, [supabase.auth]);

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null); // Clear user profile on sign out
    router.replace('/');
  };

  // We don't need signIn and signUp here anymore as the AuthUI will handle it
  const value = {
    user,
    loading,
    signOut,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}