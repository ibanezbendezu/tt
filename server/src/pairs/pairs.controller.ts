import { Controller, Get, Post, Put, Delete, Body, Param, NotFoundException, Res, UseGuards, Headers } from "@nestjs/common";
import { PairsService } from './pairs.service';
import { JwtAuthService } from "../auth/jwt/jwt-auth.service";
import { Response } from "express";

@Controller("pairs")
export class PairsController {
    constructor(
        private readonly pairsService: PairsService,
        private readonly jwt: JwtAuthService
    ) {
    }

    @Get(":id")
    async getPairById(
        @Param("id") id: string,
    ){
        const pairFound = await this.pairsService.getPairById(Number(id));
        if (!pairFound) throw new NotFoundException("Pair not found");
        return pairFound;
    }

    @Get(":clusterId/:fileId")
    async getPairsByClusterId(
        @Param("clusterId") clusterId: string,
        @Param("fileId") fileId: string,
    ){
        const pairsFound = await this.pairsService.getPairsByClusterId(Number(clusterId), Number(fileId));
        if (!pairsFound) throw new NotFoundException("Pairs not found");
        return pairsFound;
    }

    @Get("/sha/:sha/:fileSha")
    async getPairsByClusterSha(
        @Param("sha") sha: string,
        @Param("fileSha") fileSha: string,
    ){
        const pairsFound = await this.pairsService.getPairsByClusterSha(sha, fileSha);
        if (!pairsFound) throw new NotFoundException("Pairs not found");
        return pairsFound;
    }
    
    @Get()
    async getAllPairs(){
        const pairsFound = await this.pairsService.getAllPairs();
        if (!pairsFound) throw new NotFoundException("Pairs not found");
        return pairsFound;
    }
}
