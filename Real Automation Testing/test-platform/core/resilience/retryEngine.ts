export class RetryEngine {
  static async retry<T>(
    action: () => Promise<T>,
    retries = 2,
    delay = 1000
  ): Promise<T> {
    let lastError;

    for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        return await action();
      } catch (error) {
        lastError = error;
        console.warn(`Retry attempt ${attempt} failed`);

        if (attempt < retries) {
          await new Promise(res => setTimeout(res, delay));
        }
      }
    }

    throw lastError;
  }
}