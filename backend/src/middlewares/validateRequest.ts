import { Request, Response, NextFunction } from 'express'
import { ZodSchema } from 'zod'

export function validateRequest(schema: ZodSchema<any>) {
  return (req: Request, res: Response, next: NextFunction) => {
    const parsed = schema.safeParse(req.body)
    if (!parsed.success) {
      return res.status(400).json({ errors: parsed.error.errors.map(e => ({ path: e.path, message: e.message })) })
    }
    // attach parsed data
    req.body = parsed.data
    return next()
  }
}
