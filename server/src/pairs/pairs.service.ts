import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { FilesService } from 'src/files/files.service';
import { Octokit } from '@octokit/rest';

@Injectable()
export class PairsService {
    private octokit: Octokit;

    constructor(
        private prisma: PrismaService,
        private readonly filesService: FilesService,
    ) {
    }

    async getPairById(pairId: number) {
        this.octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });

        const pairFound = await this.prisma.pair.findUnique({
            where: {
                id: pairId,
            },
            select: {
                id: true,
                similarity: true,
                leftFileSha: true,
                rightFileSha: true,
                files: {
                    include: {
                        repository: {
                            select: {
                                name: true,
                                owner: true,
                                sha: true,
                            },
                        },
                    },
                },
                fragments: {
                    select: {
                        id: true,
                        leftstartRow: true,
                        leftendRow: true,
                        rightstartRow: true,
                        rightendRow: true,
                        pairId: true,
                    },
                }
            },
        });

        if (!pairFound) {
            return null;
        }

        let fragments = [{ start: 0, end: 0 }];
        let pairFragments = [{ start: 0, end: 0 }];

        if (pairFound.similarity) {
            if (pairFound.leftFileSha === pairFound.files[0].sha) {
                [pairFound.leftFileSha, pairFound.rightFileSha] = [pairFound.rightFileSha, pairFound.leftFileSha];  

                pairFound.fragments.forEach(fragment => {
                    [fragment.leftstartRow, fragment.rightstartRow] = [fragment.rightstartRow, fragment.leftstartRow];
                    [fragment.leftendRow, fragment.rightendRow] = [fragment.rightendRow, fragment.leftendRow];
                });
            }

            pairFragments = pairFound.fragments.map(fragment => {
                return {
                    start: fragment.rightstartRow,
                    end: fragment.rightendRow,
                };
            });
            fragments = pairFound.fragments.map(fragment => {
                return {
                    start: fragment.leftstartRow,
                    end: fragment.leftendRow,
                };
            });
        }
        const file = pairFound.files.find(file => file.sha === pairFound.leftFileSha);
        const pairFile = pairFound.files.find(file => file.sha === pairFound.rightFileSha);

        const finalData = {
            id: pairFound.id,
            similarity: pairFound.similarity,
            file1: {
                ...file,
                fragments: fragments,
            },
            file2: {
                ...pairFile,
                fragments: pairFragments,
            }
        };

        return finalData;
    }

    async getPairsByClusterSha(clusterSha: string, fileSha: string) {
        const fileFound = await this.prisma.file.findUnique({
            where: {
                sha: fileSha,
            },
            include: {
                repository: {
                    select: {
                        name: true,
                        owner: true,
                        sha: true,
                    },
                },
            }
        });

        const pairsFound = await this.prisma.pair.findMany({
            where: {
                comparison: {
                    clusters: {
                        some: {
                            sha: clusterSha,
                        },
                    },
                },
                files: {
                    some: {
                        id: fileFound.id,
                    },
                },
                NOT: [
                    {
                        files: {
                            every: {
                                OR: [
                                    {
                                        id: fileFound.id,
                                    },
                                    {
                                        type: {
                                            not: fileFound.type,
                                        },
                                    },
                                ],
                            },
                        },
                    },
                ],
            },
            select: {
                id: true,
                similarity: true,
                leftFileSha: true,
                rightFileSha: true,
                files: {
                    include: {
                        repository: {
                            select: {
                                name: true,
                                owner: true,
                                sha: true,
                            },
                        },
                    },
                },
                fragments: {
                    select: {
                        id: true,
                        leftstartRow: true,
                        leftendRow: true,
                        rightstartRow: true,
                        rightendRow: true,
                        pairId: true,
                    },
                }
            },
        });
        
        const pairsWithContent = await Promise.all(pairsFound.map(async (pair) => {
            if (pair.leftFileSha !== fileFound.sha) {
                [pair.leftFileSha, pair.rightFileSha] = [pair.rightFileSha, pair.leftFileSha];
                
                pair.fragments.forEach(fragment => {
                    [fragment.leftstartRow, fragment.rightstartRow] = [fragment.rightstartRow, fragment.leftstartRow];
                    [fragment.leftendRow, fragment.rightendRow] = [fragment.rightendRow, fragment.leftendRow];
                });
            }

            const fragments = pair.fragments;
            const file = pair.files.find(file => file.sha == pair.rightFileSha);

            return {
                id: pair.id,
                similarity: pair.similarity,
                sideFragments: fragments.map(fragment => { return { start: fragment.leftstartRow, end: fragment.leftendRow } } ),
                file: {
                    ...file,
                    fragments: fragments.map(fragment => { return { start: fragment.rightstartRow, end: fragment.rightendRow } } ),
                },
            };
        }));

        let pairsByRightRepository = [];
        pairsWithContent.forEach(pair => {
            let repositoryGroup = pairsByRightRepository.find(repo => repo.name === pair.file.repository.name);
            if (!repositoryGroup) {
                repositoryGroup = { name: pair.file.repository.name, id: pair.file.repositoryId, pairs: [] };
                pairsByRightRepository.push(repositoryGroup);
            }
            repositoryGroup.pairs.push(pair);
        });

        const finalData = {
            file: {
                ...fileFound,
                fragments: [{ start: 0, end: 0 }],
            },
            repositories: pairsByRightRepository,
        };

        return finalData;
    }

    async getAllPairs() {
        const pairsFound = await this.prisma.pair.findMany({
            select: {
                id: true,
                similarity: true,
                leftFileSha: true,
                rightFileSha: true,
                files: {
                    include: {
                        repository: {
                            select: {
                                name: true,
                                owner: true,
                                sha: true,
                            },
                        },
                    },
                },
                fragments: {
                    select: {
                        id: true,
                        leftstartRow: true,
                        leftendRow: true,
                        rightstartRow: true,
                        rightendRow: true,
                        pairId: true,
                    },
                }
            },
        });

        return pairsFound;
    }
}
