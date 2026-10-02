import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('user_saved_declarations')
export class UserSavedDeclaration {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'user_id', type: 'varchar', length: 36 })
  userId: string;

  @Column({ name: 'declaration_id', type: 'varchar', length: 36 })
  declarationId: string;

  @CreateDateColumn({ name: 'saved_at' })
  savedAt: Date;
}
