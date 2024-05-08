export type Token = {
    id: number;
    token: string;
    date: Date;
    active: boolean;
    userId: number;
  }

export type User = {
  id: number;
  githubId: number;
  name: string;
  tokens: Token[];
}