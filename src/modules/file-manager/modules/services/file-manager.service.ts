import { Injectable } from '@nestjs/common';
import { AbstractServiceClass } from 'src/common/abstract/abstract.service.class';
import { HandlerError } from 'src/common/class/handler.error';
import { SuccessDto } from 'src/common/result/success.dto';
import { HandlerService } from 'src/utility/handler/handler.service';
import { DataSource, FindOneOptions, QueryRunner } from 'typeorm';
import { CreateFileManagerDto } from '../dtos/create.file-manager.dto';
import { FindFileManagerDto } from '../dtos/find.file-manager.dto';
import { UpdateFileManagerDto } from '../dtos/update.file-manager.dto';
import { FileManagerEnt } from '../entities/file-manager.entity';
import { FileManagerPageDto } from '../paginations/file-manager.page.dto';
import { FileManagerRepo } from '../repositories/file-manager.repository';
import { FileManagerCUDto } from '../result/file-manager.c.u.dto';

@Injectable()
export class FileManagerService extends AbstractServiceClass<
  FileManagerEnt,
  CreateFileManagerDto,
  UpdateFileManagerDto,
  FileManagerPageDto
> {
  public constructor(
    private fileManagerRepo: FileManagerRepo,
    handlerService: HandlerService,
    public dataSource: DataSource,
  ) {
    super(dataSource, handlerService);
    this.className = this.constructor.name;
  }

  protected _getOne(searchDto: string, options?: FindOneOptions<any>) {
    throw new Error('Method not implemented.');
  }
  _resultGetOneDto(ent: FileManagerEnt) {
    throw new Error('Method not implemented.');
  }

  protected _update(
    role_Id: string,
    updateDt: UpdateFileManagerDto,
    query?: QueryRunner,
  ) {
    throw new Error('Method not implemented.');
  }
  _resultUpdateDto(ent: FileManagerEnt) {
    return new Error('Method not implemented.');
  }

  async _create(createDt: CreateFileManagerDto, query?: QueryRunner) {
    return await this.fileManagerRepo.createEntity(createDt, query);
  }
  _resultCreateDto(ent: FileManagerEnt) {
    return new FileManagerCUDto(ent)
  }

  async findOneFileManager(
    findFileManagerDto: FindFileManagerDto,
    options?: FindOneOptions,
  ) {
    try {
      return await this.fileManagerRepo.findOneFileManager(
        findFileManagerDto,
        options,
      );
    } catch (e) {
      console.log(e);
      const result = await HandlerError.errorHandler(e);
      await this.handlerService.handlerException400('FA', result);
    }
  }

  async _delete(id_fileManager: string) {
    const fileManagerEnt = await this.dataSource.manager.findOne(FileManagerEnt, { where: { id: id_fileManager } })
    return await this.fileManagerRepo.deleteEntity(fileManagerEnt);
  }
  _resultDeleteDto(ent: FileManagerEnt) {
    return new SuccessDto(true)
  }

  async _pagination(pageDto: FileManagerPageDto) {
    return await this.fileManagerRepo.paginationEntity(pageDto);
  }
}
