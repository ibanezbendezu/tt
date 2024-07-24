export function processSimilarityData(data: any) {
    const similarityCounts: { [key: number]: number } = {};

    data.forEach((item: { similarity: number; }) => {
        const roundedSimilarity = Math.round(item.similarity * 100);
        if (similarityCounts[roundedSimilarity]) {
            similarityCounts[roundedSimilarity] += 1;
        } else {
            similarityCounts[roundedSimilarity] = 1;
        }
    });

    return Object.entries(similarityCounts).map(([similarity, count]) => ({
        percent: similarity,
        amount: count
    }));
}