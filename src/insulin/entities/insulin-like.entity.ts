import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { InsulinUser } from './insulin-user.entity';
import { InsulinServiceEntity } from './insulin-service.entity';

@Entity('insulin_likes')
@Unique('uq_insulin_likes_user_service', ['userId', 'serviceId'])
export class InsulinLike {
  @PrimaryGeneratedColumn() id: number;
  @Column({ name: 'user_id', type: 'integer' }) userId: number;
  @Column({ name: 'service_id', type: 'integer' }) serviceId: number;
  @ManyToOne(() => InsulinUser, { nullable: false, onDelete: 'NO ACTION' })
  @JoinColumn({
    name: 'user_id',
    foreignKeyConstraintName: 'fk_insulin_likes_user',
  })
  user: InsulinUser;
  @ManyToOne(() => InsulinServiceEntity, {
    nullable: false,
    onDelete: 'NO ACTION',
  })
  @JoinColumn({
    name: 'service_id',
    foreignKeyConstraintName: 'fk_insulin_likes_service',
  })
  service: InsulinServiceEntity;
}
