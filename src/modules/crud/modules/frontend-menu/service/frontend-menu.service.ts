import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { DataSource } from "typeorm";
import { FrontendEnt } from "../../frontend/entities/frontend.entity";
import { FrontendService } from "../../frontend/services/frontend.service";
import { MenuService } from "../../menu/services/menu.service";


@Injectable()
export class FrontendMenuService {
    constructor(
        @InjectRepository(FrontendEnt)
        private dataSource: DataSource,
        private menuService: MenuService,
        private frontendService: FrontendService) { }


    async delete(frontend_id: string) {
        const frontEnt = await this.dataSource.manager.findOne(FrontendEnt, { where: { id: frontend_id } })
        // const menuent=await this.menuService.getOne(frontEnt.menu,ParamResultEnum.Entity)
        await this.menuService.deleteMany(frontEnt.menu)
        await this.frontendService._delete(frontEnt.id)
    }
}