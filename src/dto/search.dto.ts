interface IreqQuery {
  postTitle?: string;
  movieTitle?: string;
}

interface SearchDTO {
  name: string;
  poster_img: string | null;
  id: number;
  release_date: Date | null;
}

export { IreqQuery, SearchDTO };
