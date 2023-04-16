import {
  Controller,
  Get,
  Param,
  Post,
  Res,
  UploadedFile,
  UseInterceptors
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiHeader,
  ApiOperation,
  ApiTags
} from '@nestjs/swagger';
import { Response } from 'express';
import { PublicJwt } from 'src/common/decorates/public.jwt.decorator';
import { PublicRole } from 'src/common/decorates/public.role.decorator';
import { TypeFileEnum } from '../../modules/enums/type.file.enum';
import { FileInterceptors } from '../../modules/interceptors/file.interceptors';
import { FileService } from '../../modules/service/file.service';


@ApiTags('File')
@ApiHeader({
  name: 'language-code',
  description: 'language code',
  schema: {
    default: 'FA',
  },
})
@ApiBearerAuth('access-token')
@Controller('file')
export class FileController {
  constructor(private fileService: FileService) { }

  @Post('/upload')
  @UseInterceptors(FileInterceptors)
  @UseInterceptors(FileInterceptor('file', { dest: 'uploads/' }))
  @ApiOperation({ summary: 'Upload File' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        type_file: {
          type: 'enum',
          enum: [TypeFileEnum.PROJECT, TypeFileEnum.PROFILE],
        },
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @ApiConsumes('multipart/form-data')
  async uploadFilePublic(@UploadedFile('file') file: Express.Multer.File) {
    return await this.fileService.uploadFilePublic(file);
  }

  @ApiOperation({ summary: 'download Files' })
  @Get('stream-file/:id_unq_file')
  @PublicJwt()
  @PublicRole()
  async getFile(
    @Res() res: Response,
    @Param('id_unq_file') id_unq_file: string,
  ): Promise<any> {
    const languageInfo = 'FA';
    return await this.fileService.downloadFile(res, id_unq_file, languageInfo);
  }
}
