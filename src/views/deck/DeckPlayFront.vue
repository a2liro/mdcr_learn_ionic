<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button text="Voltar"></ion-back-button>
        </ion-buttons>
        <ion-title size="large">Play Deck Front</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content>
      <div id="container">
        <audio controls autoplay v-if="card?.audiofile">
          <source :src="server + '/' + card?.audiofile" type="audio/mpeg">
          Your browser does not support the audio element.
        </audio>
        <div>
          <ion-card>
            <ion-card-header>
              <ion-card-title>Frente:</ion-card-title>
              <!-- <ion-card-subtitle>Frente:</ion-card-subtitle> -->
            </ion-card-header>

            <ion-card-content>
              <div class="quill-editor">
                <div :ref="editor" class="user-editor" id="editor"></div>
              </div>
            </ion-card-content>
          </ion-card>
          <ion-card>
            <ion-card-header>
              <ion-card-title>Frente:</ion-card-title>
              <!-- <ion-card-subtitle>Frente:</ion-card-subtitle> -->
            </ion-card-header>

            <ion-card-content>
              Gravando -- {{ speechResult }} -- 
            </ion-card-content>
          </ion-card>
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
  onIonViewWillEnter,
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


import { ref } from 'vue';
import server from '@/config/server';
import { useRoute } from 'vue-router';
import cardStore from '@/stores/cardStore';
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.bubble.css'
import 'quill/dist/quill.snow.css'

// import Quill from 'quill/core';
import Quill from 'quill';

import { SpeechRecognition } from "@capacitor-community/speech-recognition";
import { isPlatform } from '@ionic/vue';


const editor = ref();
const _content = ref('teste');
let quill: Quill;

const speechResult = ref('teste')


// Quill.register({
//   'modules/toolbar': Toolbar,
//   'themes/snow': Snow,
//   'formats/bold': Bold,
//   'formats/italic': Italic,
//   'formats/header': Header
// });

// var editor = new Quill('#editor');

// var quill = new Quill('#editor');]



const email = ref('andreliro1945@gmail.com');
const password = ref('12345678');
const card = ref([])
const route = useRoute();

const audioAsset = ref({});

onIonViewDidEnter(async () => {

  card.value = await cardStore.getCard();
  console.log(card.value)

  const newEditor = ref()
  newEditor.value = document.getElementById('editor');

  quill = new Quill(newEditor.value, {
    theme: 'bubble',
  });
  quill.setContents(JSON.parse(card.value.front));
  // quill.blur();

  if (isPlatform('android') || isPlatform('ios')) {
    const availableRec = await SpeechRecognition.available()
    if (availableRec.available === true) {
      const hasPermissions = await SpeechRecognition.checkPermissions()
      alert(JSON.stringify(hasPermissions)); // if prompt = negado

      SpeechRecognition.requestPermissions();

      SpeechRecognition.start({
        language: "en-US",
        maxResults: 1,
        prompt: "Fale o texto em inglês",
        partialResults: true,
        popup: false,
      });

      SpeechRecognition.addListener("partialResults", (data: any) => {
        // alert("partialResults was fired" + data.matches);
        speechResult.value = data.matches
      });
      
      // alert(SpeechRecognitionResult)
      // speechResult.value = SpeechRecognitionResult.toString()
    }
  }
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
