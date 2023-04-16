import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { InjectRepository } from '@nestjs/typeorm';
import { RoleEnt } from 'src/modules/role/modules/entities/role.entity';
import { RoleTypeEnum } from 'src/modules/role/modules/enum/role.enum';
import { DataSource } from 'typeorm';
import { UserEnt } from '../entities/user.entity';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    @InjectRepository(UserEnt)
    @InjectRepository(RoleEnt)
    private dataSource: DataSource,
    private readonly reflector: Reflector,
  ) { }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // try {
    //   const request = context.switchToHttp().getRequest();

    //   const user = await this.dataSource.manager.findOne(UserEnt, {
    //     where: { id: request.user.id_User },
    //     relations: { role: true },
    //   });
    //   console.log('user', user);

    //   for (const key of user.role) {
    //     const role = await this.dataSource.manager.findOne(RoleEnt, {
    //       where: {
    //         id: key.id,
    //       },
    //     });
    //     console.log('role', role);

    //     if (role.role_type == RoleTypeEnum.ADMIN) {
    //       console.log('hereeeeeeeeee');

    //       return true;
    //     }
    //   }
    //   return;
    // } catch (e) {
    //   console.log(e);
    //   throw e;
    // }
    return true
  }
}
