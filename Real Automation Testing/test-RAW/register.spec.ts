import { test, expect } from '@playwright/test';
import { Redis } from "@upstash/redis";

declare const process: {
  env: Record<string, string | undefined>;
};

let redis: Redis | null = null;

function getRedisClient() {
  const url = "https://fine-peacock-66182.upstash.io";
  const token = "gQAAAAAAAQKGAAIncDE5Yzg5YTdjMmU1NmY0Mjk1OGFkOWE4NWM5ODU3MWExMXAxNjYxODI";

  if (!url || !token) {
    throw new Error(
      'Missing UPSTASH_REDIS_REST_URL or UPSTASH_REDIS_REST_TOKEN environment variables.'
    );
  }

  if (!redis) {
    redis = new Redis({ url, token });
  }

  return redis;
}

export async function getOtpFromRedis(email: string) {
  const data = await getRedisClient().get(`otp:${email}`);

  if (!data) throw new Error('OTP not found');

  if (typeof data === 'object') {
    const otp = (data as { otp?: unknown }).otp;
    if (typeof otp === 'string' && otp.length > 0) return otp;
  }

  if (typeof data === 'string') {
    try {
      const parsed = JSON.parse(data) as { otp?: unknown };
      if (typeof parsed.otp === 'string' && parsed.otp.length > 0) {
        return parsed.otp;
      }
    } catch {
      // If OTP is stored as plain text instead of JSON, use it directly.
      if (data.length > 0) return data;
    }
  }

  throw new Error('OTP format is invalid in Redis');
}

test('Empty register shows inline errors', async ({ page }) => {
  await page.goto('/register');

  await page.getByTestId('auth-send-otp-btn').click();

  await expect(page.getByText('Name is required')).toBeVisible();
  await expect(page.getByText('Email is required')).toBeVisible();
});

test('Register with already have account validation', async ({ page }) => {
  await page.goto('/register');

  await page.getByTestId("auth-name-input").fill("Gaurav")
  await page.getByTestId("auth-email-input").fill("gauravkhope31@gmail.com")
  await page.getByTestId('auth-send-otp-btn').click();

  await expect(page.getByText('This email is already registered')).toBeVisible();
});


test('OTP form detail validation', async ({ page }) => {
  await page.goto('/register');

  await page.getByTestId("auth-name-input").fill("Gaurav")
  await page.getByTestId("auth-email-input").fill("gauravkhope31@gmail.com")
  await page.getByTestId('auth-send-otp-btn').click();

  await expect(page.getByTestId('otp-form')).toBeVisible();
await expect(page.getByTestId('otp-email')).toBeVisible();
await expect(page.getByTestId('otp-expiry-text')).toBeVisible();

});

test('Empty OTP shows required error', async ({ page }) => {
     await page.goto('/register');

  await page.getByTestId("auth-name-input").fill("Gaurav")
  await page.getByTestId("auth-email-input").fill("gauravkhope31@gmail.com")
  await page.getByTestId('auth-send-otp-btn').click();
  await page.getByTestId('otp-verify-btn').click();

  await expect(page.getByText(/OTP is required/i)).toBeVisible();
});

test('OTP less than 6 digits shows validation error', async ({ page }) => {
  await page.goto('/register');

  await page.getByTestId("auth-name-input").fill("Gaurav")
  await page.getByTestId("auth-email-input").fill("gauravkhope31@gmail.com")
  await page.getByTestId('auth-send-otp-btn').click();
  await page.getByTestId('otp-input').fill('123');
  await page.getByTestId('otp-verify-btn').click();

  await expect(page.getByText("Enter the 6-digit OTP")).toBeVisible();
});

test('OTP should accept only numbers', async ({ page }) => {
     await page.goto('/register');

  await page.getByTestId("auth-name-input").fill("Gaurav")
  await page.getByTestId("auth-email-input").fill("gauravkhope31@gmail.com")
  await page.getByTestId('auth-send-otp-btn').click();
  await page.getByTestId('otp-input').fill('abc123');

  const value = await page.getByTestId('otp-input').inputValue();

  // ensure only digits
  expect(/^\d*$/.test(value)).toBeTruthy();
});

