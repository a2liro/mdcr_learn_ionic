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
        <ion-card>
          <ion-card-header>
            <ion-card-title>Audio:</ion-card-title>
            <!-- <ion-card-subtitle>Frente:</ion-card-subtitle> -->
          </ion-card-header>

          <ion-card-content>
            <audio controls autoplay v-if="card?.audiofile">
              <source :src="server + '/' + card?.audiofile" type="audio/mpeg">
              Your browser does not support the audio element.
            </audio>
          </ion-card-content>
        </ion-card>


        <div>
          <ion-card>
            <ion-card-header>
              <ion-card-title>Frente:</ion-card-title>
              <!-- <ion-card-subtitle>Frente:</ion-card-subtitle> -->
            </ion-card-header>

            <ion-card-content>
              <div class="quill-editor">
                <div :ref="editor" class="user-editor" :id="`editor-${randId}`"></div>
              </div>
            </ion-card-content>
          </ion-card>
          <ion-card id="card-practice">
            <ion-card-header>
              <ion-card-title>Praticar</ion-card-title>
              <ion-card-subtitle>Resultado:

                <div class="words" style="display:none;">
                <p id="p"></p>
              </div>
              <div :id="`result-${randId}`"></div>
              </ion-card-subtitle>
            </ion-card-header>

            <ion-card-content>
              <div class="heaer-error">{{ noHear }}</div>
              <!-- Resultado: {{ speechResult }} -->
              <ion-button expand="block" @click="startRecognition" v-if="isListening" color="danger">
                Parar
                <ion-icon slot="end" :icon="square"></ion-icon>
              </ion-button>
              <ion-button expand="block" @click="startRecognition" v-else>
                Praticar
                <ion-icon slot="end" :icon="micOutline"></ion-icon>
              </ion-button>

            </ion-card-content>
          </ion-card>
        </div>

      </div>
    </ion-content>
    <ion-footer>
      <ion-toolbar>
        <ion-title>
          <ion-button expand="block" fill="outline" @click="$router.push('/deck/play/back/' + card.id)">
            Continue
            <ion-icon slot="end" :icon="chevronForward"></ion-icon>
          </ion-button>
        </ion-title>
      </ion-toolbar>
    </ion-footer>
  </ion-page>
</template>

<script setup lang="ts">

const email = ref('andreliro1945@gmail.com');
const password = ref('12345678');
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
import userService from '@/services/userService';
import courseService from '@/services/courseService';
import 'swiper/css';
import '@ionic/vue/css/ionic-swiper.css';
import { Swiper, SwiperSlide } from 'swiper/vue';
import { micOutline, square, chevronForward } from 'ionicons/icons';


import { ref, watch } from 'vue';
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
const _content = ref('');
let quill: Quill;

const speechResult = ref('')

const randId = ref(Math.random())

const noHear = ref<String>('')


// Quill.register({
//   'modules/toolbar': Toolbar,
//   'themes/snow': Snow,
//   'formats/bold': Bold,
//   'formats/italic': Italic,
//   'formats/header': Header
// });

// var editor = new Quill('#editor');

// var quill = new Quill('#editor');]

const card = ref([])
const route = useRoute();

const audioAsset = ref({});

const isListening = ref(false);

let hasPermissions: any;

const loading = ref<HTMLIonLoadingElement>();


onIonViewWillEnter(async () => {
  loading.value = await showLoading();
})

onIonViewDidEnter(async () => {

  card.value = await cardStore.getCard();

  const newEditor = ref()
  newEditor.value = document.getElementById(`editor-${randId.value}`);
  console.log(`editor-${card.value.id}`, newEditor.value);

  quill = new Quill(newEditor.value, {
    theme: 'bubble',
  });
  quill.setContents(JSON.parse(card.value.front));
  // quill.blur();
  loading.value?.dismiss();
  if (isPlatform('android') || isPlatform('ios')) {
    const availableRec = await SpeechRecognition.available()
    if (availableRec.available === true) {
      hasPermissions = await SpeechRecognition.checkPermissions()

      if (hasPermissions.speechRecognition !== 'granted') {
        SpeechRecognition.requestPermissions();
      }


      SpeechRecognition.addListener("partialResults", (data: any) => {
        speechResult.value = data.matches
      });

    }
  }
});

const startRecognition = async function () {
  if (hasPermissions.speechRecognition !== 'granted') {
    SpeechRecognition.requestPermissions();
  }
  isListening.value = true;
  SpeechRecognition.start({
    language: "en-US",
    maxResults: 1,
    prompt: "Fale o texto em inglês",
    partialResults: false,
    popup: false,
  }).then((value) => {
    isListening.value = false;
    speechResult.value = value.matches[0]
    changed()
  }).catch((error) => {
    noHear.value = 'Não foi possível ouvir sua voz, tente novamente!';
    isListening.value = false;
  });
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






import * as differ from 'diff'

function changed() {
  var b = document.getElementById('p');
var result = document.getElementById(`result-${randId.value}`);

console.log(result);


  let cardFront = card.value.front.split('/')[0];

  cardFront = cardFront
  .replaceAll('"ops":', '')
  .replaceAll('"insert":', '')
  .replaceAll('"attributes":', '')
  .replaceAll('"size":', '')
  .replaceAll('"large"', '')
  .replaceAll('"normal"', '')
  .replaceAll('"color":', '')
  .replaceAll('"background":', '')
  .replaceAll("\\n", '')
  .replaceAll("],", '')
  .replaceAll("},", '')
  .replaceAll("{,", '')
  .replace(/",/g, '')
  .replaceAll(/#[0-9A-Fa-f]{6}/g, '')
  .replace(/[\[\]{}"]/g, '')


	var diffLocal = differ['diffWords'](cardFront.toLowerCase(), speechResult.value.toLowerCase()) //JsDiff['diffChars'](aValue, speechResult.value.textContent.toLowerCase());
	var fragment = document.createDocumentFragment();
	for (var i=0; i < diffLocal.length; i++) {

		if (diffLocal[i].added && diffLocal[i + 1] && diffLocal[i + 1].removed) {
			var swap = diffLocal[i];
			diffLocal[i] = diffLocal[i + 1];
			diffLocal[i + 1] = swap;
		}

		var node;
		if (diffLocal[i].removed) {
			node = document.createElement('del');
			node.appendChild(document.createTextNode(diffLocal[i].value));
		} else if (diffLocal[i].added) {
			node = document.createElement('ins');
			node.appendChild(document.createTextNode(diffLocal[i].value));
		} else {
			node = document.createTextNode(diffLocal[i].value);
		}
		fragment.appendChild(node);
	}

	result.textContent = '';
	result.appendChild(fragment);
  console.log(fragment)
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

#card-practice {
  margin-top: 2.5em;
}

del {
  text-decoration: none;
  color: #5c5b5b;
  background: #fadad7;
}

ins {
  background: #ee881b;
  color: #406619;
  text-decoration: none;
}

#result {
  margin-top: 0.6em;
  font-size: 1.3em;
}

.heaer-error {
  color: #c33502;
  font-size: large;
}
</style>
