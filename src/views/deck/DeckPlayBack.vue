<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button text="Voltar"></ion-back-button>
        </ion-buttons>
        <ion-title size="large">Play Deck Back</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content>
      <div id="container">
        <div>
          <ion-card>
            <ion-card-header>
              <ion-card-title>Frente:</ion-card-title>
            </ion-card-header>

            <ion-card-content>
              <div class="quill-editor">
                <div :ref="editor" class="user-editor" id="editor-front"></div>
              </div>
            </ion-card-content>
          </ion-card>
          <ion-card id="card-back">
            <ion-card-header>
              <ion-card-title>Verso:</ion-card-title>
            </ion-card-header>

            <ion-card-content>
              <div class="quill-editor">
                <div :ref="editorBack" class="user-editor-back" id="editor-back"></div>
              </div>
            </ion-card-content>
          </ion-card>
        </div>

      </div>
    </ion-content>
    <ion-footer>
      <ion-toolbar>
        <ion-grid v-if="card.intervals">
          <ion-row>
            <ion-col>Fácil</ion-col>
            <ion-col class="ion-text-end">Difícil</ion-col>
          </ion-row>
          <ion-row>
            <ion-col><ion-button expand="block" color="success" size="default">{{ card.intervals[1] }}</ion-button></ion-col>
            <ion-col><ion-button expand="block" color="secondary" size="default">{{ card.intervals[2] }}</ion-button></ion-col>
            <ion-col><ion-button expand="block" color="medium" size="default">{{ card.intervals[3] }}</ion-button></ion-col>
            <ion-col><ion-button expand="block" color="warning" size="default">{{ card.intervals[4] }}</ion-button></ion-col>
            <ion-col><ion-button expand="block" color="danger" size="default">{{ card.intervals[5] }}</ion-button></ion-col>
          </ion-row>
          <!-- <ion-row>
            <ion-col><ion-button expand="block" color="secondary" size="default">Fácil ({{ card.intervals[2] }})</ion-button></ion-col>
            <ion-col><ion-button expand="block" color="medium" size="default">Médio ({{ card.intervals[3] }})</ion-button></ion-col>
            <ion-col><ion-button expand="block" color="warning" size="default">Difícil ({{ card.intervals[4] }})</ion-button></ion-col>
          </ion-row> -->
        </ion-grid>
        <!-- <ion-title>
          <ion-button expand="block" fill="outline" @click="$router.push('/deck/play/back/' + card.id)">
            Continue
            <ion-icon slot="end" :icon="chevronForward"></ion-icon>
          </ion-button>
        </ion-title> -->
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
  IonButton,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  onIonViewDidEnter,
  IonFooter,
  IonIcon,
  IonRow,
  IonCol,
  IonGrid
} from '@ionic/vue';
import 'swiper/css';
import '@ionic/vue/css/ionic-swiper.css';
import { chevronForward } from 'ionicons/icons';


import { ref, watch } from 'vue';
import server from '@/config/server';
import { useRoute } from 'vue-router';
import cardStore from '@/stores/cardStore';
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.bubble.css'
import 'quill/dist/quill.snow.css'

// import Quill from 'quill/core';
import Quill from 'quill';

const editor = ref();
const editorBack = ref();

let quill: Quill;
let quillBack: Quill;

const card = ref([])

const newEditor = ref()
const newEditorBack = ref()


onIonViewDidEnter(async () => {
  card.value = await cardStore.getCard();
  console.log(card.value)
  quillBackStart()

});


const quillBackStart = function () {

  newEditor.value = document.getElementById('editor-front');

  quill = new Quill(newEditor.value, {
    theme: 'bubble',
  });
  quill.setContents(JSON.parse(card.value.front));

  newEditorBack.value = document.getElementById('editor-back');

  quillBack = new Quill(newEditorBack.value, {
    theme: 'bubble',
  });
  quillBack.setContents(JSON.parse(card.value.back));
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

#card-back {
  margin-top: 2.5em;
}
</style>
