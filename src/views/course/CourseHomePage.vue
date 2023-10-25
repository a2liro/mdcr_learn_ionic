<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button defaultHref="/home" text="Voltar"></ion-back-button>
        </ion-buttons>
        <ion-title size="large">Cursos</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content>
      <div id="container">
        <swiper :slides-per-view="3.5" :loop="false" id="swiper-categories">
          <swiper-slide v-for="category in course.categories" :key="category">
            <span class="category-name">{{ category.name }}</span>
          </swiper-slide>
        </swiper>
        <ion-toolbar>
          <ion-title>Em andamento</ion-title>
        </ion-toolbar>

        <swiper :slides-per-view="2.2" :loop="false" id="swiper-decks">
          <swiper-slide v-for="deck in course.decks" :key="deck">

            <ion-card @click="$router.push('/courses/home/' + deck.id)" v-if="deck.isPlaying">
              <img alt="deck logo" :src="server + '/' + deck.thumbnail" />
              <ion-card-header>
                <!-- <ion-card-title>{{ deck.name }}</ion-card-title> -->
                <ion-card-subtitle>{{ deck.name }}</ion-card-subtitle>
              </ion-card-header>
            </ion-card>
          </swiper-slide>
        </swiper>
        <ion-toolbar>
          <ion-title>Decks novos</ion-title>
        </ion-toolbar>
        <div class="new-decks">
          <ion-grid>
            <ion-row>
              <ion-col size="6" v-for="deck in course.decks" :key="deck">
                <!-- <ion-card @click="$router.push('/courses/home/' + deck.id)" v-if="!deck.isPlaying" :id="'present-alert' + deck.id"> -->
                  <ion-card v-if="!deck.isPlaying" :id="'present-alert' + deck.id">

                  <img alt="deck logo" :src="server + '/' + deck.thumbnail" />
                  <ion-card-header>
                    <!-- <ion-card-title>{{ deck.name }}</ion-card-title> -->
                    <ion-card-subtitle>{{ deck.name }}</ion-card-subtitle>
                  </ion-card-header>
                </ion-card>
                <!-- <ion-button :id="'present-alert' + deck.id">Click Me</ion-button> -->
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
const email = ref('andreliro1945@gmail.com');
const password = ref('12345678');
const course = ref([])
const route = useRoute();
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

onIonViewDidEnter(async () => {
  console.log('teste', route.params.id);
  course.value = await courseService.getCourseData(route.params.id);
  console.log('ccccccccccccc', course.value)
});

const startNewDeck = function (ev: CustomEvent, deckId: any) {
  console.log(deckId, ev, JSON.stringify(ev.detail));
  console.log(`Dismissed with role: ${ev.detail.role}`);

}

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
