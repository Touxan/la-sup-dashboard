
export interface Invitation {
  id: string;
  email: string;
  token: string;
  role: 'admin' | 'user' | 'viewer';
  created_at: string;
  expires_at: string;
  created_by: string | null;
  used: boolean;
}
