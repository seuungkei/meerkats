import { blogRepository } from "../repositories/blogRepository";
import MyCustomError from "../utils/customError";
import { IpostDetails, Icomments } from "dto/blog.dto";

class blogService {
  private readonly SPOILER_TYPES = Object.freeze({
    spoiler: 1,
    nonSpoiler: 2,
  });
  constructor(private Repository: blogRepository) {
  }

  public async createPost (userId: number, title: string, content: string, categoryId: number, spoilerInfoId: number, thumbnail: string): Promise<number> {
    return this.Repository.createPost(userId, title, content, categoryId, spoilerInfoId, thumbnail);
  }

  public async readPost (userId: number, postId: number): Promise<{postDetails: IpostDetails; comments: Icomments[];}> {
    return this.Repository.readPost(userId, postId);
  }

  public async updatePost (postId: number, userId: number, title: string, content: string, categoryId: number, spoilerInfoId: number, thumbnail: string): Promise<void> {
    const isPostExist = await this.Repository.isPostExist(postId);
    if (!isPostExist) throw new MyCustomError("this post doesn't exist, FAILED", 404);
    const isPostWrittenByThisUser = await this.Repository.isPostWrittenByThisUser(userId, postId);
    if (!isPostWrittenByThisUser) throw new MyCustomError("This post was not written by this user, FAILED", 403);
    return this.Repository.updatePost(postId, userId, title, content, categoryId, spoilerInfoId, thumbnail);
  }

  public async deletePost (postId: number, userId: number): Promise<void> {
    const isPostExist = await this.Repository.isPostExist(postId);
    if (!isPostExist) throw new MyCustomError("this post doesn't exist, FAILED", 404);
    const isPostWrittenByThisUser = await this.Repository.isPostWrittenByThisUser(userId, postId);
    if (!isPostWrittenByThisUser) throw new MyCustomError("This post was not written by this user, FAILED", 403);
    return this.Repository.deletePost(postId, userId);
  }

  public async getDataForBlogMainPage (take: number, skip: number, userId: number, categoryId: number ) {
    const [spoPostData, nonSpoPostData, category, spoilerInfo] = await Promise.all([
      this.Repository.getfilteredSpoOrNonspoPostData(take, skip, this.SPOILER_TYPES.spoiler, categoryId), 
      this.Repository.getfilteredSpoOrNonspoPostData(take, skip, this.SPOILER_TYPES.nonSpoiler, categoryId), 
      this.Repository.category(), 
      this.Repository.spoilerInfo()
    ]);
    if (!userId) return { spoPostData, nonSpoPostData, category, spoilerInfo }
    const thisUserWrittenPosts = await this.Repository.thisUserWrittenPosts(userId, take, skip)
    return { spoPostData, nonSpoPostData, thisUserWrittenPosts, category, spoilerInfo }
  }

  public async getfilteredSpoOrNonspoPostData (take: number, skip: number, spoilerInfoId: number, categoryId: number) {
    if (spoilerInfoId !== this.SPOILER_TYPES.spoiler && spoilerInfoId !== this.SPOILER_TYPES.nonSpoiler)
      throw new MyCustomError("Wrong spoilerInfoId, FAILED", 422);

    if (spoilerInfoId === this.SPOILER_TYPES.spoiler) {
      const spoPostData = await this.Repository.getfilteredSpoOrNonspoPostData(take, skip, spoilerInfoId, categoryId)
      return { spoPostData };
    }
    if (spoilerInfoId === this.SPOILER_TYPES.nonSpoiler) {
      const nonSpoPostData = await this.Repository.getfilteredSpoOrNonspoPostData(take, skip, spoilerInfoId, categoryId)
      return { nonSpoPostData };
    }
  }

  public async thisUserWrittenPosts (userId: number, take: number, skip: number) {
    const thisUserWrittenPosts = await this.Repository.thisUserWrittenPosts(userId, take, skip)
    return { thisUserWrittenPosts };
  }

  public async createOrDeletePostLike (userId: number, postId: number) {
    const isPostExist = await this.Repository.isPostExist(postId);
    if (!isPostExist) throw new MyCustomError("this post doesn't exist, FAILED", 404);
    const ispostLikeExist = await this.Repository.isPostLikeExist(userId, postId);
    if (!ispostLikeExist) {
      const statusCode = 201;
      const message = await this.Repository.createPostLike(userId, postId)
      return { message, statusCode };
    }
    const statusCode = 200;
    const message = await this.Repository.deletePostLike(userId, postId);
    return { message, statusCode };
  }

  public async createOrDeletePostScrap (userId: number, postId: number) {
    const isPostExist = await this.Repository.isPostExist(postId);
    if (!isPostExist) throw new MyCustomError("this post doesn't exist, FAILED", 404);
    const ispostLikeExist = await this.Repository.isPostScrapExist(userId, postId);
    if (!ispostLikeExist) {
      const statusCode = 201;
      const message = await this.Repository.createPostScrap(userId, postId)
      return { message, statusCode };
    }
    const statusCode = 200;
    const message = await this.Repository.deletePostScrap(userId, postId);
    return { message, statusCode };
  }

  public async createComment (userId: number, postId: number, content: string) {
    const isPostExist = await this.Repository.isPostExist(postId);
    if (!isPostExist) throw new MyCustomError("this post doesn't exist, FAILED", 404);
    return this.Repository.createComment(userId, postId, content);
  }

  public async updateComment (userId: number, postCommentId: number, content: string) {
    const isCommentExist = await this.Repository.isCommentExist(postCommentId);
    if (!isCommentExist) throw new MyCustomError("this comment doesn't exist, FAILED", 404);
    const isCommentByThisUser = await this.Repository.isCommentByThisUser(userId, postCommentId);
    if (!isCommentByThisUser) throw new MyCustomError("This comment was not written by this user, FAILED", 403);
    return this.Repository.updateComment(postCommentId, content);
  }

  public async deleteComment (userId: number, postCommentId: number) {
    const isCommentExist = await this.Repository.isCommentExist(postCommentId);
    if (!isCommentExist) throw new MyCustomError("this comment doesn't exist", 404);
    const isCommentByThisUser = await this.Repository.isCommentByThisUser(userId, postCommentId);
    if (!isCommentByThisUser) throw new MyCustomError("This comment was not written by this user, FAILED", 403);
    return this.Repository.deleteComment(postCommentId);
  }
}

export {
  blogService,
}