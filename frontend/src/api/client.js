// src/api/client.js
import axios from "axios";

const baseURL = import.meta.env.VITE_API_BASE_URL || "http://localhost:4000";

const api = axios.create({
    baseURL,
});

// REQUEST interceptor – pridedam accessToken
api.interceptors.request.use((config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
        config.headers = config.headers || {};
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// RESPONSE interceptor – čia tvarkom refresh'ą
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        const status = error.response?.status;
        const message = error.response?.data?.error;
        const url = originalRequest?.url || "";

        if (!originalRequest || !status) {
            return Promise.reject(error);
        }

        // auth endpointų NELIEČIAM (kad nepasidarytų begalinė kilpa)
        const isAuthEndpoint =
            url.includes("/auth/login") ||
            url.includes("/auth/register") ||
            url.includes("/auth/refresh") ||
            url.includes("/auth/logout");

        // - ARBA 422, kuriame žinutėje yra žodis "token" (nes pas tave: "Neleistinas ar pasibaigęs tokenas")
        const msgLower = typeof message === "string" ? message.toLowerCase() : "";
        const isTokenError = (status === 422 && msgLower.includes("token"));

        if (isTokenError && !originalRequest._retry && !isAuthEndpoint) {
            originalRequest._retry = true;

            const refreshToken = localStorage.getItem("refreshToken");
            if (!refreshToken) {
                // refreshToken nebėra – išloginu
                localStorage.removeItem("accessToken");
                localStorage.removeItem("refreshToken");
                localStorage.removeItem("currentUser");
                return Promise.reject(error);
            }

            try {
                console.log("[API] Access token invalid, trying /auth/refresh...");

                // svarbu: ČIA – PLAIN axios, ne api, kad nesuveiktų tas pats interceptor
                const res = await axios.post(`${baseURL}/auth/refresh`, {
                    refreshToken,
                });

                const { accessToken, refreshToken: newRefreshToken } = res.data || {};

                if (!accessToken) {
                    throw new Error("No accessToken in refresh response");
                }

                // išsaugom naujus tokenus
                localStorage.setItem("accessToken", accessToken);
                if (newRefreshToken) {
                    localStorage.setItem("refreshToken", newRefreshToken);
                }

                // perrašom headerį ir kartojam originalią užklausą
                originalRequest.headers = originalRequest.headers || {};
                originalRequest.headers.Authorization = `Bearer ${accessToken}`;

                console.log("[API] Refresh success, retrying original request:", url);
                return api(originalRequest);
            } catch (refreshError) {
                console.error("[API] Token refresh failed", refreshError);
                localStorage.removeItem("accessToken");
                localStorage.removeItem("refreshToken");
                localStorage.removeItem("currentUser");
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

export default api;
