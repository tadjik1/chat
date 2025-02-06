import { registerAs } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

// NODE_ENV=test|development|production

export default registerAs('database', () => {
  const nodeEnv = process.env.NODE_ENV || 'development';

  return {
    type: 'sqlite',
    database: '/data/db.sqlite',
    synchronize: nodeEnv !== 'production',
    autoLoadEntities: true,
  } as TypeOrmModuleOptions;
});
