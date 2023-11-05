<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button text="Voltar"></ion-back-button>
        </ion-buttons>
        <ion-title size="large">Playing audio</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true">

      <div id="container">
        <ion-card>
          <ion-card-header>
            <ion-card-title>Audio:</ion-card-title>
          </ion-card-header>

          <ion-card-content>
            <audio controls autoplay v-if="card?.audiofile" :id="'audio' + Math.random()">
              <source :src="server + '/' + card?.audiofile" type="audio/mpeg">
              Your browser does not support the audio element.
            </audio>
          </ion-card-content>
        </ion-card>

      </div>
    </ion-content>
    <ion-footer>
      <ion-toolbar>
        <ion-title>
          <ion-button expand="block" fill="outline" @click="$router.push('/deck/play/front/' + card.id)">
            Continue
            <ion-icon slot="end" :icon="chevronForward"></ion-icon>
          </ion-button>
        </ion-title>
      </ion-toolbar>
    </ion-footer>
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
  onIonViewWillEnter,
  IonCol,
  IonGrid,
  IonRow,
  useIonRouter,
  IonAlert,
  IonFooter,
  IonIcon,
  loadingController
} from '@ionic/vue';
import { chevronForward } from 'ionicons/icons';

import userService from '@/services/userService';
import courseService from '@/services/courseService';
import 'swiper/css';
import '@ionic/vue/css/ionic-swiper.css';
import { Swiper, SwiperSlide } from 'swiper/vue';
import cardStore from '@/stores/cardStore';



// import { Navigation } from 'swiper/modules';


import { ref } from 'vue';
import server from '@/config/server';
import { useRoute } from 'vue-router';
const route = useRoute();
const card = ref([])

const audioAsset = ref({});
const loading = ref<HTMLIonLoadingElement>();


onIonViewWillEnter(async () => {
  loading.value = await showLoading();
})

onIonViewDidEnter(async () => {
  card.value = [];
  card.value = await cardStore.getCard();
  loading.value?.dismiss();
});

const showLoading = async function () {
  const loading = await loadingController.create({
    message: 'Loading...',
    mode: 'ios',
    translucent: true,
  });

  loading.present();
  return loading
}

</script>

<style scoped>
#container {
  text-align: center;
  position: absolute;
  left: 0;
  right: 0;
  top: 50%;
  transform: translateY(-50%);

  /* display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding-top: 3em; */
}

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
