/* eslint-disable indent */
import {
  Entity,
  Column,
  BaseEntity,
  ManyToMany,
  BeforeInsert,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Build } from './build.entity';

@Entity({ name: 'tags' })
export class Tag extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  @ManyToMany((type) => Build, (build) => build.tags)
  builds!: Build[];

  @BeforeInsert()
  toLower() {
    this.name = this.name.trim().toLowerCase();
  }
}
