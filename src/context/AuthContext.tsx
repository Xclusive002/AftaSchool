import React, { createContext, useContext, useState, useEffect } from 'react';
import type { User as SupabaseUser, Session } from '@supabase/supabase-js';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { UserProfile, UserRole } from '../types';
import { api } from '../services/api';

interface AuthContextType {
  currentUser: UserProfile | null;
  loading: boolean;
  isAuthenticated: boolean;
  setRole: (role: UserRole) => void;
  switchUser: (user: UserProfile) => void;
  login: (email: string, password: string, role?: UserRole) => Promise<UserProfile>;
  signup: (email: string, password: string, fullName: string, role?: UserRole) => Promise<UserProfile>;
  logout: () => Promise<void>;
  hasPermission: (allowedRoles: UserRole[]) => boolean;
}

const normalizeRole = (value?: string): UserRole => {
  const role = value || 'student';
  if (['super_admin', 'admin', 'admissions_officer', 'finance_officer', 'instructor', 'student', 'parent'].includes(role)) {
    return role as UserRole;
  }
  return 'student';
};

const inferRoleFromEmail = (email: string): UserRole => {
  const lower = email.toLowerCase();
  if (lower.includes('admin')) return 'super_admin';
  if (lower.includes('admission')) return 'admissions_officer';
  if (lower.includes('bursary') || lower.includes('finance')) return 'finance_officer';
  if (lower.includes('instructor') || lower.includes('teacher')) return 'instructor';
  if (lower.includes('parent')) return 'parent';
  return 'student';
};

const buildLocalProfile = (user: Partial<UserProfile> & { email: string; fullName?: string; role?: string }): UserProfile => ({
  id: user.id || `usr-${Date.now()}`,
  email: user.email,
  fullName: user.fullName || user.email.split('@')[0].replace(/[._-]/g, ' '),
  phone: user.phone || '',
  whatsapp: user.whatsapp || user.phone || '',
  role: normalizeRole(user.role || 'student'),
  department: user.department,
  studentId: user.studentId,
  studentNumber: user.studentNumber,
  admissionNumber: user.admissionNumber,
  linkedStudentId: user.linkedStudentId,
  createdAt: user.createdAt || new Date().toISOString(),
});

const mapSupabaseUser = (user: SupabaseUser | null, session?: Session | null, fallbackRole?: UserRole): UserProfile | null => {
  if (!user) return null;

  const metadataRole = (user.user_metadata?.role as string | undefined) || (user.app_metadata?.role as string | undefined);
  return buildLocalProfile({
    id: user.id,
    email: user.email || '',
    fullName: user.user_metadata?.full_name || user.user_metadata?.name || user.email?.split('@')[0] || 'AITI User',
    phone: user.user_metadata?.phone || '',
    whatsapp: user.user_metadata?.whatsapp || user.user_metadata?.phone || '',
    role: normalizeRole((fallbackRole || metadataRole || inferRoleFromEmail(user.email || ''))),
    department: user.user_metadata?.department,
    studentId: user.user_metadata?.student_id,
    studentNumber: user.user_metadata?.student_number,
    admissionNumber: user.user_metadata?.admission_number,
    linkedStudentId: user.user_metadata?.linked_student_id,
    createdAt: session?.user?.created_at || new Date().toISOString(),
  });
};

const getPersistedUser = (): UserProfile | null => {
  if (typeof window === 'undefined') return null;
  const saved = window.localStorage.getItem('aiti_auth_user');
  if (!saved) return null;

  try {
    return JSON.parse(saved) as UserProfile;
  } catch {
    return null;
  }
};

const persistUser = (user: UserProfile | null) => {
  if (typeof window === 'undefined') return;
  if (user) {
    window.localStorage.setItem('aiti_auth_user', JSON.stringify(user));
  } else {
    window.localStorage.removeItem('aiti_auth_user');
  }
};

const ADMIN_ACCESS_PIN = import.meta.env.VITE_ADMIN_ACCESS_PIN || '';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(() => {
    const saved = getPersistedUser();
    if (saved) return saved;
    return null;
  });
  const [loading, setLoading] = useState(Boolean(isSupabaseConfigured));

  useEffect(() => {
    if (!supabase) {
      setLoading(false);
      return;
    }

    const loadSession = async () => {
      const { data } = await supabase.auth.getSession();
      const persisted = getPersistedUser();
      const profile = mapSupabaseUser(data.session?.user ?? null, data.session ?? null);

      if (profile) {
        setCurrentUser(profile);
        persistUser(profile);
      } else if (persisted) {
        setCurrentUser(persisted);
      } else {
        setCurrentUser(null);
      }
      setLoading(false);
    };

    loadSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      const persisted = getPersistedUser();
      if (!session?.user) {
        if (persisted) {
          setCurrentUser(persisted);
        } else {
          setCurrentUser(null);
        }
        setLoading(false);
        return;
      }

      const profile = mapSupabaseUser(session.user, session);
      if (profile) {
        setCurrentUser(profile);
        persistUser(profile);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    persistUser(currentUser);
  }, [currentUser]);

  const setRole = (role: UserRole) => {
    if (!currentUser) return;

    setCurrentUser({ ...currentUser, role });
  };

  const switchUser = (user: UserProfile) => {
    setCurrentUser(user);
  };

  const login = async (email: string, password: string, role?: UserRole): Promise<UserProfile> => {
    const safeEmail = (email || 'admin@aftatech.com').trim();

    const isAdminPinLogin = Boolean(ADMIN_ACCESS_PIN) && password === ADMIN_ACCESS_PIN;

    if (isAdminPinLogin) {
      const adminProfile = await api.authenticateAdmin(password);

      setCurrentUser(adminProfile);
      persistUser(adminProfile);
      return adminProfile;
    }

    if (supabase) {
      const { data, error } = await supabase.auth.signInWithPassword({ email: safeEmail, password });
      if (error) throw error;

      const profile = mapSupabaseUser(data.user ?? null, data.session ?? null, role || inferRoleFromEmail(safeEmail));
      if (!profile) throw new Error('Unable to resolve signed in user profile.');
      setCurrentUser(profile);
      persistUser(profile);
      return profile;
    }

    throw new Error('Supabase authentication is not configured.');
  };

  const signup = async (email: string, password: string, fullName: string, role: UserRole = 'student'): Promise<UserProfile> => {
    const safeEmail = email.trim();

    if (supabase) {
      const { data, error } = await supabase.auth.signUp({
        email: safeEmail,
        password,
        options: {
          data: {
            full_name: fullName,
            role,
            phone: '',
          },
        },
      });
      if (error) throw error;

      const profile = mapSupabaseUser(data.user ?? null, data.session ?? null, role);
      if (!profile) throw new Error('Signup created but no user profile was returned.');
      setCurrentUser(profile);
      return profile;
    }

    throw new Error('Supabase authentication is not configured.');
  };

  const logout = async () => {
    if (supabase) {
      await supabase.auth.signOut();
    }
    setCurrentUser(null);
    persistUser(null);
  };

  const hasPermission = (allowedRoles: UserRole[]): boolean => {
    if (!currentUser || !currentUser.role) return false;
    if (currentUser.role === 'super_admin') return true;
    return Array.isArray(allowedRoles) && allowedRoles.includes(currentUser.role);
  };

  return (
    <AuthContext.Provider value={{
      currentUser,
      loading,
      isAuthenticated: Boolean(currentUser),
      setRole,
      switchUser,
      login,
      signup,
      logout,
      hasPermission,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
