import express from 'express';

import { blogController } from '../controllers/blogController';
import { blogService } from '../services/blogService';
import { blogRepository } from '../repositories/blogRepository';
import { loginRequired, optionalRequired } from '../middlewares/auth';

const router = express.Router();

const getBlogDataController = new blogController(new blogService(new blogRepository()));

router.post("", loginRequired, getBlogDataController.createPost);
router.post("/main", optionalRequired, getBlogDataController.getDataForBlogMainPage);
router.post("/:postId", optionalRequired, getBlogDataController.readPost);
router.get("/:postId", getBlogDataController.getPostComments);
router.patch("/:postId", loginRequired, getBlogDataController.updatePost);
router.delete("/:postId", loginRequired, getBlogDataController.deletePost);
router.get("/main/post", getBlogDataController.getfilteredSpoOrNonspoPostData);
router.post("/main/mypost", loginRequired, getBlogDataController.thisUserWrittenPosts);
router.post("/postLike/:postId", loginRequired, getBlogDataController.createOrDeletePostLike);
router.post("/postScrap/:postId", loginRequired, getBlogDataController.createOrDeletePostScrap);
router.post("/postComment/:postId", loginRequired, getBlogDataController.createComment);
router.patch("/postComment/:postCommentId", loginRequired, getBlogDataController.updateComment);
router.delete("/postComment/:postCommentId", loginRequired, getBlogDataController.deleteComment);
router.get("/categoryList", getBlogDataController.getCategoryList);

export {
  router as blogRouter,
}