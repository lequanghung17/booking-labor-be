import { Logger, Module, OnModuleInit } from '@nestjs/common';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { url } from 'inspector';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService): TypeOrmModuleOptions => {
        // Determine database type from environment
        const dbType = configService.get<string>('DB_TYPE', 'mysql');

        // Common configuration
        const baseConfig = {
          type: dbType as 'mysql' | 'postgres',
          // host: configService.get<string>('DB_HOST', 'localhost'),
          // port: configService.get<number>(
          //   'DB_PORT',
          //   dbType === 'mysql' ? 3306 : 5432,
          // ),
          // username: configService.get<string>('DB_USERNAME', 'root'),
          // password: configService.get<string>('DB_PASSWORD', ''),
          // database: configService.get<string>('DB_NAME', 'railway'),
          url: configService.get<string>('DATABASE_URL', ''),
          entities: [__dirname + '/../**/*.entity{.ts,.js}'],
          synchronize: configService.get<boolean>('DB_SYNCHRONIZE', true),
          logging: configService.get<boolean>('DB_LOGGING', false),
        };

        // Optional: Additional database-specific configurations
        const typeSpecificConfig =
          dbType === 'postgres'
            ? {
                // PostgreSQL specific options
                ssl: configService.get<boolean>('DB_SSL', false),
                // Add any PostgreSQL-specific connection parameters
              }
            : {
                // MySQL specific options
                charset: 'utf8mb4',
                // Add any MySQL-specific connection parameters
              };

        return {
          ...baseConfig,
          ...typeSpecificConfig,
        };
      },
    }),
  ],
})
export class DatabaseModule implements OnModuleInit {
  onModuleInit() {
    const dbType = process.env.DB_TYPE || 'mysql';
    Logger.log(
      `Database module initialized with ${dbType} database`,
      'DatabaseModule',
    );
  }
}
