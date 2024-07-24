import axios from "../lib/axios"
import {cookies} from "next/headers";
import {jwtVerify} from "jose";

const secretKey = process.env.JWT_SECRET;
const key = new TextEncoder().encode(secretKey);

export async function decrypt(input: string): Promise<any> {
    const {payload} = await jwtVerify(input, key, {
        algorithms: ["HS256"],
    });
    return payload;
}

export async function isSessionExpired(session: any): Promise<boolean> {
    const currentTime = Math.floor(Date.now() / 1000);
    if (!session) return true;
    return session.exp < currentTime;
}

export async function getSession() {
    const token = cookies().get("jwt")?.value;
    if (!token) return null;
    try {
        const session = await decrypt(token);
        const expired = await isSessionExpired(session);
        if (expired) {
            console.log("Session has expired.");
            return null;
        }
        return session;
    } catch (error: any) {
        if (error.name === "JWTExpired") {
            console.log("JWT has expired.");
        } else {
            console.error("An error occurred:", error);
        }
        return null;
    }
}

export async function refresh() {
    return await axios.post("/auth/github/refresh");
}

export async function logout() {
    return await axios.post("/auth/github/logout");
}

export async function profile() {
    return await axios.get("/profile");
}
