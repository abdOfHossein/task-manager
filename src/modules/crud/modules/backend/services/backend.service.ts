import { Injectable } from '@nestjs/common';
import { AbstractServiceClass } from 'src/common/abstract/abstract.service.class';
import { SuccessDto } from 'src/common/result/success.dto';
import { HandlerService } from 'src/utility/handler/handler.service';
import { DataSource, FindOneOptions, QueryRunner } from 'typeorm';
import { CreateBackendDto } from '../dtos/create.backend.dto';
import { UpdateBackendDto } from '../dtos/update.backend.dto';
import { BackendEnt } from '../entities/backend.entity';
import { BackendPageDto } from '../pagination/backend.page.dto';
import { BackendRepo } from '../repositories/backend.repository';
import { BackendCUDto } from '../results/backend.c.u.dto';
import { BackendGDto } from '../results/backend.g.dto';

@Injectable()
export class BackendService extends AbstractServiceClass<
  BackendEnt,
  CreateBackendDto,
  UpdateBackendDto,
  BackendPageDto
> {

  public constructor(
    private backendRepo: BackendRepo,
    handlerService: HandlerService,
    dataSource: DataSource,
  ) {
    super(dataSource, handlerService);
    this.className = this.constructor.name;
  }

  async _create(createDt: CreateBackendDto, query?: QueryRunner) {
    return await this.backendRepo.createEntity(createDt, query);
  }
  _resultCreateDto(ent: BackendEnt) {
    return new BackendCUDto(ent);
  }

  async _getOne(searchDto: string, options?: FindOneOptions<any>) {
    return await this.backendRepo.findOneEntity(searchDto, options);
  }
  _resultGetOneDto(ent: BackendEnt) {
    return new BackendGDto(ent);
  }


  async _delete(searchDto: string, query?: QueryRunner) {
    const backendEnt = await this.dataSource.manager.findOne(BackendEnt, { where: { id: searchDto } })
    backendEnt.slug_name = 'deleted' + '_' + backendEnt.slug_name + '_' + backendEnt.id;
    await this.dataSource.manager.save(backendEnt)
    return await this.backendRepo.deleteEntity(backendEnt, query);
  }
  _resultDeleteDto(ent: BackendEnt) {
    return new SuccessDto(true);
  }

  async _update(
    backend_Id: string,
    updateDt: UpdateBackendDto,
    query?: QueryRunner,
  ) {

    const backendEnt = await this.dataSource.manager.findOne(BackendEnt, { where: { id: backend_Id } })
    return await this.backendRepo.updateEntity(backendEnt, updateDt, query);

  }
  _resultUpdateDto(ent: BackendEnt) {
    return new BackendCUDto(ent);
  }

  async _pagination(pageDto: BackendPageDto) {

    return await this.backendRepo.paginationEntity(pageDto);

  }

  async findOneByRoute(route: string) {
    return await this.backendRepo.findOneByRoute(route);
  }
}
