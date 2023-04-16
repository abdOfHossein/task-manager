import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AbstractServiceClass } from 'src/common/abstract/abstract.service.class';
import { HandlerService } from 'src/utility/handler/handler.service';
import { DataSource, FindOneOptions, QueryRunner } from 'typeorm';
import { CreateRelTaskDto } from '../dtos/create.rel-task.dto';
import { UpdateRelTaskDto } from '../dtos/update.rel-task.dto';
import { RelTaskEnt } from '../entities/rel-task.entity';
import { RelTaskPageDto } from '../paginations/rel-task.page.dto';
import { RelTaskRepo } from '../repositories/rel-task.repository';
import { RelTaskCUDto } from '../result/rel-task.c.u.dto';
import { RelTaskGDto } from '../result/rel-task.g.dto';

@Injectable()
export class RelTaskService extends AbstractServiceClass<
  RelTaskEnt,
  CreateRelTaskDto,
  UpdateRelTaskDto,
  RelTaskPageDto
> {
  public constructor(
    @InjectRepository(RelTaskEnt)
    public dataSource: DataSource,
    handlerService: HandlerService,
    private relTaskRepo: RelTaskRepo,
  ) {
    super(dataSource, handlerService);
    this.className = this.constructor.name;
  }


  protected _delete(searchDto: string, query?: QueryRunner) {
    throw new Error('Method not implemented.');
  }
  _resultDeleteDto(ent: RelTaskEnt) {
    throw new Error('Method not implemented.');
  }

  async _create(createDt: CreateRelTaskDto, query?: QueryRunner) {
    return await this.relTaskRepo.createEntity(createDt, query);
  }
  _resultCreateDto(ent: RelTaskEnt) {
    return new RelTaskCUDto(ent)
  }

  async _getOne(searchDto: string, options?: FindOneOptions) {
    return await this.relTaskRepo.findOneEntity(searchDto, options);
  }
  _resultGetOneDto(ent: RelTaskEnt) {
    return new RelTaskGDto(ent)
  }

  async _update(
    RelTask_Id: string,
    updateDt: UpdateRelTaskDto,
    query?: QueryRunner,
  ) {
    const relTaskEnt = await this.dataSource.manager.findOne(RelTaskEnt, {
      where: { id: RelTask_Id },
    });
    return await this.relTaskRepo.updateEntity(relTaskEnt, updateDt, query);
  }
  _resultUpdateDto(ent: RelTaskEnt) {
    return new RelTaskCUDto(ent)
  }

  async _pagination(pageDto: RelTaskPageDto) {
    return await this.relTaskRepo.paginationEntity(pageDto);
  }
}
