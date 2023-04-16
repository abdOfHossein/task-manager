import { BasicEnt } from 'src/common/entities/basic.entity';
import { SchemaEntityEnum } from 'src/common/enums/schema.entity.enum';
import { MessageUserEnt } from 'src/modules/message-user/modules/entities/message-user.entity';
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UserEnt } from '../../../user/modules/entities/user.entity';
import { MessageTypeEnum } from '../enum/message.type.enum';
import { RecieveTypeMessageEnum } from '../enum/recieve.type.message.enum';

@Entity({ schema: SchemaEntityEnum.MESSAGE, name: 'message' })
export class MessageEnt extends BasicEnt {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid', { array: true, nullable: true })
  to: string[];

  @Column({ nullable: true })
  title: string;

  @Column({ nullable: true })
  content: string;

  @Column({ nullable: true, type: 'enum', enum: RecieveTypeMessageEnum })
  recieve_type: RecieveTypeMessageEnum;

  @Column({ nullable: true, type: 'enum', enum: MessageTypeEnum })
  message_type: MessageTypeEnum;

  @Column({ nullable: true })
  publish_date: Date;

  @ManyToOne(() => UserEnt, (user) => user.messages)
  user: UserEnt;

  @OneToMany(() => MessageUserEnt, (messages_user) => messages_user.message)
  messages_user: MessageUserEnt[];
}
