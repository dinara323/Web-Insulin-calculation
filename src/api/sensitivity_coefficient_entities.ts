import {
  Entity,
  PrimaryGeneratedColumn,
  PrimaryColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

@Entity('insulin_users')
export class InsulinUser {
  @PrimaryGeneratedColumn() id!: number;
  @Column({ length: 100 }) name!: string;
}

@Entity('insulin_services')
export class InsulinCalculation {
  @PrimaryGeneratedColumn() id!: number;
  @Column({ length: 200 }) name!: string;
  @Column({ length: 500 }) description!: string;
  @Column({ length: 20 }) status!: string;
  @Column({ name: 'image_url', type: 'varchar', length: 500, nullable: true })
  imageUrl!: string | null;
  @Column({ name: 'video_url', type: 'varchar', length: 500, nullable: true })
  videoUrl!: string | null;
  @Column({ type: 'integer', nullable: true }) age!: number | null;
  @Column({ type: 'integer', nullable: true }) weight!: number | null;
  @Column({ name: 'sensitivity_coefficient', type: 'integer', nullable: true })
  sensitivityCoefficient!: number | null;
  @Column({ name: 'created_at', type: 'timestamp' }) createdAt!: Date;
  @Column({ name: 'creator' }) creatorId!: number;
  @Column({ name: 'formed_at', type: 'timestamp', nullable: true })
  formedAt!: Date | null;
  @ManyToOne(() => InsulinUser, { nullable: false })
  @JoinColumn({ name: 'creator' })
  creator!: InsulinUser;
}

@Entity('insulin_likes')
export class InsulinLike {
  @PrimaryColumn({ name: 'user_id' }) userId!: number;
  @PrimaryColumn({ name: 'service_id' }) serviceId!: number;
  @ManyToOne(() => InsulinUser, { nullable: false })
  @JoinColumn({ name: 'user_id' })
  user!: InsulinUser;
  @ManyToOne(() => InsulinCalculation, { nullable: false })
  @JoinColumn({ name: 'service_id' })
  calculation!: InsulinCalculation;
}
