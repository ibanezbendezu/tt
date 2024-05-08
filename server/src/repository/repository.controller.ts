import { Controller, Get, Post, Put, Delete, Body, Param, Headers, NotFoundException } from '@nestjs/common';
import { RepositoryService } from './repository.service';
import { RepositoryDto } from './dto/repository';

@Controller('repos')
export class RepositoryController {
  
  constructor(private readonly repositoryService: RepositoryService) {}

  @Get(':id')
  async getRepoContent( @Param('id') id: string, @Body() body: { username: string }) {
    return await this.repositoryService.getRepositoryContent(id, body.username);
  }

  @Post()
  async getReposContent(@Body() repos: string[], username: string) {
    return await this.repositoryService.getMultipleReposContent(repos, username);
  } 

  /* @Post()
  async createRepository(@Body() repos: RepositoryDto, username: string) {
    return this.repositoryService.saveMultipleReposMetadata(repos, username);
  } */

}