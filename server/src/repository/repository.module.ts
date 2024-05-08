import { Module } from '@nestjs/common';
import { RepositoryService } from './repository.service';
import { RepositoryController } from './repository.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { UsersModule } from 'src/users/users.module';

@Module({
    imports: [PrismaModule, UsersModule,],
    controllers: [RepositoryController,],
    providers: [RepositoryService,],
})
export class RepositoryModule {}
