import { createParamDecorator, ExecutionContext } from '@nestjs/common';

// this decorator will filter the request to retrieve the user only instead of retrieving the entire the request
export const GetUser = createParamDecorator(
  (data: never, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest();
    //console.log('This is from GetUser decorator: ' + request.user.id);
    return request.user;
  },
);