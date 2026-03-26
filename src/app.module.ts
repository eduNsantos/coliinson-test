import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ActivityController } from './presentation/http/controllers/activity/activity.controller';
import { ActivityModule } from './activity/activity.module';

@Module({
  imports: [ActivityModule],
  controllers: [AppController, ActivityController],
  providers: [AppService],
})
export class AppModule {}
