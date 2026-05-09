export type AuthenticatedUser = {
  id: string;
  email: string;
  roles: string[];
  permissions: string[];
  isMfaEnabled: boolean;
};
