import Video from "../models/Video";
import User from "../models/User";
import Comment from "../models/Comment";

export const home = async (req, res) => {
  const videos = await Video.find({})
    .sort({ createdAt: "desc" })
    .populate("owner")
    .populate("comments");
  return res.render("home", { pageTitle: "Home", videos });
};

export const watch = async (req, res) => {
  const { id } = req.params;
  const videos = await Video.find({}).populate("owner");
  const video = await Video.findById(id).populate("owner").populate("comments");
  const comments = await Comment.find({ video: id }).populate("owner");
  if (!video) {
    return res.status(404).render("404", { pageTitle: "Post not found." });
  }
  video.meta.views += 1;
  await video.save();
  return res.render("watch", {
    pageTitle: video.title,
    video,
    videos,
    comments,
  });
};

export const getEdit = async (req, res) => {
  const { id } = req.params;
  const {
    user: { _id },
  } = req.session;
  const video = await Video.findById(id);
  if (!video) {
    return res.status(404).render("404", { pageTitle: "Video not found." });
  }
  if (String(video.owner) !== String(_id)) {
    req.flash("error", "You are not the owner of the video");
    return res.status(403).redirect("/");
  }
  return res.render("edit", { pageTitle: `Edit: ${video.title}`, video });
};

export const postEdit = async (req, res) => {
  const { id } = req.params;
  const {
    user: { _id },
  } = req.session;
  const { title, description } = req.body;
  const video = await Video.findById(id); //Boolean값 반환
  if (!video) {
    return res.status(404).render("404", { pageTitle: "Post not found." });
  }
  if (String(video.owner) !== String(_id)) {
    req.flash("error", "You are not the owner of the post.");
    return res.status(403).redirect("/");
  }
  await Video.findByIdAndUpdate(id, {
    title,
    description,
    // hashtags: Video.formatHashtags(hashtags),
  });
  req.flash("success", "Changes saved.");
  return res.redirect(`/videos/${id}`);
};

export const getUpload = (req, res) => {
  res.header("Cross-Origin-Embedder-Policy", "require-corp");
  res.header("Cross-Origin-Opener-Policy", "same-origin");
  return res.render("upload", { pageTitle: "Upload Video" });
};

export const postUpload = async (req, res) => {
  const {
    user: { _id },
  } = req.session;
  const { video, thumb } = req.files;
  const { title, description } = req.body;
  const isHeroku = process.env.NODE_ENV === "production";
  try {
    const newVideo = await Video.create({
      title,
      description,
      fileUrl: video ? (isHeroku ? video[0].location : video[0].path) : "",
      thumbUrl: video ? (isHeroku ? thumb[0].location : thumb[0].path) : "",
      owner: _id,
      // hashtags: Video.formatHashtags(hashtags),
    });
    const user = await User.findById(_id);
    user.videos.push(newVideo._id);
    user.save();
    req.flash("success", "Posting succeed");
    return res.redirect("/");
  } catch (error) {
    console.log(error);
    return res.status(400).render("upload", {
      pageTitle: "Posting",
      errorMessage: error_message,
    });
  }
};

export const deleteVideo = async (req, res) => {
  const { id } = req.params;
  const {
    user: { _id },
  } = req.session;
  const video = await Video.findById(id);
  if (!video) {
    return res.status(404).render("404", { pageTitle: "Post not found." });
  }
  if (String(video.owner) !== String(_id)) {
    req.flash("error", "not authorized");
    return res.status(403).redirect("/");
  }
  await Video.findByIdAndDelete(id);
  req.flash("success", "post deleted");
  return res.redirect("/");
};

export const search = async (req, res) => {
  const { keyword } = req.query;
  let videos = [];
  if (keyword) {
    videos = await Video.find({
      title: {
        $regex: new RegExp(keyword, "i"),
      },
    }).populate("owner");
  }
  return res.render("search", { pageTitle: "Search", videos });
};

export const registerView = async (req, res) => {
  const { id } = req.params;
  const video = await Video.findById(id);
  if (!video) {
    return res.sendStatus(404);
  } else {
    video.meta.views += 1;
    await video.save();
    return res.sendStatus(200);
  }
};

export const createComment = async (req, res) => {
  const {
    session: { user },
    body: { text },
    params: { id },
  } = req;
  const video = await Video.findById(id);
  if (!video) {
    return res.sendStatus(404);
  }
  const comment = await Comment.create({
    text,
    owner: user._id,
    video: id,
  });
  video.comments.push(comment._id);
  video.save();
  return res.status(201).json({
    newCommentId: comment._id,
    name: user.name,
    avatarUrl: user.avatarUrl,
  });
};

export const deleteComment = async (req, res) => {
  const { id } = req.params;
  const deleted = await Comment.findByIdAndDelete(id);
  if (deleted) {
    return res.sendStatus(200);
  } else {
    return res.sendStatus(404);
  }
};
