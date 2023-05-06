interface Ireqdata {
  userId: number,
  title: string,
  content: string,
  categoryId: number,
  spoilerInfoId: number,
  thumbnail: string,
}

interface IpostDetails {
  id: number,
  title: string,
  content: string,
  created_at: Date,
  category : {
    id: number,
    name: string
  },
  spoiler_info_id: number,
  user: {
    id: number,
    nickname: string | null
  },
  likeCount?: number,
  isLikedByThisUser?: boolean,
  scrapCount?: number,
  isScrapedByThisUser?: boolean,
}

interface Icomments {
  commentId: number,
  content: string,
  created_at: Date,
  user: {
    id: number,
    nickname: string | null,
  }
}

interface IfilteredPostData {
  likeCount: number;
  commentCount: number;
  id: number;
  title: string;
  content: string;
  user_id: number;
  category_id: number;
  thumbnail: string;
  spoiler_info_id: number;
  created_at: Date;
  updated_at: Date;
  weeklyLikeCount: number;
}

interface IthisUserWrittenPosts {
  id: number;
  title: string;
  user: {
    nickname: string | null;
  };
  category_id: number;
  thumbnail: string;
  spoiler_info_id: number;
  created_at: Date;
  likeCount: number;
  commentCount: number;
}

export {
  Ireqdata,
  IpostDetails,
  Icomments,
  IfilteredPostData,
  IthisUserWrittenPosts,
}