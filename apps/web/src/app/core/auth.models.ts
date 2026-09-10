export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: 'ADMIN' | 'USER';
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  tokenType: 'Bearer';
  expiresIn: number;
  session: {
    idleTimeoutSeconds: number;
    refreshTokenExpiresInDays: number;
  };
  user: AuthUser;
}

export interface ApiDataResponse<T> {
  data: T;
}

export interface StoredSession extends AuthTokens {
  remember: boolean;
  lastActivityAt: number;
}
