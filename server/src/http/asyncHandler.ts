import type { NextFunction, Request, Response } from 'express'

type ErrWithStatus = Error & { statusCode?: number }

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
  const message = status === 500 ? 'Internal server error' : e.message || 'Error'
  if (status === 500) console.error(err)
  res.status(status).json({ error: { code: status === 500 ? 'INTERNAL' : 'REQUEST_ERROR', message } })
}
