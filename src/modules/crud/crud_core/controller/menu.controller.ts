import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Put,
  Query,
  UseGuards
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiHeader,
  ApiOperation,
  ApiResponse,
  ApiTags
} from '@nestjs/swagger';
import { GetUser } from 'src/common/decorates/get.user.decorator';
import { UserResponseJWTDto } from 'src/common/dtos/user.dto';
import { ParamResultEnum } from 'src/common/enums/param.result.enum';
import { JwtGuard } from 'src/modules/user/modules/auth/guards/jwt.guard';
import { CreateMenuDto } from '../../modules/menu/dtos/create.menu';
import { UpdateMenuDto } from '../../modules/menu/dtos/update.menu';
import { MenuPageDto } from '../../modules/menu/pagination/menu.pagination';
import { MenuGDto } from '../../modules/menu/results/menu.g.dto';
import { MenuService } from '../../modules/menu/services/menu.service';


@ApiTags('menu')
@ApiHeader({
  name: 'accept-language',
  description: 'language code',
  schema: {
    default: 'fa',
  },
})
@ApiBearerAuth('access-token')
@Controller('menu')
export class MenuController {
  constructor(private menuService: MenuService) { }

  @ApiOperation({ summary: 'Pagination menu' })
  @Post('page')
  pagination(@Body() pageDto: MenuPageDto) {
    return this.menuService.pagination(pageDto);
  }

  @ApiOperation({ summary: 'Create menu' })
  @Post()
  create(@Body() createMenuDto: CreateMenuDto) {
    return this.menuService.create(createMenuDto, ParamResultEnum.DTO);
  }

  @ApiOperation({ summary: 'Getone menu' })
  @Get()
  getOne(@Query('id_menu') id_menu: string) {
    return this.menuService.getOne(id_menu, ParamResultEnum.DTO);
  }

  @ApiOperation({ summary: 'Update menu' })
  @Put()
  update(
    @Query('id_menu') id_menu: string,
    @Body() updateMenuDto: UpdateMenuDto,
  ) {
    return this.menuService.update(id_menu, updateMenuDto, ParamResultEnum.DTO);
  }

  @ApiOperation({ summary: 'Delete menu' })
  @Delete()
  delete(@Query('id_menu') id_menu: string) {
    return this.menuService.delete(id_menu, ParamResultEnum.DTO);
  }

  @ApiOperation({ summary: 'List Of Menu`s Role' })
  @ApiResponse({ status: 200, type: MenuGDto })
  @UseGuards(JwtGuard)
  
  @Get('/list/role')
  getMenuTree(@GetUser() user: UserResponseJWTDto) {
    return this.menuService.getMenuTree(user.roles);
  }

  // @UseGuards(JwtGuard)
  @ApiOperation({ summary: 'List Of Menu`s' })
  @ApiResponse({ status: 200, type: MenuGDto })
  @Get('/list')
  getAllMenu() {
    return this.menuService.getAllMenu();
  }
}
