import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AbstractServiceClass } from 'src/common/abstract/abstract.service.class';
import { HandlerError } from 'src/common/class/handler.error';
import { HandlerService } from 'src/utility/handler/handler.service';
import { DataSource, FindOneOptions, QueryRunner } from 'typeorm';
import { CreateEventDto } from '../dtos/create.event.dto';
import { UpdateEventDto } from '../dtos/update.event.dto';
import { EventEnt } from '../entities/event.entity';
import { EventPageDto } from '../paginations/event.page.dto';
import { EventRepo } from '../repositories/event.repository';
import { EventCUDto } from '../result/task.c.u.dto';
import { EventGDto } from '../result/task.g.dto';

@Injectable()
export class EventService extends AbstractServiceClass<
  EventEnt,
  CreateEventDto,
  UpdateEventDto,
  EventPageDto
> {
  public constructor(
    private eventRepo: EventRepo,
    handlerService: HandlerService,
    @InjectRepository(EventEnt)
    public dataSource: DataSource,
  ) {
    super(dataSource, handlerService);
    this.className = this.constructor.name;
  }


  protected _delete(searchDto: string, query?: QueryRunner) {
    throw new Error('Method not implemented.');
  }
  _resultDeleteDto(ent: EventEnt) {
    throw new Error('Method not implemented.');
  }
  async _create(createDt: CreateEventDto, query?: QueryRunner) {
    return await this.eventRepo.createEntity(createDt, query);
  }
  _resultCreateDto(ent: EventEnt) {
    return new EventCUDto(ent)
  }

  async _getOne(searchDto: string, options?: FindOneOptions) {
    return await this.eventRepo.findOneEntity(searchDto, options);
  }
  _resultGetOneDto(ent: EventEnt) {
    return new EventGDto(ent)
  }

  async _update(
    Event_Id: string,
    updateDt: UpdateEventDto,
    query?: QueryRunner,
  ) {
    try {
      const eventEnt = await this.dataSource.manager.findOne(EventEnt, { where: { id: Event_Id } })
      return await this.eventRepo.updateEntity(eventEnt, updateDt, query);
    } catch (e) {
      console.log(e);
      const result = await HandlerError.errorHandler(e);
      await this.handlerService.handlerException400('FA', result);
    }
  }
  _resultUpdateDto(ent: EventEnt) {
    return new EventCUDto(ent)
  }

  async _pagination(pageDto: EventPageDto) {
    return await this.eventRepo.paginationEntity(pageDto);
  }
}
