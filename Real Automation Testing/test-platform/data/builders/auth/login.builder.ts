import { ENV } from '../../../core/utils/env';

export class LoginBuilder {
  private payload = {
    email: ENV.EMAIL,

    password: ENV.PASSWORD,
  };

  withEmail(email: string) {
    this.payload.email = email;

    return this;
  }

  withPassword(password: string) {
    this.payload.password = password;

    return this;
  }

  build() {
    return this.payload;
  }
}