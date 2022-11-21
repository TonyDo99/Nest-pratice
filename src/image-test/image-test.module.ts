import { Module } from '@nestjs/common';
import { ImageTestController } from './image-test.controller';

@Module({
  controllers: [ImageTestController],
})
export class ImageTestModule {}
