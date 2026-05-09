import type { Route } from 'next';

export type AppRoute =
  | '/'
  | '/auth/login'
  | '/auth/forgot-password'
  | '/auth/mfa-setup'
  | '/auth/session-expired'
  | '/dashboard'
  | '/dashboard/students'
  | '/dashboard/students/register'
  | '/dashboard/teachers'
  | '/dashboard/finance'
  | '/dashboard/analytics'
  | '/dashboard/audit-logs';

export const routes = {
  home: '/' as Route,
  login: '/auth/login' as Route,
  forgotPassword: '/auth/forgot-password' as Route,
  mfaSetup: '/auth/mfa-setup' as Route,
  sessionExpired: '/auth/session-expired' as Route,
  dashboard: {
    root: '/dashboard' as Route,
    students: '/dashboard/students' as Route,
    studentsRegister: '/dashboard/students/register' as Route,
    teachers: '/dashboard/teachers' as Route,
    finance: '/dashboard/finance' as Route,
    analytics: '/dashboard/analytics' as Route,
    auditLogs: '/dashboard/audit-logs' as Route,
  },
} as const;
