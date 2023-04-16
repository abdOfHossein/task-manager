import { PassportStrategy } from '@nestjs/passport';

import {
  Injectable,
  UnauthorizedException
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UserResponseJWTDto } from 'src/common/dtos/user.dto';
import { HashService } from 'src/utility/hash/hash.service';
import { RedisService } from 'src/utility/redis/redis.service';
import { DataSource } from 'typeorm';
import { UserEnt } from '../../entities/user.entity';
import { JwtPayloadInterface } from '../interface/jwt-payload.interface';
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  PREFIX_TOKEN_AUTH = 'prefix_auth_token_';
  constructor(
    private hashService: HashService,
    private redisService: RedisService,
    @InjectRepository(UserEnt)
    private dataSource: DataSource,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: 'secret',
      passReqToCallback: true
    });
  }


  async validate(request: Request, payload: JwtPayloadInterface): Promise<UserResponseJWTDto> {
   
    const result = await this.redisService.getKey(`${this.PREFIX_TOKEN_AUTH}${payload.unq}`)
    if (result == null) throw new UnauthorizedException()
    const encryptTextInterface: EncryptTextInterface = {
      text: result.data,
      iv: result.iv,
      key: payload.key
    }

    const rs: any = await this.hashService.decrypt(encryptTextInterface)

    const user = await this.dataSource.manager.findOne(UserEnt, {
      where: {
        id: rs,
      },
      relations: {
        role: true,
      },
    });


    if (result.currentRole) {
      return {
        uid: user.id,
        roles: result.roles,
        currenttRole: result.currentRole,
      };
    }

    else {
      return {
        uid: user.id,
        roles: result.roles,
      };
    }
  }

}
