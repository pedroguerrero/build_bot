import { DataSource } from 'typeorm';
import { Tag } from './entities/tag.entity';
import { Build } from './entities/build.entity';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DATABASE_SERVER,
  username: process.env.DATABASE_USERNAME,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  synchronize: false,
  logging: false,
  entities: [Tag, Build],
  subscribers: [],
  migrations: [],
});
