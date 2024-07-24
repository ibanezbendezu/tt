import axios from "../lib/axios"

export const profileDataRequest = async (username: string) => {
    try {
        const res = await axios.get(`/users/profile/${username}`);
        let {repos, userProfile} = res.data;

        repos = repos.filter((repo: { language: string }) => repo.language === "Java");
        repos.sort((a: { created_at: string | number | Date; }, b: {
            created_at: string | number | Date;
        }) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()); //descending, recent first

        return {userProfile, repos};
    } catch (error) {
        console.error("Error fetching profile data:", error);
        throw error;
    }
}

export const clusterDataRequest = async (id: number) => {
    try {
        const res = await axios.get(`/clusters/${id}`);
        return {data: res.data};
    } catch (error) {
        console.error("Error fetching cluster data:", error);
        throw error;
    }
}

export const clusterDataRequestBySha = async (sha: string) => {
    try {
        const res = await axios.get(`/clusters/sha/${sha}`);
        return {data: res.data};
    } catch (error) {
        console.error("Error fetching cluster data:", error);
        throw error;
    }
}

export const clusterCreateRequest = async (repos: any[], username: any) => {
    try {
        const requestBody = {repos, username};
        const res = await axios.post(`/clusters`, requestBody);
        return {data: res.data};
    } catch (error) {
        console.error("Error fetching cluster create data:", error);
        throw error;
    }
}

export const clusterUpdateRequest = async (id: number, repos: any[], username: any) => {
    try {
        const requestBody = {repos, username};
        const res = await axios.put(`/clusters/${id}`, requestBody);
        return {data: res.data};
    } catch (error) {
        console.error("Error fetching cluster update data:", error);
        throw error;
    }
}

export const clusterUpdateRequestBySha = async (sha: string, repos: any[], username: any) => {
    try {
        const requestBody = {repos, username};
        const res = await axios.put(`/clusters/sha/${sha}`, requestBody);
        return {data: res.data};
    } catch (error) {
        console.error("Error fetching cluster update data:", error);
        throw error;
    }
}

export const clusterDeleteRequestBySha = async (sha: string) => {
    try {
        const res = await axios.delete(`/clusters/sha/${sha}`);
        return {data: res.data};
    } catch (error) {
        console.error("Error fetching cluster delete data:", error);
        throw error;
    }
}

export const fileContentRequest = async (id: number) => {
    try {
        const res = await axios.get(`/files/content/${id}`);
        return {data: res.data};
    } catch (error) {
        console.error("Error fetching file content data:", error);
        throw error;
    }
}

export const fileContentRequestBySha = async (sha: string) => {
    try {
        const res = await axios.get(`/files/content/sha/${sha}`);
        return {data: res.data};
    } catch (error) {
        console.error("Error fetching file content data:", error);
        throw error;
    }
}

export const pairSimilaritiesByClusterRequest = async (id: number) => {
    try {
        const res = await axios.get(`/clusters/${id}/similarities`);
        return {data: res.data};
    } catch (error) {
        console.error("Error fetching pair similarities data:", error);
        throw error;
    }
}

export const pairSimilaritiesByClusterShaRequest = async (sha: string) => {
    try {
        const res = await axios.get(`/clusters/sha/${sha}/similarities`);
        return {data: res.data};
    } catch (error) {
        console.error("Error fetching pair similarities data:", error);
        throw error;
    }
}


//PAIRS
export const pairByIdDataRequest = async (id: number) => {
    try {
        const res = await axios.get(`/pairs/${id}`);
        return {data: res.data};
    } catch (error) {
        console.error("Error fetching pair data:", error);
        throw error;
    }
}

export const pairByClusterDataRequest = async (clusterId: number, fileId: number) => {
    try {
        const res = await axios.get(`/pairs/${clusterId}/${fileId}`);
        return {data: res.data};
    } catch (error) {
        console.error("Error fetching pair data:", error);
        throw error;
    }
}

export const pairByClusterShaDataRequest = async (sha: string, fileSha: string) => {
    try {
        const res = await axios.get(`/pairs/sha/${sha}/${fileSha}`);
        return {data: res.data};
    } catch (error) {
        console.error("Error fetching pair data:", error);
        throw error;
    }
}
