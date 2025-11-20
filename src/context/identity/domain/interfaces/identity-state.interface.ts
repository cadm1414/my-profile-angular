export interface IdentityState {
  user: {
    id: number;
    email: string;
    name: string;
    last_name: string;
    full_name: string;
  } | null;
  loading: boolean;
  error: string | null;
  success: boolean;
}
