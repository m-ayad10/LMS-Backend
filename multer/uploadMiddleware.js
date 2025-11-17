const multer = require("multer");
require("dotenv").config();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./uploads");
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname + "_" + Date.now());
  },
});

function imageFileFilter(req, file, cb) {
  const allowedType = process.env.ALLOWED_IMAGE_TYPES.split(",");
  if (allowedType.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new Error(
        `Image type ${
          file.mimetype
        } not allowed. Allowed types ${allowedType.join(", ")}`
      ),
      false
    );
  }
}

const imageUpload = multer({
  storage,
  fileFilter: imageFileFilter,
})

function fileFilter(req, file, cb) {
  const allowedType = process.env.ALLOWED_FILE_TYPE.split(",");
  if (allowedType.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new Error(
        `File type ${
          file.mimetype
        } not allowed. Allowed types ${allowedType.join(", ")}`
      ),
      false
    );
  }
}

const courseUpload = multer({
  storage:storage,
  fileFilter:fileFilter,
}).fields([
  { name: "thumbnail" },
  { name: "previewVideo" },
  { name: "lesson" },
]);

module.exports = { imageUpload, courseUpload };
