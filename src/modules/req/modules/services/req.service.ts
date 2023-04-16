import { Injectable } from '@nestjs/common';
import { AbstractServiceClass } from 'src/common/abstract/abstract.service.class';
import { HandlerError } from 'src/common/class/handler.error';
import { SuccessDto } from 'src/common/result/success.dto';
import { ReqEnum } from 'src/common/translate/enums/req.enum';
import { HandlerService } from 'src/utility/handler/handler.service';
import { DataSource, FindOneOptions, QueryRunner } from 'typeorm';
import { CreateReqDto } from '../dtos/create.req.dto';
import { DoneReqDto } from '../dtos/done.req.dto';
import { UpdateReqDto } from '../dtos/update.req.dto';
import { ReqEnt } from '../entities/req.entity';
import { ReqPageDto } from '../paginations/req.page.dto';
import { ReqRepo } from '../repositories/req.repository';
import { ReqCUDto } from '../result/req.c.u.dto';
import { ReqGDto } from '../result/req.g.dto';

@Injectable()
export class ReqService extends AbstractServiceClass<
  ReqEnt,
  CreateReqDto,
  UpdateReqDto,
  ReqPageDto
> {
  public constructor(
    private reqRepo: ReqRepo,
    handlerService: HandlerService,
    public dataSource: DataSource,
  ) {
    super(dataSource, handlerService);
    this.className = this.constructor.name;
  }

  // createEntity findOneEntity updateEntity paginationEntity deleteEntity
  async _create(createDt: CreateReqDto, query?: QueryRunner) {
    const queryRunner = this.dataSource.manager.connection.createQueryRunner();
    try {
      await queryRunner.startTransaction();
      await queryRunner.connect();
      return await this.reqRepo.createEntity(createDt, queryRunner);
    } catch (e) {
      await queryRunner.rollbackTransaction();
      console.log(e);
      const result = await HandlerError.errorHandler(e);
      await this.handlerService.handlerException400('FA', result);
    } finally {
      await queryRunner.release();
    }
  }
  _resultCreateDto(ent: ReqEnt) {
    return new ReqCUDto(ent)
  }

  async _getOne(searchDto: string, options?: FindOneOptions) {
    return await this.reqRepo.findOneEntity(searchDto, options);
  }
  _resultGetOneDto(ent: ReqEnt) {
    return new ReqGDto(ent)
  }

  async _update(id_req: string, updateDt: UpdateReqDto, query?: QueryRunner) {
    const reqEnt = await this.dataSource.manager.findOne(ReqEnt, {
      where: { id: id_req },
    });
    if (!reqEnt)
      throw new Error(
        `${JSON.stringify({
          section: 'req',
          value: ReqEnum.REQ_NOT_EXISTS,
        })}`,
      );
    return await this.reqRepo.updateEntity(reqEnt, updateDt, query);
  }

  _resultUpdateDto(ent: ReqEnt) {
    return new ReqCUDto(ent)
  }

  async _delete(id_req: string) {
    const req = await this.dataSource.manager.findOne(ReqEnt, {
      where: {
        id: id_req,
      },
    });
    if (!req)
      throw new Error(
        `${JSON.stringify({
          section: 'req',
          value: ReqEnum.REQ_NOT_EXISTS
        })}`,
      );
    req.name = 'deleted' + '_' + req.name + '_' + req.id;
    await this.dataSource.manager.save(req)
    return await this.reqRepo.deleteEntity(req);
  }
  _resultDeleteDto(ent: ReqEnt) {
    return new SuccessDto(true)
  }

  async _pagination(pageDto: ReqPageDto) {
    return await this.reqRepo.paginationEntity(pageDto)
  }

  async findDefaultReq() {
    try {
      return await this.reqRepo.findDefaultReq();
    } catch (e) {
      console.log(e);
    }
  }
  async findAllReq(): Promise<ReqEnt[]> {
    try {
      return await this.reqRepo.findAllReq();
    } catch (e) {
      throw e;
    }
  }

  async findAllReqWithIdProject(id_project: string): Promise<ReqEnt[]> {
    try {
      return await this.reqRepo.findAllReqWithIdProject(id_project);
    } catch (e) {
      throw e;
    }
  }


  async getAllReqAndTask(id_project: string, pageDto: ReqPageDto) {
    try {
      return await this.reqRepo.getAllReqAndTask(id_project, pageDto);
    } catch (e) {
      throw e;
    }
  }

  async getAllDoneReq(doneReqDto: DoneReqDto) {
    try {
      return await this.reqRepo.getAllDoneReq(doneReqDto);
    } catch (e) {
      throw e;
    }
  }

  async allReqWithoutTask(id_user: string) {
    try {
      return await this.reqRepo.allReqWithoutTask(id_user);
    } catch (e) {
      throw e;
    }
  }

  async allReqWithoutTaskAdmin() {
    try {
      return await this.reqRepo.allReqWithoutTaskAdmin();
    } catch (e) {
      throw e;
    }
  }

  async allReqBasedOnUserId(id_user: string) {
    try {
      return await this.reqRepo.allReqBasedOnUserId(id_user);
    } catch (e) {
      throw e;
    }
  }

  async reqPaginationUser(pageDto: ReqPageDto, id_user: string) {
    try {
      return await this.reqRepo.reqPaginationUser(pageDto, id_user);
    } catch (e) {
      throw e;
    }
  }

}
