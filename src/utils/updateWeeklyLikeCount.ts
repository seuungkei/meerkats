import { PrismaClient } from "@prisma/client"
import schedule, { Job } from "node-schedule";

// 주기적으로 실행할 함수 정의
async function updateWeeklyLikeCount() {
  const prisma = new PrismaClient();
  
  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

  await updateWeeklyLikeCountPrisma();

  async function updateWeeklyLikeCountPrisma(): Promise<void> {
    const getPostWithLikeCount: {post_id: number; likesCount: number;}[] = await Promise.all((await prisma.post.findMany({
      orderBy: {
        id: "asc"
      },
      select: {
        id: true,
        likes: {
          select: {
            id: true
          },
          where: {
            created_at: {
              gte: oneWeekAgo.toISOString(),
            }
          }
        }
      }})).map(async(post) => {
        return {
          post_id: post.id,
          likesCount: post.likes.length
        }
    }));
    await Promise.all(getPostWithLikeCount.map(async(data) => {
      prisma.$transaction([
        prisma.post.update({
          where: {
            id: data.post_id,
          },
          data: {
            weeklyLikeCount: data.likesCount,
          },
        }),
      ])
    }))
    console.log("updateWeeklyLikeCount() 실행!")
  }
}

// 매 시간 0분에 updateWeeklyLikeCount 함수 실행
const hourlyUpdate: Job = schedule.scheduleJob('0 * * * *', updateWeeklyLikeCount);

// 매 분 0초에 updateWeeklyLikeCount 함수 실행
// const minuteUpdate: Job = schedule.scheduleJob('* * * * *', updateWeeklyLikeCount);

export {
  hourlyUpdate,
  // minuteUpdate,
  updateWeeklyLikeCount,
}
