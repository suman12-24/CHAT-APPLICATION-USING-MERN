import express from "express";
import {
  allUsers,
  getUserByEmail,
  login,
  logout,
  signup,
  updateFullname,
} from "../controller/user.controller.js";
import secureRoute from "../middleware/secureRoute.js";
import {
  upload,
  uploadProfilePicture
} from "../controller/profile.controller.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);
router.get("/allusers", secureRoute, allUsers);

// Upload route — streamlined, email validated after multer
router.post(
  "/upload-profile",
  upload.single("profilePicture"),
  (req, res, next) => {
    if (!req.body.email) {
      if (req.file && fs.existsSync(req.file.path)) {
        fs.unlinkSync(req.file.path);
      }
      return res.status(400).json({ error: "Email is required" });
    }
    next();
  },
  uploadProfilePicture
);


router.get('/getDetails/:email', getUserByEmail);
router.put('/update-Fullname', updateFullname);


export default router;
