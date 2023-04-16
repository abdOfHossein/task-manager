import { Injectable } from '@nestjs/common';
import { AbstractServiceClass } from 'src/common/abstract/abstract.service.class';
import { HandlerError } from 'src/common/class/handler.error';
import { SuccessDto } from 'src/common/result/success.dto';
import { MessageEnum } from 'src/common/translate/enums/message.enum';
import { HandlerService } from 'src/utility/handler/handler.service';
import { DataSource, FindOneOptions, QueryRunner } from 'typeorm';
import { CreateMessageDto } from '../dtos/create.message.dto';
import { UpdateMessageDto } from '../dtos/update.message.dto';
import { MessageEnt } from '../entities/message.entity';
import { MessagePageDto } from '../paginations/message.page.dto';
import { MessageRepo } from '../repositories/message.repository';
import { MessageCUDto } from '../result/message.c.u.dto';

@Injectable()
export class MessageService extends AbstractServiceClass<
  MessageEnt,
  CreateMessageDto,
  UpdateMessageDto,
  MessagePageDto
> {
  public constructor(
    private messageRepo: MessageRepo,
    handlerService: HandlerService,
    dataSource: DataSource,
  ) {
    super(dataSource, handlerService);
    this.className = this.constructor.name;
  }

  protected _getOne(searchDto: string, options?: FindOneOptions<any>) {
    throw new Error('Method not implemented.');
  }
  _resultGetOneDto(ent: MessageEnt) {
    throw new Error('Method not implemented.');
  }

  protected _update(
    role_Id: string,
    updateDt: UpdateMessageDto,
    query?: QueryRunner,
  ) {
    throw new Error('Method not implemented.');
  }
  _resultUpdateDto(ent: MessageEnt) {
    throw new Error('Method not implemented.');
  }
  protected _pagination(pageDto: MessagePageDto) {
    throw new Error('Method not implemented.');
  }

  async _create(createDt: CreateMessageDto, query?: QueryRunner) {
    const queryRunner = this.dataSource.manager.connection.createQueryRunner();
    try {
      await queryRunner.startTransaction();
      await queryRunner.connect();
      return await this.messageRepo.createEntity(createDt, queryRunner);
    } catch (e) {
      await queryRunner.rollbackTransaction();
      console.log(e);
      const result = await HandlerError.errorHandler(e);
      await this.handlerService.handlerException400('FA', result);
    } finally {
      await queryRunner.release();
    }
  }
  _resultCreateDto(ent: MessageEnt) {
    return new MessageCUDto(ent)
  }


  async _delete(id_message: string, query?: QueryRunner) {
    const messageEnt = await this.dataSource.manager.findOne(MessageEnt, {
      where: { id: id_message },
    });
    if (!messageEnt)
      throw new Error(
        `${JSON.stringify({
          section: 'messsage',
          value: MessageEnum.MESSAGE_NOT_EXISTS,
        })}`,
      );
    return await this.messageRepo.delelteMessage(messageEnt);
  }
  _resultDeleteDto(ent: MessageEnt) {
    return new SuccessDto(true)
  }

  async getUsers() {
    try {
      return await this.messageRepo.getUsers();
    } catch (e) {
      console.log(e);
      const result = await HandlerError.errorHandler(e);
      await this.handlerService.handlerException400('FA', result);
    }
  }

}
