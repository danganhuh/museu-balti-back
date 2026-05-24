import type { NextFunction, Request, Response } from 'express'

type ErrWithStatus = Error & { statusCode?: number }

const STATUS_TO_CODE: Record<number, string> = {
  400: 'BAD_REQUEST',
  401: 'UNAUTHORIZED',
  403: 'FORBIDDEN',
  404: 'NOT_FOUND',
  409: 'CONFLICT',
  422: 'UNPROCESSABLE_ENTITY',
}

export function asyncHandler(
  fn: (req: Request, res: Response, next: NextFunction) => Promise<void>,
): (req: Request, res: Response, next: NextFunction) => void {
  return (req, res, next) => {
    void fn(req, res, next).catch(next)
  }
}

export function apiErrorHandler(err: unknown, _req: Request, res: Response, _next: NextFunction): void {
  const e = err as ErrWithStatus
  const status = typeof e.statusCode === 'number' ? e.statusCode : 500
  const code = STATUS_TO_CODE[status] ?? (status >= 500 ? 'INTERNAL_ERROR' : 'REQUEST_ERROR')
  const message = status >= 500 ? 'Internal server error' : e.message || 'Error'
  if (status >= 500) console.error(err)
  res.status(status).json({ error: { code, message } })
}
