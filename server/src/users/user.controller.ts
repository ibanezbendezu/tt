import { Controller, Get, Post, Put, Delete, Body, Param, NotFoundException } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from '@prisma/client';


@Controller('users')
export class UserController {

    constructor(private readonly userService: UsersService) { }

    @Get()
    async getAllUsers() {
        return this.userService.getAllUsers();
    }

    @Get(':id')
    async getUserById(@Param('id') id: string) {
        const Userfound = await this.userService.getUserById(Number(id));
        if (!Userfound) throw new NotFoundException('User not found');
        return Userfound;
    }

}