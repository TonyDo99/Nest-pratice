import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { TasksModule } from './tasks/tasks.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { ImageTestModule } from './image-test/image-test.module';
import { ConfigModule } from '@nestjs/config';
import { validationSchema } from './config.schema';
import { TypeOrmConfigServicesDevelop } from './config/database';
import { LoggerMiddleware } from './middleware/logger.middleware';
import { AuthoModule } from './autho/autho.module';
import { SocketModule } from './socket/socket.module';
import { AwsModule } from './aws/aws.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `src/.env.stage.${process.env.NODE_ENV || 'dev'}`,
      validationSchema,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useClass: TypeOrmConfigServicesDevelop,
    }),
    TasksModule,
    AuthModule,
    ImageTestModule,
    AuthoModule,
    SocketModule,
    AwsModule,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
