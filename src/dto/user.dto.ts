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

export { userInfoDTO, userDTO };
