import {
    Body,
    Controller,
    Delete,
    Get,
    Post,
    Put,
    Query,
    Req,
    UseGuards
} from '@nestjs/common';
import { ApiBearerAuth, ApiHeader, ApiOperation, ApiTags } from '@nestjs/swagger';
import { PublicJwt } from 'src/common/decorates/public.jwt.decorator';
import { PageDto } from 'src/common/dtos/page.dto';
import { ParamResultEnum } from 'src/common/enums/param.result.enum';
import { TaskPageDto } from 'src/modules/task/modules/paginations/task.page.dto';
import { GetUser } from '../../../../common/decorates/get.user.decorator';
import { UserResponseJWTDto } from '../../../../common/dtos/user.dto';
import { JwtGuard } from '../../modules/auth/guards/jwt.guard';
import { ChangePasswordAdminDto } from '../../modules/dtos/change-password-admin.dto';
import { ChangePasswordUserDto } from '../../modules/dtos/change-password.user.dto';
import { CreateUserDto } from '../../modules/dtos/create.user.dto';
import { LoginUserDto } from '../../modules/dtos/login.user.dto';
import { UpdateUserDto } from '../../modules/dtos/update.user.dto';
import { UserEnt } from '../../modules/entities/user.entity';
import { RolesGuard } from '../../modules/guard/role.guard';
import { UserPageDto } from '../../modules/paginations/user.page.dto';
import { UserService } from '../../modules/services/user.service';

@ApiTags('User')
@ApiHeader({
    name: 'accept-language',
    description: 'language code',
    schema: {
        default: 'fa',
    },
})
@ApiBearerAuth('access-token')
@Controller('User')
export class UserController {
    PREFIX_TOKEN_AUTH = 'prefix_auth_token_';
    constructor(private user: UserService) { }

    // @UseGuards(RolesGuard)
    @ApiOperation({ summary: 'sign up user with department' })
    @Post('/register')
    register(
        @Query('id_department') id_department: string,
        @Body() createUserDto: CreateUserDto,
    ): Promise<UserEnt> {
        createUserDto.id_department = id_department;
        return this.user.create(createUserDto, ParamResultEnum.DTO);
    }

    @ApiBearerAuth('access-token')
    @ApiOperation({ summary: 'get user' })
    @Get('/getUser')
    getUser(@GetUser() user: UserResponseJWTDto) {

        return this.user.getUser(user);
    }

    @ApiOperation({ summary: 'create admin' })
    @Get('/create/admin')
    creatAdmin() {
        return this.user.creatAdmin();
    }

    @ApiOperation({ summary: 'update user' })
    @ApiBearerAuth('access-token')
    @Put()
    updateUser(
        @Query('id_user') id_user: string,
        @Query('id_department') id_department: string,
        @Query('unq_file') unq_file: string,
        @Body() updateUserDto: UpdateUserDto,
    ): Promise<UserEnt> {

        updateUserDto.id_department = id_department;
        updateUserDto.unq_file = unq_file;
        return this.user.update(id_user, updateUserDto, ParamResultEnum.DTO);
    }

    @UseGuards(RolesGuard)
    @ApiBearerAuth('access-token')
    @ApiOperation({ summary: 'delete User' })
    @Delete()
    deleteUser(@Query('id_user') id_user: string): Promise<UserEnt> {
        return this.user.delete(id_user, ParamResultEnum.DTO);
    }


    @ApiBearerAuth('access-token')
    @ApiOperation({ summary: 'pagination for user' })
    @Post('page')
    paginationUser(@Body() pageDto: UserPageDto): Promise<PageDto<UserEnt>> {
        return this.user.pagination(pageDto);
    }

    @ApiBearerAuth('access-token')
    @ApiOperation({ summary: 'set Role for user' })
    @UseGuards(JwtGuard)
    @Get('setRole')
    async setRole(@Query('id_role') id_role: string, @Req() req: any) {
        return await this.user.createJwtSetRole(req.user.uid, id_role);
    }

