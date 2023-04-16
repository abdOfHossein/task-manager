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
import {
  ApiBearerAuth,
  ApiHeader,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags
} from '@nestjs/swagger';
import { PageDto } from 'src/common/dtos/page.dto';
import { ParamResultEnum } from 'src/common/enums/param.result.enum';
import { CreateRelTaskDto } from 'src/modules/rel-task/modules/dtos/create.rel-task.dto';
import { RelTaskEnt } from 'src/modules/rel-task/modules/entities/rel-task.entity';
import { JwtGuard } from 'src/modules/user/modules/auth/guards/jwt.guard';
import { RolesGuard } from 'src/modules/user/modules/guard/role.guard';
import { GetUser } from '../../../../common/decorates/get.user.decorator';
import { UserResponseJWTDto } from '../../../../common/dtos/user.dto';
import { CreateTaskDto } from '../../modules/dtos/create.task.dto';
import { CreateTaskSomeUserDto } from '../../modules/dtos/create.task.some-user.dto';
import { CreateTaskWithIdUserIdReqDto } from '../../modules/dtos/create.task.withIdUserIdReq.dto';
import { UpdateStatusCheckStatusTaskDto } from '../../modules/dtos/update.check-status.task.dto';
import { UpdateStatusTaskDto } from '../../modules/dtos/update.status.task.dto';
import { UpdateTaskDto } from '../../modules/dtos/update.task.dto';
import { TaskEnt } from '../../modules/entities/task.entity';
import { ReportTaskPageDto } from '../../modules/paginations/report.page.dto';
import { TaskPageDto } from '../../modules/paginations/task.page.dto';
import { TaskTypeStatusPageDto } from '../../modules/paginations/task.status-type.page.dto';
import { TaskTypePageDto } from '../../modules/paginations/task.type.page.dto';
import { TaskService } from '../../modules/services/task.service';

@ApiTags('Task')
@ApiBearerAuth('access-token')
@ApiHeader({
  name: 'accept-language',
  description: 'language code',
  schema: {
    default: 'fa',
  },
})
@Controller('Task')
export class TaskController {
  constructor(private task: TaskService) { }

  @ApiOperation({ summary: 'get daily tasks' })
  @ApiResponse({ type: [TaskEnt] })
  @Get('daily')
  dailyTask(): Promise<TaskEnt[]> {
    return this.task.dailyTask();
  }
  @ApiOperation({ summary: 'paginatio for all ExpiredTask' })
  @Post('/all/ExpiredTask')
  allExpirationTask(@Body() pageDto: TaskPageDto): Promise<PageDto<TaskEnt>> {
    return this.task.allExpirationTask(pageDto);
  }

  @ApiOperation({ summary: 'paginatio for ExpiredTask with JWT' })
  @Post('/one/ExpiredTask')
  oneExpirationTask(
    @Body() pageDto: TaskPageDto,
    @GetUser() user: UserResponseJWTDto,
  ): Promise<PageDto<TaskEnt>> {
    return this.task.oneExpirationTask(user.uid, pageDto);
  }

  @ApiOperation({ summary: 'create task' })
  @Post()
  createTask(
    @Body() createTaskDto: CreateTaskDto,
    @Req() req: any,
  ): Promise<TaskEnt> {
    createTaskDto.id_user = req.user.id_User;
    return this.task.create(createTaskDto, ParamResultEnum.DTO);
  }
  //  create getOne update pagination delete
  @ApiOperation({ summary: 'findOne task' })
  @Get()
  findOneTask(@Query('id_task') id_task: string): Promise<TaskEnt> {
    return this.task.getOne(id_task, ParamResultEnum.DTO);
  }

  @ApiOperation({ summary: 'delete task' })
  @Delete()
  deleteTask(@Query('id_task') id_task: string): Promise<TaskEnt> {
    return this.task.delete(id_task, ParamResultEnum.DTO);
  }

  @ApiOperation({ summary: 'update task' })
  @Put()
  updateTask(
    @Query('id_task') id_task: string,
    @Body() updateTaskDto: UpdateTaskDto,
  ): Promise<TaskEnt> {
    return this.task.update(id_task, updateTaskDto, ParamResultEnum.DTO);
  }

  @ApiOperation({ summary: 'pagination of task' })
  @Post('page')
  pagination(@Body() pageDto: TaskPageDto): Promise<PageDto<TaskEnt>> {
    return this.task.pagination(pageDto);
  }

