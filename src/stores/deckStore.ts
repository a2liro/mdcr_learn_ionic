import { Storage } from "@ionic/storage";
const store = new Storage({
    name: '__flash_ionic'
});
store.create();

const deckStore = {
    getCurrentDeck: async function() {
        const cards = await store.get('currentDeck')
        return cards;
    },

    setCurrentDeck: async function(data: Array<Object>) {
        console.log(JSON.parse(JSON.stringify(data)))
        const cards = await store.set('currentDeck', JSON.parse(JSON.stringify(data)))
        return cards;
    }
}

export default deckStore;