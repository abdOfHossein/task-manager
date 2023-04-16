import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HashModule } from 'src/utility/hash/hash.module';
import { RoleEnt } from 'src/modules/role/modules/entities/role.entity';
import { UserEnt } from '../modules/entities/user.entity';
import { UserModule } from '../modules/user.module';
import { UserController } from './controller/user.controller';
import { RedisModule } from '@nestjs-modules/ioredis';

@Module({
  imports: [TypeOrmModule.forFeature([UserEnt,RoleEnt]),UserModule,RedisModule.forRootAsync({
    useFactory: () => ({
      config: { 
        url: 'redis://127.0.0.1:6379',

      },
    }),
  }),
  HashModule],
  controllers: [UserController],
})
export class UserCoreModule {}