  @ApiOperation({ summary: 'pagination of task' })
  @Post('page/admin')
  paginationAdmin(
    @Body() pageDto: TaskPageDto,
    @Query('id_user') id_user: string,
  ): Promise<PageDto<TaskEnt>> {
    return this.task.paginationAdmin(id_user, pageDto);
  }

  @ApiOperation({ summary: 'create task with getting id_project' })
  @Post('/id_project')
  createTaskByProject(
    @Body() createTaskDto: CreateTaskDto,
    @Query('id_project') id_project: string,
    @Query('id_user') id_user: string,
    @GetUser() user: UserResponseJWTDto
  ): Promise<TaskEnt> {
    createTaskDto.id_project = id_project;
    createTaskDto.id_user = id_user;
    createTaskDto.head_id = user.uid;
    return this.task.createTaskByProject(createTaskDto);
  }

  @ApiOperation({ summary: 'pagination of task based on status' })
  @Post('/taskStatusReport')
  reportsTaskStatus(
    @Body() reportDto: ReportTaskPageDto,
    @GetUser() user: UserResponseJWTDto,
  ): Promise<PageDto<TaskEnt>> {
    return this.task.getReportTask(user.uid, reportDto);
  }

  @ApiOperation({ summary: 'pagination of task based on type' })
  @Post('/taskTypeReport')
  taskTypePagination(
    @Body() reportDto: TaskTypePageDto,
    @GetUser() user: UserResponseJWTDto,
  ): Promise<PageDto<TaskEnt>> {
    return this.task.taskTypePagination(user.uid, reportDto);
  }




  @ApiOperation({ summary: 'find all task based on id_user in jwt' })
  @Get('all/OfUser')
  getAllOfUser(@GetUser() user: UserResponseJWTDto): Promise<TaskEnt[]> {
    return this.task.getAllOfUser(user.uid);
  }



  @ApiOperation({ summary: 'find all task for admin' })
  @Get('all')
  getAllForAdmin(): Promise<TaskEnt[]> {
    return this.task.getAllForAdmin();
  }


  @ApiOperation({ summary: 'create task based on id_department' })
  @Post('/id_department')
  createTaskWithIdDepartment(
    @Query('id_department') id_department: string,
    @Body() createDto: CreateTaskDto,
    @GetUser() user: UserResponseJWTDto
  ): Promise<TaskEnt> {
    createDto.head_id = user.uid
    return this.task.createTaskWithIdDepartment(id_department, createDto);
  }

  @ApiOperation({ summary: 'create task based on id_department & id_req' })
  @ApiQuery({
    name: 'id_req',
    required: false,
  })
  @Post('/id_department/id_req')
  createTaskWithIdDepartmentAndIdReq(
    @Query('id_department') id_department: string,
    @Query('id_req') id_req: string,
    @Query('id_user') id_user: string,
    @Body() createDto: CreateTaskDto,
    @GetUser() user: UserResponseJWTDto
  ): Promise<TaskEnt> {
    createDto.head_id = user.uid
    return this.task.createTaskWithIdDepartmentAndIdReq(
      id_user,
      id_req,
      id_department,
      createDto,
    );
  }

  @ApiOperation({ summary: 'forward task to another person' })
  @Post('/forward')
  forwardTask(
    @Query('id_prevoise_task') id_prevoise_task: string,
    @Query('id_user') id_user: string,
    @Body() createDto: CreateRelTaskDto,
  ): Promise<RelTaskEnt> {
    return this.task.forwardTask(id_prevoise_task, createDto);
  }

  @ApiOperation({ summary: 'create task based on id_user & id_req' })
  @Post('/id_req/id_user')
  createTaskWithIdReqAnddUser(
    @Query('id_user') id_user: string,
    @Query('id_req') id_req: string,
    @Body() createDto: CreateTaskDto,
    @GetUser() user: UserResponseJWTDto
  ): Promise<TaskEnt> {
    createDto.head_id = user.uid
    return this.task.createTaskWithIdReqAnddUser(id_user, id_req, createDto);
  }

  @ApiOperation({ summary: 'findAll task are pending' })
  @Get('/all/pending')
  findAllPendingTask(): Promise<TaskEnt[]> {
    return this.task.findAllPendingTask();
  }

