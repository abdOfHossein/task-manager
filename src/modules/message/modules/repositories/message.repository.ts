import { InjectRepository } from '@nestjs/typeorm';
import { AbstractRepositoryClass } from 'src/common/abstract/abstract.repository.class';
import { PageDto } from 'src/common/dtos/page.dto';
import { DepartmentEnt } from 'src/modules/department/modules/entities/department.entity';
import { MessageUserEnt } from 'src/modules/message-user/modules/entities/message-user.entity';
import { UserEnt } from 'src/modules/user/modules/entities/user.entity';
import { HandlerService } from 'src/utility/handler/handler.service';
import { DataSource, FindOneOptions, QueryRunner } from 'typeorm';
import { CreateMessageDto } from '../dtos/create.message.dto';
import { UpdateMessageDto } from '../dtos/update.message.dto';
import { MessageEnt } from '../entities/message.entity';
import { RecieveTypeMessageEnum } from '../enum/recieve.type.message.enum';
import { MessagePageDto } from '../paginations/message.page.dto';

export class MessageRepo extends AbstractRepositoryClass<
  MessageEnt,
  CreateMessageDto,
  UpdateMessageDto,
  MessagePageDto
> {
  constructor(
    @InjectRepository(MessageEnt)
    @InjectRepository(MessageUserEnt)
    dataSource: DataSource,
    handlerService: HandlerService,
  ) {
    super(dataSource, handlerService);
  }

  _findOneEntity(
    searchDto: string,
    options?: FindOneOptions<any>,
  ): Promise<MessageEnt> {
    throw new Error('Method not implemented.');
  }

  _updateEntity(
    entity: MessageEnt,
    updateDto: UpdateMessageDto,
    query?: QueryRunner,
  ): Promise<MessageEnt> {
    throw new Error('Method not implemented.');
  }
  _deleteEntity(entity: MessageEnt, query?: QueryRunner): Promise<MessageEnt> {
    throw new Error('Method not implemented.');
  }
  _paginationEntity(pageDto: MessagePageDto): Promise<PageDto<MessageEnt>> {
    throw new Error('Method not implemented.');
  }

  async _createEntity(
    createDto: CreateMessageDto,
    query: QueryRunner | undefined,
  ): Promise<MessageEnt> {
    const messageEnt = new MessageEnt();
    messageEnt.to = createDto.to;
    messageEnt.title = createDto.title;
    messageEnt.content = createDto.content;
    messageEnt.recieve_type = createDto.recieve_type;
    messageEnt.publish_date = createDto.publish_date;
    messageEnt.message_type = createDto.message_type;
    let result: MessageEnt;
    if (query) {

      result = await query.manager.save(messageEnt);
    } else {
      result = await this.dataSource.manager.save(messageEnt);
    }
    if (createDto.recieve_type === RecieveTypeMessageEnum.USERS) {
      for (const id_user of createDto.to) {
        const message_user = new MessageUserEnt();
        message_user.user_id = id_user;
        message_user.message = messageEnt;
        if (query) {
          await query.manager.save(message_user);
        } else {
          await this.dataSource.manager.save(message_user);
        }
      }
    } else if (createDto.recieve_type === RecieveTypeMessageEnum.DEPARTMENT) {
      for (const id_department of createDto.to) {
        const users = await this.dataSource.manager
          .createQueryBuilder(DepartmentEnt, 'department')
          .where('department.id = :id_department', { id_department })
          .leftJoinAndSelect('department.users', 'users')
          .getMany();
        for (const user of users) {
          const message_user = new MessageUserEnt();
          message_user.user_id = user.id;
          message_user.message = messageEnt;
          if (query) {
            await query.manager.save(message_user);
          } else {
            await this.dataSource.manager.save(message_user);
          }
        }
      }
    } else {
      const users = await this.dataSource.manager.find(UserEnt, {});
      for (const user of users) {
        const message_user = new MessageUserEnt();
        message_user.user_id = user.id;
        message_user.message = messageEnt;
        if (query) {
          await query.manager.save(message_user);
        } else {
          await this.dataSource.manager.save(message_user);
        }
      }
    }
    await query.commitTransaction();
    return result;
  }

  async getUsers(): Promise<MessageEnt[]> {
    return await this.dataSource.manager.createQueryBuilder(MessageEnt, 'message')
      .select(['message.id', 'message.to', 'message.title', 'message.content', 'message.content', 'message.recieve_type', 'message.message_type', 'message.publish_date'])
      .getMany()

  }

  async delelteMessage(entity: MessageEnt,query?:QueryRunner) {

    if (query) return await query.manager.softRemove(entity);
    return await this.dataSource.manager.softRemove(entity);
  }

  // async getAll(): Promise<MessageEnt[]> {
  //   return await this.dataSource.manager.find(MessageEnt, {});
  // }

  // async paginationMessage(
  //   id_user: string,
  //   pageDto: MessagePageDto,
  // ): Promise<PageDto<MessageEnt>> {
  //   const queryBuilder = this.dataSource.manager
  //     .createQueryBuilder(MessageEnt, 'Message')
  //     .where('Message.head_id = :head_id', { head_id: id_user })
  //     .select([
  //       'Message.id',
  //       'Message.priority',
  //       'Message.title',
  //       'Message.head_id',
  //       'Message.type',
  //       'Message.duration',
  //       'Message.status',
  //     ]);
  //   if (pageDto.base) {
  //     const row = pageDto.base.row;
  //     const skip = PublicFunc.skipRow(pageDto.base.page, pageDto.base.row);
  //     queryBuilder.skip(skip).take(row);
  //   }
  //   if (pageDto.filter) {
  //     if (pageDto.filter.priority) {
  //       queryBuilder.andWhere('Message.priority LIKE :priority', {
  //         priority: `%${pageDto.filter.priority}%`,
  //       });
  //     }
  //     if (pageDto.filter.title) {
  //       queryBuilder.andWhere('Message.title LIKE :title', {
  //         title: `%${pageDto.filter.title}%`,
  //       });
  //     }
  //     if (pageDto.filter.type) {
  //       queryBuilder.andWhere('Message.type LIKE :type', {
  //         type: `%${pageDto.filter.type}%`,
  //       });
  //     }
  //     if (pageDto.filter.status) {
  //       queryBuilder.andWhere('Message.status LIKE :status', {
  //         status: `%${pageDto.filter.status}%`,
  //       });
  //     }
  //   }
  //   if (pageDto.field) {
  //     const mapper = MessageMapperPagination[pageDto.field];
  //     if (!mapper)
  //       throw new Error(
  //         `${JSON.stringify({
  //           section: 'public',
  //           value: 'Column Not Exist',
  //         })}`,
  //       );
  //     queryBuilder.addOrderBy(
  //       `${MessageMapperPagination[pageDto.field]}`,
  //       pageDto.base.order,
  //     );
  //   }
  //   const result = await queryBuilder.getManyAndCount();
  //   const pageMetaDto = new PageMetaDto({
  //     baseOptionsDto: pageDto.base,
  //     itemCount: result[1],
  //   });
  //   return new PageDto(result[0], pageMetaDto);
  // }

  // async createMessageWithIdDepartment(
  //   id_department: string,
  //   createDto: CreateMessageDto,
  //   query: QueryRunner | undefined,
  // ): Promise<MessageEnt> {
  //   const req = await this.dataSource.manager.findOne(ReqEnt, {
  //     where: { isDefault: true },
  //   });
  //   const department = await this.dataSource.manager.findOne(DepartmentEnt, {
  //     where: { id: id_department },
  //   });

  //   const department_rl = await this.dataSource.manager
  //     .createQueryBuilder(DepartmentRlEnt, 'department_rl_ent')
  //     .where(
  //       'department_rl_ent.department = :department AND department_rl_ent.req = :req',
  //       { department: department.id, req: req.id },
  //     )
  //     .getOne();


  //   const MessageEnt = new MessageEnt();
  //   MessageEnt.head_id = createDto.head_id;
  //   MessageEnt.priority = createDto.priority;
  //   MessageEnt.title = createDto.title;
  //   MessageEnt.duration = createDto.duration;
  //   MessageEnt.status = createDto.status;
  //   MessageEnt.type = createDto.type;
  //   if (query) return await query.manager.save(MessageEnt);
  //   return await this.dataSource.manager.save(MessageEnt);
  // }

  // async createMessageWithIdDepartmentAndIdReq(
  //   id_req: string,
  //   id_department: string,
  //   createDto: CreateMessageDto,
  //   query: QueryRunner | undefined,
  // ): Promise<MessageEnt> {

  //   let req: ReqEnt;
  //   if (!id_req) {
  //     req = await this.dataSource.manager.findOne(ReqEnt, {
  //       where: { isDefault: true },
  //     });
  //   }
  //   req = await this.dataSource.manager.findOne(ReqEnt, {
  //     where: { id: id_req },
  //   });
  //   const department = await this.dataSource.manager.findOne(DepartmentEnt, {
  //     where: { id: id_department },
  //   });

  //   const department_rl = await this.dataSource.manager
  //     .createQueryBuilder(DepartmentRlEnt, 'department_rl_ent')
  //     .where(
  //       'department_rl_ent.department = :department AND department_rl_ent.req = :req',
  //       { department: department.id, req: req.id },
  //     )
  //     .getOne();


  //   const MessageEnt = new MessageEnt();
  //   MessageEnt.head_id = createDto.head_id;
  //   MessageEnt.priority = createDto.priority;
  //   MessageEnt.title = createDto.title;
  //   MessageEnt.duration = createDto.duration;
  //   MessageEnt.status = createDto.status;
  //   MessageEnt.type = createDto.type;
  //   if (query) return await query.manager.save(MessageEnt);
  //   return await this.dataSource.manager.save(MessageEnt);
  // }

  // async forwardMessage(
  //   id_prevoise_Message: string,
  //   createDto: CreateRelMessageDto,
  //   query: QueryRunner | undefined,
  // ) {
  //   await this.dataSource.manager.update(
  //     MessageEnt,
  //     { id: id_prevoise_Message },
  //     { status: StatusMessageEnum.FORWARD },
  //   );

  //   const srcMessage = await this.dataSource.manager.findOne(MessageEnt, {
  //     where: { id: id_prevoise_Message },
  //   });

  //   const refMessage = new MessageEnt();
  //   refMessage.head_id = createDto.head_id;
  //   refMessage.priority = createDto.priority;
  //   refMessage.title = createDto.title;
  //   refMessage.duration = createDto.duration;
  //   refMessage.status = createDto.status;
  //   refMessage.type = createDto.type;
  //   if (query) await query.manager.save(refMessage);
  //   await this.dataSource.manager.save(refMessage);

  //   const MessageRlEnt = new RelMessageEnt();
  //   MessageRlEnt.src = srcMessage;
  //   MessageRlEnt.ref = refMessage;
  //   MessageRlEnt.comment = createDto.comment;
  //   if (query) return await query.manager.save(MessageRlEnt);
  //   return await this.dataSource.manager.save(MessageRlEnt);
  // }
}
