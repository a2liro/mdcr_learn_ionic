<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button text="Voltar"></ion-back-button>
        </ion-buttons>
        <ion-title size="large">Play Deck</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content>
      <div id="container">
        {{ deck }}
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import {
  IonButtons,
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonBackButton,
  IonItem,
  IonInput,
  IonButton,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  onIonViewDidEnter,
  IonCol,
  IonGrid,
  IonRow,
  useIonRouter,
  IonAlert
} from '@ionic/vue';
import userService from '@/services/userService';
import courseService from '@/services/courseService';
import 'swiper/css';
import '@ionic/vue/css/ionic-swiper.css';
import { Swiper, SwiperSlide } from 'swiper/vue';


// import { Navigation } from 'swiper/modules';


import { ref } from 'vue';
import server from '@/config/server';
import { useRoute } from 'vue-router';
import deckService from '@/services/deckService';
const email = ref('andreliro1945@gmail.com');
const password = ref('12345678');
const deck = ref([])
const route = useRoute();

onIonViewDidEnter(async () => {
  console.log('teste', route.params.id);
  deck.value = await deckService.playDeck(route.params.id) //await deckService.playDeck(route.params.id);
  console.log('ccccccccccccc', deck.value)
});

</script>

<style scoped>
#swiper-categories {
  background-color: rgb(86, 120, 91);
  height: 4em;
  padding-left: 1em;
  padding-right: 1em;
  box-shadow: 1px 8px 15px #9f9f9f;
}

.category-name {
  color: rgb(245, 245, 245);
}

ion-alert.custom-alert {
  --backdrop-opacity: 0.7;
}
</style>

<style>
.custom-alert .alert-button-group {
  padding: 8px;
}

button.alert-button.alert-button-confirm {
  background-color: var(--ion-color-success);
  color: var(--ion-color-success-contrast);
}

.md button.alert-button.alert-button-confirm {
  border-radius: 4px;
}

.ios .custom-alert button.alert-button {
  border: 0.55px solid rgba(var(--ion-text-color-rgb, 0, 0, 0), 0.2);
}

.ios button.alert-button.alert-button-cancel {
  border-right: 0;
  border-bottom-left-radius: 13px;
  border-top-left-radius: 13px;
}

.ios button.alert-button.alert-button-confirm {
  border-bottom-right-radius: 13px;
  border-top-right-radius: 13px;
}
</style>
