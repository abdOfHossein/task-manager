import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AbstractServiceClass } from 'src/common/abstract/abstract.service.class';
import { HandlerError } from 'src/common/class/handler.error';
import { SuccessDto } from 'src/common/result/success.dto';
import { DepartmentEnum } from 'src/common/translate/enums/department.enum';
import { FileEnum } from 'src/common/translate/enums/file.enum';
import { PublicEnum } from 'src/common/translate/enums/public.enum';
import { RoleEnum } from 'src/common/translate/enums/role.enum';
import { DepartmentEnt } from 'src/modules/department/modules/entities/department.entity';
import { FileEnt } from 'src/modules/file/modules/entities/file.entity';
import { TypeFileEnum } from 'src/modules/file/modules/enums/type.file.enum';
import { RoleEnt } from 'src/modules/role/modules/entities/role.entity';
import { RoleTypeEnum } from 'src/modules/role/modules/enum/role.enum';
import { TaskPageDto } from 'src/modules/task/modules/paginations/task.page.dto';
import { HandlerService } from 'src/utility/handler/handler.service';
import { DataSource, FindOneOptions, QueryRunner } from 'typeorm';
import { UserResponseJWTDto } from '../../../../common/dtos/user.dto';
import { UserEnum } from '../../../../common/translate/enums/user.enum';
import { ChangePasswordAdminDto } from '../dtos/change-password-admin.dto';
import { ChangePasswordUserDto } from '../dtos/change-password.user.dto';
import { CreateUserDto } from '../dtos/create.user.dto';
import { LoginUserDto } from '../dtos/login.user.dto';
import { UpdateUserDto } from '../dtos/update.user.dto';
import { UserEnt } from '../entities/user.entity';
import { UserStatus } from '../enum/user.status';
import { UserPageDto } from '../paginations/user.page.dto';
import { UserRepo } from '../repositories/user.repository';
import { UserCUDto } from '../result/user.c.u.dto';
import { UserGDto } from '../result/user.g.dto';

@Injectable()
export class UserService extends AbstractServiceClass<
    UserEnt,
    CreateUserDto,
    UpdateUserDto,
    UserPageDto
