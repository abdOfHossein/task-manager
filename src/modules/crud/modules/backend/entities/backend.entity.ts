import { BasicEnt } from 'src/common/entities/basic.entity';
import { SchemaEntityEnum } from 'src/common/enums/schema.entity.enum';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { RoleRlBackendEnt } from '../../role-backend-rl/entities/role-rl-backend.entity';

@Entity({ schema: SchemaEntityEnum.MENU, name: 'backend' })
export class BackendEnt extends BasicEnt {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true })
  slug_name: string;

  @Column({ unique: true, nullable: true })
  route: string;

  @Column({ nullable: true })
  method: string;

  @Column({ nullable: true })
  query: string;

  @Column({ nullable: true })
  body: string;

  @OneToMany(() => RoleRlBackendEnt, (role_user) => role_user.role)
  role_backend: RoleRlBackendEnt[];
}
