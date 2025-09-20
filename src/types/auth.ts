export interface SignUpData {
  name: string
  email: string
  password: string
}

export interface SignInData {
  email: string
  password: string
}

export interface AuthResponse {
  user: {
    id: string
    name: string
    email: string
    role?: 'USER' | 'ADMIN'
  }
  token?: string
}

export interface ErrorResponse {
  error: string
}
