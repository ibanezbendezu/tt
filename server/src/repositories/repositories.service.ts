import { Injectable } from "@nestjs/common";
import { Octokit } from "@octokit/rest";
import { UsersService } from "src/users/users.service";
import { Repository } from "@prisma/client";
import { LRUCache } from "lru-cache";

interface FileContent {
    path: string;
    sha: string;
    content: string;
}

@Injectable()
export class RepositoriesService {
    private octokit: Octokit;
    private cache: LRUCache<string, string>;

    constructor(
        private user: UsersService) {
        this.cache = new LRUCache<string, string>({
            max: 1000,
            ttl: 1000 * 60 * 60 // 1 hour
        });
    }

    async getRepositoryContent(owner: string, name: string, username: string) {
        const user_token = await this.user.getUserToken(username);
        const token = user_token || process.env.GITHUB_TOKEN;

        this.octokit = new Octokit({ auth: token });

        try {
            const sha = await this.octokit.repos.getBranch({
                owner,
                repo: name,
                branch: "master"
            });

            const { data } = await this.octokit.git.getTree({
                owner,
                repo: name,
                tree_sha: sha.data.commit.sha,
                recursive: "1"
            });

            const files = data.tree.filter(item => item.type === "blob" && item.path.startsWith("src/main/java/"));

            const fileContents = await Promise.all(files.map(async (file) => {
                const content = await this.getFileContent(owner, name, file.sha);
                return { path: file.path, sha: file.sha, content };
            }));

            return {
                sha: data.sha,
                name,
                owner,
                content: fileContents
            };

        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    async getFilteredRepositoryContent(owner: string, name: string, username: string, page: number = 1, perPage: number = 100): Promise<any> {
        const user_token = await this.user.getUserToken(username);
        const token = user_token || process.env.GITHUB_TOKEN;
    
        this.octokit = new Octokit({ auth: token });
    
        try {
        const sha = await this.octokit.repos.getBranch({
            owner,
            repo: name,
            branch: "master"
        });
    
        const { data } = await this.octokit.git.getTree({
            owner,
            repo: name,
            tree_sha: sha.data.commit.sha,
            recursive: "1",
            page,
            per_page: perPage
        });
    
        const files = data.tree.filter(item => item.type === "blob" && item.path.startsWith("src/main/java/"));
    
        if (files.length === 0) {
            throw new Error("No files found in the repository");
        }
    
        const fileContents = await Promise.allSettled(files.map(async (file) => {
            const content = await this.getFileContent(owner, name, file.sha);
            return { path: file.path, sha: file.sha, content };
        }));
    
        const filteredFiles = fileContents
            .filter(result => result.status === 'fulfilled')
            .map(result => {
                const file = (result as PromiseFulfilledResult<any>).value;
                const fileType = this.identifyFileType(file.content);
                return { ...file, fileType };
            })
            .filter(file => file.fileType !== "Unknown");
    
        return {
            sha: data.sha,
            name,
            owner,
            content: filteredFiles
        };
    
        } catch (error) {
           console.error(error);
        throw error;
        }
    }

    private async getFileContent(owner: string, repo: string, file_sha: string): Promise<string> {
        const cacheKey = `${owner}:${repo}:${file_sha}`;
        let fileContent = this.cache.get(cacheKey);
    
        if (!fileContent) {
        const { data } = await this.octokit.git.getBlob({
            owner,
            repo,
            file_sha
        });
        fileContent = Buffer.from(data.content, "base64").toString("utf-8");
        this.cache.set(cacheKey, fileContent);
        }
    
        return fileContent;
    }

    identifyFileType(fileContent: string): string {
        const controllerPattern = /@Controller|\@GetMapping|\@PostMapping|\@DeleteMapping|\@PutMapping/;
        const servicePattern = /@Service|\@Injectable/;
        const repositoryPattern = /@Repository|findById\(|save\(/;
        const entityPattern = /@Entity/;

        if (controllerPattern.test(fileContent)) {
            return "Controller";
        } else if (servicePattern.test(fileContent)) {
            return "Service";
        } else if (repositoryPattern.test(fileContent)) {
            return "Repository";
        } else if (entityPattern.test(fileContent)) {
            return "Entity";
        }

        return "Unknown";
    }
}
