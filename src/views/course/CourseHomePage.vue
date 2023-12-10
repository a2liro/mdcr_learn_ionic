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
      <ion-refresher slot="fixed" @ionRefresh="handleRefresh($event)">
        <ion-refresher-content></ion-refresher-content>
      </ion-refresher>
      <div v-if="noNetwork" class="no-network">
        <h3>Não conseguimos conectar a internet</h3>
        <ion-button @click="getAllData()">
          <ion-icon slot="start" :icon="refreshOutline"></ion-icon>
          Atualizar
        </ion-button>
      </div>
      <div id="container" v-else>
        <!-- <swiper :slides-per-view="2.6" id="swiper-categories" :space-between="50" @swiper="onSwiper"
          @slideChange="onSlideChange"> -->
        <swiper :slides-per-view="2.6" id="swiper-categories" :space-between="50">
          <swiper-slide v-for="category in course.categories" :key="category">
            <div @click="showDecksByCategory(category.id)" class="category-name">{{ category.name }}</div>
          </swiper-slide>
        </swiper>
        <ion-toolbar>
          <ion-title>Em andamento</ion-title>
        </ion-toolbar>
        <swiper :slides-per-view="2.2" :loop="false" id="swiper-decks">
          <swiper-slide v-for="deck in course.decksInProgressToShow" :key="deck">

            <ion-card :id="'present-alert' + deck.id">
              <ion-item class="badge-item-playing">
                <ion-badge slot="start" color="success" class="badge-item-playing-left">{{ deck.totalNewCards
                }}</ion-badge>
                <ion-badge slot="end" color="warning" class="badge-item-playing-right">{{ deck.totalCardsToPlayAgain
                }}</ion-badge>
              </ion-item>

              <img alt="deck logo" :src="server + '/' + deck.thumbnail" />
              <ion-card-header class="card-deck-header">
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
              <ion-col size="6" v-for="deck in course.newDecksToShow" :key="deck">
                <ion-item class="badge-item">
                  <ion-badge slot="start" color="success">{{ deck.totalNewCards }} cards</ion-badge>
                </ion-item>
                <ion-card :id="'present-alert' + deck.id">


                  <img alt="deck logo" :src="server + '/' + deck.thumbnail" />
                  <ion-card-header class="card-deck-header">
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
  IonBadge,
  IonCard,
  IonCardHeader,
  IonCardSubtitle,
  onIonViewDidEnter,
  IonCol,
  IonGrid,
  IonRow,
  useIonRouter,
  IonAlert,
  onIonViewWillEnter,
  loadingController,
  IonMenuButton,
  IonItem,
  IonIcon,
  IonRefresher,
  IonRefresherContent,
  IonButton,
} from '@ionic/vue';
import courseService from '@/services/courseService';
import 'swiper/css';
import '@ionic/vue/css/ionic-swiper.css';
import { Swiper, SwiperSlide } from 'swiper/vue';
import { refreshOutline } from 'ionicons/icons';


import deckStore from '@/stores/deckStore'

import { ref } from 'vue';
import server from '@/config/server';
import { useRoute } from 'vue-router';
import deckService from '@/services/deckService';
const course = ref({
  categories: [],
  decksInProgress: []
})
const route = useRoute();
const router = useIonRouter();
const loading = ref<HTMLIonLoadingElement>();
const noNetwork = ref(false)

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
  // loading.value = await showLoading();
})

onIonViewDidEnter(async () => {
  await getAllData();
});

const getAllData = async function () {
  try {
    loading.value = await showLoading();
    noNetwork.value = false;
    course.value = await courseService.getCourseData(route.params.id);
    course.value.decksInProgress = course.value.decks.filter((item) => item.isPlaying == true)
    course.value.newDecks = course.value.decks.filter((item) => item.isPlaying == false)
    course.value.decksInProgressToShow = course.value.decksInProgress
    course.value.newDecksToShow = shuffle(course.value.newDecks)
    course.value.categories[0] = { id: 0, name: 'Todos' }
    loading.value?.dismiss();
  } catch (error) {
    noNetwork.value = true
    loading.value?.dismiss();
  }
}

const startNewDeck = async function (ev: CustomEvent, deckId: any) {
  if (ev.detail.role == 'confirm') {

    try {
      noNetwork.value = false;
      loading.value = await showLoading()
      loading.value?.present();
      const card = await deckService.playDeck(deckId)
      if (card.length === 0) {
        loading.value?.dismiss();
        alert('Sem cards para praticar')
      } else {
        const currentDeck = course.value.decks.filter((item) => item.id == deckId)
        deckStore.setCurrentDeck(currentDeck[0]);
        loading.value?.dismiss();
        router.push('/deck/play/' + deckId)
      }
      loading.value?.dismiss();
    } catch (error) {
      noNetwork.value = true
      loading.value?.dismiss();
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

const showDecksByCategory = async function (categoryId: any) {
  const loading = await loadingController.create({
    message: 'Loading...',
    mode: 'ios',
    translucent: true,
    duration: 300
  });

  loading.present();
  if (categoryId == 0) {
    course.value.newDecksToShow = course.value.newDecks
    course.value.decksInProgressToShow = course.value.decksInProgress
  } else {
    course.value.newDecksToShow = course.value.newDecks.filter(deck => deck.category_id == categoryId)
    course.value.decksInProgressToShow = course.value.decksInProgress.filter(deck => deck.category_id == categoryId)
  }
}

const handleRefresh = async (event: CustomEvent) => {
  await getAllData();
  event.target.complete();
};

const shuffle = (array: string[]) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;

};

</script>

<style scoped>
#swiper-categories {
  background-color: #f0f0f0;
  height: 4em;
  padding-left: 1em;
  padding-right: 1em;
  box-shadow: 1px 8px 15px #518561;
}



.category-name {
  color: #518561;
}

ion-alert.custom-alert {
  --backdrop-opacity: 0.7;
}

.badge-item {
  height: 2em;
  position: absolute;
  --ion-item-background: #ffffff00;
}

.badge-item-playing {
  height: 2em;
  position: absolute;
  --ion-item-background: #ffffff00;
  top: -0.7em;
  width: 100%;
}

.badge-item-playing-right {
  position: relative;
  right: -1em;
  margin: 0;
}

.badge-item-playing-left {
  position: relative;
  left: -1em;
  margin: 0;
}

ion-badge {
  opacity: 0.9;
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

.card-deck-header {
  height: 6em;
}

#swiper-categories .swiper-slide {
  max-width: 7.5em;
}
</style>
