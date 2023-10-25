import { Storage } from "@ionic/storage";
const store = new Storage({
    name: '__flash_ionic'
});
store.create();

const courseStore = {
    getCourse: async function() {
        const courses = await store.get('courses')
        return courses;
    },

    setCourse: async function(data: Array<Object>) {
        const courses = await store.set('courses', data)
        return courses;
    }
}

export default courseStore;