import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AbstractServiceClass } from 'src/common/abstract/abstract.service.class';
import { HandlerError } from 'src/common/class/handler.error';
import { SuccessDto } from 'src/common/result/success.dto';
import { FileEnum } from 'src/common/translate/enums/file.enum';
import { ProjectEnum } from 'src/common/translate/enums/project.enum';
import { FileEnt } from 'src/modules/file/modules/entities/file.entity';
import { TypeFileEnum } from 'src/modules/file/modules/enums/type.file.enum';
import { HandlerService } from 'src/utility/handler/handler.service';
import { DataSource, FindOneOptions, QueryRunner } from 'typeorm';
import { CreateProjectDto } from '../dtos/create.project.dto';
import { UpdateProjectDto } from '../dtos/update.project.dto';
import { ProjectEnt } from '../entities/project.entity';
import { ProjectPageDto } from '../paginations/project.page.dto';
import { ProjectRepo } from '../repositories/project.repository';
import { ProjectCUDto } from '../result/project.c.u.dto';
import { ProjectGDto } from '../result/project.g.dto';

@Injectable()
export class ProjectService extends AbstractServiceClass<
  ProjectEnt,
  CreateProjectDto,
  UpdateProjectDto,
  ProjectPageDto
> {
  public constructor(
    @InjectRepository(FileEnt)
    public dataSource: DataSource,
    private projectRepo: ProjectRepo,
    handlerService: HandlerService,
  ) {
    super(dataSource, handlerService);
    this.className = this.constructor.name;
  }

  async _create(createDt: CreateProjectDto, query?: QueryRunner) {
    if(createDt.unq_file && createDt.unq_file.length>0){
      const file = await this.dataSource.manager.findOne(FileEnt, {
        where: { unq_file: createDt.unq_file, type_file: TypeFileEnum.PROJECT },
      }); 
      if (!file) {
        throw new Error(
          `${JSON.stringify({
            section: 'file',
            value: FileEnum.FILE_NOT_EXISTS,
          })}`,
        );
      }
      createDt.file = file;
    }
    
    return await this.projectRepo.createEntity(createDt, query);
  }
  _resultCreateDto(ent: ProjectEnt) {
    return new ProjectCUDto(ent)
  }

  async _getOne(searchDto: string, options?: FindOneOptions) {
    return await this.projectRepo.findOneEntity(searchDto, options);
  }
  _resultGetOneDto(ent: ProjectEnt) {
    return new ProjectGDto(ent)
  }

  async _update(
    id_project: string,
    updateDt: UpdateProjectDto,
    query?: QueryRunner,
  ) {
    const projectEnt = await this.dataSource.manager.findOne(ProjectEnt, {
      where: {
        id: id_project,
      },
    });
    return await this.projectRepo.updateEntity(projectEnt, updateDt, query);
  }
  _resultUpdateDto(ent: ProjectEnt) {
    return new ProjectCUDto(ent)
  }
  async _delete(id_projectt: string) {
    const projectEnt = await this.dataSource.manager.findOne(ProjectEnt, {
      where: { id: id_projectt },
    });
    if (!projectEnt)
      throw new Error(
        `${JSON.stringify({
          section: 'project',
          value: ProjectEnum.PROJECT_NOT_EXISTS
        })}`,)

    projectEnt.project_name = 'deleted' + '_' + projectEnt.project_name + '_' + projectEnt.id;
    await this.dataSource.manager.save(projectEnt)
    return await this.projectRepo.deleteEntity(projectEnt);
  }
  _resultDeleteDto(ent: ProjectEnt) {
    return new SuccessDto(true)
  }

  async _pagination(pageDto: ProjectPageDto) {
    return await this.projectRepo.paginationEntity(pageDto);
  }


  async getAllProject() {
    try {
      return await this.projectRepo.getAllProject();
    } catch (e) {
      console.log(e);
      const result = await HandlerError.errorHandler(e);
      await this.handlerService.handlerException400('FA', result);
    }
  }

  async allProjectWithIdUSer(id_user: string) {
    try {
      return await this.projectRepo.allProjectWithIdUSer(id_user);
    } catch (e) {
      console.log(e);
      const result = await HandlerError.errorHandler(e);
      await this.handlerService.handlerException400('FA', result);
    }
  }
  async allProjectWithReq() {
    try {
      return await this.projectRepo.allProjectWithReq();
    } catch (e) {
      console.log(e);
      const result = await HandlerError.errorHandler(e);
      await this.handlerService.handlerException400('FA', result);
    }
  }


}
