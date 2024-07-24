import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Octokit } from '@octokit/rest';
import { UsersService } from '../users/users.service';

@Injectable()
export class FilesService {
    private octokit: Octokit;

    constructor(
        private prisma: PrismaService,
        private user: UsersService) {
    }

    async getFileContentById(id: number, username: string) {
        const user_token = await this.user.getUserToken(username);
        const token = user_token || process.env.GITHUB_TOKEN;
        this.octokit = new Octokit({ auth: token });

        const file = await this.prisma.file.findUnique({
            where: { id },
            include: { repository: {
                select: { owner: true, name: true }
            }}
        });

        if (!file) return null;

        const content = await this.getFileContent(file.repository.owner, file.repository.name, file.sha);
        return content;
    }

    async getFileContentBySha(sha: string, username: string) {
        const user_token = await this.user.getUserToken(username);
        const token = user_token || process.env.GITHUB_TOKEN;
        this.octokit = new Octokit({ auth: token });

        const file = await this.prisma.file.findUnique({
            where: { sha },
            include: { repository: {
                select: { owner: true, name: true }
            }}
        });

        if (!file) return null;

        const content = await this.getFileContent(file.repository.owner, file.repository.name, file.sha);
        return content;
    }

    private async getFileContent(owner: string, repo: string, file_sha: string) {
        const { data } = await this.octokit.git.getBlob({
            owner,
            repo,
            file_sha
        });

        return Buffer.from(data.content, "base64").toString("utf-8");
    }
}
