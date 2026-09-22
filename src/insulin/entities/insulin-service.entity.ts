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
    name: 'image_url',
    type: 'varchar',
    length: 500,
    nullable: true,
  })
  imageUrl: string | null;

  @Column({
    name: 'video_url',
    type: 'varchar',
    length: 500,
    nullable: true,
  })
  videoUrl: string | null;

  @Column({
    type: 'integer',
    nullable: true,
  })
  age: number | null;

  @Column({
    type: 'integer',
    nullable: true,
  })
  weight: number | null;

  @Column({
    name: 'sensitivity_coefficient',
    type: 'integer',
    nullable: true,
  })
  sensitivityCoefficient: number | null;

  @Column({
    name: 'created_at',
    type: 'timestamp',
  })
  createdAt: Date;

  @Column({
    type: 'integer',
  })
  creator: number;

  @Column({
    name: 'formed_at',
    type: 'timestamp',
    nullable: true,
  })
  formedAt: Date | null;
}