import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FrontendEnt } from '../frontend/entities/frontend.entity';
import { FrontendModule } from '../frontend/frontend.module';
import { MenuModule } from '../menu/menu.module';
import { FrontendMenuService } from './service/frontend-menu.service';

@Module({
    imports: [
        MenuModule,
        FrontendModule,
        TypeOrmModule.forFeature([FrontendEnt])
    ],
    providers: [FrontendMenuService],
    exports: [FrontendMenuService],
})
export class FrontEndMenuModule { }
