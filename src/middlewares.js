import multer from "multer";
import multerS3 from "multer-s3";
import aws from "aws-sdk";

const s3 = new aws.S3({
  region: "ap-northeast-2",
  accessKeyId: process.env.AWS_ID,
  secretAccessKey: process.env.AWS_SECRET,
});

const isHeroku = process.env.NODE_ENV === "production";
// const isHeroku = process.env.NODE_ENV === "development";

const s3ImageUploader = multerS3({
  s3: s3,
  bucket: "mineops-web-bucket2/images",
  acl: "public-read",
});

const s3PostUploader = multerS3({
  s3: s3,
  bucket: "mineops-web-bucket2/posts",
  acl: "public-read",
});

export const localsMiddleware = (req, res, next) => {
  res.locals.loggedIn = Boolean(req.session.loggedIn);
  res.locals.siteName = "MineOps";
  res.locals.loggedInUser = req.session.user || {};
  res.locals.isHeroku = isHeroku;
  next();
};

export const protectorMiddleware = (req, res, next) => {
  if (req.session.loggedIn) {
    return next();
  } else {
    req.flash("error", "Login first");
    return res.redirect("/login");
  }
};

export const publicOnlyMiddleware = (req, res, next) => {
  if (!req.session.loggedIn) {
    return next();
  } else {
    req.flash("error", "Not authorized");
    return res.redirect("/");
  }
};

export const avatarUpload = multer({
  dest: "uploads/avatars/",
  limits: {
    fileSize: 10000000,
  },
  // storage: isHeroku ? s3ImageUploader : undefined,
  storage: s3ImageUploader,
});

export const videoUpload = multer({
  dest: "uploads/videos/",
  limits: {
    fileSize: 20000000,
  },
  // storage: isHeroku ? s3PostUploader : undefined,
  storage: s3PostUploader,
});
