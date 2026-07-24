import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Letter } from './letter.entity';
import { User } from './user.entity';

@Entity('user_letter_progress')
export class UserLetterProgress {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int', default: 0 })
  proficiencyLevel: number;

  @Column({ type: 'timestamp' })
  lastPracticed: Date;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;

  @ManyToOne(() => Letter, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'letterId' })
  letter: Letter;
}
