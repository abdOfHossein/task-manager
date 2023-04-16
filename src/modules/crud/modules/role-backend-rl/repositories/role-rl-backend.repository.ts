import { InjectRepository } from '@nestjs/typeorm';
import { AbstractRepositoryClass } from 'src/common/abstract/abstract.repository.class';
import { PageDto } from 'src/common/dtos/page.dto';
import { PageMetaDto } from 'src/common/dtos/page.meta.dto';
import { PublicFunc } from 'src/common/function/public.func';
import { PublicEnum } from 'src/common/translate/enums/public.enum';
import { HandlerService } from 'src/utility/handler/handler.service';
import { DataSource, FindOneOptions, QueryRunner } from 'typeorm';
import { CreateRoleRlBackendDto } from '../dtos/create-role-rl-backend.dto';
import { UpdateRoleRlBackendDto } from '../dtos/update-role-rl-backend.dto';
import { RoleRlBackendEnt } from '../entities/role-rl-backend.entity';
import { CountryMapperPagination } from '../mapper/country.mapper.pagination';
import { RoleRlBackendPageDto } from '../pagination/country.page.dto';

export class RoleRlBackendRepo extends AbstractRepositoryClass<
  RoleRlBackendEnt,
  CreateRoleRlBackendDto,
  UpdateRoleRlBackendDto,
  RoleRlBackendPageDto
> {
  constructor(
    @InjectRepository(RoleRlBackendEnt)
    public dataSource: DataSource,
    handlerService: HandlerService,
  ) {
    super(dataSource, handlerService);
  }

  async _findOneEntity(
    searchDto: string,
    options?: FindOneOptions<any>,
  ): Promise<RoleRlBackendEnt> {
    const backendEnt = await this.dataSource.manager.findOne(RoleRlBackendEnt, {
      where: { id: searchDto },
      relations: ['backend'],
    });
    if (!backendEnt)
      throw new Error(
        `${JSON.stringify({
          section: 'public',
          value: PublicEnum.COLUMN_NOT_EXISTS,
        })}`,
      );
    return backendEnt
  }

  async _createEntity(
    createDto: CreateRoleRlBackendDto,
    query?: QueryRunner,
  ): Promise<RoleRlBackendEnt> {
    const roleRlBackendEnt = new RoleRlBackendEnt();
    roleRlBackendEnt.backend = createDto.backend;
    roleRlBackendEnt.role = createDto.role;
    if (query) await query.manager.save(roleRlBackendEnt);
    return await this.dataSource.manager.save(roleRlBackendEnt);
  }
  async _updateEntity(
    entity: RoleRlBackendEnt,
    updateDto: UpdateRoleRlBackendDto,
    query?: QueryRunner,
  ): Promise<RoleRlBackendEnt> {
   
    entity.backend = updateDto.backend;

    entity.role = updateDto.role;

    if (query) await query.manager.save(entity);
    return await this.dataSource.manager.save(entity);
  }
  async _deleteEntity(
    entity: RoleRlBackendEnt,
    query?: QueryRunner,
  ): Promise<RoleRlBackendEnt> {
    if (query) await query.manager.softRemove(entity);
    return await this.dataSource.manager.softRemove(entity);
  }

  //pagination
  async _paginationEntity(
    pageDto: RoleRlBackendPageDto,
  ): Promise<PageDto<RoleRlBackendEnt>> {

    const queryBuilder = this.dataSource.manager
      .createQueryBuilder(RoleRlBackendEnt, 'role_rl_backend')
      .select(['role_rl_backend.id']);
    if (pageDto.base) {
      const row = pageDto.base.row;
      const skip = PublicFunc.skipRow(pageDto.base.page, pageDto.base.row);
      queryBuilder.skip(skip).take(row);
    }

    // if (pageDto.filter) {
    //   if (pageDto.filter.id) {
    //     queryBuilder.andWhere('arch.slug_arch LIKE :slug_arch', {
    //       slug_arch: `%${pageDto.filter.slug_arch}%`,
    //     });
    //   }

    // }
    if (pageDto.field) {
      const mapper = CountryMapperPagination[pageDto.field];
      if (!mapper)
        throw new Error(
          `${JSON.stringify({
            section: 'public',
            value: PublicEnum.COLUMN_NOT_EXISTS,
          })}`,
        );
      queryBuilder.addOrderBy(
        `${CountryMapperPagination[pageDto.field]}`,
        pageDto.base.order,
      );
    }

    const result = await queryBuilder.getManyAndCount();

    const pageMetaDto = new PageMetaDto({
      baseOptionsDto: pageDto.base,
      itemCount: result[1],
    });
    const a = new PageDto(result[0], pageMetaDto);
    return a;
  }
}
