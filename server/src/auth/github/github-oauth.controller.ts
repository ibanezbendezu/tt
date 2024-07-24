import { Controller, Get, Req, Res, UseGuards } from "@nestjs/common";
import { Request, Response } from "express";
import { JwtAuthGuard } from "../jwt/jwt-auth.guard";

import { User } from "../../shared";
import { PrismaService } from "src/prisma/prisma.service";
import { JwtAuthService } from "../jwt/jwt-auth.service";
import { GithubOauthGuard } from "./github-oauth.guard";

@Controller("auth/github")
export class GithubOauthController {
    constructor(private jwtAuthService: JwtAuthService, private prisma: PrismaService) {
    }

    @Get()
    @UseGuards(GithubOauthGuard)
    async githubAuth() {
    }

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

        //return { access_token: accessToken };

        // try {
        // 	res.redirect(`${SERVICE_URL}/home`);
        // } catch (err) {
        // 	res.status(500).send({ success: false, message: err.message });
        // }
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
