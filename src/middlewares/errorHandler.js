import { HttpError, isHttpError } from 'http-errors';

export const errorHandler = (err, req, res, next) => {
  if (isHttpError(err) || err instanceof HttpError) {
    const payload = {
      status: err.status,
      message: err.message,
    };

    // Если это валидация Joi — добавим массив деталей
    if (err.errors && Array.isArray(err.errors)) {
      payload.errors = err.errors.map((d) => ({
        message: d.message,
        path: d.path,
        type: d.type,
      }));
    }

    return res.status(err.status).json(payload);
  }

  res.status(500).json({
    status: 500,
    message: 'Something went wrong',
    error: err.message,
  });
};
