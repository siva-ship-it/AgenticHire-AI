import { AppError } from '../utils/api.js';

export const validate = (schema, source = 'body') => (req, _res, next) => {
  const result = schema.safeParse(req[source]);
  if (!result.success) return next(new AppError(400, result.error.issues.map((x) => x.message).join(', '), 'VALIDATION_ERROR'));
  req[source] = result.data;
  next();
};