test('Remaining attempts decrease correctly', async ({ page }) => {
  await page.goto('/register');

  await page.getByTestId("auth-name-input").fill("Gaurav")
  await page.getByTestId("auth-email-input").fill("gauravkhope31@gmail.com")
  await page.getByTestId('auth-send-otp-btn').click();
  for (let i = 3; i >= 0; i--) {
    await page.getByTestId('otp-input').fill(`12${i}45${i+1}`);
    await page.getByTestId('otp-verify-btn').click();

    if (i > 1) {
      await expect(page.getByText(`Invalid OTP. Remaining attempts: ${i-1}`))
        .toBeVisible();
    }
    else if (i === 1) {
        await expect(page.getByText("Maximum attempts exceeded. Please request a new OTP."))
        .toBeVisible();
    }
    else{
        await expect(page.getByText("Too many failed attempts. Try again after 10 minutes."))
        .toBeVisible();
    }
  }
  await page.goto('/register');
  await page.getByTestId("auth-name-input").fill("Gaurav")
  await page.getByTestId("auth-email-input").fill("gauravkhope31@gmail.com")
  await page.getByTestId('auth-send-otp-btn').click();
   await expect(page.getByText("Too many failed attempts. Try again after 10 minutes."))
        .toBeVisible();
});

test('Valid OTP flow', async ({ page }) => {

    
  const email = "gauravkhope31@gmail.com";

  await page.goto('/register');

  await page.getByTestId('auth-name-input').fill('Gaurav');
  await page.getByTestId('auth-email-input').fill(email);
  await page.getByTestId('auth-send-otp-btn').click();
 
  await page.waitForTimeout(4000); // wait for OTP to be generated and stored in Redis
  // 🔥 Get OTP directly from Redis
  const otp = await getOtpFromRedis(email);

  await page.getByTestId('otp-input').fill(otp);
  await page.getByTestId('otp-verify-btn').click();

  await expect(page.getByTestId('auth-password-input')).toBeVisible();
});

test('Valid Resend button  flow', async ({ page }) => {
  test.setTimeout(5*60*1000); // increase timeout to 2 minutes for this test
  const email = "gauravkhope62@gmail.com";

  await page.goto('/register');

  await page.getByTestId('auth-name-input').fill('Gaurav');
  await page.getByTestId('auth-email-input').fill(email);
  await page.getByTestId('auth-send-otp-btn').click();
  await page.waitForTimeout(3000); // wait for OTP to be generated and stored in Redis
  // 🔥 Get OTP directly from Redis
  const previousOtp = await getOtpFromRedis(email);
  await expect(page.getByTestId("otp-resend-container").locator("p")).toContainText("Didn't get the OTP?")
  const otpResendTimer =  page.getByTestId("otp-resend-timer");
  await expect(otpResendTimer).toBeVisible();
  await expect(otpResendTimer).toHaveText(/Resend OTP in \d+s/);
 for(let i=1; i<3; i++){
  await page.waitForTimeout(61*1000); // wait for timer to expire 
  await expect(page.getByRole("button", { name: "Resend OTP" })).toBeVisible();
  await otpResendTimer.click();
  await expect(page.getByText("A new OTP has been sent to your Gmail."))
        .toBeVisible({ timeout: 10000 });
   await page.waitForTimeout(3000); // wait for OTP to be generated and stored in Redis
    const currentOtp = await getOtpFromRedis(email);

    // ✅ validate new OTP is different
    expect(currentOtp).not.toBe(previousOtp);

    // update for next iteration
    console.log(`OTP ${i}: ${currentOtp}`);
 }
 await otpResendTimer.click();
await expect(page.getByText("Too many OTP requests. Please try again later.")).toBeVisible();
 
});


