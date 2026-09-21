import {
  Column,
  Entity,
  PrimaryColumn,
} from 'typeorm';

@Entity('insulin_likes')
export class InsulinLikeEntity {
  @PrimaryColumn({
    type: 'integer',
  })
  user_id: number;

  @PrimaryColumn({
    type: 'integer',
  })
  service_id: number;
}