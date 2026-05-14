export class UserFactory {

  static generateRandomPassword(length = 12): string {
    const chars =
      "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()";
    let result = "";

    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }

    return `Pass_${result}`;
  }

  static generateInvalidUser() {
    return {
      email: `user${Date.now()}@test.com`,
      password: this.generateRandomPassword()
    };
  }
}