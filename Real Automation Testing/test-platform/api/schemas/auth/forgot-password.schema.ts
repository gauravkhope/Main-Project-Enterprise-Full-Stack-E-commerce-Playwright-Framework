import { z } from 'zod';

export const ForgotPasswordSchema =
  z.object({
    message: z.string(),
  });

  export const ForgotPasswordInvalidEmailSchema =
  z.object({
    message: z.string(),
  });

  export const ForgotPasswordMissingEmailSchema =
  z.object({
    message: z.string(),
  });