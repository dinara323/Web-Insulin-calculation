import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
} from 'typeorm';

import { InsulinLike } from './insulin-like.entity';


@Entity('insulin_users')
export class InsulinUser {


  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    length:100,
  })
  name:string;

}