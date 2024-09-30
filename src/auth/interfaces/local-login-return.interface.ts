export interface ILocalLoginReturn {
  access_token: string;
}

export interface IJWT {
  email: string;
  sub: string;
  sessionId: string;
}

export interface IJWTOTP {
  userId: string;
  sessionId: string;
}
