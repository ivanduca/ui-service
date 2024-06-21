import { Authority } from './authority.model';

export class Token {

  constructor(public access_token: string,
              public token_type: string,
              public refresh_token: string,
              public expires_in: number,
              public scope: string,
              public auth: Authority[],
              public jti: string,
              public valid_until: number,
              public ruoli: string[],
              public ticket: string
) {}
}
