import { sha512 } from 'js-sha512';
import { BasicEnt } from 'src/common/entities/basic.entity';
import { SchemaEntityEnum } from 'src/common/enums/schema.entity.enum';
import { MenuEnt } from 'src/modules/crud/modules/menu/entities/menu.entity';
import { DepartmentEnt } from 'src/modules/department/modules/entities/department.entity';
import { FileEnt } from 'src/modules/file/modules/entities/file.entity';
import { MessageEnt } from 'src/modules/message/modules/entities/message.entity';
import { RoleEnt } from 'src/modules/role/modules/entities/role.entity';
import {
  BeforeInsert, Column,
  Entity,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn
} from 'typeorm';
import { TaskEnt } from '../../../task/modules/entities/task.entity';
import { UserStatus } from '../enum/user.status';

@Entity({ schema: SchemaEntityEnum.AUTH, name: 'user' })
export class UserEnt extends BasicEnt {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: false })
  first_name: string;

  @Column({ nullable: false })
  last_name: string;

  @Column({ nullable: false, unique: true })
  username: string;

  @Column({ nullable: false })
  password: string;

  @Column({ nullable: false, unique: true })
  email: string;

  @Column({ nullable: false, unique: true })
  phonenumber: string;

  @Column({ type: 'enum', enum: UserStatus, default: UserStatus.ACTIVE })
  status: UserStatus;

  @ManyToOne(() => DepartmentEnt, (department) => department.users)
  department: DepartmentEnt;

  @ManyToMany(() => RoleEnt, (role) => role.users)
  role: RoleEnt[];

  menu: MenuEnt[]

  @OneToMany(() => FileEnt, (files) => files.user)
  files: FileEnt[];

  @OneToMany(() => TaskEnt, (task) => task.user)
  task: TaskEnt[];

  @OneToMany(() => MessageEnt, (messages) => messages.user)
  messages: MessageEnt[];

  @BeforeInsert()
  async hashPassword() {
    if (this.password) {
      this.password = sha512(this.password);
    }
  }
  async validatePassword(password: string) {
    return this.password === sha512(password);
  }

}
