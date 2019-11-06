import { createParamDecorator } from '@nestjs/common';

/**
 * This is the decorator for the graphql resolvers to get user.
 * There is also another user.decorator.ts for the rest apis.
 */
export const CurrentUser = createParamDecorator(
  (data, [root, args, ctx, info]) => ctx.req.user,
);
