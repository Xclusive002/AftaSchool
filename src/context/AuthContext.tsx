import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile, UserRole } from '../types';

interface AuthContextType {
  currentUser: UserProfile;
  availableUsers: UserProfile[];
  setRole: (role: UserRole) => void;
  switchUser: (user: UserProfile) => void;
  login: (email: string, role?: UserRole) => void;
  logout: () => void;
  hasPermission: (allowedRoles: UserRole[]) => boolean;
}

const defaultUsers: UserProfile[] = [
  {
    id: "usr-admin-1",
    email: "admin@aftatech.com",
    fullName: "Engr. A. F. Taiwo",
    phone: "08030947468",
    whatsapp: "08030947468",
    role: "super_admin",
    department: "Executive Management",
    createdAt: "2026-01-10T09:00:00Z"
  },
  {
    id: "usr-adm-officer",
    email: "admissions@aftatech.com",
    fullName: "Mrs. K. O. Balogun",
    phone: "08024142417",
    whatsapp: "08024142417",
    role: "admissions_officer",
    department: "Admissions & Registry",
    createdAt: "2026-01-15T10:00:00Z"
  },
  {
    id: "usr-fin-officer",
    email: "bursary@aftatech.com",
    fullName: "Mr. S. A. Adeleke",
    phone: "09056119667",
    whatsapp: "09056119667",
    role: "finance_officer",
    department: "Bursary & Accounts",
    createdAt: "2026-01-18T11:00:00Z"
  },
  {
    id: "usr-inst-1",
    email: "samuel.inst@aftatech.com",
    fullName: "Samuel K. Olatunji",
    phone: "08031234567",
    whatsapp: "08031234567",
    role: "instructor",
    department: "Software Engineering",
    createdAt: "2026-02-01T08:30:00Z"
  },
  {
    id: "usr-stu-1",
    email: "oluwaseun.student@gmail.com",
    fullName: "Oluwaseun David Ajayi",
    phone: "08145678901",
    whatsapp: "08145678901",
    role: "student",
    studentNumber: "AITI/STU/2026/000001",
    admissionNumber: "AITI/ADM/2026/000001",
    studentId: "stu-1",
    createdAt: "2026-03-01T12:00:00Z"
  },
  {
    id: "usr-parent-1",
    email: "ajayi.parent@gmail.com",
    fullName: "Chief E. B. Ajayi",
    phone: "08051239876",
    role: "parent",
    linkedStudentId: "stu-1",
    createdAt: "2026-03-05T14:00:00Z"
  }
];

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('aiti_auth_user');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* ignore */ }
    }
    return defaultUsers[0]; // default to Super Admin for immediate testing
  });

  useEffect(() => {
    localStorage.setItem('aiti_auth_user', JSON.stringify(currentUser));
  }, [currentUser]);

  const setRole = (role: UserRole) => {
    const matched = defaultUsers.find(u => u.role === role);
    if (matched) {
      setCurrentUser(matched);
    } else {
      setCurrentUser(prev => ({ ...prev, role }));
    }
  };

  const switchUser = (user: UserProfile) => {
    setCurrentUser(user);
  };

  const login = (email: string, role?: UserRole) => {
    const matched = defaultUsers.find(u => u.email.toLowerCase() === email.toLowerCase()) || {
      id: `usr-${Date.now()}`,
      email,
      fullName: email.split('@')[0].toUpperCase(),
      phone: "08000000000",
      role: role || 'student',
      createdAt: new Date().toISOString()
    };
    setCurrentUser(matched);
  };

  const logout = () => {
    setCurrentUser(defaultUsers[0]);
  };

  const hasPermission = (allowedRoles: UserRole[]): boolean => {
    if (!currentUser || !currentUser.role) return false;
    if (currentUser.role === 'super_admin') return true;
    return Array.isArray(allowedRoles) && allowedRoles.includes(currentUser.role);
  };

  return (
    <AuthContext.Provider value={{
      currentUser,
      availableUsers: defaultUsers,
      setRole,
      switchUser,
      login,
      logout,
      hasPermission
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
