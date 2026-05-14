import { ZodSchema } from 'zod';

export class SchemaValidator {
  static validate(
    schema: ZodSchema,
    data: unknown
  ) {
    return schema.parse(data);
  }
}