import { HttpError } from '../helpers/HttpError.js';

export const errorHandler = (err, req, res, next) => {
  if (err instanceof HttpError) {
    res.status(err.status).json({
      status: err.status,
      message: err.message,
      data: err,
    });
    return;
  }

  res.json({
    status: 500,
    message: 'Something went wrong',
    error: err.message,
  });
};
