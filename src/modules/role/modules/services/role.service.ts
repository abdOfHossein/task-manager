import { Injectable } from '@nestjs/common';
import { AbstractServiceClass } from 'src/common/abstract/abstract.service.class';
import { HandlerError } from 'src/common/class/handler.error';
import { SuccessDto } from 'src/common/result/success.dto';
import { RoleEnum } from 'src/common/translate/enums/role.enum';
import { HandlerService } from 'src/utility/handler/handler.service';
import { DataSource, FindOneOptions, QueryRunner } from 'typeorm';
import { ConfigRoleDto } from '../dtos/config.roele.dto';
import { CreateRoleDto } from '../dtos/create.role.dto';
import { UpdateRoleDto } from '../dtos/update.role.dto';
import { RoleEnt } from '../entities/role.entity';
import { RolePageDto } from '../paginations/role.page.dto';
import { RoleRepo } from '../repositories/role.repository';
import { RoleCUDto } from '../result/role.c.u.dto';
import { RoleGDto } from '../result/role.g.dto';

// createEntity findOneEntity updateEntity paginationEntity deleteEntity


@Injectable()
export class RoleService extends AbstractServiceClass<
  RoleEnt,
  CreateRoleDto,
  UpdateRoleDto,
  RolePageDto
> {
  public constructor(
    private roleRepo: RoleRepo,
    handlerService: HandlerService,
    public dataSource: DataSource,
  ) {
    super(dataSource, handlerService);
    this.className = this.constructor.name;
  }



  // createEntity findOneEntity updateEntity paginationEntity deleteEntity



  async _create(createDt: CreateRoleDto, query?: QueryRunner) {
    return await this.roleRepo.createEntity(createDt, query)
  }
  _resultCreateDto(ent: RoleEnt) {
    return new RoleCUDto(ent)
  }


  async _update(id_role: string, updateRoleDto: UpdateRoleDto, query?: QueryRunner) {
    const roleEnt = await this.dataSource.manager.findOne(RoleEnt, {
      where: { id: id_role },
    });
    if (!roleEnt)
      throw new Error(
        `${JSON.stringify({
          section: 'role',
          value: RoleEnum.ROLE_NOT_EXISTS
        })}`,
      );
    return await this.roleRepo.updateEntity(roleEnt, updateRoleDto, query);
  }
  _resultUpdateDto(ent: RoleEnt) {
    return new RoleCUDto(ent)
  }

  async _getOne(searchDto: string, options?: FindOneOptions) {
    return await this.roleRepo.findOneEntity(searchDto, options)
  }
  _resultGetOneDto(ent: RoleEnt) {
    return new RoleGDto(ent)
  }

  async deleteSpecificRole(
    id_user: string,
    id_role: string,
    query?: QueryRunner,
  ) {
    try {
      return await this.roleRepo.deleteSpecificRole(id_user, id_role);
    } catch (e) {
      console.log(e);
      const result = await HandlerError.errorHandler(e);
      await this.handlerService.handlerException400('FA', result);
    }
  }

  async _pagination(pageDto: RolePageDto) {
      return await this.roleRepo.paginationEntity(pageDto);
  }

  async findAllRole() {
    try {
      return await this.roleRepo.findAllRole();
    } catch (e) {
      console.log(e);
      const result = await HandlerError.errorHandler(e);
      await this.handlerService.handlerException400('FA', result);
    }
  }

  async configRole(
    id_user: string,
    configRoleDto: ConfigRoleDto,
    query?: QueryRunner,
  ) {
    try {
      return await this.roleRepo.configRole(id_user, configRoleDto, query);
    } catch (e) {
      console.log(e);
      const result = await HandlerError.errorHandler(e);
      await this.handlerService.handlerException400('FA', result);
    }
  }
  async _delete(id_role: string, query?: QueryRunner) {
    const roleEnt = await this.dataSource.manager.findOne(RoleEnt, {
      where: { id: id_role },
    });
    if (!roleEnt)
    throw new Error(
      `${JSON.stringify({
        section: 'role',
        value: RoleEnum.ROLE_NOT_EXISTS
      })}`,
    );

    roleEnt.role_type = 'deleted' + '_' + roleEnt.role_type + '_' + roleEnt.id;
    await this.dataSource.manager.save(roleEnt)
      return await this.roleRepo.deleteEntity(roleEnt, query);
  }
  _resultDeleteDto(ent: RoleEnt) {
    return new SuccessDto(true)
  }
  async paginationRoleUser(id_user: string, rolePageDto: RolePageDto) {
    try {
      return await this.roleRepo.paginationRoleUser(id_user, rolePageDto);
    } catch (e) {
      console.log(e);
      const result = await HandlerError.errorHandler(e);
      await this.handlerService.handlerException400('FA', result);
    }
  }

 
  async addRole(id_user: string, id_role: string, query?: QueryRunner) {
    try {
      return await this.roleRepo.addRole(id_user, id_role);
    } catch (e) {
      console.log(e);
      const result = await HandlerError.errorHandler(e);
      await this.handlerService.handlerException400('FA', result);
    }
  }
}
