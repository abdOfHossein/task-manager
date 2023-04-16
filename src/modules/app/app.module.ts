import { RedisModule } from '@nestjs-modules/ioredis';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import appConfiguration from 'src/config/configs/app-configuration';
import { SwaggerService } from 'src/config/swagger/service/swagger.service';
import { HandlerModule } from 'src/utility/handler/handler.module';
import { TranslateModule } from 'src/utility/translate/translate.module';
import { DataSource, DataSourceOptions } from 'typeorm';
import { checkDatabase } from 'typeorm-extension';
import { createDatabase } from 'typeorm-extension/dist/database';
import { CrudCoreModule } from '../crud/crud_core/crud-core.module';
import { DepartmentRlCoreModule } from '../department-rl/department-rl-core/department-rl-core.module';
import { DepartmentCoreModule } from '../department/department-core/department-core.module';
import { EventCoreModule } from '../event/event-core/event-core.module';
import { FileManagerCoreModule } from '../file-manager/file-manager-core/file-manager-core.module';
import { FileCoreModule } from '../file/file-core/file-core.module';
import { MessageUserCoreModule } from '../message-user/message-user-core/message-user-core.module';
import { MessageCoreModule } from '../message/message-core/message-core.module';
import { ProjectCoreModule } from '../project/project-core/project-core.module';
import { RelTaskCoreModule } from '../rel-task/rel-task-core/rel-task-core.module';
import { ReqCoreModule } from '../req/req-core/req-core.module';
import { RoleCoreModule } from '../role/role-core/role-core.module';
import { TaskBlockOperationCoreModule } from '../task-cblock-operation/task-core/task-block-operation-core.module';
import { TaskCoreModule } from '../task/task-core/task-core.module';
import { UserCoreModule } from '../user/user-core/user-core.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `.${process.env.NODE_ENV}.env`,
      isGlobal: true,
      load: [appConfiguration],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        const options: TypeOrmModuleOptions = {
          type: 'postgres',
          host: process.env.DB_HOST,
          port: Number(process.env.DB_PORT),
          database: process.env.DB_DATABASE,
          username: process.env.DB_USERNAME,
          password: process.env.DB_PASSWORD,
          entities: ['dist/**/*.entity.js', '**/*.entity.js'],
          migrations: ['dist/migrations/*{.ts,.js}'],
          synchronize: process.env.DB_SYNCHRONIZE == "true",
        }

        const dataSourceOptions: DataSourceOptions = {
          type: 'postgres',
          host: process.env.DB_HOST,
          database: process.env.DB_DATABASE,
          username: process.env.DB_USERNAME,
          password: process.env.DB_PASSWORD,
          port: Number(process.env.DB_PORT),
          migrations: [
            'dist/migrations/*{.ts,.js}',
          ],
          migrationsTableName: '1677055597235-update-schema-table',
          migrationsRun: true

        }

        if (!(await checkDatabase({ options: dataSourceOptions })).exists) {
          createDatabase({ options: dataSourceOptions }).then((res) => {
          }).catch((err) => {
            console.log(err)
          })
        }
        return options;
      },
      dataSourceFactory: async (options) => {
        const dataSource = await new DataSource(options).initialize();
        return dataSource;
      },
    }),
    CrudCoreModule,
    HandlerModule,
    TranslateModule,
    FileManagerCoreModule,
    RedisModule.forRootAsync({
      useFactory: () => ({
        config: { 
          url: 'redis://127.0.0.1:6379',
        },
      }),
    }),
    UserCoreModule,
    DepartmentCoreModule,
    TaskCoreModule,
    TaskBlockOperationCoreModule,
    RelTaskCoreModule,
    ProjectCoreModule,
    ReqCoreModule,
    RoleCoreModule,
    DepartmentRlCoreModule,
    EventCoreModule,
    FileCoreModule,
    MessageCoreModule,
    MessageUserCoreModule,
  ],
  controllers: [AppController],
  providers: [AppService, SwaggerService,],
})
export class AppModule { }

