import { Storage } from "@ionic/storage";
const store = new Storage({
    name: '__flash_ionic'
});
store.create();

const userStore = {
    getUser: async function() {
        const user = await store.get('user')
        return user;
    },

    setUser: async function(data: Object) {
        const user = await store.set('user', data)
        return user;
    }
}

export default userStore;