import type { ZodType } from 'zod';
import type { NextFunction, Request, Response } from 'express';

export function validate(schema: ZodType, source: 'body' | 'query' | 'params' = 'body') {
  return (req: Request, res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req[source]);
    if (!result.success) {
      next(result.error);
      return;
    }
    if (source === 'query') {
      res.locals.validatedQuery = result.data;
    } else {
      req[source] = result.data;
    }
    next();
  };
}
