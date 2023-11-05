import axios from "axios"
import userStore from "@/stores/userStore";
import server from "@/config/server";

const userService = {
    login: async function (email: String, password: String) {
        const data = {
            email: email,
            password: password
        };
        const config = {
            headers: {
                Accept: "application/json",
            },
        };
        const response = await axios.post(server + '/api/login', data, config);
        await userStore.setUser(response.data.user);
        return response.data;
    },

    register: async function (name: String, email: String, password: String) {
        const data = {
            name: name,
            email: email,
            password: password
        };
        const config = {
            headers: {
                Accept: "application/json",
            },
        };
        const response = await axios.post(server + '/api/register', data, config);
        await userStore.setUser(response.data.user);
        return response.data;
    },
}

export default userService;