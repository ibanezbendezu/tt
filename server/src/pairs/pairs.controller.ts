import { Controller, Get, Param, NotFoundException } from "@nestjs/common";
import { PairsService } from './pairs.service';
import { JwtAuthService } from "../auth/jwt/jwt-auth.service";

/**
 * Controlador que maneja todas las solicitudes relacionadas con los pares.
 */
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

    /**
     * Endpoint que obtiene los pares de un cluster por su SHA.
     * SHA es un hash único que identifica un cluster.
     * @param sha SHA del cluster.
     * @returns Pares del cluster.
     */
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
