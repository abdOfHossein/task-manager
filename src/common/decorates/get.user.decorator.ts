import { createParamDecorator } from '@nestjs/common';
import { UserResponseJWTDto } from '../dtos/user.dto';

export const GetUser = createParamDecorator(
  (data, request): UserResponseJWTDto => {
    const req1 = request.switchToHttp().getRequest();

    const response: UserResponseJWTDto = {
      uid: req1.user.uid,
    };
    if (req1.user.roles) {
      response.roles = req1.user.roles;
    }
    
    if (req1.user.currenttRole) {
      response.currenttRole = req1.user.currenttRole;
    }
    return response;
  },
);
