import { InjectRepository } from '@nestjs/typeorm';
import { AbstractRepositoryClass } from 'src/common/abstract/abstract.repository.class';
import { PageDto } from 'src/common/dtos/page.dto';
import { PageMetaDto } from 'src/common/dtos/page.meta.dto';
import { PublicFunc } from 'src/common/function/public.func';
import { EventEnum } from 'src/common/translate/enums/event.enum';
import { HandlerService } from 'src/utility/handler/handler.service';
import { DataSource, FindOneOptions, QueryRunner } from 'typeorm';
import { CreateEventDto } from '../dtos/create.event.dto';
import { UpdateEventDto } from '../dtos/update.event.dto';
import { EventEnt } from '../entities/event.entity';
import { EventMapperPagination } from '../mapper/event.mapper.pagination';
import { EventPageDto } from '../paginations/event.page.dto';

export class EventRepo extends AbstractRepositoryClass<
  EventEnt,
  CreateEventDto,
  UpdateEventDto,
  EventPageDto
> {
  constructor(
    @InjectRepository(EventEnt)
    public dataSource: DataSource,
    handlerService: HandlerService,
  ) {
    super(dataSource, handlerService);
  }

  _deleteEntity(entity: EventEnt, query?: QueryRunner): Promise<EventEnt> {
    throw new Error('Method not implemented.');
  }

  async _createEntity(
    createDto: CreateEventDto,
    query: QueryRunner | undefined,
  ): Promise<EventEnt> {
    const eventEnt = new EventEnt();
    eventEnt.title = createDto.title;
    eventEnt.priority = createDto.priority;
    eventEnt.start_date = createDto.start_date;
    eventEnt.end_date = createDto.end_date;
    if (query) return await query.manager.save(eventEnt);
    return await this.dataSource.manager.save(eventEnt);
  }

  async _findOneEntity(
    searchDto: string,
    options?: FindOneOptions,
  ): Promise<EventEnt> {
    const event = await this.dataSource.manager.findOne(EventEnt, {
      where: { id: searchDto },
    });
    if (!event)
      throw new Error(
        `${JSON.stringify({
          section: 'event',
          value: EventEnum.EVENT_NOT_EXISTS,
        })}`,
      );
    return event;
  }

  async _updateEntity(
    entity: EventEnt,
    updateDto: UpdateEventDto,
    query?: QueryRunner,
  ): Promise<EventEnt> {
    entity.title = updateDto.title;
    entity.priority = updateDto.priority;
    entity.start_date = updateDto.start_date;
    entity.end_date = updateDto.end_date;
    if (query) return await query.manager.save(entity);
    return await this.dataSource.manager.save(entity);
  }

  async _paginationEntity(pageDto: EventPageDto): Promise<PageDto<EventEnt>> {
    const queryBuilder = this.dataSource.manager.createQueryBuilder(
      EventEnt,
      'event',
    ).select(['event.id', 'event.priority', 'event.start_date', 'event.end_date', 'event.title'])

    if (pageDto.base) {
      const row = pageDto.base.row;
      const skip = PublicFunc.skipRow(pageDto.base.page, pageDto.base.row);
      queryBuilder.skip(skip).take(row);
    }
    if (pageDto.filter) {
      if (pageDto.filter.priority) {
        queryBuilder.andWhere('event.priority = :priority', {
          priority: pageDto.filter.priority,
        });
      }
      if (pageDto.filter.start_date) {
        queryBuilder.andWhere('event.start_date = :start_date', {
          start_date: `%${pageDto.filter.start_date}%`,
        });
      }

      if (pageDto.filter.end_date) {
        queryBuilder.andWhere('event.end_date = :end_date', {
          end_date: `%${pageDto.filter.end_date}%`,
        });
      }
      if (pageDto.filter.title) {
        queryBuilder.andWhere('event.title LIKE :title', {
          title: `%${pageDto.filter.title}%`,
        });
      }
    }
    if (pageDto.field) {
      const mapper = EventMapperPagination[pageDto.field];
      if (!mapper)
        throw new Error(
          `${JSON.stringify({
            section: 'public',
            value: 'Column Not Exist',
          })}`,
        );
      queryBuilder.addOrderBy(
        `${EventMapperPagination[pageDto.field]}`,
        pageDto.base.order,
      );
    }
    const result = await queryBuilder.getManyAndCount();
    const pageMetaDto = new PageMetaDto({
      baseOptionsDto: pageDto.base,
      itemCount: result[1],
    });
    return new PageDto(result[0], pageMetaDto);
  }

}
