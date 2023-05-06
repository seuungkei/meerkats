import { Request, Response } from 'express';
import { ParamsDictionary, Query } from 'express-serve-static-core';
import { blogService } from '../services/blogService';
import { IReqUser } from '../dto/auth.dto';
import { catchAsync } from '../middlewares/error';
import MyCustomError from '../utils/customError';
import { Ireqdata } from '../dto/blog.dto';

class blogController {
  constructor (private Service: blogService) {
  }

  public createPost = catchAsync(async (req: Request<{}, {}, Ireqdata, {}> & IReqUser, res: Response) => {
    const userId = req.user;
    const {title, content, categoryId, spoilerInfoId, thumbnail} = req.body;

    if (!userId) throw new MyCustomError("userId must be defined, FAILED", 500);
    if (!title || !content || !categoryId || !spoilerInfoId || !thumbnail)
      throw new MyCustomError("somthing not exist, FAILED", 400);

    await this.Service.createPost(userId, title, content, categoryId, spoilerInfoId, thumbnail);
    return res.status(201).json({ message: "createPost SUCCESS" });
  });

  public readPost = catchAsync(async (req: Request<ParamsDictionary, {}, {}, {}> & IReqUser, res: Response) => {
      const userId = req.user;
      const { postId } = req.params;

      if (!postId) throw new MyCustomError("postId must be defined, FAILED", 400);
      
      const getPostData = await this.Service.readPost(Number(userId), Number(postId));
      return res.status(200).json({ data: getPostData });    
  });

  public updatePost = catchAsync(async (req: Request<ParamsDictionary, {}, Ireqdata, {}> & IReqUser, res: Response) => {
    const userId = req.user;
    const { postId } = req.params;
    const { title, content, categoryId, spoilerInfoId, thumbnail } = req.body;

    if (!userId) throw new MyCustomError("userId must be defined, FAILED", 500);
    if (!postId) throw new MyCustomError("postId must be defined, FAILED", 400);
    if (!title || !content || !categoryId || !spoilerInfoId || !thumbnail)
      throw new MyCustomError("somthing not exist error, FAILED", 400);    

    await this.Service.updatePost(Number(postId), userId, title, content, categoryId, spoilerInfoId, thumbnail);
    return res.status(201).json({ message: "updatePost SUCCESS" });   
  });

  public deletePost = catchAsync(async (req: Request<ParamsDictionary, {}, { userId: number }, {}> & IReqUser, res: Response) => {
    const userId = req.user;
    const { postId } = req.params;

    if (!userId) throw new MyCustomError("userId must be defined, FAILED", 500);
    if (!postId) throw new MyCustomError("postId must be defined, FAILED", 400);

    await this.Service.deletePost(Number(postId), userId);
    return res.status(200).json({ message: "deletePost SUCCESS" }); 
  });

  public getDataForBlogMainPage = catchAsync(async (req: Request<{}, {}, {}, Query> & IReqUser, res: Response) => {
    const userId = req.user;
    const { take, skip, categoryId } = req.query;

    if (!take || !skip) throw new MyCustomError("take & skip must be defined, FAILED", 400);
    
    const data = await this.Service.getDataForBlogMainPage(Number(take), Number(skip), Number(userId), Number(categoryId), );
    return res.status(200).json({ data: data });
  });

  public getfilteredSpoOrNonspoPostData = catchAsync(async (req: Request<{}, {}, {}, Query>, res: Response) => {
    const { take, skip, spoilerInfoId, categoryId} = req.query;

    if (!take || !skip) throw new MyCustomError("take & skip must be defined, FAILED", 400);
    if (!spoilerInfoId) throw new MyCustomError("spoilerInfoId must be defined, FAILED", 400);
    
    const data = await this.Service.getfilteredSpoOrNonspoPostData(Number(take), Number(skip), Number(spoilerInfoId), Number(categoryId));
    return res.status(200).json({ data: data });
  });

  public thisUserWrittenPosts = catchAsync(async(req: Request<{}, {}, {}, Query> & IReqUser, res: Response) => {
    const userId = req.user;
    const { take, skip } = req.query;

    if (!userId) throw new MyCustomError("userId must be defined, FAILED", 500);
    if (!take || !skip) throw new MyCustomError("take & skip must be defined, FAILED", 400);

    const data = await this.Service.thisUserWrittenPosts(Number(userId),Number(take), Number(skip));
    return res.status(200).json({ data: data });
  });

  public createOrDeletePostLike = catchAsync(async (req: Request<ParamsDictionary, {}, {}, {}> & IReqUser, res: Response) => {
    const userId = req.user;
    const { postId } = req.params;

    if (!userId) throw new MyCustomError("userId must be defined, FAILED", 500);
    if (!postId) throw new MyCustomError("postId must be defined, FAILED", 400);

    const { message, statusCode } = await this.Service.createOrDeletePostLike(userId, Number(postId));
    return res.status(statusCode).json({ message: message });   
  });

  public createOrDeletePostScrap = catchAsync(async (req: Request<ParamsDictionary, {}, {}, {}> & IReqUser, res: Response) => {
    const userId = req.user;
    const { postId } = req.params;

    if (!userId) throw new MyCustomError("userId must be defined, FAILED", 500);
    if (!postId) throw new MyCustomError("postId must be defined, FAILED", 400);

    const { message, statusCode } = await this.Service.createOrDeletePostScrap(userId, Number(postId));
    return res.status(statusCode).json({ message: message });   
  });

  public createComment = catchAsync(async(req: Request<ParamsDictionary, {}, {content: string}, {}> & IReqUser, res: Response) => {
    const userId = req.user;
    const { postId } = req.params;
    const { content } = req.body;

    if (!userId) throw new MyCustomError("userId must be defined, FAILED", 500);
    if (!postId) throw new MyCustomError("postId must be defined, FAILED", 400);
    if (!content) throw new MyCustomError("content must be defined, FAILED", 400);

    await this.Service.createComment(userId, Number(postId), content);
    return res.status(201).json({ message: "createComment SUCCESS"})
  });

  public updateComment = catchAsync(async(req: Request<ParamsDictionary, {}, {content: string}, {}> & IReqUser, res: Response) => {
    const userId = req.user;
    const { postCommentId } = req.params;
    const { content } = req.body;

    if (!userId) throw new MyCustomError("userId must be defined, FAILED", 500);
    if (!postCommentId) throw new MyCustomError("postCommentId must be defined, FAILED", 400);
    if (!content) throw new MyCustomError("content must be defined, FAILED", 400);

    await this.Service.updateComment(userId, Number(postCommentId), content);
    return res.status(201).json({ message: "updateComment SUCCESS"});
  });

  public deleteComment = catchAsync(async(req: Request<ParamsDictionary, {}, {}, {}> & IReqUser, res: Response) => {
    const userId = req.user;
    const { postCommentId } = req.params;

    if (!userId) throw new MyCustomError("userId must be defined, FAILED", 500);
    if (!postCommentId) throw new MyCustomError("postCommentId must be defined, FAILED", 400);

    await this.Service.deleteComment(userId, Number(postCommentId));
    return res.status(200).json({ message: "deleteComment SUCCESS"});
  });
}

export {
  blogController,
}