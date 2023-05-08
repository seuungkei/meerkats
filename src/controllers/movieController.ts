import { Request, Response } from 'express';
import { ParamsDictionary, Query } from 'express-serve-static-core';
import { MovieService } from '../services/movieService';
import { catchAsync } from '../middlewares/error';
import MyCustomError from '../utils/customError';
import { IReqUser } from '../dto/auth.dto';

class MovieController {
  constructor(private Service: MovieService) {}

  getMovieTrailerDetail = catchAsync(async (req: Request<ParamsDictionary, {}, {}, Query> & IReqUser, res: Response) => {
    const userId = req.user;
    const { movieId } = req.params;
    const { skip, take } = req.query;

    if (!take || !skip) throw new MyCustomError('take & skip를 설정해주세요', 400);

    const data = await this.Service.getMovieTrailerDetail(Number(movieId), Number(skip), Number(take), Number(userId));

    return res.status(200).json({ data });
  });

  movieLikeCreateAndDelete = catchAsync(async (req: Request & IReqUser, res: Response) => {
    const { movieId } = req.params;
    const userId = req.user;

    if (!userId || !movieId) {
      throw new MyCustomError('데이터 요청 값이 없습니다.', 400);
    }

    const message = await this.Service.movieLikeCreateAndDelete(userId, Number(movieId));

    return res.status(201).json({ message: message });
  });

  createMovieComment = catchAsync(async (req: Request & IReqUser, res: Response) => {
    const { content } = req.body;
    const userId = req.user;
    const { movieId } = req.params;

    if (!movieId) {
      throw new MyCustomError('데이터 요청 값이 없습니다.', 400);
    }

    await this.Service.createMovieComment(Number(movieId), content, Number(userId));
    return res.status(201).json({ message: '댓글 등록 완료!' });
  });

  updateMovieComment = catchAsync(async (req: Request & IReqUser, res: Response) => {
    const { content } = req.body;
    const { commentId } = req.params;
    const userId = req.user;

    await this.Service.updateMovieComment(Number(commentId), content, Number(userId));
    return res.status(200).json({ message: '댓글 수정 완료!' });
  });

  deleteMovieComment = catchAsync(async (req: Request & IReqUser, res: Response) => {
    const { commentId } = req.params;
    const userId = req.user;

    await this.Service.deleteMovieComment(Number(commentId), Number(userId));
    return res.status(200).json({ message: '댓글 삭제 완료!' });
  });

  movieMainPage = catchAsync(async (req: Request, res: Response) => {
    const { skip, take } = req.query;

    if (!take || !skip) throw new MyCustomError('take & skip를 설정해주세요', 400);

    const result = await this.Service.movieMainPage(Number(skip), Number(take));

    return res.status(200).json([result]);
  });
}

export { MovieController };
