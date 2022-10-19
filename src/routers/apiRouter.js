import express from "express";
import {
  registerView,
  createComment,
  deleteComment,
} from "../controllers/videoController";

const apiRouter = express.Router();

apiRouter.post("/posts/:id([0-9a-f]{24})/view", registerView);
apiRouter
  .route("/posts/:id([0-9a-f]{24})/comment")
  .post(createComment)
  .delete(deleteComment);

export default apiRouter;
