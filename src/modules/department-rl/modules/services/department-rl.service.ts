import { Injectable } from '@nestjs/common';
import { AbstractServiceClass } from 'src/common/abstract/abstract.service.class';
import { HandlerError } from 'src/common/class/handler.error';
import { HandlerService } from 'src/utility/handler/handler.service';
import { DataSource, FindOneOptions, QueryRunner } from 'typeorm';
import { CreateDepartmentRlDto } from '../dtos/create.department-rl.dto';
import { UpdateDepartmentRlDto } from '../dtos/update.department-rl.dto';
import { DepartmentRlEnt } from '../entities/department-rl.entity';
import { DepartmentRlPageDto } from '../paginations/department-rl.page.dto';
import { DepartmentRlRepo } from '../repositories/department-rl.repository';
import { DepartmentRlCUDto } from '../result/department-rl.c.u.dto';
import { DepartmentRlGDto } from '../result/department-rl.g.dto';

@Injectable()
export class DepartmentRlService extends AbstractServiceClass<
  DepartmentRlEnt,
  CreateDepartmentRlDto,
  UpdateDepartmentRlDto,
  DepartmentRlPageDto
> {
  public constructor(
    private departmentRlRepo: DepartmentRlRepo,
    handlerService: HandlerService,
    public dataSource: DataSource,
  ) {
    super(dataSource, handlerService);
    this.className = this.constructor.name;
  }
  protected _delete(searchDto: string, query?: QueryRunner) {
    throw new Error('Method not implemented.');
  }
  _resultDeleteDto(ent: DepartmentRlEnt) {
    throw new Error('Method not implemented.');
  }


  async _create(
    createDt: CreateDepartmentRlDto,
    query?: QueryRunner,
  ) {
    return await this.departmentRlRepo.createEntity(createDt, query);
  }
  _resultCreateDto(ent: DepartmentRlEnt) {
    return new DepartmentRlCUDto(ent)
  }

  async _getOne(searchDto: string, options?: FindOneOptions) {
    return await this.departmentRlRepo.findOneEntity(
      searchDto,
      options,
    );
  }
  _resultGetOneDto(ent: DepartmentRlEnt) {
    return new DepartmentRlGDto(ent)
  }


  async findByDepartmentRequest(id_req: string, id_user: string) {
    try {
      return await this.departmentRlRepo.findByDepartmentRequest(
        id_req,
        id_user,
      );
    } catch (e) {
      console.log(e);
      const result = await HandlerError.errorHandler(e);
      await this.handlerService.handlerException400('FA', result);
    }
  }

  async _update(
    id_departmen_rl: string,
    updateDt: UpdateDepartmentRlDto,
    query?: QueryRunner,
  ) {

    const department_rl = await this.dataSource.manager.findOne(
      DepartmentRlEnt,
      {
        where: {
          id: id_departmen_rl,
        },
      },
    );
    return await this.departmentRlRepo.updateEntity(
      department_rl,
      updateDt,
      query,
    );
  }
  _resultUpdateDto(ent: DepartmentRlEnt) {
    return new DepartmentRlCUDto(ent)
  }

  async _pagination(pageDto: DepartmentRlPageDto) {
    return await this.departmentRlRepo.paginationEntity(pageDto)
  }

  async listUserDepartment(department_rl_id: string) {
    return await this.departmentRlRepo.listUserDepartment(department_rl_id);
  }
}
