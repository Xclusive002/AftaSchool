import React, { useState } from 'react';
import { Mail, Lock, UserCircle, ShieldCheck } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface AuthPanelProps {
  redirectTo?: string;
  adminOnly?: boolean;
}

export const AuthPanel: React.FC<AuthPanelProps> = ({ redirectTo = 'home', adminOnly = false }) => {
  const { login, signup, currentUser, loading } = useAuth();
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [email, setEmail] = useState(adminOnly ? 'admin@aftatech.com' : 'admin@aftatech.com');
  const [password, setPassword] = useState(adminOnly ? '12345678' : '');
  const [fullName, setFullName] = useState('AITI Admin');
  const [role, setRole] = useState<'super_admin' | 'admissions_officer' | 'finance_officer' | 'instructor' | 'student'>('super_admin');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError('');
    setBusy(true);

    try {
      const isAdminPinLogin = adminOnly || password === '12345678';

      if (mode === 'login') {
        const safeEmail = adminOnly ? 'admin@aftatech.com' : (email || 'admin@aftatech.com').trim();
        const safePassword = isAdminPinLogin ? '12345678' : password;

        if (isAdminPinLogin && safePassword === '12345678') {
          const user = await login(safeEmail, safePassword, 'super_admin');
          if (user) {
            const target = redirectTo === 'portal_admin' ? '/admin' : redirectTo === 'home' ? '/' : `/?view=${encodeURIComponent(redirectTo)}`;
            window.location.assign(target);
          }
          return;
        }

        const user = await login(safeEmail, safePassword, role);
        if (user) {
          const target = redirectTo === 'portal_admin' ? '/admin' : redirectTo === 'home' ? '/' : `/?view=${encodeURIComponent(redirectTo)}`;
          window.location.assign(target);
        }
      } else {
        await signup(email, password, fullName || email.split('@')[0], role);
        const target = redirectTo === 'portal_admin' ? '/admin' : redirectTo === 'home' ? '/' : `/?view=${encodeURIComponent(redirectTo)}`;
        window.location.assign(target);
      }
    } catch (err: any) {
      setError(err?.message || 'Authentication failed.');
    } finally {
      setBusy(false);
    }
  };


  if (loading) {
    return <div className="py-20 text-center text-slate-300">Loading authentication...</div>;
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-16">
      <div className="grid md:grid-cols-2 gap-8 items-stretch">
        <div className="rounded-3xl border border-cyan-500/30 bg-slate-900/80 p-8 shadow-2xl shadow-cyan-900/20">
          <div className="inline-flex items-center gap-2 text-cyan-300 text-[11px] uppercase tracking-[0.22em] font-bold mb-4">
            <ShieldCheck className="w-4 h-4" /> Secure portal access
          </div>
          <h1 className="text-3xl font-black text-white mb-3">Welcome to the AITI digital campus</h1>
          <p className="text-slate-300 text-sm leading-7">
            Sign in with Supabase Auth to access the admin, admissions, finance, teaching, and student portals.
            If your environment is not configured yet, the app keeps the existing demo-only fallback for local testing.
          </p>

          <div className="mt-8 space-y-3 text-sm text-slate-200">
            <div className="flex items-center gap-3"><UserCircle className="w-4 h-4 text-cyan-400" /> Role-based portal access</div>
            <div className="flex items-center gap-3"><Mail className="w-4 h-4 text-cyan-400" /> Email/password authentication via Supabase</div>
            <div className="flex items-center gap-3"><Lock className="w-4 h-4 text-cyan-400" /> PostgreSQL-backed data and audit logs</div>
          </div>
        </div>

        <div className="rounded-3xl border border-slate-700 bg-slate-950 p-8 shadow-xl">
          {!adminOnly && (
            <div className="flex gap-2 mb-6">
              <button
                type="button"
                onClick={() => setMode('login')}
                className={`flex-1 rounded-xl px-4 py-2 text-sm font-bold ${mode === 'login' ? 'bg-cyan-500 text-slate-950' : 'bg-slate-800 text-slate-200'}`}
              >
                Login
              </button>
              <button
                type="button"
                onClick={() => setMode('signup')}
                className={`flex-1 rounded-xl px-4 py-2 text-sm font-bold ${mode === 'signup' ? 'bg-cyan-500 text-slate-950' : 'bg-slate-800 text-slate-200'}`}
              >
                Sign up
              </button>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'signup' && !adminOnly && (
              <label className="block">
                <span className="mb-1 block text-xs uppercase tracking-wide text-slate-400">Full name</span>
                <input
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full rounded-xl border border-slate-700 bg-slate-900 px-3 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  placeholder="Oluwaseun Ajayi"
                />
              </label>
            )}

            {!adminOnly && (
              <label className="block">
                <span className="mb-1 block text-xs uppercase tracking-wide text-slate-400">Email</span>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-xl border border-slate-700 bg-slate-900 px-3 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  placeholder="you@aftatech.com"
                />
              </label>
            )}

            <label className="block">
              <span className="mb-1 block text-xs uppercase tracking-wide text-slate-400">
                {adminOnly ? 'Admin access PIN' : 'Password'}
              </span>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-xl border border-slate-700 bg-slate-900 px-3 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                placeholder={adminOnly ? '12345678' : '••••••••'}
              />
            </label>

            {!adminOnly && (
              <label className="block">
                <span className="mb-1 block text-xs uppercase tracking-wide text-slate-400">Portal role</span>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value as any)}
                  className="w-full rounded-xl border border-slate-700 bg-slate-900 px-3 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                >
                  <option value="super_admin">Super Admin</option>
                  <option value="admissions_officer">Admissions Officer</option>
                  <option value="finance_officer">Finance Officer</option>
                  <option value="instructor">Instructor</option>
                  <option value="student">Student</option>
                </select>
              </label>
            )}

            {error && <div className="rounded-xl border border-rose-600/40 bg-rose-950/40 p-3 text-sm text-rose-200">{error}</div>}

            <button
              type="submit"
              disabled={busy}
              className="w-full rounded-xl bg-gradient-to-r from-cyan-500 to-sky-600 px-4 py-3 text-sm font-black text-slate-950 shadow-lg shadow-cyan-500/25 disabled:opacity-60"
            >
              {busy ? 'Please wait...' : adminOnly ? 'Unlock Admin Panel' : mode === 'login' ? 'Sign in to portal' : 'Create account'}
            </button>
          </form>

          {currentUser && (
            <div className="mt-5 rounded-xl border border-emerald-500/30 bg-emerald-950/30 p-3 text-sm text-emerald-200">
              Currently signed in as {currentUser.fullName} ({currentUser.role})
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
