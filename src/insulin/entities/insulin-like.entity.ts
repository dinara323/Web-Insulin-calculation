import {
  Entity,
  PrimaryColumn,
  Column,
} from 'typeorm';

@Entity('insulin_likes')
export class InsulinLike {
  @PrimaryColumn({
    name: 'user_id',
    type: 'integer',
  })
  userId: number;

  @PrimaryColumn({
    name: 'service_id',
    type: 'integer',
  })
  serviceId: number;
}