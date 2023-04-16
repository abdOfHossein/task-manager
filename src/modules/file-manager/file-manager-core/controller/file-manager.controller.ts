import { Body, Controller, Delete, Get, Post, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiHeader, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { PageDto } from 'src/common/dtos/page.dto';
import { ParamResultEnum } from 'src/common/enums/param.result.enum';
import { CreateFileManagerDto } from '../../modules/dtos/create.file-manager.dto';
import { FileManagerEnt } from '../../modules/entities/file-manager.entity';
import { RecieveTypeEnum } from '../../modules/enums/file-manager.enum';
import { FileManagerPageDto } from '../../modules/paginations/file-manager.page.dto';
import { FileManagerService } from '../../modules/services/file-manager.service';

@ApiTags('FileManager')
@ApiHeader({
  name: 'accept-language',
  description: 'language code',
  schema: {
    default: 'fa',
  },
})
@ApiBearerAuth('access-token')
@Controller('FileManager')
export class FileManagerController {
  constructor(private fileManager: FileManagerService) { }

  @ApiOperation({ summary: 'create FileManager' })
  @Post()
  createFileManager(
    @Body() createFileManagerDto: CreateFileManagerDto,
  ): Promise<FileManagerEnt> {
    return this.fileManager.create(createFileManagerDto, ParamResultEnum.DTO);
  }

  @ApiQuery({
    name: 'destination_id',
    required: false,
  })
  @ApiOperation({ summary: 'findOne FileManager' })
  @Get()
  findOneFileManager(
    @Query('destination_id') destination_id: string,
    @Query('recieve_type') recieve_type: RecieveTypeEnum,
  ): Promise<FileManagerEnt | FileManagerEnt[]> {
    let findFileManagerDto: any = {};
    findFileManagerDto.destination_id = destination_id;
    findFileManagerDto.reciverType = recieve_type;
    return this.fileManager.findOneFileManager(findFileManagerDto);
  }

  @ApiOperation({ summary: 'delete FileManager' })
  @Delete()
  deleteFileManager(
    @Query('id_fileManager') id_fileManager: string,
  ): Promise<FileManagerEnt> {
    return this.fileManager.delete(id_fileManager, ParamResultEnum.DTO);
  }

  @ApiOperation({ summary: 'pagination for FileManager' })
  @Post('page')
  paginationFileManager(
    @Body() pageDto: FileManagerPageDto,
  ): Promise<PageDto<FileManagerEnt>> {
    return this.fileManager.pagination(pageDto);
  }
}
