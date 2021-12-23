import { ResponseBody } from '@gambling-machine/src/types';
import {
  LoginRequestDto,
  LoginResponseDto,
} from '@gambling-machine/src/types/login';
import { rest } from 'msw';

const loginHandler = rest.post<
  LoginRequestDto,
  {},
  ResponseBody<LoginResponseDto>
>('/api/v1/login', (req, res, ctx) => {
  const { userId, password } = req.body;

  if (userId.concat('_password') !== password) {
    return res(
      ctx.status(401),
      ctx.json({
        data: [],
        totalSize: 0,
        currentSize: 0,
        isSucceed: false,
        error: {
          message: `Login Failed.`,
          code: '401',
          name: `UnauthorizedException`,
        },
        infoLayoutMessage: `Login Failed.`,
        redirectUrl: `/`,
      })
    );
  }

  return res(
    ctx.json({
      data: [
        {
          userId,
          accessToken: 'mockAccessToken',
        },
      ],
      totalSize: 1,
      currentSize: 1,
      isSucceed: true,
    })
  );
});

export default loginHandler;
