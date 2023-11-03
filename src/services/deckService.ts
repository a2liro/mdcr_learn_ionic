import axios from "axios";
import { Storage } from '@ionic/storage';
import userStore from "@/stores/userStore";
import server from "@/config/server";
import cardStore from "@/stores/cardStore";


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
        
        await cardStore.setCard(response.data.card);
        return response.data.card
    },
}

export default deckService;