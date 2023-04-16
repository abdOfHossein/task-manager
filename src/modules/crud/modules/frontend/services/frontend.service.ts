import { Injectable } from '@nestjs/common';
import { AbstractServiceClass } from 'src/common/abstract/abstract.service.class';
import { HandlerError } from 'src/common/class/handler.error';
import { SuccessDto } from 'src/common/result/success.dto';
import { HandlerService } from 'src/utility/handler/handler.service';
import { DataSource, FindOneOptions, QueryRunner } from 'typeorm';
import { CreateFrontendDto } from '../dtos/create.frontend.dto';
import { UpdateFrontendDto } from '../dtos/update.frontend.dto';
import { FrontendEnt } from '../entities/frontend.entity';
import { FrontendPageDto } from '../pagination/frontend.page.dto';
import { FrontendRepo } from '../repositories/frontend.repository';
import { FrontendCUDto } from '../results/frontend.c.u.dto';
import { FrontendGDto } from '../results/frontend.g.dto';

@Injectable()
export class FrontendService extends AbstractServiceClass<
  FrontendEnt,
  CreateFrontendDto,
  UpdateFrontendDto,
  FrontendPageDto
> {
  public constructor(
    private frontendRepo: FrontendRepo,
    handlerService: HandlerService,
    dataSource: DataSource,
  ) {
    super(dataSource, handlerService);
    this.className = this.constructor.name;
  }

  async _pagination(pageDto: FrontendPageDto) {
    return this.frontendRepo.paginationEntity(pageDto);
  }

  async _create(createDt: CreateFrontendDto, query?: QueryRunner) {
    return await this.frontendRepo.createEntity(createDt, query);

  }
  _resultCreateDto(ent: FrontendEnt) {
    return new FrontendCUDto(ent)
  }

  _getOne(searchDto: string, options?: FindOneOptions<any>) {
    return this.frontendRepo.findOneEntity(searchDto, options);
  }
  _resultGetOneDto(ent: FrontendEnt) {
    return new FrontendGDto(ent)
  }

  async _update(
    id_frontend: string,
    updateDt: UpdateFrontendDto,
    query?: QueryRunner,
  ) {
    const frontendEnt = await this.dataSource.manager.findOne(FrontendEnt, { where: { id: id_frontend } })
    return await this.frontendRepo.updateEntity(
      frontendEnt,
      updateDt,
      query,
    );

  }
  _resultUpdateDto(ent: FrontendEnt) {
    return new FrontendCUDto(ent)
  }

  async _delete(searchDto: string, query?: QueryRunner) {
    const frontendEnt = await this.dataSource.manager.findOne(FrontendEnt, { where: { id: searchDto } })
    frontendEnt.slug_name = 'deleted' + '_' + frontendEnt.slug_name + '_' + frontendEnt.id;
    await this.dataSource.manager.save(frontendEnt)
    return await this.frontendRepo.deleteEntity(frontendEnt);

  }
  _resultDeleteDto(ent: FrontendEnt) {
    return new SuccessDto(true);
  }

  async getAll() {
    try {
      return await this.frontendRepo.getAll();

    } catch (e) {
      console.log(e);
      const result = await HandlerError.errorHandler(e);
      await this.handlerService.handlerException400('FA', result);

    }
  }
}
