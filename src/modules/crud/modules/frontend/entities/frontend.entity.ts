import { BasicEnt } from 'src/common/entities/basic.entity';
import { SchemaEntityEnum } from 'src/common/enums/schema.entity.enum';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { MenuEnt } from '../../menu/entities/menu.entity';
import { TypePlatformEnum } from '../enum/type.platform.enum';

@Entity({ schema: SchemaEntityEnum.MENU, name: 'frontend' })
export class FrontendEnt extends BasicEnt {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true })
  slug_name: string;

  @Column({
    type: 'enum',
    enum: TypePlatformEnum,
    default: TypePlatformEnum.WEB,
  })
  type_platform: TypePlatformEnum;

  @Column({ nullable: true })
  description: string;

  @Column({ nullable: true })
  host: string;

  @Column({ nullable: true, unique: false })
  route: string;

  @OneToMany(() => MenuEnt, (menu) => menu.frontend)
  menu: MenuEnt[];
}
