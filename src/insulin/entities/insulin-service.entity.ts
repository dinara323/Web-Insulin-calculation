import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  Index,
  JoinColumn,
  ManyToOne,
} from 'typeorm';

import { InsulinUser } from './insulin-user.entity';

@Entity('insulin_services')
@Index('uq_insulin_services_one_draft', ['creator'], {
  unique: true,
  where: "status = 'черновик'",
})
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
    nullable: true,
  })
  description: string | null;

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
    type: 'numeric',
    precision: 6,
    scale: 2,
    transformer: {
      to: (value: number | null) => value,
      from: (value: string | null) => (value === null ? null : Number(value)),
    },
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

  @ManyToOne(() => InsulinUser, { nullable: false, onDelete: 'NO ACTION' })
  @JoinColumn({
    name: 'creator',
    foreignKeyConstraintName: 'fk_insulin_services_creator',
  })
  creatorUser: InsulinUser;

  @Column({
    name: 'formed_at',
    type: 'timestamp',
    nullable: true,
  })
  formedAt: Date | null;
}
