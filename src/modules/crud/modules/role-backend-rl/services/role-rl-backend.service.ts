import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AbstractServiceClass } from 'src/common/abstract/abstract.service.class';
import { HandlerError } from 'src/common/class/handler.error';
import { SuccessDto } from 'src/common/result/success.dto';
import { CrudBackendEnum } from 'src/common/translate/enums/crud-backend.enum';
import { PublicEnum } from 'src/common/translate/enums/public.enum';
import { RoleEnum } from 'src/common/translate/enums/role.enum';
import { RoleEnt } from 'src/modules/role/modules/entities/role.entity';
import { RoleService } from 'src/modules/role/modules/services/role.service';
import { HandlerService } from 'src/utility/handler/handler.service';
import { DataSource, FindOneOptions, QueryRunner } from 'typeorm';
import { BackendEnt } from '../../backend/entities/backend.entity';
import { BackendService } from '../../backend/services/backend.service';
import { CreateRoleRlBackendDto } from '../dtos/create-role-rl-backend.dto';
import { UpdateRoleRlBackendDto } from '../dtos/update-role-rl-backend.dto';
import { RoleRlBackendEnt } from '../entities/role-rl-backend.entity';
import { RoleRlBackendPageDto } from '../pagination/country.page.dto';
import { RoleRlBackendRepo } from '../repositories/role-rl-backend.repository';
import { RoleRlBackendCUDto } from '../results/role-rl-backend.c.u.dto';
import { RoleRlBackendGDto } from '../results/role-rl-backend.g.dto';

@Injectable()
export class RoleRlBackendService extends AbstractServiceClass<
  RoleRlBackendEnt,
  CreateRoleRlBackendDto,
  UpdateRoleRlBackendDto,
  RoleRlBackendPageDto
> {
  public constructor(
    handlerService: HandlerService,
    @InjectRepository(RoleEnt)
    @InjectRepository(BackendEnt)
    @InjectRepository(RoleRlBackendEnt)
    public dataSource: DataSource,
    private roleService: RoleService,
    private backendService: BackendService,
    private roleRlBackendRepo: RoleRlBackendRepo,
  ) {
    super(dataSource, handlerService);
    this.className = this.constructor.name;
  }


  async _getOne(searchDto: string, options?: FindOneOptions<any>) {
    return await this.roleRlBackendRepo.findOneEntity(searchDto, options);
  }
  _resultGetOneDto(ent: RoleRlBackendEnt) {
    return new RoleRlBackendGDto(ent);
  }

  async _create(createDt: CreateRoleRlBackendDto, query?: QueryRunner) {
    const backendEnt = await this.dataSource.manager.findOne(BackendEnt, { where: { id: createDt.id_backend } })
    createDt.backend = backendEnt
    const roleEnt = await this.dataSource.manager.findOne(RoleEnt, { where: { id: createDt.id_role } })
    if (!roleEnt)
      throw new Error(
        `${JSON.stringify({
          section: 'role',
          value: RoleEnum.ROLE_NOT_EXISTS,
        })}`,
      );
    createDt.role = roleEnt
    return await this.roleRlBackendRepo.createEntity(createDt, query);
  }
  _resultCreateDto(ent: RoleRlBackendEnt) {
    return new RoleRlBackendCUDto(ent);
  }

  async _delete(searchDto: string, query?: QueryRunner) {
    const roleRlBackendEnt = await this.dataSource.manager.findOne(RoleRlBackendEnt, { where: { id: searchDto } })
    if (!roleRlBackendEnt)
      throw new Error(
        `${JSON.stringify({
          section: 'public',
          value: PublicEnum.COLUMN_NOT_EXISTS,
        })}`,
      );
    return await this.roleRlBackendRepo.deleteEntity(roleRlBackendEnt, query);
  }
  _resultDeleteDto(ent: RoleRlBackendEnt) {
  return new SuccessDto(true);
  }

  async _update(
    role_rl_backend_Id: string,
    updateDt: UpdateRoleRlBackendDto,
    query?: QueryRunner,
  ) {
    const roleRlBackendEnt = await this.dataSource.manager.findOne(RoleRlBackendEnt, { where: { id: role_rl_backend_Id } })

    if (!roleRlBackendEnt)
      throw new Error(
        `${JSON.stringify({
          section: 'public',
          value: PublicEnum.COLUMN_NOT_EXISTS,
        })}`,
      );
    const backendEnt = await this.dataSource.manager.findOne(BackendEnt, { where: { id: updateDt.id_backend } })
    if (!backendEnt)
      throw new Error(
        `${JSON.stringify({
          section: 'crud_backend',
          value: CrudBackendEnum.CRUD_BACKEND_NOT_EXISTS,
        })}`,
      );
      

    updateDt.backend = backendEnt
    const roleEnt = await this.dataSource.manager.findOne(RoleEnt, { where: { id: updateDt.id_role } })
    if (!roleEnt)
      throw new Error(
        `${JSON.stringify({
          section: 'role',
          value: RoleEnum.ROLE_NOT_EXISTS,
        })}`,
      );
    updateDt.role = roleEnt
    return await this.roleRlBackendRepo.updateEntity(
      roleRlBackendEnt,
      updateDt,
      query,
    );
  }
  _resultUpdateDto(ent: RoleRlBackendEnt) {
    return new RoleRlBackendCUDto(ent);
  }

  async _pagination(pageDto: RoleRlBackendPageDto) {
    return await this.roleRlBackendRepo.paginationEntity(pageDto);
  }

  async deleteBackend(id_backend: string): Promise<SuccessDto> {
    try {
      const backendEnt: any = await this.dataSource.manager.findOne(BackendEnt, {
        where: { id: id_backend },
        relations: { role_backend: true },
      });
      if (backendEnt.role_backend.length !== 0)
        await this._delete(backendEnt.role_backend.id);
      await this.backendService._delete(id_backend);
      return new SuccessDto(true);
    } catch (e) {
      console.log(e);
      const result = await HandlerError.errorHandler(e);
      await this.handlerService.handlerException400('FA', result);
    }
  }
}
