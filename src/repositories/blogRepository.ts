import { prisma } from '../repositories/prisma';
import { PrismaClient } from "@prisma/client"
import MyCustomError from "../utils/customError"
import { IpostDetails, Icomments, IfilteredPostData, IthisUserWrittenPosts } from "../dto/blog.dto";

class blogRepository {
  private readonly prisma: PrismaClient;
  constructor() {
    this.prisma = prisma;
  };

  async createPost (userId: number, title: string, content: string, categoryId: number, spoilerInfoId: number, thumbnail: string): Promise<number> {
    const createPost = await this.prisma.post.create({
      data : {
        user_id: userId,
        title: title,
        content: content,
        category_id: categoryId,
        spoiler_info_id: spoilerInfoId,
        thumbnail: thumbnail,
        weeklyLikeCount: 0,
      }
    })
    return createPost.id;
  };

  async readPost (userId: number, postId: number): Promise<{postDetails: IpostDetails;}> {
    const postDetails: IpostDetails | null = await this.prisma.post.findUnique({
      where: {
        id: postId,
      },
      select: {
        id: true,
        title: true,
        content: true,
        created_at: true,
        category : {
          select: {
            id: true,
            name: true
          }
        },
        spoiler_info_id: true,
        user: {
          select: {
            id: true,
            nickname: true,
          }
        }
      },
    });

    if (!postDetails) throw new MyCustomError("this post doesn't exist, FAILED", 404);

    const likeCount = await this.likeCount(postId);
    const scrapCount = await this.scrapCount(postId);

    postDetails.likeCount = likeCount;
    postDetails.isLikedByThisUser = false;
    postDetails.scrapCount = scrapCount;
    postDetails.isScrapedByThisUser = false;

    if (userId) {
      const isLikedByThisUser: boolean = await this.prisma.postLike.findFirst({
        where: {
          user_id: userId,
          post_id: postId,
        }
      }) !== null;

      const isScrapedByThisUser: boolean = await this.prisma.postScrap.findFirst({
        where: {
          user_id: userId,
          post_id: postId,
        }
      }) !== null;
      postDetails.isLikedByThisUser = isLikedByThisUser;
      postDetails.isScrapedByThisUser = isScrapedByThisUser;
    }

    return { postDetails };
  }

  async getPostComments (postId: number) {
    return (await this.prisma.postComment.findMany({
    where: {
      post_id: postId,
    },
    orderBy: {
      created_at: 'asc',
    },
    select: {
      id: true,
      content: true,
      created_at: true,
      user: {
        select: {
          id: true,
          nickname: true,
        }
      }
    }
  }))?.map((data: { id: number, content: string, created_at: Date, user: { id: number, nickname: string | null}}) => {
      return { commentId: data.id, content: data.content, created_at: data.created_at, user: data.user };
    })
  }

  async updatePost (postId: number, userId: number, title: string, content: string, categoryId: number, spoilerInfoId: number, thumbnail: string): Promise<void> {
    await this.prisma.$transaction([
      this.prisma.post.updateMany({
        where: {
          id: postId,
          user_id: userId,
        },
        data: {
          title: title,
          content: content,
          category_id: categoryId,
          spoiler_info_id: spoilerInfoId,
          thumbnail: thumbnail,
        },
      }),
    ])
  }

  async deletePost (postId: number, userId: number): Promise<void> {
    await this.prisma.$transaction([
      this.prisma.postLike.deleteMany({
        where: {
          post_id: postId
        }
      }),
      this.prisma.postComment.deleteMany({
        where: {
          post_id: postId
        }
      }),
      this.prisma.post.deleteMany({
        where: {
          id: postId,
          user_id: userId
        }
      })
    ])
  };

  async getfilteredSpoOrNonspoPostData(take: number, skip: number, spoilerInfoId: number, categoryId: number): Promise<IfilteredPostData[]> {
    const prismaQeury: any = {
      where: {
        spoiler_info_id: spoilerInfoId
      },
      take: take,
      skip: skip,
      orderBy: [
        {
          weeklyLikeCount: 'desc'
        },
        {
          id: 'desc'
        },
      ],
      select: {
        id: true,
        title: true,
        user: {
            select:{
                nickname: true,
            }
        },
        category_id: true,
        thumbnail: true,
        spoiler_info_id: true,
        created_at: true,
        weeklyLikeCount: true,
      }
    }

    if (categoryId) prismaQeury.where.category_id = categoryId;

    const postData = await this.prisma.post.findMany(prismaQeury);

    const result = await Promise.all(postData.map(async (data) => {
      const likeCount = await this.likeCount(data.id);
      const commentCount = await this.commentCount(data.id);
      return {
        ...data,
        likeCount,
        commentCount,
      };
    }));
    return result;
  }

