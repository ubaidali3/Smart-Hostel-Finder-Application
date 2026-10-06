import multer from "multer";

// Files disk par save nahi hongi, memory (req.files[i].buffer) me rahengi
// taake seedha Cloudinary par upload ho sakein (room controller bhi yehi use karta hai)
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Only image files are allowed"), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});

export default upload;