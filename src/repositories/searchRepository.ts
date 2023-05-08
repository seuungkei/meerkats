import { prisma } from '../repositories/prisma';
import { Prisma, PrismaClient } from '@prisma/client';
import { blogRepository } from './blogRepository';

class searchRepository {
  private readonly prisma: PrismaClient;

  constructor(private blogRepository: blogRepository) {
    this.prisma = prisma;
  }

  blogSearch = async (postTitle: string) => {
    const postData = await this.prisma.post.findMany({
      orderBy: {
        id: "desc"
      },
      where: {
        title: {
          contains: postTitle,
        }
      },
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
        weeklyLikeCount: true
      }
    });

    return Promise.all(postData.map(async(post) => {
      const likeCount = await this.blogRepository.likeCount(post.id);
      const commentCount = await this.blogRepository.commentCount(post.id);
      return {
        ...post,
        likeCount,
        commentCount,
      };
    }));
  }
}

export {
  searchRepository
}