import { Category, Region } from '@prisma/client';
interface movieDataDTO {
  category?: Category;
  region?: Region;
  release_date?: Date;
  name: string;
  director: string;
  actor: string;
  ratings: string;
  running_time: string;
}

interface movieDataWIhtLikeDTO extends movieDataDTO {
  movieLikeCount: number;
}
