import { PrismaModule } from 'src/prisma/prisma.module';
import { TaskController } from './task.controller';
import { TaskService } from './task.service';
import { Module } from '@nestjs/common';

@Module({
    imports: [PrismaModule],
    controllers: [TaskController,],
    providers: [TaskService,],
})
export class TaskModule { }
