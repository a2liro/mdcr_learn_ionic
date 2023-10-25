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

        console.log(response);
        await userStore.setUser(response.data.user);
        return response;
    },
}

export default userService;