import axios from "axios"
const BASE_URL = import.meta.env.VITE_BASE_URL;

export async function login(email: string, password: string) {
    try {
        const response = await axios.post(`${BASE_URL}/api/auth/login`, {email, password})
        const token = response.data.token;
        localStorage.setItem("token", token);
        return {error: null};
    }
    catch (error: any) {

        if(error.response.status === 401) {
            console.log("Invalid email or password")
            return {error: "Invalid email or password"};
        }
        else {
            return {error: "An error occurred please try again"};
        }
    }
}

export async function register(email: string, password: string) {
    try {
        const response = await axios.post(`${BASE_URL}/api/auth/register`, {email, password})
        if(response.status === 201) {
            return {error: null};
        }
        else {
            return {error: "An error occurred please try again"};
        }
    }
    catch (error: any) {
        if(error.response.status === 409) {
            console.log("User already exists")
            return {error: "User already exists"};
        }
        else {
            return {error: "An error occurred please try again"};
        }
    }
}

export async function logout() {
    localStorage.removeItem("token");
    return {error: null};
}