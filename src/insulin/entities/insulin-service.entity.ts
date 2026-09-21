import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('insulin_services')
export class InsulinServiceEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'varchar',
    length: 200,
  })
  name: string;

  @Column({
    type: 'varchar',
    length: 500,
  })
  description: string;

  @Column({
    type: 'varchar',
    length: 20,
  })
  status: string;

  @Column({
    type: 'varchar',
    length: 500,
    nullable: true,
  })
  image_url: string | null;

  @Column({
    type: 'varchar',
    length: 500,
    nullable: true,
  })
  video_url: string | null;

  @Column({
    type: 'integer',
  })
  age: number;

  @Column({
    type: 'integer',
  })
  weight: number;

  @Column({
    type: 'integer',
  })
  sensitivity_coefficient: number;

  @Column({
    type: 'timestamp',
  })
  created_at: Date;

  @Column({
    type: 'integer',
  })
  creator: number;

  @Column({
    type: 'timestamp',
    nullable: true,
  })
  formed_at: Date | null;
}