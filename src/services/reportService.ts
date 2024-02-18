import axios from "axios";
import { Storage } from '@ionic/storage';
import userStore from "@/stores/userStore";
import courseStore from "@/stores/courseStore";
import server from "@/config/server";


const reportService = {

    overview: async function () {
        const user = await userStore.getUser();
        
        const config = {
            headers: {
                Accept: "application/json",
                Authorization: 'Baerer ' + user.token
            },
        };
        const response = await axios.get(server + '/api/reports/overview', config);
        // await courseStore.setCourse(response.data.courses);
        return response.data
    },
}

export default reportService;