> {
    protected _getOne(searchDto: string, options?: FindOneOptions<any>) {
        throw new Error('Method not implemented.');
    }
    public constructor(
        private userRepo: UserRepo,
        @InjectRepository(FileEnt)
        @InjectRepository(UserEnt)
        @InjectRepository(RoleEnt)
        @InjectRepository(DepartmentEnt)
        public dataSource: DataSource,
        handlerService: HandlerService,
    ) {
        super(dataSource, handlerService);
        this.className = this.constructor.name;
    }

    async _create(createDto: CreateUserDto, query?: QueryRunner) {

        if (createDto.unq_file) {
            const file = await this.dataSource.manager.findOne(FileEnt, {
                where: { unq_file: createDto.unq_file },
            });
            createDto.file = file;
        }
        createDto.departmentEnt = await this.dataSource.manager.findOne(
            DepartmentEnt,
            { where: { id: createDto.id_department } },
        );
        const roles: any = [];
        for (const id_role of createDto.id_role) {
            let role = await this.dataSource.manager.findOne(RoleEnt, {
                where: { id: id_role },
            });
            roles.push(role);
        }
        createDto.roleEnt = roles;
        return await this.userRepo.createEntity(createDto, query);

    }
    _resultCreateDto(ent: UserEnt) {
        return new UserCUDto(ent)
    }

    async _update(
        id_user: string,
        updateDt: UpdateUserDto,
        query?: QueryRunner,
    ) {
        const file = await this.dataSource.manager.findOne(FileEnt, {
            where: { unq_file: updateDt.unq_file, type_file: TypeFileEnum.PROFILE },
        });
        if (!file) {
            throw new Error(
                `${JSON.stringify({
                    section: 'file',
                    value: FileEnum.FILE_NOT_EXISTS,
                })}`,
            );
        }
        updateDt.file = file;

        const departmentEnt = await this.dataSource.manager.findOne(
            DepartmentEnt,
            { where: { id: updateDt.id_department } },
        );
        if (!departmentEnt) {
            throw new Error(
                `${JSON.stringify({
                    section: 'department',
                    value: DepartmentEnum.DEPARTMENT_NOT_EXISTS,
                })}`,
            );
        }
        updateDt.departmentEnt = departmentEnt;
        let roles = [];
        for (const id_role of updateDt.id_role) {
            const role = await this.dataSource.manager.findOne(RoleEnt, {
                where: { id: id_role },
            });
            roles.push(role);
        }
        updateDt.roleEnt = roles;
        const userEnt = await this.dataSource.manager.findOne(UserEnt, {
            where: { id: id_user },
        });
        if (!userEnt) {
            throw new Error(
                `${JSON.stringify({
                    section: 'user',
                    value: UserEnum.USER_NOT_EXISTS,
                })}`,
            );
        }
        return await this.userRepo.updateEntity(userEnt, updateDt, query);

    }
    _resultUpdateDto(ent: UserEnt) {
        return new UserCUDto(ent)
    }

    async _pagination(pageDto: UserPageDto) {
        return await this.userRepo.paginationEntity(pageDto);

    }

    async getUser(user: UserResponseJWTDto) {
        return await this.userRepo.getUser(user);
    }
    _resultGetOneDto(ent: UserEnt) {
        return new UserGDto(ent)
    }
    // createEntity findOneEntity updateEntity paginationEntity deleteEntity

    async _delete(id_user: string) {
        const user = await this.dataSource.manager.findOne(UserEnt, {
            where: { id: id_user },
        });
        if (!user)
            throw new Error(
                `${JSON.stringify({
                    section: 'user',
                    value: UserEnum.USER_NOT_EXISTS
                })}`,
            );
        const rolesEnt = await this.dataSource.manager
            .createQueryBuilder(RoleEnt, 'role')
            .leftJoinAndSelect('role.users', 'users')
            .where('users.id = :id_user', { id_user })
            .getMany();
        for (const role of rolesEnt) {
            if (role.role_type === RoleTypeEnum.ADMIN) {
                throw new Error(
                    `${JSON.stringify({
                        section: 'public',
                        value: PublicEnum.ACCESS_IS_DENIDE,
                    })}`,
                );
            }
        }

        user.username = 'deleted' + '_' + user.username + '_' + user.id;
        user.email = 'deleted' + '_' + user.email + '_' + user.id;
        user.phonenumber = 'deleted' + '_' + user.phonenumber + '_' + user.id;
        await this.dataSource.manager.save(user)
        return await this.userRepo.deleteEntity(user);

    }
    _resultDeleteDto(ent: UserEnt) {
        return new SuccessDto(true)
    }

    async getAllUser() {
        try {
            return await this.userRepo.getAllUser();
        } catch (e) {
            console.log(e);
            const result = await HandlerError.errorHandler(e);
            await this.handlerService.handlerException400('FA', result);
        }
    }

    async creatAdmin() {
        try {
            const existAdmin = await this.dataSource.manager.createQueryBuilder(UserEnt, 'user')
                .leftJoin('user.role', 'role')
                .where('role.role_type = :role_type', { role_type: 'ADMIN' })
                .getOne()
            if (existAdmin) {
                throw new Error(
                    `${JSON.stringify({
                        section: 'role',
                        value: RoleEnum.ROLE_NOT_ALREADY_EXISTS,
                    })}`,
                );
            }
            const role=new RoleEnt()
            role.role_type='ADMIN'
            await this.dataSource.manager.save(role)
            const admin = new UserEnt()
            admin.first_name = 'admin'
            admin.last_name = 'admin'
            admin.username = 'admin'
            admin.password = '123'
            admin.email = 'admin@yahoo.com'
            admin.phonenumber = '09153658845'
            admin.role = [role]
            await this.dataSource.manager.save(admin)
            return admin
        } catch (e) {
            console.log('err of CreateAdminFunc', e)
            throw e
        }
    }

    async createJwtSetRole(id_user: string, id_role: string) {
        try {
            const user = await this.dataSource.manager.findOne(UserEnt, {
                where: { id: id_user },
            });

            const rolesEnt: any = await this.dataSource.manager
                .createQueryBuilder(RoleEnt, 'role')
                .leftJoinAndSelect('role.users', 'users')
                .where('users.id = :id_user', { id_user: user.id })
                .getMany();
            let roles = [];
            let id_roles = [];
            
            for (let role of rolesEnt) {
                roles.push({ id: role.id, title: role.role_type });
                id_roles.push(role.id);
            }
            if (id_roles.indexOf(id_role) == -1) {
                throw new Error(
                    `${JSON.stringify({
                        section: 'user',
                        value: UserEnum.USER_DOES_NOT_HAVE_THIS_ROLE,
                    })}`,
                );
            }
            const currentRole = await this.dataSource.manager.findOne(RoleEnt, {
                where: { id: id_role },
            });

            if (!user || user.status == UserStatus.BLOCK) {
                throw new BadRequestException('User does not exist');
            }
            return await this.userRepo.createJwtSetRole(
                user.id,
                roles,
                currentRole.id,
            );
        } catch (e) {
            console.log(e);
            const result = await HandlerError.errorHandler(e);
            await this.handlerService.handlerException400('FA', result);
        }
    }

    async _createJwt(loginUserDto: LoginUserDto) {
        try {
            const user = await this.dataSource.manager.findOne(UserEnt, {
                where: { username: loginUserDto.username },
            });
            if (
                !user ||
                !(await user.validatePassword(loginUserDto.password)) ||
                user.status == UserStatus.BLOCK
            ) {
                throw new Error(
                    `${JSON.stringify({
                        section: 'user',
                        value: UserEnum.USER_NOT_EXISTS,
                    })}`,
                );
            }
            const rolesEnt: any = await this.dataSource.manager
                .createQueryBuilder(RoleEnt, 'role')
                .leftJoinAndSelect('role.users', 'users')
                .where('users.id = :id_user', { id_user: user.id })
                .getMany();
            let roles = [];
            for (const role of rolesEnt) {
                roles.push({ id: role.id, title: role.role_type });
            }
            return await this.userRepo._createJwt(user.id, roles);
        } catch (e) {
            console.log(e);
            const result = await HandlerError.errorHandler(e);
            await this.handlerService.handlerException400('FA', result);
        }
    }

    async findOneUser(searchDto: string, options?: FindOneOptions) {
        return await this.userRepo.findOneUser(searchDto, options);
    }


    async blockUser(id_user: string): Promise<UserEnt> {
        try {
            return await this.userRepo.blockUser(id_user);
        } catch (e) {
            console.log(e);
            const result = await HandlerError.errorHandler(e);
            await this.handlerService.handlerException400('FA', result);
        }
    }

    async changePassword(
        id_user: UserResponseJWTDto,
        changePasswordUserDto: ChangePasswordUserDto,
    ): Promise<UserEnt> {
        return await this.userRepo.changePassword(id_user, changePasswordUserDto);
    }
    async changePasswordAdmin(
        id_user: string,
        changePasswordUserDto: ChangePasswordAdminDto,
    ): Promise<UserEnt> {
        try {
            return await this.userRepo.changePasswordAdmin(
                id_user,
                changePasswordUserDto,
            );
        } catch (e) {
            console.log(e);
            const result = await HandlerError.errorHandler(e);
            await this.handlerService.handlerException400('FA', result);
        }
    }

    async paginationTask(id_user: string, pageDto: TaskPageDto) {
        try {
            return await this.userRepo.paginationTask(id_user, pageDto);
        } catch (e) {
            console.log(e);
            const result = await HandlerError.errorHandler(e);
            await this.handlerService.handlerException400('FA', result);
        }
    }

    async paginationTaskWithJwt(id_user: string, pageDto: TaskPageDto) {
        try {
            return await this.userRepo.paginationTaskWithJwt(id_user, pageDto);
        } catch (e) {
            console.log(e);
            const result = await HandlerError.errorHandler(e);
            await this.handlerService.handlerException400('FA', result);
        }
    }

    async jwtAdmin(id_user: string) {
        try {
            const user = await this.dataSource.manager.findOne(UserEnt, {
                where: { id: id_user },
            });
            if (!user || user.status == UserStatus.BLOCK) {
                throw new Error(
                    `${JSON.stringify({
                        section: 'user',
                        value: UserEnum.USER_NOT_EXISTS,
                    })}`,
                );
            }
            const rolesEnt: any = await this.dataSource.manager
                .createQueryBuilder(RoleEnt, 'role')
                .leftJoinAndSelect('role.users', 'users')
                .where('users.id = :id_user', { id_user: user.id })
                .getMany();
            for (const role of rolesEnt) {
                if (role.role_type === RoleTypeEnum.ADMIN) {
                    throw new Error(
                        `${JSON.stringify({
                            section: 'public',
                            value: PublicEnum.ACCESS_IS_DENIDE,
                        })}`,
                    );
                }
            }
            let roles = [];
            for (const role of rolesEnt) {
                role.ty;
                roles.push({ id: role.id, title: role.role_type });
            }
            if (!user) {
                throw new BadRequestException(
                    `${JSON.stringify({
                        section: 'public',
                        value: PublicEnum.USER_NOT_EXISTS,
                    })}`,
                );
            }
            return await this.userRepo._createJwt(user.id, roles);
        } catch (e) {
            console.log(e);

            const result = await HandlerError.errorHandler(e);
            await this.handlerService.handlerException400('FA', result);
        }
    }


    async getDepartmentUsers(id_department: string) {
        try {
            return await this.userRepo.getDepartmentUsers(id_department);
        } catch (e) {
            console.log(e);
            const result = await HandlerError.errorHandler(e);
            await this.handlerService.handlerException400('FA', result);
        }
    }

    async paginationDoneTaskRecentDay(id_user: string, pageDto: TaskPageDto) {
        try {
            return await this.userRepo.paginationDoneTaskRecentDay(id_user, pageDto);
        } catch (e) {
            console.log(e);
            const result = await HandlerError.errorHandler(e);
            await this.handlerService.handlerException400('FA', result);
        }
    }

    async listOfTaskRecentDay(id_user: string) {
        try {
            return await this.userRepo.listOfTaskRecentDay(id_user);
        } catch (e) {
            console.log(e);
            const result = await HandlerError.errorHandler(e);
            await this.handlerService.handlerException400('FA', result);
        }
    }


}
