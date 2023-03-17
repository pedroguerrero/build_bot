/* eslint-disable indent */
import {
  Entity,
  Column,
  JoinTable,
  BaseEntity,
  ManyToMany,
  BeforeInsert,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Tag } from './tag.entity';

@Entity({ name: 'builds' })
export class Build extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  @Column()
  img!: string;

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  @ManyToMany((type) => Tag, (tag) => tag.builds, {
    eager: true,
  })
  @JoinTable()
  tags!: Tag[];

  @BeforeInsert()
  toLower() {
    this.name = this.name.trim().toLowerCase();
  }
}
