export interface LoginRequestDto {
  userId: string;
  password: string;
}

export interface LoginResponseDto {
  userId: string;
  accessToken: string;
}
