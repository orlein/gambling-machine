export type UserRequestPathParams = {
  userId: string;
};

export interface UserResponseDto {
  userId: string;
  userName: string;
  balance: number;
}