  @ApiOperation({ summary: 'update status of task ' })
  @Put('taskStatus')
  updateStatusTask(
    @Query('id_task') id_task: string,
    @Body() updateStatusTaskDto: UpdateStatusTaskDto,
  ): Promise<TaskEnt> {
    return this.task.updateStatusTask(id_task, updateStatusTaskDto.status);
  }

  @ApiOperation({ summary: 'update status of task ' })
  @Put('user/taskStatus')
  updateStatusTaskUser(
    @Query('id_task') id_task: string,
    @Body() updateStatusTaskDto: UpdateStatusTaskDto,
  ): Promise<TaskEnt> {
    return this.task.updateStatusTask(id_task, updateStatusTaskDto.status);
  }

  @ApiOperation({ summary: 'pagination of task based on status and type' })
  @Post('/taskStatusType')
  paginationStatusTypeTask(
    @Body() pageDto: TaskTypeStatusPageDto,
    @Req() req: any,
  ): Promise<PageDto<TaskEnt>> {
    return this.task.paginationStatusTypeTask(req.user.id_User, pageDto);
  }

  @ApiOperation({ summary: 'pagination of task based on status and type' })
  @Get('/changeStatus/pending')
  changeStatusToPending(
    @Query('id_task') id_task: string,
    @GetUser() user: UserResponseJWTDto,
  ): Promise<TaskEnt> {
    return this.task.changeStatusToPending(user.uid, id_task);
  }

  @ApiOperation({ summary: 'pagination of task based on status and type' })
  @Get('/changeStatus/success')
  changeStatusToSuccess(
    @Query('id_task') id_task: string,
    @GetUser() user: UserResponseJWTDto,
  ): Promise<TaskEnt> {
    return this.task.changeStatusToSuccess(user.uid, id_task);
  }

  @ApiOperation({
    summary:
      'change status of task to entered status and change checkstatus to pending',
  })
  @Put('/status/ToCheck')
  changeStatusToCheck(
    @Query('id_task') id_task: string,
    @Body() updateStatusTaskDto: UpdateStatusTaskDto,
    @GetUser() user: UserResponseJWTDto,
  ) {
    return this.task.changeStatusToCheck(
      id_task,
      user.uid,
      updateStatusTaskDto,
    );
  }


  @UseGuards(RolesGuard)
  @ApiOperation({
    summary:
      'admin=>change status of task to entered status and change checkstatus to done',
  })
  @Put('/status/ToCheck/admin')
  changeStatusToCheckAdmin(
    @Query('id_task') id_task: string,
    @Body() updateDto: UpdateStatusCheckStatusTaskDto,
  ) {
    return this.task.changeStatusToCheckAdmin(
      id_task,
      updateDto,
    );
  }

  @ApiOperation({
    summary: 'create task based on id_User & id_req',
  })
  @Post('/createTaskWithIdUserAndIdReq')
  createTaskWithIdUserAndIdReq(
    @Query('id_req') id_req: string,
    @Query('id_user') id_user: string,
    @GetUser() user: UserResponseJWTDto,
    @Body() createDto: CreateTaskWithIdUserIdReqDto,
  ): Promise<TaskEnt> {
    createDto.head_id = user.uid
    return this.task.ceateTaskWithIdUserIdReqDto(
      id_req,
      id_user,
      user.uid,
      createDto,
    );
  }

  @ApiOperation({ summary: 'pagination for task with CheckStatus' })
  @Post('page/ofCheckStatusTask')
  paginationTaskWithCheckStatus(
    @GetUser() user: UserResponseJWTDto,
    @Body() pageDto: TaskPageDto,
  ): Promise<PageDto<TaskEnt>> {
    return this.task.paginationTaskWithCheckStatus(user.uid, pageDto);
  }


  @ApiOperation({ summary: 'create task for some user' })
  @Post('/someUser')
  createTaskSomeUser(
    @Body() createDto: CreateTaskSomeUserDto,
    @GetUser() user: UserResponseJWTDto,
  ): Promise<TaskEnt[]> {
    createDto.head_id = user.uid
    return this.task.createTaskSomeUser(createDto);
  }
  
  @ApiOperation({ summary: 'pagination all task of departments user head ' })
  @Post('department/head')
  headDepartmentTask(
    @Body() taskTypeStatusPageDto: TaskTypeStatusPageDto,
    @GetUser() user: UserResponseJWTDto,
  ) {
    return this.task.headDepartmentTask(user, taskTypeStatusPageDto);
  }
}
