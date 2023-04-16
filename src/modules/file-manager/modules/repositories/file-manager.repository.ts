import { InjectRepository } from '@nestjs/typeorm';
import { AbstractRepositoryClass } from 'src/common/abstract/abstract.repository.class';
import { PageDto } from 'src/common/dtos/page.dto';
import { PageMetaDto } from 'src/common/dtos/page.meta.dto';
import { PublicFunc } from 'src/common/function/public.func';
import { FileManagerEnum } from 'src/common/translate/enums/file-manager.enum';
import { HandlerService } from 'src/utility/handler/handler.service';
import { DataSource, FindOneOptions, QueryRunner } from 'typeorm';
import { CreateFileManagerDto } from '../dtos/create.file-manager.dto';
import { FindFileManagerDto } from '../dtos/find.file-manager.dto';
import { UpdateFileManagerDto } from '../dtos/update.file-manager.dto';
import { FileManagerEnt } from '../entities/file-manager.entity';
import { RecieveTypeEnum } from '../enums/file-manager.enum';
import { FileManagerMapperPagination } from '../mapper/file-manager.mapper.pagination';
import { FileManagerPageDto } from '../paginations/file-manager.page.dto';

export class FileManagerRepo extends AbstractRepositoryClass<
  FileManagerEnt,
  CreateFileManagerDto,
  UpdateFileManagerDto,
  FileManagerPageDto
> {
  _findOneEntity(searchDto: string, options?: FindOneOptions<any>): Promise<FileManagerEnt> {
    throw new Error('Method not implemented.');
  }
  _createEntity(createDto: CreateFileManagerDto, query?: QueryRunner): Promise<FileManagerEnt> {
    throw new Error('Method not implemented.');
  }
  _updateEntity(entity: FileManagerEnt, updateDto: UpdateFileManagerDto, query?: QueryRunner): Promise<FileManagerEnt> {
    throw new Error('Method not implemented.');
  }

  constructor(
    @InjectRepository(FileManagerEnt)
    public dataSource: DataSource,
    handlerService: HandlerService,
  ) {
    super(dataSource, handlerService);
  }
  async createEntity(
    createDto: CreateFileManagerDto,
    query: QueryRunner | undefined,
  ): Promise<FileManagerEnt> {
    const fileManagerEnt = new FileManagerEnt();
    fileManagerEnt.title = createDto.title;
    fileManagerEnt.description = createDto.description;
    fileManagerEnt.files = createDto.files;
    fileManagerEnt.reciverType = createDto.reciverType;
    if (query) return await query.manager.save(fileManagerEnt);
    return await this.dataSource.manager.save(fileManagerEnt);
  }

  async findOneFileManager(
    findFileManagerDto: FindFileManagerDto,
    options?: FindOneOptions,
  ): Promise<FileManagerEnt | FileManagerEnt[]> {

    const queryBuilder = this.dataSource.manager.createQueryBuilder(
      FileManagerEnt,
      'file_manager',
    );
    let fileManager: FileManagerEnt | FileManagerEnt[];
    if (findFileManagerDto.reciverType === RecieveTypeEnum.PUBLIC) {
      return (fileManager = await queryBuilder
        .where('file_manager.reciverType = :reciverType', {
          reciverType: findFileManagerDto.reciverType,
        })
        .getMany());
    }
    fileManager = await queryBuilder
      .where(
        'file_manager.destination_id = :destination_id AND file_manager.reciverType = :reciverType',
        {
          destination_id: findFileManagerDto.destination_id,
      
        },
      )
      .getOne();
    if (!fileManager)
      throw new Error(
        `${JSON.stringify({
          section: 'file_manager',
          value: FileManagerEnum.FILEMANAGER_NOT_EXISTS,
        })}`,
      );
    return fileManager;
  }

  async _deleteEntity(entity: FileManagerEnt) {

    await this.dataSource.manager.softRemove(entity);
    return entity;
  }

  async _paginationEntity(
    pageDto: FileManagerPageDto,
  ): Promise<PageDto<FileManagerEnt>> {
    const queryBuilder = this.dataSource.manager.createQueryBuilder(
      FileManagerEnt,
      'file_manager',
    ).select(['file_manager.id', 'file_manager.title', 'file_manager.destination_id', 'file_manager.description', 'file_manager.files', 'file_manager.reciverType'])
    if (pageDto.base) {
      const row = pageDto.base.row;
      const skip = PublicFunc.skipRow(pageDto.base.page, pageDto.base.row);
      queryBuilder.skip(skip).take(row);
    }
    if (pageDto.filter) {
      if (pageDto.filter.title) {
        queryBuilder.andWhere('file_manager.title LIKE :title', {
          title: `%${pageDto.filter.title}%`,
        });
      }
      if (pageDto.filter.reciverType) {
        queryBuilder.andWhere('file_manager.reciverType = :reciverType', {
          reciverType: pageDto.filter.reciverType,
        });
      }
    }
    if (pageDto.field) {
      const mapper = FileManagerMapperPagination[pageDto.field];
      if (!mapper)
        throw new Error(
          `${JSON.stringify({
            section: 'public',
            value: 'Column Not Exist',
          })}`,
        );
      queryBuilder.addOrderBy(
        `${FileManagerMapperPagination[pageDto.field]}`,
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
