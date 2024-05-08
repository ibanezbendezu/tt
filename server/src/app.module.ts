import { RepositoryModule } from './repository/repository.module';
import { TaskModule } from './task/task.module';
import { AuthModule } from './github/auth.module';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import appConfig from './config/app.config';
import { GithubOauthModule } from './auth/github/github-oauth.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    TaskModule, RepositoryModule, AuthModule,
    ConfigModule.forRoot({ isGlobal: true, load: [appConfig] }), GithubOauthModule, UsersModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
