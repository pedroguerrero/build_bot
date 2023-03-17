import { DataSource } from 'typeorm';
import { Tag } from './entities/tag.entity';
import { Build } from './entities/build.entity';

export const AppDataSource = new DataSource({
  type: 'sqlite',
  database: 'bot',
  synchronize: true,
  logging: false,
  entities: [Tag, Build],
  subscribers: [],
  migrations: [],
});
