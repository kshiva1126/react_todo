import url from './ApiURL'

export type AuthProps = {
  email: string
  password: string
}

export type TokenProps = {
  access_token: string
  token_type: string
}

export type HeaderType = {
  'Authorization': string
}

interface AuthInterface {
  isLoggedIn(): boolean
  authenticate(props: AuthProps | any): any
  logout(): void
  storeAccessToken(props: TokenProps): void
  getHeader(): HeaderType
}

class Auth implements AuthInterface {
  async authenticate(props: AuthProps) {
    const data = await fetch(`${url}/authenticate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ ...props, name: '' })
    })
      .then(res => {
        return res.json()
      })
      .then(data => {
        this.storeAccessToken(data)

        return data
      })

    return data
  }

  logout() {
    localStorage.removeItem('accessToken')
  }

  storeAccessToken(props: TokenProps | any) {
    if ('access_token' in props) {
      localStorage.setItem('accessToken', props.access_token)
    }
  }

  getHeader() {
    const accessToken = localStorage.getItem('accessToken')

    return { 'Authorization': `Bearer ${accessToken}` }
  }

  isLoggedIn() {
    return localStorage.getItem('accessToken') !== null
  }
}

export default new Auth
