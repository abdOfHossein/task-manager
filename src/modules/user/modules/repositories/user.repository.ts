import {
    BadGatewayException,
    BadRequestException,
    UnauthorizedException
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt/dist';
import { InjectRepository } from '@nestjs/typeorm';
import { AbstractRepositoryClass } from 'src/common/abstract/abstract.repository.class';
import { PageDto } from 'src/common/dtos/page.dto';
import { PageMetaDto } from 'src/common/dtos/page.meta.dto';
import { PublicFunc } from 'src/common/function/public.func';
import { PublicEnum } from 'src/common/translate/enums/public.enum';
import { UserEnum } from 'src/common/translate/enums/user.enum';
import { MenuEnt } from 'src/modules/crud/modules/menu/entities/menu.entity';
import { RoleEnt } from 'src/modules/role/modules/entities/role.entity';
import { RoleTypeEnum } from 'src/modules/role/modules/enum/role.enum';
import { TaskMapperPagination } from 'src/modules/task/modules/mapper/task.mapper.pagination';
import { TaskPageDto } from 'src/modules/task/modules/paginations/task.page.dto';
import { HandlerService } from 'src/utility/handler/handler.service';
import { HashService } from 'src/utility/hash/hash.service';
import { RedisService } from 'src/utility/redis/redis.service';
import { DataSource, FindOneOptions, QueryRunner } from 'typeorm';
import { UserResponseJWTDto } from '../../../../common/dtos/user.dto';
import { JwtPayloadInterface } from '../auth/interface/jwt-payload.interface';
import { ChangePasswordAdminDto } from '../dtos/change-password-admin.dto';
import { ChangePasswordUserDto } from '../dtos/change-password.user.dto';
import { CreateUserDto } from '../dtos/create.user.dto';
import { LoginUserDto } from '../dtos/login.user.dto';
import { UpdateUserDto } from '../dtos/update.user.dto';
import { UserEnt } from '../entities/user.entity';
import { UserStatus } from '../enum/user.status';
import { UserMapperPagination } from '../mapper/user.mapper.pagination';
import { UserPageDto } from '../paginations/user.page.dto';
const randomstring = require('randomstring');
import { sha512 } from 'js-sha512';

export class UserRepo extends AbstractRepositoryClass<
    UserEnt,
    CreateUserDto,
    UpdateUserDto,
    UserPageDto
> {
    _findOneEntity(searchDto: string, options?: FindOneOptions<any>): Promise<UserEnt> {
        throw new Error('Method not implemented.');
    }
    PREFIX_TOKEN_AUTH = 'prefix_auth_token_';
    constructor(
        @InjectRepository(UserEnt)
        @InjectRepository(RoleEnt)
        public dataSource: DataSource,
        handlerService: HandlerService,
        private redisService: RedisService,
        private jwtService: JwtService,
        private hashService: HashService,
    ) {
        super(dataSource, handlerService);
    }

    async _createJwt(data: string, roles: any) {

        let jwtPayloadInterface: JwtPayloadInterface = {};
        const encryptTextInterface = await this.hashService.encrypt(data);
        const code = randomstring.generate({
            length: 64,
            charset: process.env.RANDOM_STRING_HASH_JWT,
        });

        jwtPayloadInterface.data = encryptTextInterface.text;
        jwtPayloadInterface.key = encryptTextInterface.key;
        jwtPayloadInterface.unq = sha512(code);
        jwtPayloadInterface.roles = roles;
        const dataRedis = {
            data: encryptTextInterface.text,
            iv: encryptTextInterface.iv,
            roles: roles,
        };

        const result = this.jwtService.sign(jwtPayloadInterface);

        const saveRedis = await this.redisService.setKey(
            `${this.PREFIX_TOKEN_AUTH}${jwtPayloadInterface.unq}`,
            JSON.stringify(dataRedis),
            "EX",
            300,
        );

        return result;
    }

    async createJwtSetRole(data: string, roles: any, currentRole: string) {
        let jwtPayloadInterface: JwtPayloadInterface = {};
        const encryptTextInterface = await this.hashService.encrypt(data);
        const code = randomstring.generate({
            length: 64,
            charset: process.env.RANDOM_STRING_HASH_JWT,
        });
        jwtPayloadInterface.data = encryptTextInterface.text;
        jwtPayloadInterface.key = encryptTextInterface.key;
        jwtPayloadInterface.roles = roles;
        jwtPayloadInterface.unq = sha512(code);
        jwtPayloadInterface.currentRole = currentRole;
        const dataRedis = {
            data: encryptTextInterface.text,
            iv: encryptTextInterface.iv,
            roles: roles,
            currentRole,
        };
        const trees = await this.dataSource.manager
            .getTreeRepository(MenuEnt)
            .createQueryBuilder('menu')
            .leftJoinAndSelect('menu.children', 'child')
            .leftJoinAndSelect('child.frontend', 'child_front')
            .leftJoinAndSelect('menu.frontend', 'frontend')
            .leftJoinAndSelect('menu.role', 'role')
            .where('role.id = :role_id', { role_id: currentRole })
            .andWhere('menu.parent IS NULL')
            .getMany();

        const tokenJwt = this.jwtService.sign(jwtPayloadInterface);
        let result: any = {};
        result.menu = trees;
        result.tokenJwt = tokenJwt;
        await this.redisService.setKey(
            `${this.PREFIX_TOKEN_AUTH}${jwtPayloadInterface.unq}`,
            JSON.stringify(dataRedis),
            "EX",
            10000000,
        );
        return result;
    }

    async _createEntity(
        createDto: CreateUserDto,
        query: QueryRunner | undefined,
    ): Promise<UserEnt> {
        const userEnt = new UserEnt();
        userEnt.first_name = createDto.first_name;
        userEnt.role = createDto.roleEnt;
        userEnt.email = createDto.email;
        userEnt.last_name = createDto.last_name;
        userEnt.password = createDto.password;
        userEnt.phonenumber = createDto.phonenumber;
        userEnt.username = createDto.username;
        userEnt.department = createDto.departmentEnt;
        userEnt.files = [createDto.file];
        if (query) return await query.manager.save(userEnt);
        return await this.dataSource.manager.save(userEnt);
    }

    async validateUser(
        loginUserDto: LoginUserDto,
        options?: FindOneOptions,
    ): Promise<UserEnt> {
        const user = await this.dataSource.manager.findOne(UserEnt, {
            where: { username: loginUserDto.username },
        });
        if (user && loginUserDto.password == user.password) return user;
        return null;
    }

    async loginUser(user: any) {
        const payload = {
            sub: user.id,
            username: user.username,
        };
        return {
            access_token: this.jwtService.sign(payload),
        };
    }

    async findOneUser(
        searchDto: string,
        options?: FindOneOptions,
    ): Promise<UserEnt> {
        const result = await this.dataSource.manager.findOne(UserEnt, {
            where: { id: searchDto },
            relations: ['department'],
        });

        if (!result)
            throw new BadGatewayException({ message: 'user does not exits' });
        return result;
    }

    async _updateEntity(
        entity: UserEnt,
        updateDto: UpdateUserDto,
        query?: QueryRunner,
    ): Promise<UserEnt> {
        entity.department = updateDto.departmentEnt;
        entity.first_name = updateDto.first_name;
        entity.email = updateDto.email;
        entity.last_name = updateDto.last_name;
        entity.password = sha512(updateDto.password)
        entity.role = updateDto.roleEnt;
        entity.phonenumber = updateDto.phonenumber;
        entity.username = updateDto.username;
        entity.files = [updateDto.file];
        if (query) return await query.manager.save(entity);
        return await this.dataSource.manager.save(entity);
    }

    async changePassword(
        user: UserResponseJWTDto,
        changePasswordUserDto: ChangePasswordUserDto,
        query?: QueryRunner
    ): Promise<UserEnt> {
        if (
            changePasswordUserDto.confirm_password != changePasswordUserDto.password
        )
            throw new BadRequestException();

        const userEntity = await this.dataSource.manager.findOne(UserEnt, {
            where: { id: user.uid },
        });
        if (!userEntity)
            throw new Error(
                `${JSON.stringify({
                    section: 'user',
                    value: UserEnum.USER_NOT_EXISTS,
                })}`,
            );

        if (userEntity.id !== user.uid)
            throw new Error(
                `${JSON.stringify({
                    section: 'public',
                    value: PublicEnum.ACCESS_IS_DENIDE,
                })}`,
            );
        userEntity.password = sha512(changePasswordUserDto.new_password);
        if (query) return await query.manager.save(userEntity);
        return await this.dataSource.manager.save(userEntity);
    }

    async changePasswordAdmin(
        id_user: string,
        changePasswordUserDto: ChangePasswordAdminDto,
        query?: QueryRunner,
    ): Promise<UserEnt> {
        const userEntity = await this.dataSource.manager.findOne(UserEnt, {
            where: { id: id_user },
        });
        if (!userEntity || userEntity.status == UserStatus.BLOCK)
            throw new Error(
                `${JSON.stringify({
                    section: 'user',
                    value: UserEnum.USER_NOT_EXISTS,
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
        userEntity.password = sha512(changePasswordUserDto.new_password);
        if (query) return await query.manager.save(userEntity);
        return await this.dataSource.manager.save(userEntity);
    }

    async blockUser(id_user: string): Promise<UserEnt> {
        const userEntity = await this.dataSource.manager.findOne(UserEnt, {
            where: { id: id_user },
        });
        if (!userEntity)
            throw new Error(
                `${JSON.stringify({
                    section: 'user',
                    value: UserEnum.USER_NOT_EXISTS,
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
        userEntity.status = UserStatus.BLOCK;
        return await this.dataSource.manager.save(userEntity);
    }

    async _paginationEntity(pageDto: UserPageDto): Promise<PageDto<UserEnt>> {
        const queryBuilder = this.dataSource.manager
            .createQueryBuilder(UserEnt, 'user')
            .leftJoinAndSelect('user.department', 'department')
            .leftJoinAndSelect('user.role', 'role')
            .leftJoinAndSelect('department.department_rls', 'department_rls')
            .leftJoinAndSelect('department_rls.tasks', 'tasks')
            .select([
                'user.id',
                'user.first_name',
                'user.last_name',
                'user.username',
                'user.email',
                'user.phonenumber',
                'department.id',
                'role.id',
                'department.name_department',
                'role.role_type'
            ]);

        if (pageDto.base) {
            const row = pageDto.base.row;
            const skip = PublicFunc.skipRow(pageDto.base.page, pageDto.base.row);
            queryBuilder.skip(skip).take(row);
        }

        if (pageDto.filter) {
            if (pageDto.filter.username)
                queryBuilder.andWhere('user.username LIKE :username', {
                    username: `%${pageDto.filter.username}%`,
                });
            if (pageDto.filter.first_name)
                queryBuilder.andWhere('user.first_name LIKE :first_name', {
                    first_name: `%${pageDto.filter.first_name}%`,
                });
            if (pageDto.filter.username)
                queryBuilder.andWhere('user.last_name LIKE :last_name', {
                    last_name: `%${pageDto.filter.last_name}%`,
                });
        }
        if (pageDto.field) {
            const mapper = UserMapperPagination[pageDto.field];
            if (!mapper)
                throw new Error(
                    `${JSON.stringify({
                        section: 'public',
                        value: 'Column Not Exist',
                    })}`,
                );
            queryBuilder.addOrderBy(
                `${UserMapperPagination[pageDto.field]}`,
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

    async paginationTask(
        id_user: string,
        pageDto: TaskPageDto,
    ): Promise<PageDto<UserEnt>> {
        const queryBuilder = this.dataSource.manager
            .createQueryBuilder(UserEnt, 'user')
            .where('user.id = :id_user', { id_user })
            .leftJoinAndSelect('user.task', 'task')
            .select([
                'user.id',
                'task.id',
                'task.priority',
                'task.title',
                'task.head_id',
                'task.do_date',
                'task.remain_date',
                'task.type',
                'task.duration',
                'task.status',
            ]);

        if (pageDto.base) {
            const row = pageDto.base.row;
            const skip = PublicFunc.skipRow(pageDto.base.page, pageDto.base.row);
            queryBuilder.skip(skip).take(row);
        }

        if (pageDto.filter) {
            if (pageDto.filter.priority)
                queryBuilder.andWhere('task.priority LIKE :priority', {
                    priority: `%${pageDto.filter.priority}%`,
                });
            if (pageDto.filter.title)
                queryBuilder.andWhere('task.title LIKE :title', {
                    title: `%${pageDto.filter.title}%`,
                });
            if (pageDto.filter.type)
                queryBuilder.andWhere('task.type LIKE :type', {
                    type: `%${pageDto.filter.type}%`,
                });
            if (pageDto.filter.status)
                queryBuilder.andWhere('task.status LIKE :status', {
                    status: `%${pageDto.filter.status}%`,
                });
        }
        if (pageDto.field) {
            const mapper = TaskMapperPagination[pageDto.field];
            if (!mapper)
                throw new Error(
                    `${JSON.stringify({
                        section: 'public',
                        value: 'Column Not Exist',
                    })}`,
                );
            queryBuilder.addOrderBy(
                `${TaskMapperPagination[pageDto.field]}`,
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

    async getUser(user: UserResponseJWTDto, options?: FindOneOptions) {
        console.log(user);
        const trees = await this.dataSource.manager
            .getTreeRepository(MenuEnt)
            // .findTrees({relations: ['frontend']})
            .createQueryBuilder('menu')
            .leftJoinAndSelect('menu.children', 'child')
            .leftJoinAndSelect('child.frontend', 'child_front')
            .leftJoinAndSelect('menu.frontend', 'frontend')
            .leftJoinAndSelect('menu.role', 'role')
            .where('role.id=:role_id', {
                role_id: user.currenttRole,
            })
            .andWhere('menu.parent IS NULL')
            .getMany();

            console.log("trees");            
            console.log(trees);
            
        const userEnt = await this.dataSource.manager
            .createQueryBuilder(UserEnt, 'user')
            .leftJoinAndSelect('user.role', 'role')
            .leftJoinAndSelect('user.files', 'file')
            .where('user.id = :id', { id: user.uid })
            .getOne();
            console.log("userEnt");
            console.log(userEnt);
            
        userEnt.menu = trees;
        if (!userEnt)
            throw new UnauthorizedException({ message: 'user does not exits' });
        return userEnt;
    }

    async getDepartmentUsers(id_department: string) {
        return await this.dataSource.manager
            .createQueryBuilder(UserEnt, 'user')
            .innerJoin('user.department', 'department')
            .where('department.id = :id_department', {
                id_department,
            })
            .select([
                'user.id',
                'user.first_name',
                'user.last_name',
                'user.username',
                'user.email',
                'user.phonenumber',
            ])
            .getMany();
    }

    async paginationTaskWithJwt(
        id_user: string,
        pageDto: TaskPageDto,
    ): Promise<PageDto<UserEnt>> {
        const queryBuilder = this.dataSource.manager
            .createQueryBuilder(UserEnt, 'user')
            .where('user.id = :id_user', { id_user })
            .leftJoinAndSelect('user.task', 'task')
            .select([
                'user.id',
                'task.id',
                'task.priority',
                'task.title',
                'task.head_id',
                'task.do_date',
                'task.remain_date',
                'task.type',
                'task.duration',
                'task.status',
            ]);

        if (pageDto.base) {
            const row = pageDto.base.row;
            const skip = PublicFunc.skipRow(pageDto.base.page, pageDto.base.row);
            queryBuilder.skip(skip).take(row);
        }

        if (pageDto.filter) {
            if (pageDto.filter.priority)
                queryBuilder.andWhere('task.priority LIKE :priority', {
                    priority: `%${pageDto.filter.priority}%`,
                });
            if (pageDto.filter.title)
                queryBuilder.andWhere('task.title LIKE :title', {
                    title: `%${pageDto.filter.title}%`,
                });
            if (pageDto.filter.type)
                queryBuilder.andWhere('task.type = :type', {
                    type: pageDto.filter.type,
                });
            if (pageDto.filter.status)
                queryBuilder.andWhere('task.status = :status', {
                    status: pageDto.filter.status,
                });
        }
        if (pageDto.field) {
            const mapper = TaskMapperPagination[pageDto.field];
            if (!mapper)
                throw new Error(
                    `${JSON.stringify({
                        section: 'public',
                        value: 'Column Not Exist',
                    })}`,
                );
            queryBuilder.addOrderBy(
                `${TaskMapperPagination[pageDto.field]}`,
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

    async paginationDoneTaskRecentDay(
        id_user: string,
        pageDto: TaskPageDto,
    ): Promise<UserEnt[]> {
        return this.dataSource.manager
            .query(`select u.id,u.first_name ,u.last_name , (select  jsonb_agg(jsonb_build_object('id',id,'title',title,'status',status,'type',"type",'priority',priority,'duration',duration)) as text  from task.task.task t where cast (t."userId" as text) = cast(u.id as text) )  
		from auth."user" u where u.status ='active'
		`);
    }

    async listOfTaskRecentDay(id_user: string): Promise<UserEnt[]> {
        let nowDate = new Date(Date.now()).toUTCString();
        const midnight = nowDate.split(' ')[4];
        let previousDay = nowDate.replace(midnight, '00:00:00');
        const result = this.dataSource.manager
            .query(`select 'user.id',
            'user.first_name',
            'user.last_name',
            'user.username',
            'user.email',
            'user.phonenumber' from  auth."user" u 
		left join  task.task.task t on u.id =t."userId" 
		where  u.id ='${id_user}'
		and t.update_at  between '${previousDay}' and '${nowDate}'
		`);

        return result;
    }

    async _deleteEntity(entity: UserEnt, query?: QueryRunner) {
        if (query) return await query.manager.softRemove(entity);
        return await this.dataSource.manager.softRemove(entity);
    }

    async getAllUser() {
        return await this.dataSource.manager
            .createQueryBuilder(UserEnt, 'user')
            .select([
                'user.id',
                'user.first_name',
                'user.last_name',
                'user.username',
                'user.email',
                'user.phonenumber',
            ]).getMany()
    }
}
