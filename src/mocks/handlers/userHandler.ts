import { ResponseBody } from '@gambling-machine/src/types';
import {
  UserRequestPathParams,
  UserResponseDto,
} from '@gambling-machine/src/types/user';
import { rest } from 'msw';

const userHandler = rest.get<
  {},
  UserRequestPathParams,
  ResponseBody<UserResponseDto>
>('/api/v1/user/:userId', (req, res, ctx) => {
  const { userId } = req.params;

  if (userId === 'userId1') {
    return res(
      ctx.status(404),
      ctx.json({
        data: [],
        totalSize: 0,
        currentSize: 0,
        isSucceed: false,
        error: {
          message: `Data not found.`,
          code: '404',
          name: `NotFoundException`,
        },
        infoLayoutMessage: `Data not found.`,
      })
    );
  }

  return res(
    ctx.json({
      data: [{ userId: 'userId1', userName: 'userName1', balance: 2000 }],
      currentSize: 1,
      isSucceed: true,
      totalSize: 1,
    })
  );
});

export default userHandler;
