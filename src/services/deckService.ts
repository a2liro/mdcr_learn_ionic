import axios from "axios";
import { Storage } from '@ionic/storage';
import userStore from "@/stores/userStore";
// import deckStore from "@/stores/deckStore";
import server from "@/config/server";


const deckService = {

    playDeck: async function (id: any) {
        const user = await userStore.getUser();
        
        const config = {
            headers: {
                Accept: "application/json",
                Authorization: 'Baerer ' + user.token
            },
        };
        const response = await axios.get(server + '/api/decks/play/' + id, config);
        console.log(response);

        
        // await deckStore.setDeck(response.data.decks);
        return response.data
    },
}

export default deckService;