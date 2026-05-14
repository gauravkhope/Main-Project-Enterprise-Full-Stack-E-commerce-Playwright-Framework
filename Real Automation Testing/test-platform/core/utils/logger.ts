export class Logger {
  static request(
    method: string,
    endpoint: string,
    payload?: unknown
  ) {
    console.log('\n========== API REQUEST ==========');

    console.log(`METHOD   : ${method}`);

    console.log(`ENDPOINT : ${endpoint}`);

    if (payload) {
      console.log(
        `PAYLOAD  : ${JSON.stringify(
          payload,
          null,
          2
        )}`
      );
    }
  }

  static async response(response: any) {
    console.log('\n========== API RESPONSE ==========');

    console.log(`STATUS : ${response.status()}`);

    try {
      const body = await response.json();

      console.log(
        `BODY   : ${JSON.stringify(
          body,
          null,
          2
        )}`
      );
    } catch {
      console.log('No JSON response body');
    }

    console.log('==================================\n');
  }
}