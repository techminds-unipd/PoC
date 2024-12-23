import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { WorkflowsModule } from './workflows/workflows.module';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    WorkflowsModule,
      AuthModule,
    MongooseModule.forRoot('mongodb://root:password@localhost:27017/'),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
