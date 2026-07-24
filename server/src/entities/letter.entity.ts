import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Unit } from './unit.entity';

@Entity('letters')
export class Letter {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar' })
  uppercase: string;

  @Column({ type: 'varchar' })
  lowercase: string;

  @Column({ type: 'varchar', nullable: true })
  audioUrl: string | null;

  @ManyToOne(() => Unit, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'unitId' })
  unit: Unit;
}
