import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AbstractServiceClass } from 'src/common/abstract/abstract.service.class';
import { HandlerError } from 'src/common/class/handler.error';
import { SuccessDto } from 'src/common/result/success.dto';
import { CrudFrontendEnum } from 'src/common/translate/enums/crud-frontend.enum';
import { CrudMenuEnum } from 'src/common/translate/enums/crud-menu.enum';
import { RoleEnt } from 'src/modules/role/modules/entities/role.entity';
import { RoleService } from 'src/modules/role/modules/services/role.service';
import { HandlerService } from 'src/utility/handler/handler.service';
import { DataSource, FindOneOptions, QueryRunner } from 'typeorm';
import { FrontendEnt } from '../../frontend/entities/frontend.entity';
import { FrontendService } from '../../frontend/services/frontend.service';
import { CreateMenuDto } from '../dtos/create.menu';
import { UpdateMenuDto } from '../dtos/update.menu';
import { MenuEnt } from '../entities/menu.entity';
import { MenuPageDto } from '../pagination/menu.pagination';
import { MenuRepo } from '../repositories/menu.repository';
import { MenuCUDto } from '../results/menu.c.u.dto';
import { MenuGDto } from '../results/menu.g.dto';

@Injectable()
export class MenuService extends AbstractServiceClass<
  MenuEnt,
  CreateMenuDto,
  UpdateMenuDto,
  MenuPageDto
> {
  public constructor(
    @InjectRepository(FrontendEnt)
    @InjectRepository(MenuEnt)
    public dataSource: DataSource,
    handlerService: HandlerService,
    private menuRepo: MenuRepo,
    private frontendService: FrontendService,
    private roleService: RoleService,
  ) {
    super(dataSource, handlerService);
    this.className = this.constructor.name;
  }

  async _getOne(searchDto: string, options?: FindOneOptions<any>) {
    return await this.menuRepo.findOneEntity(searchDto, options);
  }
  _resultGetOneDto(ent: MenuEnt) {
    return new MenuGDto(ent)
  }
  async _create(createDt: CreateMenuDto, query?: QueryRunner) {
    // const exist = await this.findOneByName(createDt.slug_name);
    // if (exist) {
    //   throw new Error(
    //     `${JSON.stringify({
    //       section: 'crud_menu',
    //       value: CrudMenuEnum.CRUD_MENU_ALREADY_EXISTS
    //     })}`,
    //   );
    // }
    if (createDt.id_front) {
      const frontend = await this.dataSource.manager.findOne(FrontendEnt, { where: { id: createDt.id_front } })
      if (!frontend)
        throw new Error(
          `${JSON.stringify({
            section: 'crud_frontend',
            value: CrudFrontendEnum.CRUD_FRONTEND_NOT_EXISTS,
          })}`,
        );
      createDt.frontend = frontend
    }
    createDt.role = await this.dataSource.manager.findOne(RoleEnt, { where: { id: createDt.id_role } })
    if (createDt.id_parent)
      var parentEnt = await this.dataSource.manager.findOne(MenuEnt, { where: { id: createDt.id_parent } })
    createDt.parent = parentEnt
    return await this.menuRepo.createEntity(createDt, query);
  }
  _resultCreateDto(ent: MenuEnt) {
    return new MenuCUDto(ent)
  }

  async _delete(searchDto: string, query?: QueryRunner) {
    const menuEnt: any = await this.dataSource.manager
      .createQueryBuilder(MenuEnt, 'menu')
      .leftJoinAndSelect('menu.children', 'children')
      .where('menu.id = :menu_id', { menu_id: searchDto })
      .getMany();
    menuEnt[0].slug_name = 'deleted' + '_' + menuEnt[0].slug_name + '_' + menuEnt[0].id;
    await this.dataSource.manager.save(menuEnt)

    if (menuEnt[0].children)
      for (const children of menuEnt[0].children) {
        children.slug_name = 'deleted' + '_' + children.slug_name + '_' + children.id;
        await this.dataSource.manager.save(children)
      }
    return await this.menuRepo.deleteEntity(menuEnt, query);
  }
  _resultDeleteDto(ent: MenuEnt) {
    return new SuccessDto(true)
  }

  async _update(menu_Id: string, updateDt: UpdateMenuDto, query?: QueryRunner) {
    const menuEnt = await this.dataSource.manager.findOne(MenuEnt, { where: { id: menu_Id } })
    if (!menuEnt)
      throw new Error(
        `${JSON.stringify({
          section: 'crud_menu',
          value: CrudMenuEnum.CRUD_MENU_NOT_EXISTS
        })}`,
      );
    return await this.menuRepo.updateEntity(menuEnt, updateDt, query);
  }
  _resultUpdateDto(ent: MenuEnt) {
    return new MenuCUDto(ent)
  }

  async _pagination(pageDto: MenuPageDto) {
    return await this.menuRepo.paginationEntity(pageDto);
  }

  async getMenuTree(id_role: string) {
    try {
      const findRoleDto = {
        id_role: id_role,
      };
      return await this.menuRepo.getMenuTree(findRoleDto);
    } catch (e) {
      console.log(e);
      const result = await HandlerError.errorHandler(e);
      await this.handlerService.handlerException400('FA', result);
    }
  }

  async deleteMany(menuEnt: MenuEnt[]) {
    try {
      return await this.menuRepo.deleteMany(menuEnt);
    } catch (e) {
      console.log(e);
      const result = await HandlerError.errorHandler(e);
      await this.handlerService.handlerException400('FA', result);
    }

  }

  async getAllMenu() {
    try {
      return await this.menuRepo.getAllMenu();
    } catch (e) {
      console.log(e);
      const result = await HandlerError.errorHandler(e);
      await this.handlerService.handlerException400('FA', result);
    }
  }
  async findOneByName(slug_name: string) {
    try {
      return await this.menuRepo.findOneByName(slug_name);
    } catch (e) {
      console.log(e);
      const result = await HandlerError.errorHandler(e);
      await this.handlerService.handlerException400('FA', result);
    }
  }
}
