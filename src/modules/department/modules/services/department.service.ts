import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AbstractServiceClass } from 'src/common/abstract/abstract.service.class';
import { HandlerError } from 'src/common/class/handler.error';
import { SuccessDto } from 'src/common/result/success.dto';
import { DepartmentEnum } from 'src/common/translate/enums/department.enum';
import { HandlerService } from 'src/utility/handler/handler.service';
import { DataSource, FindOneOptions, QueryRunner } from 'typeorm';
import { CreateDepartmentDto } from '../dtos/create.department.dto';
import { UpdateDepartmentDto } from '../dtos/update.department.dto';
import { DepartmentEnt } from '../entities/department.entity';
import { DepartmentPageDto } from '../paginations/department.page.dto';
import { DepartmentRepo } from '../repositories/department.repository';
import { DepartmentCUDto } from '../result/department.c.u.dto';
import { DepartmentGDto } from '../result/department.g.dto';


 // createEntity findOneEntity updateEntity paginationEntity deleteEntity

@Injectable()
export class DepartmentService extends AbstractServiceClass<
  DepartmentEnt,
  CreateDepartmentDto,
  UpdateDepartmentDto,
  DepartmentPageDto
> {
  public constructor(
    @InjectRepository(DepartmentEnt)
    public dataSource: DataSource,
    private departmentRepo: DepartmentRepo,
    handlerService: HandlerService,
  ) {
    super(dataSource, handlerService);
    this.className = this.constructor.name;
  }


  async _create(createDt: CreateDepartmentDto, query?: QueryRunner) {
    const queryRunner = this.dataSource.manager.connection.createQueryRunner();
    try {
      await queryRunner.startTransaction();
      await queryRunner.connect();
      return await this.departmentRepo.createEntity(createDt, queryRunner);
    } catch (e) {
      await queryRunner.rollbackTransaction();
      console.log(e);
      const result = await HandlerError.errorHandler(e);
      await this.handlerService.handlerException400('FA', result);
    } finally {
      await queryRunner.release();
    }
  }
  _resultCreateDto(ent: DepartmentEnt) {
    return new DepartmentCUDto(ent)
  }

  async _getOne(searchDto: string, options?: FindOneOptions) {
    return await this.departmentRepo.findOneEntity(searchDto, options);

  }
  _resultGetOneDto(ent: DepartmentEnt) {
    return new DepartmentGDto(ent)
  }

  async _update(
    Department_Id: string,
    updateDt: UpdateDepartmentDto,
    query?: QueryRunner,
  ) {

    const departmentEnt = await this.dataSource.manager.findOne(DepartmentEnt, { where: { id: Department_Id } })
    if (!departmentEnt)
      throw new Error(
        `${JSON.stringify({
          section: 'department',
          value: DepartmentEnum.DEPARTMENT_NOT_EXISTS,
        })}`,
      );
    return await this.departmentRepo.updateEntity(
      departmentEnt,
      updateDt,
      query,
    );

  }
  _resultUpdateDto(ent: DepartmentEnt) {
    return new DepartmentCUDto(ent)
  }

  async _delete(id_department: string) {
    const departmentEnt = await this.dataSource.manager.findOne(DepartmentEnt, {
      where: { id: id_department },
    });
    if (!departmentEnt)
      throw new Error(
        `${JSON.stringify({
          section: 'department',
          value: DepartmentEnum.DEPARTMENT_NOT_EXISTS
        })}`,
      );    departmentEnt.name_department = 'deleted' + '_' + departmentEnt.name_department + '_' + departmentEnt.id;
    await this.dataSource.manager.save(departmentEnt)
    return await this.departmentRepo.deleteEntity(departmentEnt);

  }
  _resultDeleteDto(ent: DepartmentEnt) {
    return new SuccessDto(true);
  }

  async _pagination(pageDto: DepartmentPageDto) {
    return await this.departmentRepo.paginationEntity(pageDto);

  }

  async getAllDepartment() {
    try {
      return await this.departmentRepo.getAllDepartment();
    } catch (e) {
      console.log(e);
      const result = await HandlerError.errorHandler(e);
      await this.handlerService.handlerException400('FA', result);
    }
  }


  async getDepartmentUsers(id_department: string) {
    try {
      return await this.departmentRepo.getDepartmentUsers(id_department);
    } catch (e) {
      console.log(e);
      const result = await HandlerError.errorHandler(e);
      await this.handlerService.handlerException400('FA', result);
    }
  }


  async allReqOfDepartment(id_user: string) {
    try {
      return await this.departmentRepo.allReqOfDepartment(id_user);
    } catch (e) {
      console.log(e);
      const result = await HandlerError.errorHandler(e);
      await this.handlerService.handlerException400('FA', result);
    }
  }

  async allTaskOfDepartment(id_user: string) {
    try {
      return await this.departmentRepo.allTaskOfDepartment(id_user);
    } catch (e) {
      console.log(e);
      const result = await HandlerError.errorHandler(e);
      await this.handlerService.handlerException400('FA', result);
    }
  }

  async allUsersOfDepartment(id_user: string) {
    try {
      return await this.departmentRepo.allUsersOfDepartment(id_user);
    } catch (e) {
      console.log(e);
      const result = await HandlerError.errorHandler(e);
      await this.handlerService.handlerException400('FA', result);
    }
  }

  async allTaskOfUser(id_header: string, id_user: string) {
    try {
      return await this.departmentRepo.allTaskOfUser(id_header, id_user);
    } catch (e) {
      console.log(e);
      const result = await HandlerError.errorHandler(e);
      await this.handlerService.handlerException400('FA', result);
    }
  }

  async allReqWithoutTaskOfDepartment(id_user: string) {
    try {
      return await this.departmentRepo.allReqWithoutTaskOfDepartment(id_user);
    } catch (e) {
      console.log(e);
      const result = await HandlerError.errorHandler(e);
      await this.handlerService.handlerException400('FA', result);
    }
  }

  async allDepartmentOfUser(id_user: string) {
    try {
      return await this.departmentRepo.allDepartmentOfUser(id_user);
    } catch (e) {
      console.log(e);
      const result = await HandlerError.errorHandler(e);
      await this.handlerService.handlerException400('FA', result);
    }
  }

}
