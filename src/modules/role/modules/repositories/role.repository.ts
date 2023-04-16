import { InjectRepository } from '@nestjs/typeorm';
import { AbstractRepositoryClass } from 'src/common/abstract/abstract.repository.class';
import { PageDto } from 'src/common/dtos/page.dto';
import { PageMetaDto } from 'src/common/dtos/page.meta.dto';
import { PublicFunc } from 'src/common/function/public.func';
import { RoleEnum } from 'src/common/translate/enums/role.enum';
import { UserEnum } from 'src/common/translate/enums/user.enum';
import { UserEnt } from 'src/modules/user/modules/entities/user.entity';
import { HandlerService } from 'src/utility/handler/handler.service';
import { DataSource, FindOneOptions, QueryRunner } from 'typeorm';
import { ConfigRoleDto } from '../dtos/config.roele.dto';
import { CreateRoleDto } from '../dtos/create.role.dto';
import { UpdateRoleDto } from '../dtos/update.role.dto';
import { RoleEnt } from '../entities/role.entity';
import { RoleMapperPagination } from '../mapper/role.mapper.pagination';
import { RolePageDto } from '../paginations/role.page.dto';

export class RoleRepo extends AbstractRepositoryClass<
  RoleEnt,
  CreateRoleDto,
  UpdateRoleDto,
  RolePageDto
