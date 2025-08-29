import { AppError } from "./index";
import { Request, Response } from "express";

export const errorMiddleware = (err: Error, req: Request, res: Response) => {
  //& If the error is an instance of AppError, it's a known operational error
  if (err instanceof AppError) {
    console.log(`Error : ${req.method} ${req.url} - ${err.message}`);

    return res.status(err.statusCode).json({
      status: "error",
      message: err.message,
      ...(err.details && { details: err.details }),
    });
  }

  //& If the error is not an instance of AppError, it's an unknown error
  console.log("Unhandled Error :", err);

  return res.status(500).json({
    message: "Something went wrong, please try again",
  });
};
