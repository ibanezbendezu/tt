import { Injectable } from "@nestjs/common";
import { Dolos, Report } from "src/dolos";
import { Comparison } from "@prisma/client";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class ComparisonsService {

    constructor(
        private prisma: PrismaService) {
    }

    async createComparation(leftRepository: any, rightRepository: any, clusterId: number) {
        try {
            const dolosFile = new Dolos();

            const leftRepoFiles = await dolosFile.stringsToFiles(leftRepository.content);
            const righRepoFiles = await dolosFile.stringsToFiles(rightRepository.content);

            const sortStrings = [leftRepository.sha, rightRepository.sha].sort();
            const sha = sortStrings.join("");

            const c = await this.prisma.comparison.findUnique({ where: { sha: sha } });
            if (c) {
                return c;
            }

            let repositoryA = await this.prisma.repository.findUnique({ where: { sha: leftRepository.sha } });
            if (!repositoryA) {
                repositoryA = await this.prisma.repository.create({
                    data: {
                        sha: leftRepository.sha,
                        owner: leftRepository.owner,
                        name: leftRepository.name,
                        totalLines: 0
                    }
                });
            }

            let repositoryB = await this.prisma.repository.findUnique({ where: { sha: rightRepository.sha } });
            if (!repositoryB) {
                repositoryB = await this.prisma.repository.create({
                    data: {
                        sha: rightRepository.sha,
                        owner: rightRepository.owner,
                        name: rightRepository.name,
                        totalLines: 0
                    }
                });
            }

            let comparison = await this.prisma.comparison.create({
                data: {
                    sha: sha,
                    similarity: 0.0,
                    comparisonDate: new Date(),
                    repositories: { connect: [{ id: repositoryA.id }, { id: repositoryB.id }] },
                }
            });

            repositoryA = await this.prisma.repository.update({
                where: { id: repositoryA.id },
                data: {
                    comparisons: { connect: { id: comparison.id } }
                }
            });

            repositoryB = await this.prisma.repository.update({
                where: { id: repositoryB.id },
                data: {
                    comparisons: { connect: { id: comparison.id } }
                }
            });

            console.log("Comparing repositories: ", leftRepository.name, rightRepository.name);

            for (let i = 0; i < leftRepoFiles.length; i++) {
                let fileA = await this.prisma.file.findUnique({
                    where: {
                        sha: leftRepoFiles[i].sha
                    }
                });
                if (!fileA) {
                    const fileAType = this.identifyFileType(leftRepoFiles[i].content);
                    const fileALanguage = this.getFileLanguage(leftRepoFiles[i].path);
                    fileA = await this.prisma.file.create({
                        data: {
                            sha: leftRepoFiles[i].sha,
                            filepath: leftRepoFiles[i].path,
                            charCount: leftRepoFiles[i].charCount,
                            lineCount: leftRepoFiles[i].lineCount,
                            repository: { connect: { id: repositoryA.id } },
                            type: fileAType,
                            language: fileALanguage
                        }
                    });
                    repositoryA = await this.prisma.repository.update({
                        where: { id: repositoryA.id },
                        data: {
                            totalLines: repositoryA.totalLines + fileA.lineCount,
                            files: { connect: { id: fileA.id } }
                        }
                    });
                }
                for (let j = 0; j < righRepoFiles.length; j++) {

                    let fileB = await this.prisma.file.findUnique({
                        where: {
                            sha: righRepoFiles[j].sha
                        }
                    });

                    if (!fileB) {
                        const fileBType = this.identifyFileType(righRepoFiles[j].content);
                        const fileBLanguage = this.getFileLanguage(righRepoFiles[j].path);
                        fileB = await this.prisma.file.create({
                            data: {
                                sha: righRepoFiles[j].sha,
                                filepath: righRepoFiles[j].path,
                                charCount: righRepoFiles[j].charCount,
                                lineCount: righRepoFiles[j].lineCount,
                                repository: { connect: { id: repositoryB.id } },
                                type: fileBType,
                                language: fileBLanguage
                            }
                        });

                        repositoryB = await this.prisma.repository.update({
                            where: { id: repositoryB.id },
                            data: {
                                totalLines: repositoryB.totalLines + fileB.lineCount,
                                files: { connect: { id: fileB.id } }
                            }
                        });
                    }
                    console.log("Comparing files: ", leftRepoFiles[i].path, righRepoFiles[j].path);

                    const dolos = new Dolos();
                    const result = await dolos.analyze([leftRepoFiles[i], righRepoFiles[j]]);

                    const pair = await this.prisma.pair.create({
                        data: {
                            similarity: result.allPairs()[0].similarity,

                            leftFilepath: result.allPairs()[0].leftFile.path,
                            leftFileId: fileA.id,
                            leftFileSha: leftRepoFiles[i].sha,
                            charCountLeft: result.allPairs()[0].leftFile.charCount,
                            lineCountLeft: result.allPairs()[0].leftFile.lineCount,

                            rightFilepath: result.allPairs()[0].rightFile.path,
                            rightFileId: fileB.id,
                            rightFileSha: righRepoFiles[j].sha,
                            charCountRight: result.allPairs()[0].rightFile.charCount,
                            lineCountRight: result.allPairs()[0].rightFile.lineCount,

                            files: { connect: [{ id: fileA.id }, { id: fileB.id }] },
                            comparisonId: comparison.id
                        }
                    });

                    let p = result.allPairs()[0];
                    if (p) {
                        for (const f of p.buildFragments()) {

                            let left = f.leftSelection;
                            let right = f.rightSelection;

                            let fragment = await this.prisma.fragment.create({
                                data: {
                                    leftstartRow: left.startRow,
                                    leftendRow: left.endRow,
                                    leftstartCol: left.startCol,
                                    leftendCol: left.endCol,
                                    rightstartRow: right.startRow,
                                    rightendRow: right.endRow,
                                    rightstartCol: right.startCol,
                                    rightendCol: right.endCol,
                                    pair: { connect: { id: pair.id } }                                
                                }
                            });
                        }
                    }
                }
            }
            console.log("---------------------------------");
            return comparison;
        } catch (error) {
            console.log(error);
        }
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

    getFileLanguage(filename: string): string {
        const lastDotIndex = filename.lastIndexOf('.');
        if (lastDotIndex === -1) return 'Unknown';
        const extension = filename.substring(lastDotIndex + 1);
        const languageName = ComparisonsService.languagePicker[extension] || 'Unknown';
        return languageName;
    }

    async getAllComparisons(): Promise<Comparison[]> {
        return this.prisma.comparison.findMany({
            include: {
                repositories: {
                    include: {
                        comparisons: true,
                        files: {
                            include: {
                                pairs: {
                                    include: {
                                        fragments: true
                                    }
                                }
                            }
                        }
                    }
                },
            }
        });
    }

    static languagePicker = {
        "sh": "bash",
        "bash": "bash",
        "c": "c",
        "h": "c/cpp",
        "cpp": "cpp",
        "hpp": "cpp",
        "cc": "cpp",
        "cp": "cpp",
        "cxx": "cpp",
        "c++": "cpp",
        "hh": "cpp",
        "hxx": "cpp",
        "h++": "cpp",
        "cs": "c-sharp",
        "csx": "c-sharp",
        "py": "python",
        "py3": "python",
        "php": "php",
        "php3": "php",
        "php4": "php",
        "php5": "php",
        "php7": "php",
        "phps": "php",
        "phpt": "php",
        "phtml": "php",
        "mo": "modelica",
        "mos": "modelica",
        "java": "java",
        "js": "javascript",
        "elm": "elm",
        "r": "r",
        "rdata": "r",
        "rds": "r",
        "rda": "r",
        "scala": "scala",
        "sc": "scala",
        "sql": "sql",
        "ts": "typescript",
        "tsx": "tsx",
        "v": "verilog",
        "vh": "verilog"
    };
}
