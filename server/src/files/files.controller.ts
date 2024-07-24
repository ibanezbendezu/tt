import { Body, Controller, Get, Headers, NotFoundException, Param } from '@nestjs/common';
import { FilesService } from './files.service';
import { JwtAuthService } from '../auth/jwt/jwt-auth.service';

@Controller("files")
export class FilesController {
    constructor(
        private readonly filesService: FilesService,
        private readonly jwt: JwtAuthService
    ) {
    }

    @Get("content/:id")
    async getFileContentById(
        @Param("id") id: string,
        @Headers('authorization') authorizationHeader: string
    ){
        try {
            const token = authorizationHeader.split(' ')[1];
            const decoded = this.jwt.verifyToken(token);
            const username = decoded.username;

            const fileFound = await this.filesService.getFileContentById(Number(id), username);
            if (!fileFound) throw new NotFoundException("File not found");
            return fileFound;
        } catch (error) {
            throw new NotFoundException("Token inválido o expirado");
        }
    }

    @Get("content/sha/:sha")
    async getFileContentBySha(
        @Param("sha") sha: string,
        @Headers('authorization') authorizationHeader: string
    ){
        try {
            const token = authorizationHeader.split(' ')[1];
            const decoded = this.jwt.verifyToken(token);
            const username = decoded.username;

            const fileFound = await this.filesService.getFileContentBySha(sha, username);
            if (!fileFound) throw new NotFoundException("File not found");
            return fileFound;
        } catch (error) {
            throw new NotFoundException("Token inválido o expirado");
        }
    }
}
