import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
dotenv.config({
  path: `src/.env.stage.${process.env.NODE_ENV || 'dev'}`,
});

@Injectable()
export class TypeOrmConfigServicesDevelop implements TypeOrmOptionsFactory {
  constructor(private configService: ConfigService) {}
  createTypeOrmOptions(): TypeOrmModuleOptions | Promise<TypeOrmModuleOptions> {
    return {
      type: 'postgres',
      host: this.configService.get('DB_HOST'),
      port: this.configService.get('DB_PORT'),
      username: this.configService.get('DB_USERNAME'),
      password: this.configService.get('DB_PASSWORD'),
      database: this.configService.get('DB_DATABASENAME'),
      // entities: [__dirname + '/../**/*.entity{.ts,.js}'], You can define specific entities place or using autoLoadEntities
      autoLoadEntities: true,
      synchronize: true,
      logging: true,
    };
  }
}

@Injectable()
export class TypeOrmConfigServicesProd implements TypeOrmOptionsFactory {
  constructor(private configService: ConfigService) {}
  createTypeOrmOptions(): TypeOrmModuleOptions | Promise<TypeOrmModuleOptions> {
    return {
      type: 'postgres',
      host: this.configService.get('DB_HOST'),
      port: this.configService.get('DB_PORT'),
      username: this.configService.get('DB_USERNAME'),
      password: this.configService.get('DB_PASSWORD'),
      database: this.configService.get('DB_DATABASENAME'),
      entities: [__dirname + '/../**/*.entity{.ts,.js}'],
      synchronize: false,
      logging: true,
    };
  }
}

/*
  + ADD: To run migrations Typeorm need to define DataSource export
*/
const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASENAME,
  entities: [__dirname + '/../**/*.entity{.ts,.js}'],
  migrations: ['src/migrations/**/*.ts'],
  migrationsTableName: 'sadasdd',
  synchronize: false,
});

export default AppDataSource;
