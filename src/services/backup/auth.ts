export interface AuthService {
  authenticate(): Promise<void>;
  isAuthenticated(): Promise<boolean>;
  disconnect(): Promise<void>;
}
