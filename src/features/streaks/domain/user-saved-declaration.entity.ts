import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('user_saved_declarations')
export class UserSavedDeclaration {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'user_id', type: 'varchar', length: 36 })
  userId: string;

  @Column({ name: 'declaration_id', type: 'varchar', length: 36 })
  declarationId: string;

  @Column({ name: 'gender', type: 'varchar', length: 20, nullable: true })
  gender?: string;

  @Column({ name: 'declared_date', type: 'varchar', length: 10, nullable: true })
  declaredDate?: string;

  @CreateDateColumn({ name: 'saved_at' })
  savedAt: Date;
}
