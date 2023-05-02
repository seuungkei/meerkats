import { Request, Response } from 'express';
import { userService } from '../services/userService';
import { catchAsync } from '../middlewares/error';
import MyCustomError from '../utils/customError';
import { userDTO } from '../dto/user.dto';

let certificationNumber: string;

class userController {
  constructor(private Service: userService) {
  }

  public kakaoLogin = catchAsync(async (req: Request, res: Response) => {
    const kakaoToken: string | undefined = req.headers.authorization;
  
    if (!kakaoToken) throw new MyCustomError("kakaoToken must be defined", 400);
  
    const { accessToken, userNickname, status } = await this.Service.kakaoLogin(kakaoToken);
    return res.status(status).json({ accessToken, userNickname });
  });

  public checkEmail = catchAsync(async (req: Request, res: Response) => {
    const email: string = req.body.email;

    if (!email) throw new MyCustomError('이메일을 확인해 주세요.', 400);

    await this.Service.checkEmail(email);
    return res.status(200).json({ message: '사용 가능한 이메일입니다.' });
  });

  public sendEmail = catchAsync(async (req: Request, res: Response) => {
    const email: string = req.body.email;
    certificationNumber = Math.random().toString().substring(2, 8);

    await this.Service.emailSend(email, certificationNumber);
    return res.status(200).json({ message: '인증 이메일이 발송 되었습니다.' });
  });

  public confirmEmail = catchAsync(async (req: Request<{}, {}, { userEmailCode: string }, {}>, res: Response) => {
    const { userEmailCode } = req.body;

    if (!userEmailCode) {
      throw new MyCustomError('인증번호를 확인해 주세요.', 400);
    }

    if (userEmailCode !== certificationNumber) {
      throw new MyCustomError('인증번호가 일치하지 않습니다.', 400);
    }

    return res.status(200).json({ message: '인증이 성공적으로 완료되었습니다.' });
  });

  public signUp = catchAsync(async (req: Request<{}, {}, userDTO, {}>, res: Response) => {
    const { email, password, nickname } = req.body;

    if (!email || !password) {
      throw new MyCustomError('이메일과 비밀번호를 입력해주세요', 400);
    }

    if (!nickname) {
      throw new MyCustomError('닉네임을 입력해주세요', 400);
    }

    await this.Service.signUp(email, password, nickname);
    return res.status(201).json({ message: '회원가입이 정상적으로 완료 되었습니다.' });
  });

  public signIn = catchAsync(async (req: Request<{}, {}, userDTO, {}>, res: Response) => {
    const { email, password } = req.body;

    if (!email || !password) {
      throw new MyCustomError('이메일과 비밀번호를 입력해주세요', 400);
    }

    const jwtToken = await this.Service.signIn(email, password);

    return res.status(201).json(jwtToken);
  });
}

export {
  userController,
}