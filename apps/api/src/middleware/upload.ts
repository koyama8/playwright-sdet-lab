import multer from "multer";
import { HttpError } from "../utils/http-error.js";

export const imageUpload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 1_500_000 },
  fileFilter: (_req, file, callback) => {
    if (!/^image\/(jpeg|png|webp)$/.test(file.mimetype)) {
      callback(
        new HttpError(415, "Only JPEG, PNG and WebP images are accepted"),
      );
      return;
    }
    callback(null, true);
  },
});
