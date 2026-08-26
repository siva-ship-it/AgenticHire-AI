export function notFound(req, res) { res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: `Route ${req.method} ${req.path} not found` } }); }
export function errorHandler(error, _req, res, _next) {
  const status = error.status || (error.name === 'CastError' ? 404 : 500);
  res.status(status).json({ success: false, error: { code: error.code || 'INTERNAL_ERROR', message: status === 500 ? 'Internal server error' : error.message } });
}
