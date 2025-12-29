import User from "../models/user.model.js";
import multer from "multer";
import path from "path";
import fs from "fs";

// Multer Storage Config
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const uploadDir = "uploads/profiles";
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        const ext = path.extname(file.originalname).toLowerCase();
        cb(null, `profile-${uniqueSuffix}${ext}`);
    }
});

// File Filter (MIME + Extension)
const fileFilter = (req, file, cb) => {
    const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];
    const allowedExt = [".jpg", ".jpeg", ".png"];
    const ext = path.extname(file.originalname).toLowerCase();

    if (allowedTypes.includes(file.mimetype) && allowedExt.includes(ext)) {
        cb(null, true);
    } else {
        cb(new Error("Only jpeg, jpg, or png images are allowed"), false);
    }
};

// Exported Multer Instance
export const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter
});

// Controller
export const uploadProfilePicture = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            if (req.file && fs.existsSync(req.file.path)) {
                fs.unlink(req.file.path, err => {
                    if (err) console.error("Failed to delete unused file:", err);
                });
            }
            return res.status(400).json({ error: "Email is required" });
        }

        if (!req.file) {
            return res.status(400).json({ error: "Please upload an image file" });
        }

        const newProfilePhotoPath = path
            .relative(process.cwd(), req.file.path)
            .replace(/\\/g, "/");

        const user = await User.findOne({ email });
        if (!user) {
            if (fs.existsSync(req.file.path)) {
                fs.unlink(req.file.path, err => {
                    if (err) console.error("Error deleting file:", err);
                });
            }
            return res.status(404).json({ error: "User not found with the provided email" });
        }

        // Delete old profile photo if exists
        if (user.profilePhoto && fs.existsSync(user.profilePhoto)) {
            fs.unlink(user.profilePhoto, err => {
                if (err) console.error("Failed to delete old profile photo:", err);
            });
        }

        user.profilePhoto = newProfilePhotoPath;
        await user.save();

        const { password, ...userData } = user.toObject();

        res.status(200).json({

            message: "Profile picture uploaded successfully",
            user: userData
        });
    } catch (error) {
        console.error("Upload error:", error);
        if (req.file && fs.existsSync(req.file.path)) {
            fs.unlink(req.file.path, err => {
                if (err) console.error("Error deleting file:", err);
            });
        }
        res.status(500).json({
            error: "Failed to upload profile picture",
            details: error.message
        });
    }
};