  async category() {
    return this.prisma.category.findMany({
      orderBy: {
        id: 'asc',
      },
      select:{
        id: true,
        name: true,
      }
    })
  }

  async spoilerInfo() {
    return this.prisma.spoilerInfo.findMany({
      orderBy: {
        id: 'asc',
      },
      select:{
        id: true,
        name: true,
      }
    })
  }

  async thisUserWrittenPosts(userId: number, take: number, skip: number): Promise<IthisUserWrittenPosts[]> {
    const thisUserWrittenPosts = await this.prisma.post.findMany({
      where: {
        user_id: userId,
      },
      take: take,
      skip: skip,
      orderBy: [
        {
          id: 'desc'
        },
      ],
      select: {
        id: true,
        title: true,
        user: {
            select:{
                nickname: true,
            }
        },
        category_id: true,
        thumbnail: true,
        spoiler_info_id: true,
        created_at: true,
      }
    })

    const result = await Promise.all(thisUserWrittenPosts.map(async (data) => {
      const likeCount = await this.likeCount(data.id);
      const commentCount = await this.commentCount(data.id);
      return {
        ...data,
        likeCount,
        commentCount,
      };
    }));
    return result;
  }

  async createPostLike(userId: number, postId: number): Promise<string> {
    await this.prisma.postLike.create({
      data: {
        user_id: userId,
        post_id: postId,
      }
    })
    return "createPostLike SUCCESS";
  }

  async deletePostLike(userId: number, postId: number): Promise<string> {
    await this.prisma.$transaction([
      this.prisma.postLike.deleteMany({
        where: {
          post_id: postId,
          user_id: userId
        }
      })
    ])
    return "deletePostLike SUCCESS";
  }

  async createPostScrap(userId: number, postId: number): Promise<string> {
    await this.prisma.postScrap.create({
      data: {
        user_id: userId,
        post_id: postId,
      }
    })
    return "createPostScrap SUCCESS";
  }

  async deletePostScrap(userId: number, postId: number): Promise<string> {
    await this.prisma.$transaction([
      this.prisma.postScrap.deleteMany({
        where: {
          post_id: postId,
          user_id: userId
        }
      })
    ])
    return "deletePostScrap SUCCESS";
  }

  async createComment(userId: number, postId: number, content: string): Promise<void> {
    await this.prisma.postComment.create({
      data: {
        user_id: userId,
        post_id: postId,
        content: content
      }
    })
  }

  async updateComment(postCommentId: number, content: string): Promise<void> {
    await this.prisma.$transaction([
      this.prisma.postComment.update({
        where: {
          id: postCommentId
        },
        data: {
          content: content
        }
      })
    ])
  }

  async deleteComment(postCommentId: number): Promise<void> {
    await this.prisma.$transaction([
      this.prisma.postComment.delete({
        where: {
          id: postCommentId
        }
      })
    ])
  }

  async likeCount (postId: number): Promise<number> {
    return this.prisma.postLike.count({
      where: {
        post_id: postId,
      }
    });
  };

  async scrapCount (postId: number): Promise<number> {
    return this.prisma.postScrap.count({
      where: {
        post_id: postId,
      }
    });
  };

  async commentCount (postId: number): Promise<number> {
    return this.prisma.postComment.count({
      where: {
        post_id: postId,
      }
    });
  };

  async isPostWrittenByThisUser (userId: number, postId: number): Promise<boolean> {
    return await this.prisma.post.findFirst({
      where: {
        id: postId,
        user_id: userId
      }
    }) !== null
  };

  async isCommentByThisUser(userId: number, postCommentId: number): Promise<boolean> {
    return await this.prisma.postComment.findFirst({
      where: {
        id: postCommentId,
        user_id: userId
      }
    }) !== null;
  }

  async isPostScrapExist(userId: number, postId: number): Promise<boolean> {
    return await this.prisma.postScrap.findFirst({
      where: {
        user_id: userId,
        post_id: postId
      }
    }) !== null;
  }

  async isPostLikeExist(userId: number, postId: number): Promise<boolean> {
    return await this.prisma.postLike.findFirst({
      where: {
        user_id: userId,
        post_id: postId
      }
    }) !== null;
  }

  async isCommentExist(postCommentId: number): Promise<boolean> {
    return await this.prisma.postComment.findUnique({
      where: {
        id: postCommentId
      }
    }) !== null;
  }

  async isPostExist (postId: number): Promise<boolean> {
    return await this.prisma.post.findUnique({
      where: {
        id: postId
      }
    }) !== null
  };
}

export {
  blogRepository,
}