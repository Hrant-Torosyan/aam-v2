const BASE_URL = process.env.REACT_APP_BASE_URL;

const getAuthHeader = () => ({
    Authorization: `Bearer ${JSON.parse(localStorage.getItem("userAuth") || "{}").token}`,
});

export const api = {
    async getUserInfo() {
        const response = await fetch(`${BASE_URL}users/profiles/me`, {
            method: "GET",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                ...getAuthHeader(),
            },
        });
        if (!response.ok) throw new Error("Failed to fetch user info");
        return response.json();
    },

    async setUserInfo(userData: any) {
        const response = await fetch(`${BASE_URL}users/profiles`, {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                ...getAuthHeader(),
            },
            body: JSON.stringify(userData),
        });
        if (!response.ok) throw new Error("Failed to update user info");
        return response.json();
    },
    async setUserImage(userData: File[]) {
        const formData = new FormData();
        let name: string | null = null;

        userData.forEach((file, index) => {
            name = file.name; // Set the name to the current file's name
            formData.append(`files[${index}].image`, file);
            formData.append(`files[${index}].imageName`, file.name);
            formData.append(`files[${index}].type`, "USER");
        });

        const response = await fetch(`${BASE_URL}media/store`, {
            method: "POST",
            headers: {
                Authorization: getAuthHeader().Authorization,
            },
            body: formData,
        });

        if (!response.ok) throw new Error("Failed to upload user image");

        const data = await response.json();

        if (!name) {
            throw new Error("File name is null. Cannot retrieve uploaded file data.");
        }

        return data.data[name];
    },

    async resetPassword(userData: any) {
        const response = await fetch(`${BASE_URL}users/profiles/change-password`, {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                ...getAuthHeader(),
            },
            body: JSON.stringify(userData),
        });
        if (!response.ok) throw new Error("Failed to reset password");
        return response.json();
    },

    async getProfileProducts(queryData: any) {
        const queryString = queryData ? `?${new URLSearchParams(queryData).toString()}` : "";
        const response = await fetch(`${BASE_URL}portfolios/list${queryString}`, {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                ...getAuthHeader(),
            },
            body: JSON.stringify({}),
        });
        if (!response.ok) throw new Error("Failed to fetch profile products");
        return response.json();
    },

    async getProfit() {
        const response = await fetch(`${BASE_URL}users/profiles/profit`, {
            method: "GET",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                ...getAuthHeader(),
            },
        });
        if (!response.ok) throw new Error("Failed to fetch profit");
        return response.json();
    },

    async getProfileCareer() {
        const response = await fetch(`${BASE_URL}users/profiles/career`, {
            method: "GET",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                ...getAuthHeader(),
            },
        });
        if (!response.ok) throw new Error("Failed to fetch profile career");
        return response.json();
    },
};