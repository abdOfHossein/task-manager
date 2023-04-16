import { Module } from '@nestjs/common';
import { FileModule } from '../modules/file.module';
import { FileController } from './controller/file.controller';

@Module({
  imports: [FileModule],
  controllers: [FileController],
})
export class FileCoreModule {}
