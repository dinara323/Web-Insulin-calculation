import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('insulin_users')
export class InsulinUser {
  @PrimaryGeneratedColumn() id: number;
  @Column({ length: 100 }) name: string;
  // Reserved for authentication in a later lab. Never store a plain password.
  // Existing users remain valid until they have been assigned a password.
  @Column({
    name: 'password_hash',
    type: 'varchar',
    length: 255,
    nullable: true,
    select: false,
  })
  passwordHash: string | null;
}
