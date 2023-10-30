import { Storage } from "@ionic/storage";
const store = new Storage({
    name: '__flash_ionic'
});
store.create();

const cardStore = {
    getCard: async function() {
        const cards = await store.get('card')
        return cards;
    },

    setCard: async function(data: Array<Object>) {
        const cards = await store.set('card', data)
        return cards;
    }
}

export default cardStore;