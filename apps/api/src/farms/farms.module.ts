// apps/api/src/farms/farms.module.ts
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { FarmsService } from './farms.service';
import { FarmsController } from './farms.controller';
import { Farm, FarmSchema } from './entities/farm.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Farm.name, schema: FarmSchema },
    ]),
  ],
  controllers: [FarmsController],
  providers: [FarmsService],
})
export class FarmsModule {}