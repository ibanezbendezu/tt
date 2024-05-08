import { Injectable } from '@nestjs/common';
import { Profile } from 'passport-github2';
import { PrismaService } from 'src/prisma/prisma.service';
import { User, Token } from '../types';


import { AuthProvider, User as DummyUser } from '../shared';

@Injectable()
export class UsersService {
	constructor(private prisma: PrismaService) { }

	async findOrCreate(profile: Profile, accessToken: string, provider: AuthProvider): Promise<DummyUser> {
		const { id, displayName, photos, username } = profile;
		const githubId: number = +id;

		let user = await this.prisma.user.findUnique({
			where: {
				githubId: githubId,
			},
		});
		
		if (!user) {
			user = await this.prisma.user.create({
				data: {
					githubId: githubId,
					name: username,
					tokens: {
						create: {
							token: accessToken,
							active: true,
							date: new Date(),
						},
					},
				},
			});
		}
				
		return {
			id: user.id.toString(),
			provider,
			providerId: id,
			displayName: displayName,
			photos: photos,
		};
	}

		async getAllUsers(): Promise<User[]> {
			return this.prisma.user.findMany({
				include: {
					tokens: true
				}
			});
		}
		
		async getUserById(id: number): Promise<User> {
			return this.prisma.user.findUnique({
				where: {
					id
				},
				include: {
					tokens: true
				}
			});
		}
	
	async getUserByGId(id: number): Promise<User> {
		return this.prisma.user.findUnique({
			where: {
				githubId: id
			},
			include: {
				tokens: true
			}
		});
	}

	async getUserByName(username: string): Promise<User> {
		return this.prisma.user.findUnique({
		  where: {
			name: username
		  },
		  include: {
			tokens: true
		  }
		});
	}

	async getUserToken(username: string): Promise<string> {
		const user = await this.getUserByName(username);

		const token = user.tokens[0].token;

		return token;
	}
}
