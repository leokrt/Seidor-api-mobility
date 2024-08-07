import { Request, Response, NextFunction } from "express";
import { HttpException } from "../utils/errors";

function errorHandler(
  err: unknown,
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (err instanceof HttpException) {
    res.status(err.statusCode).json({ message: err.message });
  } else if (err instanceof Error) {
    res.status(500).json({ message: "Server error", error: err.message });
  } else {
    res.status(500).json({ message: "Server error" });
  }
}

export default errorHandler;
