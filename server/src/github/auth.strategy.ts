import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-github2';

@Injectable()
export class GithubStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      clientID: 'Ov23lifnGqTReSWZ7JbH',
      clientSecret: '900bd5dcbc2fd9ad79efc94774795ba0e10c8f20',
      callbackURL: 'http://localhost:3000/auth/github/callback',
      scope: ['user:email'],
    });
  }

  async validate(accessToken: string, refreshToken: string, profile, done: Function) {
    const user = { accessToken, refreshToken, profile };
    done(null, user);
  }
}
