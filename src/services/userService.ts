import { createTransport } from 'nodemailer';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import SMTPTransport from 'nodemailer/lib/smtp-transport';

import MyCustomError from '../utils/customError';
import { userRepository } from '../repositories/userRepository';
import { userDTO } from '../dto/user.dto';
import gmail from '../utils/gmail';

export class userService {
  private readonly JWT_SECRET_KEY: string | undefined;
  constructor(private Repository: userRepository) {
    this.JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;
  }

  public checkEmail = async (email: string): Promise<Boolean> => {
    const userExists = await this.Repository.checkEmail(email);

    if (userExists) {
      throw new MyCustomError('이메일이 이미 존재합니다.', 409);
    }

    return userExists;
  };

  public emailSend = async (email: string, certificationNumber: string): Promise<SMTPTransport.SentMessageInfo> => {
    const certification = createTransport({
      service: 'gmail',
      host: 'smtp.gmail.com',
      port: 587,
      secure: true,
      auth: {
        type: 'OAuth2',
        user: gmail.mailer.gmailUser,
        clientId: gmail.mailer.gmailClientId,
        clientSecret: gmail.mailer.gmailClientSecret,
        refreshToken: gmail.mailer.gmailRefreshToken,
      },
    });

    const mailOptions = {
      from: 'seuungkei@gmail.com',
      to: email,
      subject: '[meerkats] 회원가입 이메일 인증 진행해주세요.',
      html: `<html lang="ko">
      <div style="margin: 0 auto; text-align: left; padding: 0 20px; color: #222; font-size: 16px;">
        <header class="logo" style="margin-bottom: 80px; margin-top: 100px;">
          <img src="https://velog.velcdn.com/images/ohjoo1130/post/f2f86cf9-643c-4f41-a0b0-dc9546475e5e/image.png" alt="logo" style="width: 170px;" />
        </header>
        <section style="margin-bottom: 40px;">
          <h1>이메일 인증번호를 확인해주세요.</h1>
          <p>
            안녕하세요. 미어캐츠를 이용해주셔서 감사합니다. :) <br />
            미어캐츠 가입을 위해 아래 인증번호를 화면에 입력해주세요.
          </p>
          <div style="border-radius: 10px;">
            <table class="certification_box" style="width: 50%; margin-top: 30px; border: none; border-radius: 10px;">
              <tbody style="width: 50%">
                <tr>
                  <td style="height: 30px; background-color: #f2f2f2; border-radius: 10px 10px 0 0; margin: 0; translate: 0 2px;"></td>
                </tr>
                <tr>
                  <td align="center" style="font-size: 20px; height: 20px; background-color: #f2f2f2; margin: 0;">${certificationNumber}</td>
                </tr>
                <tr>
                  <td style="height: 30px; background-color: #f2f2f2; border-radius: 0 0 10px 10px; margin: 0; translate: 0 -2px;"></td>
                </tr>
              </tbody>
            </table>
          </div>
          <p style="color: gray;">본 인증번호의 유효시간은 24시간입니다.</p>
        </section>
        <footer>
          <hr />
          <div>
            <p style="font-size: 14px; padding-bottom: 30px;">
              <strong>mgkkm Industries Ltd.</strong> <br />
              Providing reliable tech since 2023 <br />
              Copyright © 2023 - All right reserved
            </p>
          </div>
        </footer>
      </div>
    </html>`,
    };

    return await certification.sendMail(mailOptions);
  };

  public signUp = async (email: string, password: string, nickname: string): Promise<userDTO | null> => {
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const createUser = await this.Repository.signUp(email, hashedPassword, nickname);
    return createUser;
  };

  public signIn = async (email: string, password: string): Promise<{ accessToken: string }> => {
    const userInfo = await this.Repository.getUserInfo(email);
    const hashedPassword = userInfo?.password ?? '';
    const compare = await bcrypt.compare(password, hashedPassword);

    if (!userInfo?.email || !compare) {
      throw new MyCustomError('이메일과 비밀번호를 확인해주세요.', 401);
    }

    const jwtToken = jwt.sign({ id: userInfo.id }, this.JWT_SECRET_KEY as string);

    return { accessToken: jwtToken };
  };
}
