import { SignUpData, SignInData, AuthResponse, ErrorResponse } from '@/types/auth'

export async function signUpApi(data: SignUpData): Promise<AuthResponse | ErrorResponse> {
  const response = await fetch('/api/auth/signup', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })
  
  return response.json()
}

export async function signInApi(data: SignInData): Promise<AuthResponse | ErrorResponse> {
  const response = await fetch('/api/auth/signin', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })
  
  return response.json()
}

export async function signOutApi(): Promise<void> {
  await fetch('/api/auth/signout', {
    method: 'POST',
  })
}

export function isErrorResponse(response: AuthResponse | ErrorResponse): response is ErrorResponse {
  return 'error' in response
}
