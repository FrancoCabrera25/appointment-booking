import { Module } from '@nestjs/common';
import { TurnService } from './turn.service';
import { TurnController } from './turn.controller';
import { AuthModule } from '../auth/auth.module';
import { MongooseModule } from '@nestjs/mongoose';
import { Turn, Turnschema } from './entities/turn.entity';

@Module({
  controllers: [TurnController],
  providers: [TurnService],
  imports: [
    MongooseModule.forFeature([
      {
        name: Turn.name,
        schema: Turnschema,
      },
    ]),
    AuthModule,
  ],
  exports: [MongooseModule],
})
export class TurnModule {}
