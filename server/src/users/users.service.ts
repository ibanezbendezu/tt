import { Injectable } from "@nestjs/common";
import { Profile } from "passport-github2";
import { PrismaService } from "src/prisma/prisma.service";
import { User } from "../types";
import { AuthProvider, User as DummyUser } from "../shared";

/**
 * Servicio que maneja todas las operaciones relacionadas con los usuarios.
 */
@Injectable()
export class UsersService {

    constructor(private prisma: PrismaService) {
    }

    /**
     * Busca un usuario en la base de datos y lo crea si no existe.
     * @param profile Perfil de GitHub.
     * @param accessToken Token de acceso de GitHub.
     * @param provider Proveedor de autenticación.
     * @returns Usuario.
     */
    async findOrCreate(profile: Profile, accessToken: string, provider: AuthProvider): Promise<DummyUser> {
        const { id, username, emails, displayName, photos } = profile;
        const githubId: number = +id;

        let user = await this.prisma.user.findUnique({
            where: {
                githubId: githubId
            }
        });

        if (!user) {
            user = await this.prisma.user.create({
                data: {
                    githubId: githubId,
                    name: username,
                    githubToken: accessToken
                }
            });
        } else {
            let newUsername = username;
            if (user.name !== newUsername) {
                await this.prisma.user.update({
                    where: {
                        githubId: githubId
                    },
                    data: {
                        name: newUsername
                    }
                });
            }
            
            user = await this.prisma.user.update({
                where: {
                    githubId: githubId
                },
                data: {
                    githubToken: accessToken
                }
            });
        }

        return {
            id: user.id.toString(),
            provider,
            providerId: id,
            username: username,
            email: emails ? emails[0].value : "",
            displayName: displayName || username,
            photos: photos
        };
    }

    async getAllUsers(): Promise<User[]> {
        return this.prisma.user.findMany({});
    }

    async getUserById(id: number): Promise<User> {
        return this.prisma.user.findUnique({
            where: {
                id
            }
        });
    }

    async getUserByGithubId(id: number): Promise<User> {
        return this.prisma.user.findUnique({
            where: {
                githubId: id
            }
        });
    }

    async getUserByName(username: string): Promise<User> {
        return this.prisma.user.findUnique({
            where: {
                name: username
            }
        });
    }

    async getUserToken(username: string): Promise<string> {
        const user = await this.getUserByName(username);
        return user.githubToken;
    }
}
