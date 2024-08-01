import { Controller, Get, Req, Res, UseGuards } from "@nestjs/common";
import { Request, Response } from "express";
import { JwtAuthGuard } from "../jwt/jwt-auth.guard";

import { User } from "../../shared";
import { PrismaService } from "src/prisma/prisma.service";
import { JwtAuthService } from "../jwt/jwt-auth.service";
import { GithubOauthGuard } from "./github-oauth.guard";

/**
 * Este controlador maneja todas las solicitudes relacionadas con la autenticación de GitHub.
 */
@Controller("auth/github")
export class GithubOauthController {
    constructor(private jwtAuthService: JwtAuthService, private prisma: PrismaService) {
    }

    @Get()
    @UseGuards(GithubOauthGuard)
    async githubAuth() {
        // La lógica de autenticación se maneja en el guard.
    }

    /**
     * Método que maneja la redirección de GitHub después de que el usuario haya iniciado sesión.
     * Aquí, se crea un JWT y se envía al cliente.
     * También se envía la información del usuario al cliente.
     * @param req
     * @param res
    */
    @Get("callback")
    @UseGuards(GithubOauthGuard)
    async githubAuthCallback(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
        const user = req.user as User;

        console.log(
            `${this.githubAuthCallback.name}(): req.user = ${JSON.stringify(user, null, 4)}`
        );

        const { accessToken } = this.jwtAuthService.login(user);

        const newUser = this.prisma.user.findUnique({
            where: {
                githubId: parseInt(user.providerId)
            }
        });
        const githubToken = (await newUser).githubToken;
        const userWithToken = {
            ...user,
            githubToken: githubToken
        };

        res.cookie("jwt", accessToken);
        res.cookie("user", JSON.stringify(userWithToken));
        res.redirect(`${process.env.CLIENT_URL}/welcome`);
    }

    @Get("logout")
    async logout(@Res({ passthrough: true }) res: Response) {
        res.clearCookie("jwt");
        return { message: "Logout successful" };
    }

    @Get("refresh")
    @UseGuards(JwtAuthGuard)
    async refresh(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
        const user = req.user as User;
        const { accessToken } = this.jwtAuthService.login(user);

        res.cookie("jwt", accessToken);
        return { access_token: accessToken };
    }

    @Get("check")
    @UseGuards(JwtAuthGuard)
    async check(@Req() req: Request, @Res() res: Response) {
        if (req.isAuthenticated()) {
            res.send({ user: req.user });
        } else {
            res.send({ user: null });
        }
    }
}
