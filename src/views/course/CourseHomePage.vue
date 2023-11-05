<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-menu-button></ion-menu-button>
          <ion-back-button defaultHref="/home" text="Voltar"></ion-back-button>
        </ion-buttons>
        <ion-title size="large">Curso - {{ course?.course?.name }}</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content>
      <div id="container">
        <swiper :slides-per-view="2.6" :loop="false" id="swiper-categories">
          <swiper-slide v-for="category in course.categories" :key="category">
            <span class="category-name">{{ category.name }}</span>
          </swiper-slide>
        </swiper>
        <ion-toolbar>
          <ion-title>Em andamento</ion-title>
        </ion-toolbar>

        <swiper :slides-per-view="2.2" :loop="false" id="swiper-decks">
          <swiper-slide v-for="deck in course.decksInProgress" :key="deck">

            <ion-card :id="'present-alert' + deck.id">
              <img alt="deck logo" :src="server + '/' + deck.thumbnail" />
              <ion-card-header>
                <!-- <ion-card-title>{{ deck.name }}</ion-card-title> -->
                <ion-card-subtitle>{{ deck.name }}</ion-card-subtitle>
              </ion-card-header>
            </ion-card>
            <ion-alert :trigger="'present-alert' + deck.id" class="custom-alert" header="Continuar estudos?"
              :buttons="alertButtons" @didDismiss="startNewDeck($event, deck.id)"></ion-alert>
          </swiper-slide>
        </swiper>
        <ion-toolbar>
          <ion-title>Decks novos</ion-title>
        </ion-toolbar>
        <div class="new-decks">
          <ion-grid>
            <ion-row>
              <ion-col size="6" v-for="deck in course.newDecks" :key="deck">
                <ion-card :id="'present-alert' + deck.id">

                  <img alt="deck logo" :src="server + '/' + deck.thumbnail" />
                  <ion-card-header>
                    <ion-card-subtitle>{{ deck.name }}</ion-card-subtitle>
                  </ion-card-header>
                </ion-card>
                <ion-alert :trigger="'present-alert' + deck.id" class="custom-alert" header="Iniciar estudos?"
                  :buttons="alertButtons" @didDismiss="startNewDeck($event, deck.id)"></ion-alert>

              </ion-col>
            </ion-row>
          </ion-grid>
        </div>
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
  IonAlert,
  onIonViewWillEnter,
  loadingController,
  IonMenuButton
} from '@ionic/vue';
import userService from '@/services/userService';
import courseService from '@/services/courseService';
import 'swiper/css';
import '@ionic/vue/css/ionic-swiper.css';
import { Swiper, SwiperSlide } from 'swiper/vue';

import deckStore from '@/stores/deckStore'


// import { Navigation } from 'swiper/modules';


import { ref } from 'vue';
import server from '@/config/server';
import { useRoute } from 'vue-router';
import deckService from '@/services/deckService';
const email = ref('andreliro1945@gmail.com');
const password = ref('12345678');
const course = ref([])
const route = useRoute();
const router = useIonRouter();
const loading = ref<HTMLIonLoadingElement>();

const alertButtons = ref([
  {
    text: 'Não',
    cssClass: 'alert-button-cancel',
    role: 'cancel'
  },
  {
    text: 'Sim',
    cssClass: 'alert-button-confirm',
    role: 'confirm',
  },
])

onIonViewWillEnter(async () => {
  loading.value = await showLoading();
})

onIonViewDidEnter(async () => {
  course.value = await courseService.getCourseData(route.params.id);
  course.value.decksInProgress = course.value.decks.filter((item) => item.isPlaying == true)
  course.value.newDecks = course.value.decks.filter((item) => item.isPlaying == false)
  console.log(course.value)
  loading.value?.dismiss();
});

const startNewDeck = async function (ev: CustomEvent, deckId: any) {
  if (ev.detail.role == 'confirm') {
    loading.value = await showLoading()
    loading.value?.present();
    const card = await deckService.playDeck(deckId)
    console.log(card);
    if (card.length === 0) {
      loading.value?.dismiss();
      alert('Sem cards para praticar')
    } else {
      const currentDeck = course.value.decks.filter((item) => item.id == deckId)
      console.log(currentDeck[0]);
      deckStore.setCurrentDeck(currentDeck[0]);
      loading.value?.dismiss();
      router.push('/deck/play/' + deckId)
    }
  }
}
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
#swiper-categories {
  background-color: #518561;
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
