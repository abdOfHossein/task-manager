import { Injectable } from '@nestjs/common';
import { AbstractServiceClass } from 'src/common/abstract/abstract.service.class';
import { HandlerError } from 'src/common/class/handler.error';
import { SuccessDto } from 'src/common/result/success.dto';
import { MessageUserEnum } from 'src/common/translate/enums/message-user.enum';
import { HandlerService } from 'src/utility/handler/handler.service';
import { DataSource, FindOneOptions, QueryRunner } from 'typeorm';
import { CreateMessageUserDto } from '../dtos/create.message-user.dto';
import { UpdateMessageUserDto } from '../dtos/update.message-user.dto';
import { MessageUserEnt } from '../entities/message-user.entity';
import { MessageUserPageDto } from '../paginations/message-user.page.dto';
import { MessageUserRepo } from '../repositories/message-user.repository';

@Injectable()
export class MessageUserService extends AbstractServiceClass<
  MessageUserEnt,
  CreateMessageUserDto,
  UpdateMessageUserDto,
  MessageUserPageDto
> {

  public constructor(
    private messageUserRepo: MessageUserRepo,
    handlerService: HandlerService,
    public dataSource: DataSource,
  ) {
    super(dataSource, handlerService);
    this.className = this.constructor.name;
  }

  protected _getOne(searchDto: string, options?: FindOneOptions<any>) {
    throw new Error('Method not implemented.');
  }
  _resultGetOneDto(ent: MessageUserEnt) {
    throw new Error('Method not implemented.');
  }
  protected _create(createDt: CreateMessageUserDto, query?: QueryRunner) {
    throw new Error('Method not implemented.');
  }
  _resultCreateDto(ent: MessageUserEnt) {
    throw new Error('Method not implemented.');
  }

  protected _update(
    role_Id: string,
    updateDt: UpdateMessageUserDto,
    query?: QueryRunner,
  ) {
    throw new Error('Method not implemented.');
  }
  _resultUpdateDto(ent: MessageUserEnt) {
    throw new Error('Method not implemented.');
  }
  protected _pagination(pageDto: MessageUserPageDto) {
    throw new Error('Method not implemented.');
  }

  async _delete(id_message_user: string, query?: QueryRunner) {

    const messageUserEnt = await this.dataSource.manager.findOne(
      MessageUserEnt,
      {
        where: { id: id_message_user },
      },
    );
    if (!messageUserEnt)
      throw new Error(
        `${JSON.stringify({
          section: 'message_user',
          value: MessageUserEnum.MESSAGE_USER_NOT_EXISTS,
        })}`,
      );
    return await this.messageUserRepo.deleteEntity(
      messageUserEnt,
      query,
    );
  }
  _resultDeleteDto(ent: MessageUserEnt) {
    return new SuccessDto(true)
  }

  async paginationMessageUser(
    id_user: string,
    reportPage: MessageUserPageDto,
    query?: QueryRunner,
  ) {
    return await this.messageUserRepo.paginationMessageUser(
      id_user,
      reportPage,
      query,
    );
  }
}
