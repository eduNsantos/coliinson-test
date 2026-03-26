import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RankingController } from './presentation/http/controllers/ranking/ranking.controller';

@Module({
  imports: [],
  controllers: [AppController, RankingController],
  providers: [AppService],
})
export class AppModule {}