    @PublicJwt()
    @Post('login')
    @ApiOperation({ summary: 'sign in user by username and password' })
    async login(@Body() loginUserDto: LoginUserDto) {
        return await this.user._createJwt(loginUserDto);
    }

    @ApiBearerAuth('access-token')
    @ApiOperation({ summary: 'test Jwt' })
    @Get('/protected')
    protected(
        @GetUser() user: UserResponseJWTDto
    ) {
        return user
    }

    @UseGuards(RolesGuard)
    @ApiBearerAuth('access-token')
    @Get('/block')
    @ApiOperation({ summary: 'block user access to app' })
    async blockUser(@Query('id_user') id_user: string) {
        return await this.user.blockUser(id_user);
    }

    @UseGuards(RolesGuard)
    @ApiBearerAuth('access-token')
    @Get('/all')
    @ApiOperation({ summary: 'get all Users' })
    async getAllUser() {
        return await this.user.getAllUser();
    }

    @UseGuards(RolesGuard)
    @ApiBearerAuth('access-token')
    @Post('password')
    @ApiOperation({ summary: 'change user password' })
    async changePassword(
        @Body() changePasswordUserDto: ChangePasswordUserDto,
        @GetUser() id_user: UserResponseJWTDto,
    ) {
        return await this.user.changePassword(id_user, changePasswordUserDto);
    }



    @UseGuards(RolesGuard)
    @ApiBearerAuth('access-token')
    @Post('admin/password')
    @ApiOperation({ summary: 'change user password by vadmin' })
    async changePasswordAdmin(
        @Body() changePasswordUserDto: ChangePasswordAdminDto,
        @Query('id_user') id_user: string,
    ) {
        return await this.user.changePasswordAdmin(id_user, changePasswordUserDto);
    }

    @ApiBearerAuth('access-token')
    @ApiOperation({ summary: 'pagination for task of user wiht recieve id_user' })
    @Post('page/task/id_user')
    paginationTask(
        @Body() pageDto: TaskPageDto,
        @Query('id_user') id_user: string,
    ): Promise<PageDto<UserEnt>> {
        return this.user.paginationTask(id_user, pageDto);
    }

    @ApiBearerAuth('access-token')
    @ApiOperation({ summary: 'pagination for task of user with JWT' })
    @Post('page/task/withJWT')
    paginationTaskWithJwt(
        @Body() pageDto: TaskPageDto,
        @GetUser() id_user: UserResponseJWTDto,
    ): Promise<PageDto<UserEnt>> {
        return this.user.paginationTaskWithJwt(id_user.uid, pageDto);
    }

    @UseGuards(RolesGuard)
    @ApiBearerAuth('access-token')
    @ApiOperation({ summary: 'pagination for user' })
    @Get('/admin/jwt')
    jwtAdmin(@Query('id_user') id_user: string, @Req() req: any) {
        return this.user.jwtAdmin(id_user);
    }



    @UseGuards(RolesGuard)
    @ApiBearerAuth('access-token')
    @ApiOperation({ summary: 'get all users in department' })
    @Get('/users')
    async getDepartmentUsers(
        @Query('id_department') id_department: string,
    ): Promise<UserEnt[]> {
        return this.user.getDepartmentUsers(id_department);
    }

    @UseGuards(RolesGuard)
    @ApiBearerAuth('access-token')
    @ApiOperation({ summary: 'pagination for tasks are done in previous day' })
    @Post('/page/previousDay')
    paginationDoneTaskRecentDay(
        @GetUser() id_user: UserResponseJWTDto,
        @Body() pageDto: TaskPageDto,
    ) {
        return this.user.paginationDoneTaskRecentDay(id_user.uid, pageDto);
    }

    @ApiBearerAuth('access-token')
    @ApiOperation({ summary: 'find All tasks in previous day' })
    @Post('/lsit/previousDay')
    listOfTaskRecentDay(@GetUser() id_user: UserResponseJWTDto) {
        return this.user.listOfTaskRecentDay(id_user.uid);
    }


}
