import express from "express";
import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import {
  createAccommodation,
  getAccommodations,
  getMyAccommodations,
  getAccommodationById,
  updateAccommodation,
  deleteAccommodation,
} from "../controllers/accommodationController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

const storage = multer.memoryStorage();

const upload = multer({
  storage,
  limits: {
    fileSize: 20 * 1024 * 1024,
  },
});

function uploadToCloudinary(fileBuffer) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });

  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: "airbnb-capstone",
        resource_type: "image",
      },
      (error, result) => {
        if (error) {
          reject(error);
          return;
        }

        resolve(result);
      },
    );

    stream.end(fileBuffer);
  });
}

// creates a new accommodation by logged in users only
router.post("/", protect, createAccommodation);

router.post("/upload", protect, (req, res) => {
  upload.single("image")(req, res, async (error) => {
    try {
      if (error) {
        res.status(400).json({
          message: error.message,
        });
        return;
      }

      if (!req.file) {
        res.status(400).json({
          message: "No image uploaded",
        });
        return;
      }

      if (
        !process.env.CLOUDINARY_CLOUD_NAME ||
        !process.env.CLOUDINARY_API_KEY ||
        !process.env.CLOUDINARY_API_SECRET
      ) {
        res.status(500).json({
          message: "Cloudinary environment variables are missing",
        });
        return;
      }

      const result = await uploadToCloudinary(req.file.buffer);

      res.status(201).json({
        imageUrl: result.secure_url,
      });
    } catch (error) {
      res.status(500).json({
        message: error.message,
      });
    }
  });
});

// gets all accommodations
router.get("/", getAccommodations);

// gets accommodations created by the logged in user
router.get("/my-listings", protect, getMyAccommodations);

// gets one accommodation by id
router.get("/:id", getAccommodationById);

// updates one accommodation by id only the owner can update
router.put("/:id", protect, updateAccommodation);

// deletes one accommodation by id only the owner can delete
router.delete("/:id", protect, deleteAccommodation);

export default router;
