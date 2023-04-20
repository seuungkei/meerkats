import axios from 'axios';
import jwt from 'jsonwebtoken';
import MyCustomError from '../utils/customError';
import { userRepository } from '../repositories/userRepository';
import { IgetSocialUser } from '../dto/user.dto';

import dotenv from 'dotenv';
dotenv.config();

class userService {
  private readonly JWT_SECRET: string | undefined;
  private readonly SOCIAL_TYPES = Object.freeze({
    kakao: 1,
    naver: 2,
    google: 3,
  });
  constructor (private Repository: userRepository) {
    this.JWT_SECRET = process.env.JWT_SECRET;
  }

  public async kakaoLogin  (kakaoToken: string | undefined): Promise<{accessToken: string; userNickname: string | null; status: number;}> {
    if(!this.JWT_SECRET) throw new MyCustomError('JWT_SECRET must be defined', 500);

    const {nickname, email, socialId} = await this._getKakaoUserData(kakaoToken);
    const user = await this.Repository.getSocialUser(socialId);

    return user? await this._ifExistUser(user, this.JWT_SECRET) : await this._ifNotExistUser(nickname, email, socialId, this.JWT_SECRET, this.SOCIAL_TYPES.kakao);
  };

  private async _getKakaoUserData (kakaoToken: string | undefined): Promise<{nickname: string; email: string; socialId: string;}> {
    const { data } = await axios.get("https://kapi.kakao.com/v2/user/me", {
      headers: {
        authorization: `Bearer ${kakaoToken}`,
        "Content-type": "application/x-www-form-urlencoded;charset=utf-8",
      },
    });
  
    const nickname: string = data.properties.nickname;
    const email: string = data.kakao_account.email;
    const socialId: string = data.id.toString();

    return {nickname, email, socialId};
  }

  private async _ifExistUser(user: IgetSocialUser, JWT_SECRET: string): Promise<{accessToken: string; userNickname: string | null; status: number;}> {
    const userId: number = user.id;
    const userNickname: string | null = user.nickname;
    const jsonwebtoken: string = jwt.sign({ id: userId }, JWT_SECRET);
  
    return { accessToken: jsonwebtoken, userNickname: userNickname, status: 200 };
  }

  private async _ifNotExistUser(nickname: string, email: string, socialId: string, JWT_SECRET: string, socialTypeId: number): Promise<{accessToken: string; userNickname: string; status: number;}> {
    const userId = await this.Repository.createUser(nickname, email, socialId, socialTypeId);
    const jsonwebtoken = jwt.sign({ id: userId }, JWT_SECRET);

    return { accessToken: jsonwebtoken, userNickname: nickname, status: 201 };
  }
}

export {
  userService,
}