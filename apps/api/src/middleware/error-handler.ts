import type { ErrorRequestHandler } from "express";
import multer from "multer";
import { Prisma } from "@prisma/client";
import { ZodError } from "zod";
import { HttpError } from "../utils/http-error.js";

export const errorHandler: ErrorRequestHandler = (error, req, res, _next) => {
  if (error instanceof ZodError) {
    res
      .status(400)
      .json({
        error: {
          code: "VALIDATION_ERROR",
          message: "Invalid request",
          details: error.issues,
          requestId: res.locals.requestId,
        },
      });
    return;
  }
  if (error instanceof HttpError) {
    res
      .status(error.statusCode)
      .json({
        error: {
          code: "REQUEST_ERROR",
          message: error.message,
          details: error.details,
          requestId: res.locals.requestId,
        },
      });
    return;
  }
  if (error instanceof multer.MulterError) {
    const fileTooLarge = error.code === "LIMIT_FILE_SIZE";
    res
      .status(fileTooLarge ? 413 : 400)
      .json({
        error: {
          code: "UPLOAD_ERROR",
          message: fileTooLarge
            ? "Image must be at most 1.5 MB"
            : "Invalid image upload",
          requestId: res.locals.requestId,
        },
      });
    return;
  }
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (error.code === "P2002") {
      res
        .status(409)
        .json({
          error: {
            code: "CONFLICT",
            message: "A record with the same unique value already exists",
            requestId: res.locals.requestId,
          },
        });
      return;
    }
    if (error.code === "P2025") {
      res
        .status(404)
        .json({
          error: {
            code: "NOT_FOUND",
            message: "Record not found",
            requestId: res.locals.requestId,
          },
        });
      return;
    }
  }
  console.error(`[${req.method} ${req.originalUrl}]`, error);
  res
    .status(500)
    .json({
      error: {
        code: "INTERNAL_ERROR",
        message: "Internal server error",
        requestId: res.locals.requestId,
      },
    });
};
