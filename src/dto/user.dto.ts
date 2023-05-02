interface IgetSocialUser {
  id: number;
  nickname: string | null;
  email: string | null;
  social_id: string | null;
  social_type_id: number | null;
}
interface userInfoDTO {
  id: number;
  email: string | null;
  password: string | null;
}

interface userDTO {
  email: string | null;
  password: string | null;
  nickname: string | null;
}

export {
  IgetSocialUser,
  userInfoDTO,
  userDTO
}