> {
  constructor(
    @InjectRepository(RoleEnt)
    public dataSource: DataSource,
    handlerService: HandlerService,
  ) {
    super(dataSource, handlerService);
  }

  async _createEntity(
    createDto: CreateRoleDto,
    query: QueryRunner | undefined,
  ): Promise<RoleEnt> {
    const roleEnt = new RoleEnt();
    roleEnt.role_type = createDto.role_type;
    if (query) return await query.manager.save(roleEnt);
    return await this.dataSource.manager.save(roleEnt);
  }

  async _updateEntity(
    entity: RoleEnt,
    updateRoleDto: UpdateRoleDto,
    query: QueryRunner | undefined,
  ): Promise<RoleEnt> {
    entity.role_type = updateRoleDto.role_type;
    if (query) return await query.manager.save(entity);
    return await this.dataSource.manager.save(entity);
  }

  async _findOneEntity(
    searchDto: string,
    options?: FindOneOptions,
  ): Promise<RoleEnt> {
    const result = await this.dataSource.manager.findOne(RoleEnt, {
      where: { id: searchDto },
    });
    if (!result)
      throw new Error(
        `${JSON.stringify({
          section: 'role',
          value: RoleEnum.ROLE_NOT_EXISTS,
        })}`,
      );
    return result;
  }

  async _paginationEntity(pageDto: RolePageDto): Promise<PageDto<RoleEnt>> {
    const queryBuilder = this.dataSource.manager
      .createQueryBuilder(RoleEnt, 'role')
      .select(['role.id', 'role.role_type']);
    if (pageDto.base) {
      const row = pageDto.base.row;
      const skip = PublicFunc.skipRow(pageDto.base.page, pageDto.base.row);
      queryBuilder.skip(skip).take(row);
    }
    if (pageDto.filter) {
      if (pageDto.filter.role_type) {
        queryBuilder.andWhere('role.role_type LIKE :role_type', {
          role_type: `%${pageDto.filter.role_type}%`,
        });
      }
    }
    if (pageDto.field) {
      const mapper = RoleMapperPagination[pageDto.field];
      if (!mapper)
        throw new Error(
          `${JSON.stringify({
            section: 'public',
            value: 'Column Not Exist',
          })}`,
        );
      queryBuilder.addOrderBy(
        `${RoleMapperPagination[pageDto.field]}`,
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

  async findAllRole(): Promise<RoleEnt[]> {
    return await this.dataSource.manager
      .createQueryBuilder(RoleEnt, 'role')
      .select(['role.id', 'role.role_type', 'role.role_default_status'])
      .getMany()
  }

  async configRole(
    id_user: string,
    configRoleDto: ConfigRoleDto,
    query?: QueryRunner,
  ): Promise<UserEnt> {
    const role = await this.dataSource.manager.findOne(RoleEnt, {
      where: { id: configRoleDto.id_roles },
    });

    const user = await this.dataSource.manager
      .createQueryBuilder(UserEnt, 'user')
      .leftJoinAndSelect('user.role', 'role')
      .where('user.id = :id_user', { id_user })
      .getOne();
    user.role = [role];
    if (query) return await query.manager.save(user);
    return await this.dataSource.manager.save(user);
  }

  async _deleteEntity(entity: RoleEnt, query?: QueryRunner): Promise<RoleEnt> {
    if (query) return await query.manager.softRemove(entity);
    return await this.dataSource.manager.softRemove(entity);
  }

  async paginationRoleUser(
    id_user: string,
    pageDto: RolePageDto,
  ): Promise<PageDto<RoleEnt>> {
    const queryBuilder = this.dataSource.manager
      .createQueryBuilder(RoleEnt, 'role')
      .leftJoinAndSelect('role.users', 'users')
      .where('users.id = :id_user', { id_user })
      .select(['role.id', 'role.role_type']);
    if (pageDto.base) {
      const row = pageDto.base.row;
      const skip = PublicFunc.skipRow(pageDto.base.page, pageDto.base.row);
      queryBuilder.skip(skip).take(row);
    }
    if (pageDto.filter) {
      if (pageDto.filter.role_type) {
        queryBuilder.andWhere('role.role_type LIKE :role_type', {
          role_type: `%${pageDto.filter.role_type}%`,
        });
      }
    }
    if (pageDto.field) {
      const mapper = RoleMapperPagination[pageDto.field];
      if (!mapper)
        throw new Error(
          `${JSON.stringify({
            section: 'public',
            value: 'Column Not Exist',
          })}`,
        );
      queryBuilder.addOrderBy(
        `${RoleMapperPagination[pageDto.field]}`,
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

  async deleteSpecificRole(
    id_user: string,
    id_role: string,
    query?: QueryRunner,
  ): Promise<RoleEnt> {

    const roleEnt: any = await this.dataSource.manager.findOne(RoleEnt, {
      where: { id: id_role },
    });

    const user = await this.dataSource.manager.findOne(UserEnt, {
      where: { id: id_user },
      relations: { role: true },
    });
    if (user.role.length == 1) {
      throw new Error(`${JSON.stringify({
        section: 'user',
        value: UserEnum.USER_MUST_ATLEAST_HAS_ONE_ROLE
      })}`)
    }

    for (let i = 0; i < user.role.length; i++) {


      if (user.role[i].id === roleEnt.id) {

        user.role[i] = null;
        await this.dataSource.manager.save(user);

      }
    }
    if (query) return query.manager.save(roleEnt);
    return await this.dataSource.manager.save(roleEnt);
  }

  async addRole(
    id_user: string,
    id_role: string,
    query?: QueryRunner,
  ): Promise<UserEnt> {
    const roleEnt = await this.dataSource.manager.findOne(RoleEnt, {
      where: { id: id_role },
    });
    
    const user = await this.dataSource.manager.findOne(UserEnt, {
      where: { id: id_user },
      relations: { role: true },
    });
    if (user.role) {
      for (let i = 0; i < user.role.length; i++) {
        const element = user.role[i];
        if (id_role == element.id) {
          throw new Error(`${JSON.stringify({
            section: 'role',
            value: RoleEnum.ROLE_NOT_ALREADY_EXISTS
          })}`)
        }
      }
      user.role.push(roleEnt);
    }
    else{
      user.role.push(roleEnt);
    }
    if (query) return query.manager.save(user);
    return await this.dataSource.manager.save(user);
  }
}
