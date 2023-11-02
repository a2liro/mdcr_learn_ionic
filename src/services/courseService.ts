import axios from "axios";
import { Storage } from '@ionic/storage';
import userStore from "@/stores/userStore";
import courseStore from "@/stores/courseStore";
import server from "@/config/server";


const courseService = {

    getCourses: async function () {
        const user = await userStore.getUser();
        
        const config = {
            headers: {
                Accept: "application/json",
                Authorization: 'Baerer ' + user.token
            },
        };
        const response = await axios.get(server + '/api/courses', config);
        await courseStore.setCourse(response.data.courses);
        return response.data.courses
    },
    getCourseData: async function (id: any) {
        const user = await userStore.getUser();
        
        const config = {
            headers: {
                Accept: "application/json",
                Authorization: 'Baerer ' + user.token
            },
        };
        const response = await axios.get(server + '/api/courses/show/' + id, config);
        
        await courseStore.setCourse(response.data);
        return response.data
    }
}

export default courseService;